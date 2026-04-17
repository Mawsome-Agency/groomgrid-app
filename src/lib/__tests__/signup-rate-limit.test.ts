/**
 * Unit tests for the signup rate limiter.
 *
 * This module was extracted from src/app/api/auth/signup/route.ts so its
 * core logic can be tested without a running Next.js server or Prisma
 * connection.
 *
 * Key invariant these tests protect:
 *   The E2E complete-user-journey suite makes exactly 5 calls to
 *   /api/auth/signup across all 15 steps (1 browser form + 4 API).
 *   MAX_SIGNUP_ATTEMPTS is 5, so the 5th call must succeed and the 6th
 *   must be rejected. Any accidental addition of a fresh-user-creation
 *   step in the E2E suite (steps 6-15) will cause 429s that cascade
 *   into timeout failures — which is the bug this fix addresses.
 */

import {
  checkRateLimit,
  getRateLimitKey,
  resetRateLimitMap,
  MAX_SIGNUP_ATTEMPTS,
  RATE_LIMIT_WINDOW_MS,
} from '../signup-rate-limit'

/** Minimal headers shim so we can test getRateLimitKey without NextRequest. */
function makeHeaders(forwardedFor?: string): { get(name: string): string | null } {
  return {
    get(name: string) {
      if (name === 'x-forwarded-for') return forwardedFor ?? null
      return null
    },
  }
}

beforeEach(() => {
  resetRateLimitMap()
})

// ── getRateLimitKey ──────────────────────────────────────────────────────────

describe('getRateLimitKey', () => {
  it('returns the first IP from a single-value x-forwarded-for header', () => {
    expect(getRateLimitKey(makeHeaders('1.2.3.4'))).toBe('1.2.3.4')
  })

  it('returns the first IP from a comma-separated x-forwarded-for chain', () => {
    expect(getRateLimitKey(makeHeaders('10.0.0.1, 172.16.0.1, 192.168.0.1'))).toBe('10.0.0.1')
  })

  it('trims whitespace around the IP', () => {
    expect(getRateLimitKey(makeHeaders('  203.0.113.5  '))).toBe('203.0.113.5')
  })

  it('falls back to "unknown" when x-forwarded-for is absent', () => {
    expect(getRateLimitKey(makeHeaders())).toBe('unknown')
  })

  it('falls back to "unknown" when x-forwarded-for is an empty string', () => {
    expect(getRateLimitKey(makeHeaders(''))).toBe('unknown')
  })
})

// ── checkRateLimit ───────────────────────────────────────────────────────────

describe('checkRateLimit', () => {
  const KEY = '1.2.3.4'
  const T0 = 1_000_000_000_000 // arbitrary fixed timestamp

  describe('happy path — within budget', () => {
    it('allows the first attempt', () => {
      expect(checkRateLimit(KEY, T0)).toEqual({ allowed: true })
    })

    it(`allows up to ${MAX_SIGNUP_ATTEMPTS} consecutive attempts`, () => {
      for (let i = 0; i < MAX_SIGNUP_ATTEMPTS; i++) {
        expect(checkRateLimit(KEY, T0).allowed).toBe(true)
      }
    })

    it('allows attempt #5 (the last one within the limit)', () => {
      // Exhaust 4 attempts first
      for (let i = 0; i < MAX_SIGNUP_ATTEMPTS - 1; i++) {
        checkRateLimit(KEY, T0)
      }
      // 5th must still be allowed
      expect(checkRateLimit(KEY, T0)).toEqual({ allowed: true })
    })
  })

  describe('rate limit enforcement', () => {
    it('blocks the 6th attempt in the same window', () => {
      for (let i = 0; i < MAX_SIGNUP_ATTEMPTS; i++) {
        checkRateLimit(KEY, T0)
      }
      const result = checkRateLimit(KEY, T0)
      expect(result.allowed).toBe(false)
    })

    it('returns a positive retryAfter when blocked', () => {
      for (let i = 0; i < MAX_SIGNUP_ATTEMPTS; i++) checkRateLimit(KEY, T0)
      const { retryAfter } = checkRateLimit(KEY, T0)
      expect(retryAfter).toBeGreaterThan(0)
    })

    it('reports retryAfter = window remaining in seconds', () => {
      for (let i = 0; i < MAX_SIGNUP_ATTEMPTS; i++) checkRateLimit(KEY, T0)
      // 5 seconds into the window
      const { retryAfter } = checkRateLimit(KEY, T0 + 5_000)
      expect(retryAfter).toBe(Math.ceil((RATE_LIMIT_WINDOW_MS - 5_000) / 1000))
    })

    it('keeps blocking throughout the entire window', () => {
      for (let i = 0; i < MAX_SIGNUP_ATTEMPTS; i++) checkRateLimit(KEY, T0)
      // 14 minutes later — still within the 15-minute window
      expect(checkRateLimit(KEY, T0 + 14 * 60_000).allowed).toBe(false)
    })
  })

  describe('window reset', () => {
    it('resets the counter after the window expires', () => {
      for (let i = 0; i < MAX_SIGNUP_ATTEMPTS; i++) checkRateLimit(KEY, T0)
      // Blocked at T0
      expect(checkRateLimit(KEY, T0).allowed).toBe(false)
      // One millisecond past the window end — new window starts
      const afterWindow = T0 + RATE_LIMIT_WINDOW_MS + 1
      expect(checkRateLimit(KEY, afterWindow).allowed).toBe(true)
    })

    it('starts a fresh counter after window reset', () => {
      for (let i = 0; i < MAX_SIGNUP_ATTEMPTS; i++) checkRateLimit(KEY, T0)
      const afterWindow = T0 + RATE_LIMIT_WINDOW_MS + 1
      // New window: should allow MAX_SIGNUP_ATTEMPTS again
      for (let i = 0; i < MAX_SIGNUP_ATTEMPTS; i++) {
        expect(checkRateLimit(KEY, afterWindow).allowed).toBe(true)
      }
      // 6th attempt in the new window should be blocked
      expect(checkRateLimit(KEY, afterWindow).allowed).toBe(false)
    })
  })

  describe('isolation between IPs', () => {
    it('tracks different keys independently', () => {
      const IP_A = '1.1.1.1'
      const IP_B = '2.2.2.2'

      // Exhaust IP_A
      for (let i = 0; i < MAX_SIGNUP_ATTEMPTS; i++) checkRateLimit(IP_A, T0)
      expect(checkRateLimit(IP_A, T0).allowed).toBe(false)

      // IP_B is unaffected
      expect(checkRateLimit(IP_B, T0).allowed).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('handles "unknown" key without throwing', () => {
      expect(() => checkRateLimit('unknown', T0)).not.toThrow()
    })

    it('returns allowed:true on first call for any key', () => {
      expect(checkRateLimit('new-ip-never-seen', T0).allowed).toBe(true)
    })

    it('MAX_SIGNUP_ATTEMPTS constant is 5 (E2E test budget assumption)', () => {
      // The E2E complete-user-journey suite relies on this value being 5.
      // Steps 1-9 consume exactly 5 API calls; steps 12-15 reuse the shared
      // account and make zero new signup calls. If this constant changes,
      // the E2E spec must be audited to match.
      expect(MAX_SIGNUP_ATTEMPTS).toBe(5)
    })
  })
})
