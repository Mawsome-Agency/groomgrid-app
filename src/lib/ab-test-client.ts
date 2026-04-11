/**
 * A/B Testing Framework - Client-safe utilities
 *
 * Pure functions with no server-side dependencies (no Prisma, no pg).
 * Safe to import in 'use client' components.
 */

export type Variant = 'A' | 'B';

/**
 * Simple hash function for deterministic variant assignment (djb2 algorithm).
 * Returns the same variant for the same user+test combination, every time.
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * Get variant for a user/session based on test name.
 * Deterministic — no DB required.
 */
export function getVariant(testName: string, userId?: string, sessionId?: string): Variant {
  const identifier = userId || sessionId || 'anonymous';
  const hashInput = `${testName}:${identifier}`;
  const hash = hashString(hashInput);
  const normalized = (hash % 1000) / 1000;
  return normalized < 0.5 ? 'A' : 'B';
}

/**
 * Record an A/B test assignment via API (fire-and-forget).
 * Call from client components instead of importing server-side ab-test.ts directly.
 */
export async function trackAssignment(
  testName: string,
  variant: Variant,
  userId: string
): Promise<void> {
  try {
    await fetch('/api/ab-test/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testName, variant, userId }),
    });
  } catch {
    // Non-critical — don't break UI if tracking fails
  }
}
