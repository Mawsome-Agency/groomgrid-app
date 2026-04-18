/**
 * @jest-environment node
 *
 * Unit tests for GET /api/checkout/session
 *
 * This route creates a Stripe Checkout session with BETA50 pre-applied and
 * redirects (307) to the Stripe-hosted checkout URL.
 *
 * Coverage:
 *  - Valid plan param creates checkout session and redirects
 *  - BETA50 coupon is always pre-applied (discounts param)
 *  - allow_promotion_codes is omitted (Stripe mutual exclusivity with discounts)
 *  - Invalid plan param → 400
 *  - Missing plan param → 400
 *  - Stripe error → 500
 *  - Session without URL → 500
 *  - All three valid plans (solo/salon/enterprise)
 */

// ── Mocks (hoisted above imports) ─────────────────────────────────────────────

jest.mock('stripe', () => {
  const mockCreate = jest.fn();
  const MockStripe = jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: mockCreate,
      },
    },
  }));
  (MockStripe as any).__mockCreate = mockCreate;
  return { __esModule: true, default: MockStripe };
});

jest.mock('@/lib/validation', () => ({
  __esModule: true,
  requireEnvVar: jest.fn((name: string) => {
    const vars: Record<string, string> = {
      STRIPE_SECRET_KEY: 'sk_test_mock_key',
      STRIPE_PRICE_SOLO: 'price_mock_solo',
      STRIPE_PRICE_SALON: 'price_mock_salon',
      STRIPE_PRICE_ENTERPRISE: 'price_mock_enterprise',
    };
    return vars[name] ?? `mock_${name}`;
  }),
}));

// ── Imports ────────────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { GET } from '@/app/api/checkout/session/route';
import Stripe from 'stripe';

// Access the mock create function via the mock
function getMockCreate(): jest.MockedFunction<any> {
  const MockStripe = Stripe as unknown as jest.MockedClass<any>;
  return MockStripe.__mockCreate;
}

function makeRequest(url: string): NextRequest {
  return new NextRequest(url);
}

const MOCK_CHECKOUT_URL = 'https://checkout.stripe.com/c/pay/cs_test_mock_abc';

// ─────────────────────────────────────────────────────────────────────────────
// Valid plan → redirect
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/checkout/session — valid plans', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getMockCreate().mockResolvedValue({ id: 'cs_test_mock_abc', url: MOCK_CHECKOUT_URL });
  });

  it('redirects (307) to Stripe checkout URL for solo plan', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe(MOCK_CHECKOUT_URL);
  });

  it('redirects (307) to Stripe checkout URL for salon plan', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=salon');
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe(MOCK_CHECKOUT_URL);
  });

  it('redirects (307) to Stripe checkout URL for enterprise plan', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=enterprise');
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe(MOCK_CHECKOUT_URL);
  });

  it('calls stripe.checkout.sessions.create once per request', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    expect(getMockCreate()).toHaveBeenCalledTimes(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BETA50 coupon pre-applied
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/checkout/session — BETA50 coupon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getMockCreate().mockResolvedValue({ id: 'cs_test_mock_abc', url: MOCK_CHECKOUT_URL });
  });

  it('passes BETA50 as a discount coupon in the Stripe session params', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    const [params] = getMockCreate().mock.calls[0];
    expect(params.discounts).toEqual([{ coupon: 'BETA50' }]);
  });

  it('does not set allow_promotion_codes when coupon is pre-applied (Stripe mutual exclusivity)', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    const [params] = getMockCreate().mock.calls[0];
    // Stripe requires discounts and allow_promotion_codes to be mutually exclusive.
    // When discounts is specified, allow_promotion_codes must be omitted entirely.
    expect(params.allow_promotion_codes).toBeUndefined();
  });

  it('uses subscription mode', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    const [params] = getMockCreate().mock.calls[0];
    expect(params.mode).toBe('subscription');
  });

  it('includes correct price ID for solo plan', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    const [params] = getMockCreate().mock.calls[0];
    expect(params.line_items[0].price).toBe('price_mock_solo');
    expect(params.line_items[0].quantity).toBe(1);
  });

  it('includes correct price ID for salon plan', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=salon');
    await GET(req);

    const [params] = getMockCreate().mock.calls[0];
    expect(params.line_items[0].price).toBe('price_mock_salon');
  });

  it('includes correct price ID for enterprise plan', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=enterprise');
    await GET(req);

    const [params] = getMockCreate().mock.calls[0];
    expect(params.line_items[0].price).toBe('price_mock_enterprise');
  });

  it('sets success_url with CHECKOUT_SESSION_ID placeholder', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    const [params] = getMockCreate().mock.calls[0];
    expect(params.success_url).toContain('{CHECKOUT_SESSION_ID}');
    expect(params.success_url).toContain('/checkout/success');
  });

  it('sets cancel_url to /plans', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    const [params] = getMockCreate().mock.calls[0];
    expect(params.cancel_url).toContain('/plans');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Validation — missing or invalid plan param
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/checkout/session — validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getMockCreate().mockResolvedValue({ id: 'cs_test_mock', url: MOCK_CHECKOUT_URL });
  });

  it('returns 400 when plan param is missing', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session');
    const res = await GET(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/missing plan/i);
  });

  it('does NOT call Stripe when plan param is missing', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session');
    await GET(req);

    expect(getMockCreate()).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid plan "premium"', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=premium');
    const res = await GET(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/invalid plan/i);
  });

  it('returns 400 for invalid plan "free"', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=free');
    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  it('returns 400 for uppercase plan (case-sensitive)', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=SOLO');
    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  it('returns 400 for empty plan param', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=');
    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  it('does NOT call Stripe for invalid plan', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=bogus');
    await GET(req);

    expect(getMockCreate()).not.toHaveBeenCalled();
  });

  it.each(['solo', 'salon', 'enterprise'])('accepts valid plan "%s" without error', async (plan) => {
    const req = makeRequest(`http://localhost:3000/api/checkout/session?plan=${plan}`);
    const res = await GET(req);

    expect(res.status).toBe(307);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Error handling
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/checkout/session — error handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 500 when Stripe throws an error', async () => {
    getMockCreate().mockRejectedValueOnce(new Error('Stripe network error'));

    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    const res = await GET(req);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it('returns 500 when Stripe session has no URL', async () => {
    getMockCreate().mockResolvedValueOnce({ id: 'cs_no_url', url: null });

    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    const res = await GET(req);

    expect(res.status).toBe(500);
  });

  it('returns JSON error body on Stripe failure', async () => {
    getMockCreate().mockRejectedValueOnce(new Error('Connection timeout'));

    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=salon');
    const res = await GET(req);
    const body = await res.json();

    expect(body).toHaveProperty('error');
  });
});
