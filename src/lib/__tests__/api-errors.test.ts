/**
 * Tests for api-errors.ts — the shared API error response helper.
 *
 * Testing strategy:
 * - Happy path: default values, minimal args
 * - All options: type, declineCode, retryAfter, fields, headers
 * - Edge cases: empty strings, 0 values, undefined vs absent, null
 * - Response shape: JSON body matches contract exactly
 * - HTTP semantics: status codes, custom headers
 * - Conditional fields: declineCode/retryAfter/fields only present when set
 *
 * Coverage target: 100% line + branch coverage for api-errors.ts
 */

// Mock next/server — matches existing project pattern (see ping.test.ts)
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body: unknown, init?: ResponseInit & { headers?: Record<string, string> }) => {
      const status = init?.status ?? 200;
      const headers = new Map<string, string>();
      headers.set('content-type', 'application/json');
      if (init?.headers && typeof init.headers === 'object') {
        for (const [k, v] of Object.entries(init.headers)) {
          headers.set(k, v);
        }
      }
      return {
        _body: body,
        status,
        headers: {
          get: (key: string) => headers.get(key.toLowerCase()) ?? headers.get(key) ?? null,
        },
        async json() { return body; },
      };
    }),
  },
}));

import { apiError, ApiErrorOptions } from '../api-errors';

// Helper to extract JSON body from our mocked response
async function parseBody(response: any): Promise<Record<string, unknown>> {
  return response.json();
}

