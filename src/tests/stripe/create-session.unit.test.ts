/**
 * @jest-environment node
 *
 * Unit tests for the checkout session creation flow.
 *
 * Uses jest.mock('@/lib/stripe') to avoid V8 SIGTRAP crash caused by native Stripe
 * SDK bindings loading in jest-worker (even when the stripe constructor is mocked).
 * This is the same mock strategy used in checkout.unit.test.ts.
 *
 * Bug coverage (at route-call-boundary level):
 *  Bug 1: customer_update is NOT a field in CreateCheckoutSessionParams — the function
 *         interface itself enforces its absence; these tests confirm the route passes
 *         only documented params (no stray customer_update sneaks through).
 *  Bug 2: createCheckoutSession receives userId so it can set session-level metadata.userId
 */

// ── Mocks (hoisted above imports) ──────────────────────────────────────────

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

// next/headers is only available in Next.js request scope; stub it so
// getServerSession doesn't throw "headers() called outside request scope".
jest.mock('next/headers', () => ({
  headers: jest.fn(() => new Headers()),
  cookies: jest.fn(() => ({ get: jest.fn(), getAll: jest.fn(() => []) })),
}));

// Mock getServerSession so route auth check passes without a real request context.
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() =>
    Promise.resolve({ user: { id: 'user-123', email: 'test@example.com' } })
  ),
}));

// ── Imports ────────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/checkout/route';
import { createCheckoutSession, getCheckoutSession, getStripeErrorMessage } from '@/lib/stripe';
import prisma from '@/lib/prisma';

const mockCreateCheckoutSession = createCheckoutSession as jest.MockedFunction<typeof createCheckoutSession>;
const mockGetCheckoutSession = getCheckoutSession as jest.MockedFunction<typeof getCheckoutSession>;
const mockGetStripeErrorMessage = getStripeErrorMessage as jest.MockedFunction<typeof getStripeErrorMessage>;
const mockFindFirstLockout = prisma.paymentLockout.findFirst as jest.MockedFunction<typeof prisma.paymentLockout.findFirst>;
const mockFindUniqueProfile = prisma.profile.findUnique as jest.MockedFunction<typeof prisma.profile.findUnique>;

function makeReq(body: Record<string, unknown>): NextRequest {
  return { json: () => Promise.resolve(body) } as unknown as NextRequest;
}

const MOCK_SESSION = {
  id: 'cs_test_session_abc',
  url: 'https://checkout.stripe.com/c/pay/cs_test_session_abc',
};

