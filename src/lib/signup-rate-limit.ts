/**
 * In-memory rate limiter for signup attempts.
 *
 * Uses a single sliding-window bucket per IP address. For production scale,
 * swap this out for @upstash/ratelimit backed by Redis.
 *
 * Exported so the logic can be unit-tested independently of the Next.js
 * request context and Prisma bindings.
 */

export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
export const MAX_SIGNUP_ATTEMPTS = 5

export interface RateLimitRecord {
  count: number
  resetAt: number
}

// Module-level map so the window persists across requests within a process.
// Tests can clear it between runs by calling resetRateLimitMap().
let rateLimitMap = new Map<string, RateLimitRecord>()

/** Reset the map — only for use in tests. */
export function resetRateLimitMap(): void {
  rateLimitMap = new Map()
}

/** Derive a stable key from the request's remote IP. */
export function getRateLimitKey(headers: { get(name: string): string | null }): string {
  const forwarded = headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown'
}

/**
 * Check whether the given key is within its rate-limit budget.
 *
 * Side-effect: increments the counter if allowed, or starts a new window
 * if the previous window has expired.
 */
export function checkRateLimit(
  key: string,
  now = Date.now()
): { allowed: boolean; retryAfter?: number } {
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetAt) {
    // New window or expired window — reset counter
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true }
  }

  if (record.count >= MAX_SIGNUP_ATTEMPTS) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000)
    return { allowed: false, retryAfter }
  }

  record.count++
  return { allowed: true }
}
