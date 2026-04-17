/**
 * @jest-environment node
 *
 * Unit tests for the /api/checkout route.
 * Tests validatePlan, ensureIdempotentLockout, and the POST handler.
 */

// --- Mocks (hoisted by Jest before imports) ---

jest.mock('@/lib/stripe', () => ({
  __esModule: true,
  createCheckoutSession: jest.fn(),
  getCheckoutSession: jest.fn(),
  getStripeErrorMessage: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    paymentLockout: {
      findFirst: jest.fn(),
    },
    profile: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@/lib/ga4-server', () => ({
  __esModule: true,
  trackPaymentInitiatedServer: jest.fn(),
}));

jest.mock('@/lib/validation', () => ({
  __esModule: true,
  ensureEnv: jest.fn(), // no-op — env vars set in jest.setup.js
}));

// --- Imports (after mocks) ---

import { NextRequest } from 'next/server';
import { validatePlan, ensureIdempotentLockout, POST } from '@/app/api/checkout/route';
import { createCheckoutSession, getCheckoutSession, getStripeErrorMessage } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { trackPaymentInitiatedServer } from '@/lib/ga4-server';

// Typed mock helpers
const mockFindFirstLockout = prisma.paymentLockout.findFirst as jest.MockedFunction<typeof prisma.paymentLockout.findFirst>;
const mockFindUniqueProfile = prisma.profile.findUnique as jest.MockedFunction<typeof prisma.profile.findUnique>;
const mockCreateCheckoutSession = createCheckoutSession as jest.MockedFunction<typeof createCheckoutSession>;
const mockGetCheckoutSession = getCheckoutSession as jest.MockedFunction<typeof getCheckoutSession>;
const mockGetStripeErrorMessage = getStripeErrorMessage as jest.MockedFunction<typeof getStripeErrorMessage>;
const mockTrackPayment = trackPaymentInitiatedServer as jest.MockedFunction<typeof trackPaymentInitiatedServer>;

/** Build a minimal NextRequest-compatible mock — only req.json() is used by the handler. */
function makeRequest(body: Record<string, unknown>): NextRequest {
  return { json: () => Promise.resolve(body) } as unknown as NextRequest;
}

// ─────────────────────────────────────────────
// validatePlan
// ─────────────────────────────────────────────
describe('validatePlan', () => {
  it('returns true for "solo"', () => {
    expect(validatePlan('solo')).toBe(true);
  });

  it('returns true for "salon"', () => {
    expect(validatePlan('salon')).toBe(true);
  });

  it('returns true for "enterprise"', () => {
    expect(validatePlan('enterprise')).toBe(true);
  });

  it('returns false for unknown plan', () => {
    expect(validatePlan('premium')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(validatePlan('')).toBe(false);
  });

  it('returns false for capitalised plan name (case-sensitive)', () => {
    expect(validatePlan('Solo')).toBe(false);
    expect(validatePlan('SOLO')).toBe(false);
    expect(validatePlan('Salon')).toBe(false);
    expect(validatePlan('Enterprise')).toBe(false);
  });

  it('returns false for null coerced as string', () => {
    // Runtime guard — callers may pass unvalidated input
    expect(validatePlan(null as any)).toBe(false);
  });

  it('returns false for undefined coerced as string', () => {
    expect(validatePlan(undefined as any)).toBe(false);
  });

  it('returns false for numeric string', () => {
    expect(validatePlan('29')).toBe(false);
    expect(validatePlan('1')).toBe(false);
  });
});

// ─────────────────────────────────────────────
// ensureIdempotentLockout
// ─────────────────────────────────────────────
describe('ensureIdempotentLockout', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns existing sessionId when lockout record is found', async () => {
    mockFindFirstLockout.mockResolvedValueOnce({
      id: 'lockout-1',
      userId: 'user-123',
      paymentId: 'solo',
      sessionId: 'cs_existing_session',
      status: 'processing',
      errorMessage: null,
      retryCount: 0,
      lastRetryAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await ensureIdempotentLockout('user-123', 'solo');

    expect(result).toBe('cs_existing_session');
    expect(mockFindFirstLockout).toHaveBeenCalledWith({
      where: { userId: 'user-123', paymentId: 'solo' },
    });
  });

  it('returns null when no lockout record exists', async () => {
    mockFindFirstLockout.mockResolvedValueOnce(null);

    const result = await ensureIdempotentLockout('user-456', 'salon');

    expect(result).toBeNull();
    expect(mockFindFirstLockout).toHaveBeenCalledWith({
      where: { userId: 'user-456', paymentId: 'salon' },
    });
  });

  it('queries with the exact userId and paymentId provided', async () => {
    mockFindFirstLockout.mockResolvedValueOnce(null);

    await ensureIdempotentLockout('abc', 'enterprise');

    expect(mockFindFirstLockout).toHaveBeenCalledTimes(1);
    const callArg = mockFindFirstLockout.mock.calls[0]![0];
    expect((callArg as any).where.userId).toBe('abc');
    expect((callArg as any).where.paymentId).toBe('enterprise');
  });
});

