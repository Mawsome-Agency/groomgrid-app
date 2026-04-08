/**
 * In-memory token bucket rate limiter.
 *
 * Tracks request counts per key (typically IP address) within a sliding window.
 * Designed for single-process deployments (like PM2 single instance).
 * Not shared across processes — acceptable for MVP scale.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number; // timestamp ms
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  store.forEach((entry, key) => {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  });
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number; // seconds until reset (0 if allowed)
}

/**
 * Check and consume a rate limit token for the given key.
 *
 * @param key - Unique identifier (e.g., IP address)
 * @param limit - Max requests allowed in the window
 * @param windowMs - Window duration in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 10 * 60 * 1000, // 10 minutes
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const entry = store.get(key);

  // No existing entry or window expired — start fresh
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  // Within window — check count
  if (entry.count < limit) {
    entry.count++;
    return { allowed: true, remaining: limit - entry.count, retryAfter: 0 };
  }

  // Rate limited
  const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
  return { allowed: false, remaining: 0, retryAfter };
}
