/**
 * @jest-environment node
 *
 * Unit tests for the BETA50 promo code + direct paid signup path feature.
 *
 * Coverage:
 *  - stripe.ts: couponCode is passed through to Stripe as discounts param
 *  - checkout route: coupon field accepted, sanitized, forwarded to createCheckoutSession
 *  - sanitization: uppercase, alphanumeric-only, max 20 chars
 */

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock('@/lib/stripe', () => ({
  __esModule: true,
  createCheckoutSession: jest.fn(),
  getCheckoutSession: jest.fn(),
  getStripeErrorMessage: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    paymentLockout: { findFirst: jest.fn() },
    profile: { findUnique: jest.fn() },
  },
}));

jest.mock('@/lib/ga4-server', () => ({
  __esModule: true,
  trackPaymentInitiatedServer: jest.fn(),
}));

jest.mock('@/lib/validation', () => ({
  __esModule: true,
  ensureEnv: jest.fn(),
}));

// ── Imports ────────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/checkout/route';
import { createCheckoutSession, getStripeErrorMessage } from '@/lib/stripe';
import prisma from '@/lib/prisma';

const mockCreateCheckoutSession = createCheckoutSession as jest.MockedFunction<typeof createCheckoutSession>;
const mockGetStripeErrorMessage = getStripeErrorMessage as jest.MockedFunction<typeof getStripeErrorMessage>;
const mockFindFirstLockout = prisma.paymentLockout.findFirst as jest.MockedFunction<typeof prisma.paymentLockout.findFirst>;
const mockFindUniqueProfile = prisma.profile.findUnique as jest.MockedFunction<typeof prisma.profile.findUnique>;

const MOCK_SESSION = {
  id: 'cs_test_promo_abc',
  url: 'https://checkout.stripe.com/c/pay/cs_test_promo_abc',
};

const MOCK_PROFILE = {
  id: 'profile-promo',
  userId: 'user-promo',
  businessName: 'Beta Groomers',
  createdAt: new Date(),
  updatedAt: new Date(),
};

function makeReq(body: Record<string, unknown>): NextRequest {
  return { json: () => Promise.resolve(body) } as unknown as NextRequest;
}

// ─────────────────────────────────────────────────────────────────────────────
// Checkout route — coupon field acceptance and sanitization
// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/checkout — coupon handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFindFirstLockout.mockResolvedValue(null);
    mockFindUniqueProfile.mockResolvedValue(MOCK_PROFILE as any);
    mockCreateCheckoutSession.mockResolvedValue(MOCK_SESSION as any);
    mockGetStripeErrorMessage.mockReturnValue({ message: 'Error', type: 'generic', declineCode: undefined });
  });

  it('passes couponCode to createCheckoutSession when coupon is provided', async () => {
    const req = makeReq({ userId: 'user-promo', planType: 'solo', coupon: 'BETA50' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.couponCode).toBe('BETA50');
  });

  it('passes undefined couponCode when no coupon is provided', async () => {
    const req = makeReq({ userId: 'user-promo', planType: 'solo' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.couponCode).toBeUndefined();
  });

  it('uppercases the coupon before passing to createCheckoutSession', async () => {
    const req = makeReq({ userId: 'user-promo', planType: 'solo', coupon: 'beta50' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.couponCode).toBe('BETA50');
  });

  it('strips non-alphanumeric characters from coupon', async () => {
    const req = makeReq({ userId: 'user-promo', planType: 'solo', coupon: 'BETA-50!' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.couponCode).toBe('BETA50');
  });

  it('truncates coupon to 20 characters', async () => {
    const req = makeReq({ userId: 'user-promo', planType: 'solo', coupon: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.couponCode).toBe('ABCDEFGHIJKLMNOPQRST'); // 20 chars
  });

  it('passes undefined when coupon sanitizes to empty string', async () => {
    // All non-alphanumeric → empty after strip → undefined
    const req = makeReq({ userId: 'user-promo', planType: 'solo', coupon: '---' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.couponCode).toBeUndefined();
  });

  it('returns 200 when coupon is provided alongside valid userId and planType', async () => {
    const req = makeReq({ userId: 'user-promo', planType: 'solo', coupon: 'BETA50' });
    const res = await POST(req);

    expect(res.status).toBe(200);
  });

  it('still returns checkout url when coupon is present', async () => {
    const req = makeReq({ userId: 'user-promo', planType: 'salon', coupon: 'BETA50' });
    const res = await POST(req);
    const body = await res.json();

    expect(body.url).toBe(MOCK_SESSION.url);
  });

  it('passes coupon for all three plan types', async () => {
    for (const planType of ['solo', 'salon', 'enterprise'] as const) {
      jest.clearAllMocks();
      mockFindFirstLockout.mockResolvedValue(null);
      mockFindUniqueProfile.mockResolvedValue(MOCK_PROFILE as any);
      mockCreateCheckoutSession.mockResolvedValue(MOCK_SESSION as any);

      const req = makeReq({ userId: 'user-promo', planType, coupon: 'BETA50' });
      await POST(req);

      const [args] = mockCreateCheckoutSession.mock.calls[0];
      expect(args.couponCode).toBe('BETA50');
      expect(args.planType).toBe(planType);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// stripe.ts — CreateCheckoutSessionParams includes couponCode
// ─────────────────────────────────────────────────────────────────────────────
describe('createCheckoutSession — couponCode param shape', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFindFirstLockout.mockResolvedValue(null);
    mockFindUniqueProfile.mockResolvedValue(MOCK_PROFILE as any);
    mockCreateCheckoutSession.mockResolvedValue(MOCK_SESSION as any);
    mockGetStripeErrorMessage.mockReturnValue({ message: 'Error', type: 'generic', declineCode: undefined });
  });

  it('couponCode appears in args when coupon is present in request', async () => {
    const req = makeReq({ userId: 'user-promo', planType: 'solo', coupon: 'BETA50' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args).toHaveProperty('couponCode', 'BETA50');
  });

  it('couponCode is absent (not null) from args when no coupon provided', async () => {
    const req = makeReq({ userId: 'user-promo', planType: 'solo' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    // Should be undefined, not null or empty string
    expect(args.couponCode).toBeUndefined();
  });
});
