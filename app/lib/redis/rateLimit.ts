import { redis } from "@/app/lib/redis";

type MemoryRateLimitEntry = {
  count: number;
  expiresAt: number;
};

declare global {
  var memoryRateLimitStore: Map<string, MemoryRateLimitEntry> | undefined;
}

const getMemoryRateLimitStore = () => {
  if (!global.memoryRateLimitStore) {
    global.memoryRateLimitStore = new Map<string, MemoryRateLimitEntry>();
  }

  return global.memoryRateLimitStore;
};

const checkMemoryRateLimit = (
  key: string,
  maxRequests: number,
  windowSeconds: number,
): boolean => {
  const now = Date.now();
  const store = getMemoryRateLimitStore();
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

/**
 * Sliding-window rate limiter backed by Redis.
 * Returns true if the request is allowed, false if the limit is exceeded.
 * Uses a process-local fallback when Redis is unavailable.
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number,
): Promise<boolean> {
  if (!redis) return checkMemoryRateLimit(key, maxRequests, windowSeconds);
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSeconds);
    return count <= maxRequests;
  } catch {
    return checkMemoryRateLimit(key, maxRequests, windowSeconds);
  }
}
