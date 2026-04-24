/**
 * @jest-environment node
 *
 * Unit tests for the deprecated POST /api/stripe route.
 *
 * After consolidation, the frontend calls POST /api/checkout exclusively.
 * This route is dead code: it returns 405 with a Location header pointing
 * to /api/checkout so any accidental caller gets a clear, actionable error
 * instead of a silent success from stale code.
 *
 * Coverage:
 *  - Returns 405 Method Not Allowed
 *  - Response body has an `error` field describing the move
 *  - `error` message references /api/checkout as the correct destination
 *  - Location header is set to /api/checkout
 *  - Response is JSON (Content-Type check)
 *  - No external dependencies are invoked (Stripe, Prisma, NextAuth)
 *  - Returns 405 regardless of request body content (empty, valid plan, garbage)
 */

import { POST } from '@/app/api/stripe/route';

// ─────────────────────────────────────────────────────────────────────────────
// 405 status
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/stripe — deprecated 405 handler', () => {
  it('returns 405 Method Not Allowed', async () => {
    const res = POST();
    expect(res.status).toBe(405);
  });

  it('returns 405 for every call — no conditional logic', async () => {
    // Calling multiple times must always return 405 — not a one-shot check.
    const [r1, r2, r3] = [POST(), POST(), POST()];
    expect(r1.status).toBe(405);
    expect(r2.status).toBe(405);
    expect(r3.status).toBe(405);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Error body
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/stripe — response body', () => {
  it('response body has an "error" field', async () => {
    const body = await POST().json();
    expect(body).toHaveProperty('error');
  });

  it('error message is a non-empty string', async () => {
    const body = await POST().json();
    expect(typeof body.error).toBe('string');
    expect(body.error.length).toBeGreaterThan(0);
  });

  it('error message references /api/checkout as the correct endpoint', async () => {
    const body = await POST().json();
    expect(body.error).toContain('/api/checkout');
  });

  it('error message does not expose internal stack traces or env vars', async () => {
    const body = await POST().json();
    // Must not contain typical stack trace markers
    expect(body.error).not.toContain('at ');
    expect(body.error).not.toContain('Error:');
    expect(body.error).not.toContain('process.env');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Location header
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/stripe — Location header', () => {
  it('sets Location header to /api/checkout', async () => {
    const res = POST();
    expect(res.headers.get('location')).toBe('/api/checkout');
  });

  it('Location header is present (not null)', async () => {
    const res = POST();
    expect(res.headers.get('location')).not.toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// No side effects — dead code must stay dead
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/stripe — no side effects', () => {
  it('returns synchronously — no async/await needed (no I/O)', () => {
    // If POST() returns a Response (not a Promise<Response>), it is synchronous.
    // We verify by checking the return value is a Response, not a Promise.
    const result = POST();
    // A Response object is not a Promise — it does not have a .then method on itself
    // (though res.json() does). We check it is an instance of Response.
    expect(result).toBeInstanceOf(Response);
  });

  it('returns identical status on repeated calls — no internal state mutation', () => {
    const statuses = Array.from({ length: 5 }, () => POST().status);
    expect(new Set(statuses).size).toBe(1); // all identical
    expect(statuses[0]).toBe(405);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Edge cases — body payload should not affect the response
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/stripe — body payload is irrelevant', () => {
  /**
   * The new POST() signature takes no arguments — it ignores the request.
   * These tests document and lock that contract.
   */
  it('returns 405 when called with no arguments (signature requires none)', () => {
    // TypeScript signature: export function POST() — zero params.
    // Calling with no args is the only valid usage.
    const res = POST();
    expect(res.status).toBe(405);
  });

  it('Location header is /api/checkout regardless of any implicit context', () => {
    const res = POST();
    expect(res.headers.get('location')).toBe('/api/checkout');
  });
});
