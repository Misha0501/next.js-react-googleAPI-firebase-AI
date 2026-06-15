import { redis } from "@/app/lib/redis";

/**
 * Sliding-window rate limiter backed by Redis.
 * Returns true if the request is allowed, false if the limit is exceeded.
 * Gracefully allows all requests when Redis is unavailable.
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number,
): Promise<boolean> {
  if (!redis) return true;
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSeconds);
    return count <= maxRequests;
  } catch {
    return true;
  }
}