// ─────────────────────────────────────────────
// POST handler
// ─────────────────────────────────────────────
describe('POST /api/checkout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Sensible defaults: no existing lockout, profile exists
    mockFindFirstLockout.mockResolvedValue(null);
    mockFindUniqueProfile.mockResolvedValue({
      id: 'profile-1',
      userId: 'user-123',
      businessName: 'Happy Paws Grooming',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    mockCreateCheckoutSession.mockResolvedValue({
      id: 'cs_test_abc123',
      url: 'https://checkout.stripe.com/c/pay/cs_test_abc123',
    } as any);
    mockTrackPayment.mockResolvedValue(undefined);
    mockGetStripeErrorMessage.mockReturnValue({
      message: 'Something went wrong',
      type: 'generic',
      declineCode: undefined,
    });
  });

  // ── Happy path ──────────────────────────────
  it('returns 200 with url and sessionId on success', async () => {
    const req = makeRequest({ userId: 'user-123', planType: 'solo', customerEmail: 'test@example.com' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.url).toBe('https://checkout.stripe.com/c/pay/cs_test_abc123');
    expect(body.sessionId).toBe('cs_test_abc123');
  });

  it('calls createCheckoutSession with correct parameters', async () => {
    const req = makeRequest({
      userId: 'user-123',
      planType: 'salon',
      customerEmail: 'groomer@example.com',
      clientId: 'client-ga4-id',
    });
    await POST(req);

    expect(mockCreateCheckoutSession).toHaveBeenCalledTimes(1);
    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.userId).toBe('user-123');
    expect(args.planType).toBe('salon');
    expect(args.customerEmail).toBe('groomer@example.com');
    expect(args.businessName).toBe('Happy Paws Grooming');
    expect(args.clientId).toBe('client-ga4-id');
  });

  it('falls back to userId@groomgrid.app when customerEmail is omitted', async () => {
    const req = makeRequest({ userId: 'user-99', planType: 'enterprise' });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.customerEmail).toBe('user-99@groomgrid.app');
  });

  it('tracks payment initiation via GA4', async () => {
    const req = makeRequest({ userId: 'user-123', planType: 'solo' });
    await POST(req);

    expect(mockTrackPayment).toHaveBeenCalledWith('user-123', 'cs_test_abc123', 'solo');
  });

  // ── Idempotency — Bug 4 fix ─────────────────
  // When a lockout exists, the route now retrieves the session from Stripe
  // and returns its `url` field (not a manually-constructed URL).
  it('returns Stripe session URL when lockout already exists', async () => {
    mockFindFirstLockout.mockResolvedValueOnce({
      id: 'lockout-1',
      userId: 'user-123',
      paymentId: 'solo',
      sessionId: 'cs_cached_xyz',
      status: 'processing',
      errorMessage: null,
      retryCount: 0,
      lastRetryAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockGetCheckoutSession.mockResolvedValueOnce({
      id: 'cs_cached_xyz',
      url: 'https://checkout.stripe.com/c/pay/cs_cached_xyz',
    } as any);

    const req = makeRequest({ userId: 'user-123', planType: 'solo' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.sessionId).toBe('cs_cached_xyz');
    // URL must come from Stripe, not be manually constructed
    expect(body.url).toBe('https://checkout.stripe.com/c/pay/cs_cached_xyz');
    // Stripe session retrieval was called with the cached session ID
    expect(mockGetCheckoutSession).toHaveBeenCalledWith('cs_cached_xyz');
    // Must NOT create a new Stripe session
    expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
    // Must NOT call GA4 tracking
    expect(mockTrackPayment).not.toHaveBeenCalled();
  });

  // ── Validation — missing fields ─────────────
  it('returns 400 when userId is missing', async () => {
    const req = makeRequest({ planType: 'solo' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('Missing required fields');
    expect(body.errorType).toBe('generic');
  });

  it('returns 400 when planType is missing', async () => {
    const req = makeRequest({ userId: 'user-123' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('Missing required fields');
  });

  it('returns 400 when both userId and planType are missing', async () => {
    const req = makeRequest({});
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it('returns 400 when userId is an empty string', async () => {
    const req = makeRequest({ userId: '', planType: 'solo' });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it('returns 400 when planType is an empty string', async () => {
    const req = makeRequest({ userId: 'user-123', planType: '' });
    const res = await POST(req);
    const body = await res.json();

    // empty string is falsy → Missing required fields
    expect(res.status).toBe(400);
    expect(body.error).toBe('Missing required fields');
  });

  // ── Validation — invalid plan ────────────────
  it('returns 400 for unknown planType', async () => {
    const req = makeRequest({ userId: 'user-123', planType: 'premium' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('Invalid plan type');
    expect(body.errorType).toBe('generic');
  });

  it('returns 400 for capitalised plan name', async () => {
    const req = makeRequest({ userId: 'user-123', planType: 'Solo' });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it('does not reach Stripe for invalid plan', async () => {
    const req = makeRequest({ userId: 'user-123', planType: 'bogus' });
    await POST(req);

    expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
  });

  // ── Profile not found ───────────────────────
  it('returns 404 when profile does not exist', async () => {
    mockFindUniqueProfile.mockResolvedValueOnce(null);
    const req = makeRequest({ userId: 'no-profile-user', planType: 'solo' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.error).toBe('Profile not found');
  });

  it('does not call Stripe when profile is missing', async () => {
    mockFindUniqueProfile.mockResolvedValueOnce(null);
    const req = makeRequest({ userId: 'ghost-user', planType: 'salon' });
    await POST(req);

    expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
  });

  // ── Stripe error handling ───────────────────
  it('returns 500 when Stripe throws an error', async () => {
    mockCreateCheckoutSession.mockRejectedValueOnce(new Error('card_declined'));
    mockGetStripeErrorMessage.mockReturnValueOnce({
      message: 'Your card was declined',
      type: 'card_error',
      declineCode: 'insufficient_funds',
    });

    const req = makeRequest({ userId: 'user-123', planType: 'solo' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe('Your card was declined');
    expect(body.errorType).toBe('card_error');
    expect(body.declineCode).toBe('insufficient_funds');
  });

  it('returns 500 when the DB throws during lockout check', async () => {
    mockFindFirstLockout.mockRejectedValueOnce(new Error('DB connection lost'));
    mockGetStripeErrorMessage.mockReturnValueOnce({
      message: 'DB connection lost',
      type: 'generic',
      declineCode: undefined,
    });

    const req = makeRequest({ userId: 'user-123', planType: 'solo' });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });

  it('calls getStripeErrorMessage to normalise error shape', async () => {
    const err = new Error('boom');
    mockCreateCheckoutSession.mockRejectedValueOnce(err);
    mockGetStripeErrorMessage.mockReturnValueOnce({
      message: 'boom',
      type: 'generic',
      declineCode: undefined,
    });

    const req = makeRequest({ userId: 'user-123', planType: 'enterprise' });
    await POST(req);

    expect(mockGetStripeErrorMessage).toHaveBeenCalledWith(err);
  });

  // ── Plan data coverage ──────────────────────
  it.each([
    ['solo', 'Solo', 2900],
    ['salon', 'Salon', 7900],
    ['enterprise', 'Enterprise', 14900],
  ])('passes correct planData for plan "%s"', async (planType, planName, price) => {
    const req = makeRequest({ userId: 'user-123', planType });
    await POST(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.planData).toEqual({ name: planName, price });
  });
});
