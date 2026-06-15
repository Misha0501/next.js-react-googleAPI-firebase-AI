import Redis from "ioredis";

let redisClient: Redis | null = null;

const url = process.env.REDIS_URL;
if (url) {
  try {
    redisClient = new Redis(url);
    redisClient.on("error", () => {
      // Suppress connection errors — rate limiting degrades gracefully without Redis
    });
  } catch {
    redisClient = null;
  }
}

export const redis = redisClient;
