import { redis } from "./redis";

type RateLimitResult = {
  success: boolean;
  remaining: number;
};

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `rate:${key}:${Math.floor(now / windowSeconds)}`;

  const count = await redis.incr(windowKey);

  if (count === 1) {
    // First request → set expiry
    await redis.expire(windowKey, windowSeconds);
  }

  return {
    success: count <= limit,
    remaining: Math.max(0, limit - count),
  };
}
