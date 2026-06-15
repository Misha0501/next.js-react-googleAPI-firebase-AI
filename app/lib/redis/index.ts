import Redis from "ioredis";

const getRedisUrl = () => process.env.REDIS_URL ?? null;

let redisClient: Redis | null = null;

try {
  const url = getRedisUrl();
  redisClient = url ? new Redis(url) : new Redis();
} catch {
  // Redis unavailable — rate limiting and caching degrade gracefully
  redisClient = null;
}

export const redis = redisClient;
