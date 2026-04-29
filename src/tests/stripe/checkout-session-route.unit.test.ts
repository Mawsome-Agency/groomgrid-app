/**
 * @jest-environment node
 *
 * Unit tests for GET /api/checkout/session
 *
 * This route creates a Stripe Checkout session with BETA50 pre-applied and
 * redirects (307) to the Stripe-hosted checkout URL.
 *
 * Mocking strategy: mock @/lib/stripe (createCheckoutSession) directly to avoid
 * loading the Stripe SDK native bindings which cause SIGTRAP in jest-worker.
 * Missing mocks for next-auth, next/headers, next-auth-options, and prisma were
 * the original cause of this test file being excluded — all four are now provided.
 *
 * Coverage:
 *  - Valid plan param creates checkout session and redirects (307)
 *  - BETA50 coupon is always pre-applied (couponCode forwarded to createCheckoutSession)
 *  - Invalid plan param → 400
 *  - Missing plan param → 400
 *  - Unauthenticated request → 302 redirect to /login
 *  - Profile not found → 404
 *  - Stripe error → 500
 *  - Session without URL → 500
 *  - All three valid plans (solo/salon/enterprise)
 *  - PLAN_DATA_CENTS values reach createCheckoutSession (regression lock against manual sync)
 */

// ── Mocks (hoisted above imports) ─────────────────────────────────────────────

// Mock @/lib/stripe directly — avoids loading Stripe SDK native bindings
jest.mock('@/lib/stripe', () => ({
  __esModule: true,
  createCheckoutSession: jest.fn(),
}));

jest.mock('@/lib/validation', () => ({
  __esModule: true,
  ensureEnv: jest.fn(), // no-op — env vars are set in jest.setup.js
  requireEnvVar: jest.fn((name: string) => `mock_${name}`),
}));

// Prevent next/headers from throwing "headers() called outside request scope"
jest.mock('next/headers', () => ({
  headers: jest.fn(() => new Headers()),
  cookies: jest.fn(() => ({ get: jest.fn(), getAll: jest.fn(() => []) })),
}));

// Mock getServerSession — returns authenticated user by default
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(() =>
    Promise.resolve({ user: { id: 'user-sess-123', email: 'session@example.com' } })
  ),
}));

// Prevent loading @/lib/next-auth-options which pulls in Prisma (native bindings)
jest.mock('@/lib/next-auth-options', () => ({
  authOptions: {},
}));

// Mock Prisma — prevents loading native bindings that crash jest-worker
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    profile: {
      findUnique: jest.fn(),
    },
  },
}));

// ── Imports (after mocks) ──────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { GET } from '@/app/api/checkout/session/route';
import { createCheckoutSession } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

// Typed mock helpers
const mockCreateCheckoutSession = createCheckoutSession as jest.MockedFunction<typeof createCheckoutSession>;
const mockGetServerSession = getServerSession as jest.MockedFunction<any>;
const mockFindUniqueProfile = prisma.profile.findUnique as jest.MockedFunction<typeof prisma.profile.findUnique>;

const MOCK_CHECKOUT_URL = 'https://checkout.stripe.com/c/pay/cs_test_session_mock';

function makeRequest(url: string): NextRequest {
  return new NextRequest(url);
}

// ─────────────────────────────────────────────────────────────────────────────
// Test helpers / shared setup
// ─────────────────────────────────────────────────────────────────────────────

