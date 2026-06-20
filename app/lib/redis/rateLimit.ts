import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/app/lib/redis";

type MemoryRateLimitEntry = {
  count: number;
  expiresAt: number;
};

declare global {
  var memoryRateLimitStore: Map<string, MemoryRateLimitEntry> | undefined;
  var rateLimiterCache: Map<string, Ratelimit> | undefined;
}

const getMemoryRateLimitStore = () => {
  if (!global.memoryRateLimitStore) {
    global.memoryRateLimitStore = new Map<string, MemoryRateLimitEntry>();
  }

  return global.memoryRateLimitStore;
};

// Bounds how large the fallback store can grow during a sustained Redis
// outage (one entry per distinct rate-limited key, e.g. per IP/user).
const MAX_MEMORY_ENTRIES = 5000;

const sweepExpiredEntries = (
  store: Map<string, MemoryRateLimitEntry>,
  now: number,
) => {
  for (const [entryKey, entry] of store) {
    if (entry.expiresAt <= now) store.delete(entryKey);
  }
};

const checkMemoryRateLimit = (
  key: string,
  maxRequests: number,
  windowSeconds: number,
): boolean => {
  const now = Date.now();
  const store = getMemoryRateLimitStore();

  if (store.size > MAX_MEMORY_ENTRIES) sweepExpiredEntries(store, now);

  const existingEntry = store.get(key);

  if (!existingEntry || existingEntry.expiresAt <= now) {
    store.set(key, {
      count: 1,
      expiresAt: now + windowSeconds * 1000,
    });
    return true;
  }

  existingEntry.count += 1;
  store.set(key, existingEntry);

  return existingEntry.count <= maxRequests;
};

// One Ratelimit instance per distinct (maxRequests, windowSeconds) pair.
// Cheap to construct, but every call site here uses a fixed pair, so this
// just avoids rebuilding it on every single request.
const getRateLimiterCache = () => {
  if (!global.rateLimiterCache) {
    global.rateLimiterCache = new Map<string, Ratelimit>();
  }

  return global.rateLimiterCache;
};

const getRateLimiter = (
  redisClient: NonNullable<typeof redis>,
  maxRequests: number,
  windowSeconds: number,
): Ratelimit => {
  const cache = getRateLimiterCache();
  const cacheKey = `${maxRequests}:${windowSeconds}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const limiter = new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
  });
  cache.set(cacheKey, limiter);
  return limiter;
};

/**
 * Sliding-window rate limiter backed by Upstash Redis.
 * Returns true if the request is allowed, false if the limit is exceeded.
 * Uses a process-local fallback when Redis is unavailable.
 *
 * Note: Ratelimit has its own built-in in-memory "ephemeral cache" that
 * remembers already-blocked identifiers and rejects them without calling
 * Redis at all. That's why a key that just got blocked will keep returning
 * false instantly even if Redis goes down right after — that's the
 * ephemeral cache short-circuiting, not the catch-block fallback below.
 * The fallback only actually gets exercised for keys Redis hasn't already
 * told this process to block.
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number,
): Promise<boolean> {
  if (!redis) return checkMemoryRateLimit(key, maxRequests, windowSeconds);
  try {
    const { success } = await getRateLimiter(
      redis,
      maxRequests,
      windowSeconds,
    ).limit(key);
    return success;
  } catch {
    return checkMemoryRateLimit(key, maxRequests, windowSeconds);
  }
}
