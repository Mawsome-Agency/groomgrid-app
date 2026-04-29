/**
 * @jest-environment node
 *
 * Unit tests for GET /api/checkout/success
 *
 * Covers Bug 3 fix: session.payment_intent is null during 14-day trial checkout.
 * The paymentEvent must be created using the pre-computed `paymentId` variable
 * (which falls back to session.id), not the raw `session.payment_intent`.
 */

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock('@/lib/stripe', () => ({
  __esModule: true,
  getCheckoutSession: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    paymentEvent: {
      create: jest.fn(),
    },
  },
}));

jest.mock('@/lib/payment-lockout', () => ({
  __esModule: true,
  createPaymentLockout: jest.fn(),
}));

// ── Imports ────────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { GET } from '@/app/api/checkout/success/route';
import { getCheckoutSession } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { createPaymentLockout } from '@/lib/payment-lockout';

const mockGetCheckoutSession = getCheckoutSession as jest.MockedFunction<typeof getCheckoutSession>;
const mockPaymentEventCreate = prisma.paymentEvent.create as jest.MockedFunction<typeof prisma.paymentEvent.create>;
const mockCreatePaymentLockout = createPaymentLockout as jest.MockedFunction<typeof createPaymentLockout>;

function makeRequest(sessionId: string): NextRequest {
  return {
    url: `http://localhost:3000/api/checkout/success?session_id=${sessionId}`,
  } as unknown as NextRequest;
}

/** A realistic trial checkout session where payment_intent is null */
const TRIAL_SESSION = {
  id: 'cs_test_trial_123',
  payment_intent: null,           // null during 14-day trial — no charge yet
  subscription: null,
  metadata: {
    userId: 'user-abc',
    planType: 'solo',
    businessName: 'Test Grooming',
    planName: 'Solo Groomer',
    planPrice: '2900',
    isTrial: 'true',
    clientId: '',
  },
} as any;