describe('apiError', () => {
  // ── Happy Path ──────────────────────────────────────────────────────

  describe('defaults (minimal arguments)', () => {
    it('should return 500 status when no status provided', () => {
      const res = apiError('Something went wrong');
      expect(res.status).toBe(500);
    });

    it('should default errorType to "generic" when no options provided', async () => {
      const res = apiError('Something went wrong');
      const body = await parseBody(res);
      expect(body.errorType).toBe('generic');
    });

    it('should set the error message in the response body', async () => {
      const res = apiError('Database connection failed');
      const body = await parseBody(res);
      expect(body.error).toBe('Database connection failed');
    });

    it('should NOT include declineCode when not provided', async () => {
      const res = apiError('fail');
      const body = await parseBody(res);
      expect(body).not.toHaveProperty('declineCode');
    });

    it('should NOT include retryAfter when not provided', async () => {
      const res = apiError('fail');
      const body = await parseBody(res);
      expect(body).not.toHaveProperty('retryAfter');
    });

    it('should NOT include fields when not provided', async () => {
      const res = apiError('fail');
      const body = await parseBody(res);
      expect(body).not.toHaveProperty('fields');
    });

    it('should return JSON content-type', () => {
      const res = apiError('fail');
      expect(res.headers.get('content-type')).toContain('application/json');
    });
  });

  // ── Status Codes ──────────────────────────────────────────────────

  describe('status codes', () => {
    const cases: [string, number][] = [
      ['bad request', 400],
      ['unauthorized', 401],
      ['forbidden', 403],
      ['not found', 404],
      ['conflict', 409],
      ['rate limited', 429],
      ['server error', 500],
      ['bad gateway', 502],
      ['service unavailable', 503],
    ];

    cases.forEach(([label, code]) => {
      it(`should use ${code} for ${label}`, () => {
        const res = apiError(label, code);
        expect(res.status).toBe(code);
      });
    });
  });

  // ── Error Type Option ─────────────────────────────────────────────

  describe('type option', () => {
    it('should set errorType to "declined" for payment declined', async () => {
      const res = apiError('Card declined', 402, { type: 'declined' });
      const body = await parseBody(res);
      expect(body.errorType).toBe('declined');
    });

    it('should set errorType to "insufficient"', async () => {
      const res = apiError('Insufficient funds', 402, { type: 'insufficient' });
      const body = await parseBody(res);
      expect(body.errorType).toBe('insufficient');
    });

    it('should set errorType to "expired"', async () => {
      const res = apiError('Card expired', 402, { type: 'expired' });
      const body = await parseBody(res);
      expect(body.errorType).toBe('expired');
    });

    it('should set errorType to "network"', async () => {
      const res = apiError('Network error', 502, { type: 'network' });
      const body = await parseBody(res);
      expect(body.errorType).toBe('network');
    });

    it('should allow arbitrary string error types', async () => {
      const res = apiError('Custom', 500, { type: 'custom_domain_error' });
      const body = await parseBody(res);
      expect(body.errorType).toBe('custom_domain_error');
    });

    it('should default to "generic" when type is undefined in options', async () => {
      const res = apiError('Error', 500, { type: undefined });
      const body = await parseBody(res);
      expect(body.errorType).toBe('generic');
    });

    it('should pass through empty string as type (not caught by ??)', async () => {
      const res = apiError('Error', 500, { type: '' });
      const body = await parseBody(res);
      // ?? only catches null/undefined — empty string passes through
      expect(body.errorType).toBe('');
    });
  });

  // ── Decline Code Option ───────────────────────────────────────────

  describe('declineCode option', () => {
    it('should include declineCode when provided', async () => {
      const res = apiError('Declined', 402, { type: 'declined', declineCode: 'card_declined' });
      const body = await parseBody(res);
      expect(body.declineCode).toBe('card_declined');
    });

    it('should include declineCode "insufficient_funds"', async () => {
      const res = apiError('Insufficient', 402, { declineCode: 'insufficient_funds' });
      const body = await parseBody(res);
      expect(body.declineCode).toBe('insufficient_funds');
    });

    it('should NOT include declineCode when undefined', async () => {
      const res = apiError('Error', 500, { declineCode: undefined });
      const body = await parseBody(res);
      expect(body).not.toHaveProperty('declineCode');
    });

    it('should include empty string declineCode (not undefined)', async () => {
      const res = apiError('Error', 500, { declineCode: '' });
      const body = await parseBody(res);
      expect(body).toHaveProperty('declineCode');
      expect(body.declineCode).toBe('');
    });
  });

  // ── Retry After Option ────────────────────────────────────────────

  describe('retryAfter option', () => {
    it('should include retryAfter when provided', async () => {
      const res = apiError('Rate limited', 429, { retryAfter: 60 });
      const body = await parseBody(res);
      expect(body.retryAfter).toBe(60);
    });

    it('should include retryAfter of 0 (falsy but not undefined)', async () => {
      const res = apiError('Rate limited', 429, { retryAfter: 0 });
      const body = await parseBody(res);
      expect(body).toHaveProperty('retryAfter');
      expect(body.retryAfter).toBe(0);
    });

    it('should NOT include retryAfter when undefined', async () => {
      const res = apiError('Error', 429, { retryAfter: undefined });
      const body = await parseBody(res);
      expect(body).not.toHaveProperty('retryAfter');
    });

    it('should include large retryAfter values', async () => {
      const res = apiError('Rate limited', 429, { retryAfter: 3600 });
      const body = await parseBody(res);
      expect(body.retryAfter).toBe(3600);
    });
  });

  // ── Fields Option (Validation Errors) ─────────────────────────────

  describe('fields option', () => {
    it('should include fields for validation errors', async () => {
      const fields = { email: 'Invalid email format', password: 'Too short' };
      const res = apiError('Validation failed', 400, { fields });
      const body = await parseBody(res);
      expect(body.fields).toEqual(fields);
    });

    it('should include single field error', async () => {
      const res = apiError('Validation failed', 400, { fields: { email: 'Required' } });
      const body = await parseBody(res);
      expect(body.fields).toEqual({ email: 'Required' });
    });

    it('should include empty fields object when explicitly provided', async () => {
      const res = apiError('Error', 400, { fields: {} });
      const body = await parseBody(res);
      expect(body).toHaveProperty('fields');
      expect(body.fields).toEqual({});
    });

    it('should NOT include fields when undefined', async () => {
      const res = apiError('Error', 400, { fields: undefined });
      const body = await parseBody(res);
      expect(body).not.toHaveProperty('fields');
    });
  });

  // ── Headers Option ────────────────────────────────────────────────

  describe('headers option', () => {
    it('should set custom HTTP headers', () => {
      const res = apiError('Rate limited', 429, {
        headers: { 'Retry-After': '60' },
      });
      expect(res.headers.get('Retry-After')).toBe('60');
    });

    it('should set multiple custom headers', () => {
      const res = apiError('Error', 500, {
        headers: {
          'X-Request-Id': 'abc123',
          'X-Error-Code': 'DB_TIMEOUT',
        },
      });
      expect(res.headers.get('X-Request-Id')).toBe('abc123');
      expect(res.headers.get('X-Error-Code')).toBe('DB_TIMEOUT');
    });

    it('should still include content-type alongside custom headers', () => {
      const res = apiError('Error', 500, {
        headers: { 'X-Custom': 'test' },
      });
      expect(res.headers.get('content-type')).toContain('application/json');
    });
  });

  // ── Combined Options ──────────────────────────────────────────────

  describe('combined options', () => {
    it('should handle all options together (payment error)', async () => {
      const res = apiError('Card declined', 402, {
        type: 'declined',
        declineCode: 'card_declined',
        retryAfter: 30,
        headers: { 'X-Payment-Error': 'true' },
      });

      expect(res.status).toBe(402);
      expect(res.headers.get('X-Payment-Error')).toBe('true');

      const body = await parseBody(res);
      expect(body).toEqual({
        error: 'Card declined',
        errorType: 'declined',
        declineCode: 'card_declined',
        retryAfter: 30,
      });
    });

    it('should handle validation error with fields + type', async () => {
      const res = apiError('Validation failed', 400, {
        type: 'validation',
        fields: { email: 'Invalid', name: 'Required' },
      });

      const body = await parseBody(res);
      expect(body.error).toBe('Validation failed');
      expect(body.errorType).toBe('validation');
      expect(body.fields).toEqual({ email: 'Invalid', name: 'Required' });
      expect(body).not.toHaveProperty('declineCode');
      expect(body).not.toHaveProperty('retryAfter');
    });

    it('should handle rate limit with retryAfter + header', async () => {
      const res = apiError('Too many requests', 429, {
        retryAfter: 120,
        headers: { 'Retry-After': '120' },
      });

      expect(res.status).toBe(429);
      expect(res.headers.get('Retry-After')).toBe('120');

      const body = await parseBody(res);
      expect(body.retryAfter).toBe(120);
      expect(body.errorType).toBe('generic');
    });
  });

  // ── Edge Cases ────────────────────────────────────────────────────

  describe('edge cases', () => {
    it('should handle empty error message', async () => {
      const res = apiError('');
      const body = await parseBody(res);
      expect(body.error).toBe('');
    });

    it('should handle very long error messages', async () => {
      const longMsg = 'x'.repeat(10000);
      const res = apiError(longMsg);
      const body = await parseBody(res);
      expect(body.error).toBe(longMsg);
    });

    it('should handle error messages with special characters', async () => {
      const msg = 'Error: "test" <script>alert(1)</script> & more';
      const res = apiError(msg, 400);
      const body = await parseBody(res);
      expect(body.error).toBe(msg);
    });

    it('should handle error messages with unicode', async () => {
      const msg = 'Error: 日本語テスト 🐕';
      const res = apiError(msg, 400);
      const body = await parseBody(res);
      expect(body.error).toBe(msg);
    });

    it('should handle empty options object', async () => {
      const res = apiError('Error', 500, {});
      const body = await parseBody(res);
      expect(body.errorType).toBe('generic');
      expect(body).not.toHaveProperty('declineCode');
      expect(body).not.toHaveProperty('retryAfter');
      expect(body).not.toHaveProperty('fields');
    });

    it('should handle options with all undefined values', async () => {
      const res = apiError('Error', 500, {
        type: undefined,
        declineCode: undefined,
        retryAfter: undefined,
        fields: undefined,
        headers: undefined,
      });
      const body = await parseBody(res);
      expect(body.errorType).toBe('generic');
      expect(Object.keys(body)).toEqual(['error', 'errorType']);
    });
  });

  // ── Response Shape Contract ───────────────────────────────────────

  describe('response shape contract', () => {
    it('should always include "error" and "errorType" keys', async () => {
      const res = apiError('Test');
      const body = await parseBody(res);
      expect(Object.keys(body)).toContain('error');
      expect(Object.keys(body)).toContain('errorType');
    });

    it('minimal body has exactly 2 keys: error + errorType', async () => {
      const res = apiError('Test');
      const body = await parseBody(res);
      expect(Object.keys(body)).toHaveLength(2);
    });

    it('maximal body has exactly 5 keys', async () => {
      const res = apiError('Test', 402, {
        type: 'declined',
        declineCode: 'card_declined',
        retryAfter: 60,
        fields: { card: 'invalid' },
      });
      const body = await parseBody(res);
      expect(Object.keys(body)).toHaveLength(5);
    });
  });
});
