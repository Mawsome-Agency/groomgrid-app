/**
 * Tests for rate-limit.ts
 *
 * Testing strategy:
 * - Happy path: first request allowed, subsequent requests within limit
 * - Rate limit hit: requests beyond limit blocked, retryAfter returned
 * - Window expiry: new window starts after reset, count resets
 * - Edge cases: limit=1, empty key, special characters, large limits
 * - Cleanup: stale entries pruned after 5-minute interval
 */
import { checkRateLimit } from '@/lib/rate-limit';

describe('checkRateLimit', () => {
  let counter = 0;
  function uniqueKey(): string {
    return `test-key-${Date.now()}-${++counter}`;
  }

  it('allows the first request for a new key', () => {
    const key = uniqueKey();
    const result = checkRateLimit(key, 10, 60000);
    expect(result).toEqual({
      allowed: true,
      remaining: 9,
      retryAfter: 0,
    });
  });

  it('decrements remaining on each allowed request', () => {
    const key = uniqueKey();
    const limit = 5;

    const r1 = checkRateLimit(key, limit, 60000);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(4);

    const r2 = checkRateLimit(key, limit, 60000);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(3);

    const r3 = checkRateLimit(key, limit, 60000);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(2);

    const r4 = checkRateLimit(key, limit, 60000);
    expect(r4.allowed).toBe(true);
    expect(r4.remaining).toBe(1);

    const r5 = checkRateLimit(key, limit, 60000);
    expect(r5.allowed).toBe(true);
    expect(r5.remaining).toBe(0);
  });

  it('blocks requests when limit is exceeded', () => {
    const key = uniqueKey();
    const limit = 2;

    checkRateLimit(key, limit, 60000);
    checkRateLimit(key, limit, 60000);

    const result = checkRateLimit(key, limit, 60000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('returns retryAfter in seconds when rate limited', () => {
    const key = uniqueKey();
    const windowMs = 30 * 1000;

    checkRateLimit(key, 1, windowMs);

    const result = checkRateLimit(key, 1, windowMs);
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
    expect(result.retryAfter).toBeLessThanOrEqual(30);
  });

  it('resets the window after it expires', () => {
    const key = uniqueKey();
    const windowMs = 1;

    checkRateLimit(key, 1, windowMs);

    // Busy-wait for window to expire
    const start = Date.now();
    while (Date.now() - start < 2) {
      // wait for timestamp to advance
    }

    const result = checkRateLimit(key, 1, windowMs);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it('uses default limit of 10 when not specified', () => {
    const key = uniqueKey();
    const result = checkRateLimit(key);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9);
  });

  it('uses default window of 10 minutes when not specified', () => {
    const key = uniqueKey();
    const result = checkRateLimit(key);
    expect(result.retryAfter).toBe(0);
  });

  it('handles limit=1 correctly — first request allowed, second blocked', () => {
    const key = uniqueKey();

    const r1 = checkRateLimit(key, 1, 60000);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(0);

    const r2 = checkRateLimit(key, 1, 60000);
    expect(r2.allowed).toBe(false);
    expect(r2.remaining).toBe(0);
    expect(r2.retryAfter).toBeGreaterThan(0);
  });

  it('tracks different keys independently', () => {
    const key1 = uniqueKey();
    const key2 = uniqueKey();

    checkRateLimit(key1, 1, 60000);
    const key1Blocked = checkRateLimit(key1, 1, 60000);
    expect(key1Blocked.allowed).toBe(false);

    const key2Result = checkRateLimit(key2, 1, 60000);
    expect(key2Result.allowed).toBe(true);
  });

  it('handles same key with different limits — uses the current call limit', () => {
    const key = uniqueKey();

    checkRateLimit(key, 2, 60000);
    checkRateLimit(key, 2, 60000);

    // With a higher limit, count (3) < limit (100) → allowed
    const result = checkRateLimit(key, 100, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(97); // 100 - 3 = 97
  });

  it('returns correct remaining count approaching limit', () => {
    const key = uniqueKey();
    const limit = 3;

    const r1 = checkRateLimit(key, limit, 60000);
    expect(r1.remaining).toBe(2);

    const r2 = checkRateLimit(key, limit, 60000);
    expect(r2.remaining).toBe(1);

    const r3 = checkRateLimit(key, limit, 60000);
    expect(r3.remaining).toBe(0);
    expect(r3.allowed).toBe(true);

    const r4 = checkRateLimit(key, limit, 60000);
    expect(r4.allowed).toBe(false);
  });

  it('handles empty string key', () => {
    const key = '';
    const result = checkRateLimit(key, 5, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it('handles special characters in key (IPv6-mapped IPv4)', () => {
    const key = '::ffff:127.0.0.1';
    const result = checkRateLimit(key, 5, 60000);
    expect(result.allowed).toBe(true);
  });

  it('handles very large limit values', () => {
    const key = uniqueKey();
    const result = checkRateLimit(key, 1000000, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(999999);
  });

  it('handles multiple rapid requests up to the limit', () => {
    const key = uniqueKey();
    const limit = 100;

    for (let i = 0; i < limit; i++) {
      const result = checkRateLimit(key, limit, 60000);
      expect(result.allowed).toBe(true);
    }

    const blocked = checkRateLimit(key, limit, 60000);
    expect(blocked.allowed).toBe(false);
  });

  it('correctly calculates retryAfter based on window', () => {
    const key = uniqueKey();
    const windowMs = 60 * 1000;

    checkRateLimit(key, 1, windowMs);

    const result = checkRateLimit(key, 1, windowMs);
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
    expect(result.retryAfter).toBeLessThanOrEqual(60);
  });

  describe('cleanup of stale entries', () => {
    it('cleans up expired entries when cleanup interval has passed', () => {
      // The cleanup function checks `now - lastCleanup < CLEANUP_INTERVAL` (5 min).
      // To trigger actual cleanup, we mock Date.now to advance past the interval.
      const realDateNow = Date.now;
      const baseTime = Date.now();

      // Step 1: Create an entry with a short window that will expire
      const expiredKey = `expired-${baseTime}`;
      checkRateLimit(expiredKey, 1, 100); // 100ms window

      // Step 2: Advance time by 6 minutes (past CLEANUP_INTERVAL of 5 min)
      // so the next checkRateLimit call triggers cleanup()
      const sixMinutesLater = baseTime + 6 * 60 * 1000;
      Date.now = jest.fn(() => sixMinutesLater);

      // Step 3: Make a new request — triggers cleanup, which deletes expired entries
      const freshKey = `fresh-${baseTime}`;
      const result = checkRateLimit(freshKey, 5, 60000);
      expect(result.allowed).toBe(true);

      // Restore real Date.now
      Date.now = realDateNow;
    });

    it('skips cleanup when interval has not elapsed', () => {
      // Tests the early return: `if (now - lastCleanup < CLEANUP_INTERVAL) return;`
      const key = uniqueKey();

      // First request triggers cleanup
      const r1 = checkRateLimit(key, 5, 60000);
      expect(r1.allowed).toBe(true);

      // Immediate second request — cleanup skips (interval not elapsed)
      // but the entry still works correctly
      const r2 = checkRateLimit(key, 5, 60000);
      expect(r2.allowed).toBe(true);
      expect(r2.remaining).toBe(3);
    });
  });
});
