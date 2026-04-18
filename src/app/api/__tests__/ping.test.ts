/**
 * Tests for the liveness ping endpoint.
 *
 * GET /api/health/ping — no DB, no env-var dependencies.
 * We mock next/server to avoid the Request global requirement in jsdom,
 * matching the pattern used by the health-check utility tests.
 */

// Mock next/server before importing the route
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body: unknown, _init?: ResponseInit) => ({
      _body: body,
      status: (_init as { status?: number } | undefined)?.status ?? 200,
      async json() { return body; },
    })),
  },
}));

import { GET } from '@/app/api/health/ping/route';

describe('GET /api/health/ping', () => {
  it('returns 200 with ok:true and a timestamp', async () => {
    const before = new Date().toISOString();
    const response = await GET();
    const after = new Date().toISOString();

    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(typeof body.timestamp).toBe('string');

    // Timestamp should fall within the test window
    expect(body.timestamp >= before).toBe(true);
    expect(body.timestamp <= after).toBe(true);
  });

  it('returns a valid ISO 8601 timestamp', async () => {
    const response = await GET();
    const body = await response.json();

    const parsed = new Date(body.timestamp);
    expect(parsed.toString()).not.toBe('Invalid Date');
    expect(parsed.toISOString()).toBe(body.timestamp);
  });
});
