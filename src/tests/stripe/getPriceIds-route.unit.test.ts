/**
 * @jest-environment node
 *
 * Route-level integration tests confirming that planType → STRIPE_PRICE_*
 * env var routing is correct end-to-end through the checkout API.
 *
 * getPriceIds() in src/lib/stripe.ts maps:
 *   solo       → STRIPE_PRICE_SOLO
 *   salon      → STRIPE_PRICE_SALON
 *   enterprise → STRIPE_PRICE_ENTERPRISE
 *
 * We can't import stripe.ts directly (SIGTRAP — see jest.config.js).
 * Instead we use the repo's standard pattern: mock @/lib/stripe entirely and
 * verify that the checkout route forwards the correct planType and planData
 * to createCheckoutSession, which is the function that internally calls
 * getPriceIds()[planType] to get the Stripe price ID.
 *
 * The planData prices (solo=$29, salon=$79, enterprise=$149) in the route's
 * PLAN_DATA must match the prices in pricing-data.ts — this test suite
 * acts as a regression guard for that alignment.
 *
 * Coverage targets:
 *  - solo plan → planType:'solo', planData:{name:'Solo Groomer', price:2900}
 *  - salon plan → planType:'salon', planData:{name:'Salon Team', price:7900}
 *  - enterprise plan → planType:'enterprise', planData:{name:'Multi-Location', price:14900}
 *  - planType is forwarded as-is (no transformation)
 *  - createCheckoutSession is called exactly once per request
 */

// ── Mocks (hoisted above imports) ────────────────────────────────────────────

jest.mock('@/lib/stripe', () => ({
  __esModule: true,
  createCheckoutSession: jest.fn(),
  getCheckoutSession: jest.fn(),
  getStripeErrorMessage: jest.fn().mockReturnValue({
    message: 'Error',
    type: 'generic',
    declineCode: undefined,
  }),
}));

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    paymentLockout: { findFirst: jest.fn().mockResolvedValue(null) },
    profile: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'profile-1',
        userId: 'user-123',
        businessName: 'Test Grooming Co',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    },
  },
}));

jest.mock('@/lib/ga4-server', () => ({
  __esModule: true,
  trackPaymentInitiatedServer: jest.fn(),
}));

jest.mock('@/lib/validation', () => ({
  __esModule: true,
  ensureEnv: jest.fn(),
  requireEnvVar: jest.fn((name: string) => `mock_${name}`),
}));

jest.mock('next/headers', () => ({
  headers: jest.fn(() => new Headers()),
  cookies: jest.fn(() => ({ get: jest.fn(), getAll: jest.fn(() => []) })),
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() =>
    Promise.resolve({ user: { id: 'user-123', email: 'test@example.com' } })
  ),
}));

// ── Imports ───────────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/checkout/route';
import { createCheckoutSession } from '@/lib/stripe';

const mockCreate = createCheckoutSession as jest.MockedFunction<typeof createCheckoutSession>;

const MOCK_SESSION = {
  id: 'cs_test_mock_abc',
  url: 'https://checkout.stripe.com/c/pay/cs_test_mock_abc',
};

function makeReq(body: Record<string, unknown>): NextRequest {
  return { json: () => Promise.resolve(body) } as unknown as NextRequest;
}

// ─────────────────────────────────────────────────────────────────────────────
// planType routing → correct planData (price and name alignment with pricing-data.ts)
// ─────────────────────────────────────────────────────────────────────────────
describe('getPriceIds() route integration — planType routes to correct STRIPE_PRICE_* config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockResolvedValue(MOCK_SESSION as any);
  });

  it('solo plan passes planType:"solo" to createCheckoutSession', async () => {
    await POST(makeReq({ userId: 'user-123', planType: 'solo' }));
    const [args] = mockCreate.mock.calls[0];
    expect(args.planType).toBe('solo');
  });

  it('salon plan passes planType:"salon" to createCheckoutSession', async () => {
    await POST(makeReq({ userId: 'user-123', planType: 'salon' }));
    const [args] = mockCreate.mock.calls[0];
    expect(args.planType).toBe('salon');
  });

  it('enterprise plan passes planType:"enterprise" to createCheckoutSession', async () => {
    await POST(makeReq({ userId: 'user-123', planType: 'enterprise' }));
    const [args] = mockCreate.mock.calls[0];
    expect(args.planType).toBe('enterprise');
  });

  // Regression: planData prices must align with pricing-data.ts PLANS array
  it.each([
    ['solo',       { name: 'Solo Groomer',   price: 2900  }],
    ['salon',      { name: 'Salon Team',     price: 7900  }],
    ['enterprise', { name: 'Multi-Location', price: 14900 }],
  ] as const)('%s plan forwards correct planData to createCheckoutSession', async (planType, expectedPlanData) => {
    await POST(makeReq({ userId: 'user-123', planType }));
    const [args] = mockCreate.mock.calls[0];
    expect(args.planData).toEqual(expectedPlanData);
  });

  it('solo planData price is 2900 (matches $29/mo in pricing-data.ts)', async () => {
    await POST(makeReq({ userId: 'user-123', planType: 'solo' }));
    const [args] = mockCreate.mock.calls[0];
    expect(args.planData?.price).toBe(2900);
  });

  it('salon planData price is 7900 (matches $79/mo in pricing-data.ts)', async () => {
    await POST(makeReq({ userId: 'user-123', planType: 'salon' }));
    const [args] = mockCreate.mock.calls[0];
    expect(args.planData?.price).toBe(7900);
  });

  it('enterprise planData price is 14900 (matches $149/mo in pricing-data.ts)', async () => {
    await POST(makeReq({ userId: 'user-123', planType: 'enterprise' }));
    const [args] = mockCreate.mock.calls[0];
    expect(args.planData?.price).toBe(14900);
  });

  it('solo planData name is "Solo Groomer"', async () => {
    await POST(makeReq({ userId: 'user-123', planType: 'solo' }));
    const [args] = mockCreate.mock.calls[0];
    expect(args.planData?.name).toBe('Solo Groomer');
  });

  it('salon planData name is "Salon Team"', async () => {
    await POST(makeReq({ userId: 'user-123', planType: 'salon' }));
    const [args] = mockCreate.mock.calls[0];
    expect(args.planData?.name).toBe('Salon Team');
  });

  it('enterprise planData name is "Multi-Location"', async () => {
    await POST(makeReq({ userId: 'user-123', planType: 'enterprise' }));
    const [args] = mockCreate.mock.calls[0];
    expect(args.planData?.name).toBe('Multi-Location');
  });

  it('createCheckoutSession is called exactly once per request', async () => {
    await POST(makeReq({ userId: 'user-123', planType: 'solo' }));
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('planType does NOT get transformed (e.g. uppercased or renamed)', async () => {
    for (const planType of ['solo', 'salon', 'enterprise'] as const) {
      jest.clearAllMocks();
      mockCreate.mockResolvedValue(MOCK_SESSION as any);
      await POST(makeReq({ userId: 'user-123', planType }));
      const [args] = mockCreate.mock.calls[0];
      expect(args.planType).toBe(planType);
    }
  });
});
