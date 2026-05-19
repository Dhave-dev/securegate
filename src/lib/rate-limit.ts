import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

export async function rateLimit(identifier: string, limit: number, window: string) {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return false // Pass through if Redis isn't configured
  }

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window as any),
    analytics: false,
    prefix: "securegate",
  })

  const { success } = await ratelimit.limit(identifier)
  return !success // Return true if rate limited (i.e. blocked)
}