const MOCK_PROFILE = {
  id: 'profile-1',
  userId: 'user-123',
  businessName: 'Pampered Paws Grooming',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─────────────────────────────────────────────────────────────────────────────
// createCheckoutSession interface contract
// (Bug 1: customer_update absent; Bug 2: userId present for metadata)
// ─────────────────────────────────────────────────────────────────────────────
describe('createCheckoutSession params — Bug 1 & 2 interface contract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFindFirstLockout.mockResolvedValue(null);
    mockFindUniqueProfile.mockResolvedValue(MOCK_PROFILE as any);
    mockCreateCheckoutSession.mockResolvedValue(MOCK_SESSION as any);
    mockGetStripeErrorMessage.mockReturnValue({ message: 'Error', type: 'generic', declineCode: undefined });
  });

  // Bug 1: customer_update must NOT be in the params passed to createCheckoutSession
  it('does NOT pass customer_update to createCheckoutSession (Bug 1: not in CreateCheckoutSessionParams)', async () => {
    const req = makeReq({ userId: 'user-123', planType: 'solo', customerEmail: 'test@example.com' });
    await POST(req);

    expect(mockCreateCheckoutSession).toHaveBeenCalledTimes(1);
    const [args] = mockCreateCheckoutSession.mock.calls[0];
    // customer_update is not a field on CreateCheckoutSessionParams
    expect(args).not.toHaveProperty('customer_update');
  });

  // Bug 2: userId must be passed so createCheckoutSession can set session.metadata.userId
  it('passes userId to createCheckoutSession so session-level metadata.userId can be set (Bug 2)', async () => {
    const req = makeReq({ userId: 'user-123', planType: 'salon' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.userId).toBe('user-123');
  });

  it('passes planType to createCheckoutSession', async () => {
    const req = makeReq({ userId: 'user-123', planType: 'enterprise' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.planType).toBe('enterprise');
  });

  it('passes customerEmail to createCheckoutSession', async () => {
    const req = makeReq({ userId: 'user-123', planType: 'solo', customerEmail: 'groomer@example.com' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.customerEmail).toBe('groomer@example.com');
  });

  it('passes businessName from profile to createCheckoutSession', async () => {
    const req = makeReq({ userId: 'user-123', planType: 'solo' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.businessName).toBe('Pampered Paws Grooming');
  });

  it('passes planData with name and price to createCheckoutSession', async () => {
    const req = makeReq({ userId: 'user-123', planType: 'solo' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.planData).toEqual({ name: 'Solo Groomer', price: 2900 });
  });

  it('params object matches CreateCheckoutSessionParams shape — no extra Stripe-internal fields', async () => {
    const req = makeReq({ userId: 'user-123', planType: 'solo', clientId: 'ga4-client-id' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    // Only these fields are valid in CreateCheckoutSessionParams
    const knownFields = ['userId', 'planType', 'customerEmail', 'businessName', 'planData', 'clientId', 'couponCode'];
    const actualFields = Object.keys(args);
    const unknownFields = actualFields.filter(f => !knownFields.includes(f));
    expect(unknownFields).toHaveLength(0);
  });

  it('passes clientId when provided in request body', async () => {
    const req = makeReq({ userId: 'user-123', planType: 'solo', clientId: 'ga4-xyz' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.clientId).toBe('ga4-xyz');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Session creation response
// ─────────────────────────────────────────────────────────────────────────────
describe('session creation response shape', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFindFirstLockout.mockResolvedValue(null);
    mockFindUniqueProfile.mockResolvedValue(MOCK_PROFILE as any);
    mockCreateCheckoutSession.mockResolvedValue(MOCK_SESSION as any);
    mockGetStripeErrorMessage.mockReturnValue({ message: 'Error', type: 'generic', declineCode: undefined });
  });

  it('response contains url from Stripe session', async () => {
    const req = makeReq({ userId: 'user-123', planType: 'solo' });
    const res = await POST(req);
    const body = await res.json();

    expect(body.url).toBe('https://checkout.stripe.com/c/pay/cs_test_session_abc');
  });

  it('response contains sessionId from Stripe session', async () => {
    const req = makeReq({ userId: 'user-123', planType: 'solo' });
    const res = await POST(req);
    const body = await res.json();

    expect(body.sessionId).toBe('cs_test_session_abc');
  });

  it('returns 200 status on successful session creation', async () => {
    const req = makeReq({ userId: 'user-123', planType: 'salon' });
    const res = await POST(req);

    expect(res.status).toBe(200);
  });

  it.each([
    ['solo',       { name: 'Solo Groomer',   price: 2900  }],
    ['salon',      { name: 'Salon Team',     price: 7900  }],
    ['enterprise', { name: 'Multi-Location', price: 14900 }],
  ])('passes correct planData for %s plan', async (planType, expectedPlanData) => {
    const req = makeReq({ userId: 'user-123', planType });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.planData).toEqual(expectedPlanData);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Idempotency — Bug 4 (returns live Stripe URL, not constructed string)
// ─────────────────────────────────────────────────────────────────────────────
describe('idempotency session URL — Bug 4 fix', () => {
  beforeEach(() => jest.clearAllMocks());

  it('uses getCheckoutSession to retrieve live URL on idempotency hit', async () => {
    mockFindFirstLockout.mockResolvedValueOnce({
      id: 'lock-1',
      userId: 'user-123',
      paymentId: 'solo',
      sessionId: 'cs_cached_001',
      status: 'processing',
      errorMessage: null,
      retryCount: 0,
      lastRetryAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockGetCheckoutSession.mockResolvedValueOnce({
      id: 'cs_cached_001',
      url: 'https://checkout.stripe.com/c/pay/cs_cached_001',
    } as any);

    const req = makeReq({ userId: 'user-123', planType: 'solo' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.url).toBe('https://checkout.stripe.com/c/pay/cs_cached_001');
    expect(mockGetCheckoutSession).toHaveBeenCalledWith('cs_cached_001');
    expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
  });

  it('idempotency response does NOT construct URL manually — uses Stripe-provided url field', async () => {
    mockFindFirstLockout.mockResolvedValueOnce({
      id: 'lock-2',
      userId: 'user-123',
      paymentId: 'solo',
      sessionId: 'cs_idm_abc',
      status: 'processing',
      errorMessage: null,
      retryCount: 0,
      lastRetryAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const liveUrl = 'https://checkout.stripe.com/c/pay/cs_idm_abc?variant=live';
    mockGetCheckoutSession.mockResolvedValueOnce({ id: 'cs_idm_abc', url: liveUrl } as any);

    const req = makeReq({ userId: 'user-123', planType: 'solo' });
    const res = await POST(req);
    const body = await res.json();

    // URL must be exactly what Stripe returns, not constructed
    expect(body.url).toBe(liveUrl);
    expect(body.url).not.toBe(`https://checkout.stripe.com/pay/cs_idm_abc`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Validation guards
// ─────────────────────────────────────────────────────────────────────────────
describe('createCheckoutSession — request validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStripeErrorMessage.mockReturnValue({ message: 'Error', type: 'generic', declineCode: undefined });
  });

  it('returns 400 when userId is missing', async () => {
    const res = await POST(makeReq({ planType: 'solo' }));
    expect(res.status).toBe(400);
    expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid planType — createCheckoutSession never called', async () => {
    const res = await POST(makeReq({ userId: 'user-123', planType: 'unlimited' }));
    expect(res.status).toBe(400);
    expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
  });

  it('returns 404 when profile not found — createCheckoutSession never called', async () => {
    mockFindFirstLockout.mockResolvedValue(null);
    mockFindUniqueProfile.mockResolvedValue(null);

    const res = await POST(makeReq({ userId: 'user-123', planType: 'solo' }));
    expect(res.status).toBe(404);
    expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
  });

  it('returns 500 when createCheckoutSession throws', async () => {
    mockFindFirstLockout.mockResolvedValue(null);
    mockFindUniqueProfile.mockResolvedValue(MOCK_PROFILE as any);
    mockCreateCheckoutSession.mockRejectedValueOnce(new Error('Stripe error'));
    mockGetStripeErrorMessage.mockReturnValueOnce({ message: 'Stripe error', type: 'stripe_error', declineCode: undefined });

    const res = await POST(makeReq({ userId: 'user-123', planType: 'solo' }));
    expect(res.status).toBe(500);
  });

  it('returns 400 when both userId and planType are missing', async () => {
    const res = await POST(makeReq({}));
    expect(res.status).toBe(400);
    expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
  });

  it('returns 400 when userId is empty string', async () => {
    const res = await POST(makeReq({ userId: '', planType: 'solo' }));
    expect(res.status).toBe(400);
    expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
  });

  it('returns 400 when planType is empty string', async () => {
    const res = await POST(makeReq({ userId: 'user-123', planType: '' }));
    expect(res.status).toBe(400);
    expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// validatePlan — exported pure function, direct unit tests
// ─────────────────────────────────────────────────────────────────────────────
import { validatePlan, ensureIdempotentLockout } from '@/app/api/checkout/route';

describe('validatePlan — direct unit tests', () => {
  it.each(['solo', 'salon', 'enterprise'])('returns true for valid plan "%s"', (plan) => {
    expect(validatePlan(plan)).toBe(true);
  });

  it.each([
    'unlimited',
    'free',
    'SOLO',          // case-sensitive
    'Solo',
    'pro',
    '',
    '   ',
    'solo ',         // trailing space
    ' solo',         // leading space
  ])('returns false for invalid plan "%s"', (plan) => {
    expect(validatePlan(plan)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ensureIdempotentLockout — exported async helper, direct unit tests
// ─────────────────────────────────────────────────────────────────────────────
describe('ensureIdempotentLockout — direct unit tests', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns null when no existing lockout is found', async () => {
    mockFindFirstLockout.mockResolvedValueOnce(null);
    const result = await ensureIdempotentLockout('user-1', 'solo');
    expect(result).toBeNull();
    expect(mockFindFirstLockout).toHaveBeenCalledWith({ where: { userId: 'user-1', paymentId: 'solo' } });
  });

  it('returns sessionId when an existing lockout exists', async () => {
    mockFindFirstLockout.mockResolvedValueOnce({
      id: 'lock-x',
      userId: 'user-1',
      paymentId: 'salon',
      sessionId: 'cs_existing_99',
      status: 'processing',
      errorMessage: null,
      retryCount: 0,
      lastRetryAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const result = await ensureIdempotentLockout('user-1', 'salon');
    expect(result).toBe('cs_existing_99');
  });

  it('queries with exact userId + paymentId so lockout is plan-scoped (not user-wide)', async () => {
    mockFindFirstLockout.mockResolvedValueOnce(null);
    await ensureIdempotentLockout('user-42', 'enterprise');
    expect(mockFindFirstLockout).toHaveBeenCalledWith({
      where: { userId: 'user-42', paymentId: 'enterprise' },
    });
  });

  it('propagates DB errors — does not swallow exceptions', async () => {
    mockFindFirstLockout.mockRejectedValueOnce(new Error('DB timeout'));
    await expect(ensureIdempotentLockout('user-1', 'solo')).rejects.toThrow('DB timeout');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// customerEmail fallback — undocumented but critical branch
// ─────────────────────────────────────────────────────────────────────────────
describe('customerEmail fallback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFindFirstLockout.mockResolvedValue(null);
    mockFindUniqueProfile.mockResolvedValue(MOCK_PROFILE as any);
    mockCreateCheckoutSession.mockResolvedValue(MOCK_SESSION as any);
    mockGetStripeErrorMessage.mockReturnValue({ message: 'Error', type: 'generic', declineCode: undefined });
  });

  it('falls back to {userId}@groomgrid.app when customerEmail is absent', async () => {
    const req = makeReq({ userId: 'user-123', planType: 'solo' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.customerEmail).toBe('user-123@groomgrid.app');
  });

  it('uses provided customerEmail when present, does not fall back', async () => {
    const req = makeReq({ userId: 'user-123', planType: 'solo', customerEmail: 'real@example.com' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.customerEmail).toBe('real@example.com');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// clientId optional passthrough
// ─────────────────────────────────────────────────────────────────────────────
describe('clientId optional passthrough', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFindFirstLockout.mockResolvedValue(null);
    mockFindUniqueProfile.mockResolvedValue(MOCK_PROFILE as any);
    mockCreateCheckoutSession.mockResolvedValue(MOCK_SESSION as any);
    mockGetStripeErrorMessage.mockReturnValue({ message: 'Error', type: 'generic', declineCode: undefined });
  });

  it('passes undefined clientId when not provided in body', async () => {
    const req = makeReq({ userId: 'user-123', planType: 'solo' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.clientId).toBeUndefined();
  });

  it('passes clientId through when provided', async () => {
    const req = makeReq({ userId: 'user-123', planType: 'solo', clientId: 'GA4-abc-123' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.clientId).toBe('GA4-abc-123');
  });
});