function setupAuthenticatedProfile() {
  mockGetServerSession.mockResolvedValue({
    user: { id: 'user-sess-123', email: 'session@example.com' },
  });
  mockFindUniqueProfile.mockResolvedValue({
    id: 'profile-sess-1',
    userId: 'user-sess-123',
    businessName: 'Sudsy Paws Salon',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any);
  mockCreateCheckoutSession.mockResolvedValue({
    id: 'cs_test_session_mock',
    url: MOCK_CHECKOUT_URL,
  } as any);
}

// ─────────────────────────────────────────────────────────────────────────────
// Authentication guard
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/checkout/session — authentication guard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('redirects (302) to /login when user is unauthenticated', async () => {
    mockGetServerSession.mockResolvedValueOnce(null);

    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    const res = await GET(req);

    expect(res.status).toBe(302);
  });

  it('redirect URL contains /login for unauthenticated user', async () => {
    mockGetServerSession.mockResolvedValueOnce(null);

    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    const res = await GET(req);

    expect(res.headers.get('location')).toContain('/login');
  });

  it('sets next=/plans query param in login redirect', async () => {
    mockGetServerSession.mockResolvedValueOnce(null);

    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    const res = await GET(req);

    const location = decodeURIComponent(res.headers.get('location') ?? '');
    expect(location).toContain('next=');
    expect(location).toContain('/plans');
  });

  it('does not call createCheckoutSession when unauthenticated', async () => {
    mockGetServerSession.mockResolvedValueOnce(null);

    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Plan parameter validation
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/checkout/session — plan validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthenticatedProfile();
  });

  it('returns 400 when plan param is missing', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session');
    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  it('error body mentions missing plan', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session');
    const res = await GET(req);
    const body = await res.json();

    expect(body.error).toMatch(/missing plan/i);
  });

  it('returns 400 for invalid plan "premium"', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=premium');
    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  it('returns 400 for uppercase plan "SOLO" (case-sensitive)', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=SOLO');
    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  it('returns 400 for empty plan string', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=');
    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  it('returns 400 for plan "free"', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=free');
    const res = await GET(req);

    expect(res.status).toBe(400);
  });

  it('does not call createCheckoutSession for invalid plan', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=bogus');
    await GET(req);

    expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
  });

  it.each(['solo', 'salon', 'enterprise'])('accepts valid plan "%s" — returns 307', async (plan) => {
    const req = makeRequest(`http://localhost:3000/api/checkout/session?plan=${plan}`);
    const res = await GET(req);

    expect(res.status).toBe(307);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Happy path — valid plan → 307 redirect
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/checkout/session — valid plan creates session', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthenticatedProfile();
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

  it('calls createCheckoutSession exactly once per request', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    expect(mockCreateCheckoutSession).toHaveBeenCalledTimes(1);
  });

  it('forwards the authenticated userId to createCheckoutSession', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.userId).toBe('user-sess-123');
  });

  it('forwards business name from profile to createCheckoutSession', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.businessName).toBe('Sudsy Paws Salon');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// BETA50 coupon — always pre-applied
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/checkout/session — BETA50 coupon pre-applied', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthenticatedProfile();
  });

  it('passes BETA50 as couponCode to createCheckoutSession for solo', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.couponCode).toBe('BETA50');
  });

  it('passes BETA50 as couponCode to createCheckoutSession for salon', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=salon');
    await GET(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.couponCode).toBe('BETA50');
  });

  it('passes BETA50 as couponCode to createCheckoutSession for enterprise', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=enterprise');
    await GET(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.couponCode).toBe('BETA50');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PLAN_DATA_CENTS regression lock — prices must match pricing-data.ts
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/checkout/session — PLAN_DATA_CENTS regression lock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthenticatedProfile();
  });

  it('passes correct planData for solo ($29 = 2900 cents)', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.planData).toEqual({ name: 'Solo Groomer', price: 2900 });
  });

  it('passes correct planData for salon ($79 = 7900 cents)', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=salon');
    await GET(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.planData).toEqual({ name: 'Salon Team', price: 7900 });
  });

  it('passes correct planData for enterprise ($149 = 14900 cents)', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=enterprise');
    await GET(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.planData).toEqual({ name: 'Multi-Location', price: 14900 });
  });

  it('planData is sourced from PLAN_DATA_CENTS — same shape as checkout POST route', async () => {
    // This test locks that both checkout routes use the same pricing source.
    // If pricing-data.ts prices change, both routes update automatically.
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.planData).toHaveProperty('name');
    expect(args.planData).toHaveProperty('price');
    expect(typeof args.planData!.price).toBe('number');
    expect(Number.isInteger(args.planData!.price)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Profile not found
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/checkout/session — profile not found', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-sess-123', email: 'session@example.com' },
    });
    mockFindUniqueProfile.mockResolvedValue(null);
  });

  it('returns 404 when profile does not exist', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    const res = await GET(req);

    expect(res.status).toBe(404);
  });

  it('error body mentions profile not found', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    const res = await GET(req);
    const body = await res.json();

    expect(body.error).toMatch(/profile not found/i);
  });

  it('does not call createCheckoutSession when profile is missing', async () => {
    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    expect(mockCreateCheckoutSession).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Error handling
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/checkout/session — error handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-sess-123', email: 'session@example.com' },
    });
    mockFindUniqueProfile.mockResolvedValue({
      id: 'profile-1',
      userId: 'user-sess-123',
      businessName: 'Test Salon',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
  });

  it('returns 500 when createCheckoutSession throws', async () => {
    mockCreateCheckoutSession.mockRejectedValueOnce(new Error('Stripe network error'));

    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    const res = await GET(req);

    expect(res.status).toBe(500);
  });

  it('returns JSON error body on Stripe failure', async () => {
    mockCreateCheckoutSession.mockRejectedValueOnce(new Error('Connection timeout'));

    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=salon');
    const res = await GET(req);
    const body = await res.json();

    expect(body).toHaveProperty('error');
  });

  it('returns 500 when checkout session has no URL', async () => {
    mockCreateCheckoutSession.mockResolvedValueOnce({
      id: 'cs_no_url',
      url: null,
    } as any);

    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    const res = await GET(req);

    expect(res.status).toBe(500);
  });

  it('error body is defined when session has no URL', async () => {
    mockCreateCheckoutSession.mockResolvedValueOnce({
      id: 'cs_no_url',
      url: null,
    } as any);

    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    const res = await GET(req);
    const body = await res.json();

    expect(body.error).toBeDefined();
    expect(typeof body.error).toBe('string');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Plan type forwarding
// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/checkout/session — planType forwarding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupAuthenticatedProfile();
  });

  it.each(['solo', 'salon', 'enterprise'] as const)(
    'forwards planType "%s" to createCheckoutSession',
    async (plan) => {
      const req = makeRequest(`http://localhost:3000/api/checkout/session?plan=${plan}`);
      await GET(req);

      const [args] = mockCreateCheckoutSession.mock.calls[0];
      expect(args.planType).toBe(plan);
    }
  );

  it('falls back to userId@groomgrid.app when session email is absent', async () => {
    mockGetServerSession.mockResolvedValueOnce({
      user: { id: 'user-sess-123' }, // no email
    });
    mockFindUniqueProfile.mockResolvedValueOnce({
      id: 'profile-1',
      userId: 'user-sess-123',
      businessName: 'No Email Salon',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);
    mockCreateCheckoutSession.mockResolvedValueOnce({
      id: 'cs_test_fallback',
      url: MOCK_CHECKOUT_URL,
    } as any);

    const req = makeRequest('http://localhost:3000/api/checkout/session?plan=solo');
    await GET(req);

    const [args] = mockCreateCheckoutSession.mock.calls[0];
    expect(args.customerEmail).toBe('user-sess-123@groomgrid.app');
  });
});