describe('GET /api/checkout/success', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCheckoutSession.mockResolvedValue(TRIAL_SESSION);
    mockPaymentEventCreate.mockResolvedValue({} as any);
    mockCreatePaymentLockout.mockResolvedValue({} as any);
  });

  // ── Bug 3: paymentId fallback ─────────────────────────────────────────────
  it('uses session.id as paymentId when payment_intent is null (Bug 3 fix)', async () => {
    const res = await GET(makeRequest('cs_test_trial_123'));

    expect(res.status).toBe(200);

    // paymentEvent.create must have been called with session.id, NOT null
    expect(mockPaymentEventCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          paymentId: 'cs_test_trial_123',   // session.id, not null
          eventType: 'PAYMENT_INITIATED',
        }),
      })
    );
  });

  it('creates lockout with the same paymentId fallback', async () => {
    await GET(makeRequest('cs_test_trial_123'));

    // createPaymentLockout receives (userId, paymentId, sessionId)
    expect(mockCreatePaymentLockout).toHaveBeenCalledWith(
      'user-abc',
      'cs_test_trial_123',  // session.id fallback, not null
      'cs_test_trial_123'
    );
  });

  it('uses payment_intent when it exists (non-trial payment)', async () => {
    mockGetCheckoutSession.mockResolvedValueOnce({
      ...TRIAL_SESSION,
      payment_intent: 'pi_live_abc123',
    });

    await GET(makeRequest('cs_test_live_456'));

    expect(mockPaymentEventCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          paymentId: 'pi_live_abc123',
        }),
      })
    );
  });

  // ── Missing session_id ────────────────────────────────────────────────────
  it('returns 400 when session_id is missing', async () => {
    const req = { url: 'http://localhost:3000/api/checkout/success' } as unknown as NextRequest;
    const res = await GET(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Missing session_id');
  });

  // ── Missing userId in metadata ────────────────────────────────────────────
  it('returns 400 when session has no userId in metadata (Bug 2 was the root cause)', async () => {
    mockGetCheckoutSession.mockResolvedValueOnce({
      ...TRIAL_SESSION,
      metadata: {},  // no userId — what happened before Bug 2 was fixed
    });

    const res = await GET(makeRequest('cs_test_no_meta'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid session');
  });

  // ── Happy path response shape ─────────────────────────────────────────────
  it('returns session_id and metadata on success', async () => {
    const res = await GET(makeRequest('cs_test_trial_123'));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.session_id).toBe('cs_test_trial_123');
    expect(body.metadata.userId).toBe('user-abc');
    expect(body.metadata.planType).toBe('solo');
  });

  // ── Lockout is called once per request ────────────────────────────────────
  it('calls createPaymentLockout exactly once', async () => {
    await GET(makeRequest('cs_test_trial_123'));

    expect(mockCreatePaymentLockout).toHaveBeenCalledTimes(1);
  });

  it('calls getCheckoutSession with the provided session_id', async () => {
    await GET(makeRequest('cs_test_trial_123'));

    expect(mockGetCheckoutSession).toHaveBeenCalledWith('cs_test_trial_123');
  });

  it('calls paymentEvent.create exactly once', async () => {
    await GET(makeRequest('cs_test_trial_123'));

    expect(mockPaymentEventCreate).toHaveBeenCalledTimes(1);
  });

  // ── createPaymentLockout args ─────────────────────────────────────────────
  it('calls createPaymentLockout with userId, paymentId (session.id), and sessionId', async () => {
    await GET(makeRequest('cs_test_trial_123'));

    expect(mockCreatePaymentLockout).toHaveBeenCalledWith(
      'user-abc',
      'cs_test_trial_123',
      'cs_test_trial_123'
    );
  });

  // ── trial_end_days_left ───────────────────────────────────────────────────
  it('returns trial_end_days_left as 0 when subscription is null', async () => {
    const res = await GET(makeRequest('cs_test_trial_123'));
    const body = await res.json();

    expect(body.trial_end_days_left).toBe(0);
  });

  it('calculates trial_end_days_left when subscription has trial_end', async () => {
    const trialEnd = Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60; // 14 days from now
    mockGetCheckoutSession.mockResolvedValueOnce({
      ...TRIAL_SESSION,
      subscription: { trial_end: trialEnd },
    } as any);

    const res = await GET(makeRequest('cs_test_trial_123'));
    const body = await res.json();

    // Should be approximately 14 days
    expect(body.trial_end_days_left).toBeGreaterThanOrEqual(13);
    expect(body.trial_end_days_left).toBeLessThanOrEqual(14);
  });

  // ── Stripe error ──────────────────────────────────────────────────────────
  it('returns 500 when getCheckoutSession throws', async () => {
    mockGetCheckoutSession.mockRejectedValueOnce(new Error('Stripe API error'));

    const res = await GET(makeRequest('cs_test_error'));
    expect(res.status).toBe(500);
  });

  it('returns error message when getCheckoutSession throws', async () => {
    mockGetCheckoutSession.mockRejectedValueOnce(new Error('Network failure'));

    const res = await GET(makeRequest('cs_test_error'));
    const body = await res.json();
    expect(body.error).toBe('Failed to fetch session');
  });

  // ── paymentEvent payload ──────────────────────────────────────────────────
  it('paymentEvent.create receives correct payload with userId and planType', async () => {
    await GET(makeRequest('cs_test_trial_123'));

    expect(mockPaymentEventCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          payload: expect.objectContaining({
            userId: 'user-abc',
            planType: 'solo',
          }),
        }),
      })
    );
  });

  // ── metadata forwarded to response ───────────────────────────────────────
  it('forwards all metadata fields in response', async () => {
    const res = await GET(makeRequest('cs_test_trial_123'));
    const body = await res.json();

    expect(body.metadata.businessName).toBe('Test Grooming');
    expect(body.metadata.planName).toBe('Solo Groomer');
    expect(body.metadata.isTrial).toBe('true');
  });

  // ── planType defaults ─────────────────────────────────────────────────────
  it('uses "unknown" planType in paymentEvent payload when planType absent from metadata', async () => {
    mockGetCheckoutSession.mockResolvedValueOnce({
      ...TRIAL_SESSION,
      metadata: { userId: 'user-abc' },
    } as any);

    await GET(makeRequest('cs_test_trial_123'));

    expect(mockPaymentEventCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          payload: expect.objectContaining({ planType: 'unknown' }),
        }),
      })
    );
  });
});
