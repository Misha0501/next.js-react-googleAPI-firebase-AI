import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis =
  url && token
    ? new Redis({
        url,
        token,
        // Fail fast instead of the SDK's default 5 retries with exponential
        // backoff (~4.3s before giving up) — checkRateLimit's fallback only
        // helps if the call it's wrapping actually rejects quickly.
        retry: { retries: 0 },
        signal: () => AbortSignal.timeout(1000),
      })
    : null;
