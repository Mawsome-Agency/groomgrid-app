/**
 * @jest-environment node
 *
 * Unit tests for createCheckoutSession in src/lib/stripe.ts
 *
 * Verifies the two critical bug fixes:
 *  Bug 1: customer_update must NOT be present (it requires customer ID, which new users don't have)
 *  Bug 2: session-level metadata must be present so webhook handler can read userId
 */

// Mock the stripe SDK before importing stripe.ts
const mockCreate = jest.fn();

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: mockCreate,
        retrieve: jest.fn(),
      },
    },
    billingPortal: {
      sessions: {
        create: jest.fn(),
      },
    },
  }));
});

// Mock validation so requireEnvVar doesn't throw
jest.mock('@/lib/validation', () => ({
  __esModule: true,
  requireEnvVar: (name: string) => `test_${name}`,
  ensureEnv: jest.fn(),
}));

import { createCheckoutSession } from '@/lib/stripe';

const BASE_PARAMS = {
  userId: 'user-abc',
  planType: 'solo' as const,
  customerEmail: 'groomer@test.com',
  businessName: 'Test Grooming Co',
  planData: { name: 'Solo', price: 2900 },
  clientId: 'client-123',
};

describe('createCheckoutSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockResolvedValue({
      id: 'cs_test_abc',
      url: 'https://checkout.stripe.com/c/pay/cs_test_abc',
    });
  });

  // ── Bug 1: No customer_update without customer ─────────────────────────────
  it('does NOT include customer_update in the session params (Bug 1 fix)', async () => {
    await createCheckoutSession(BASE_PARAMS);

    const [sessionParams] = mockCreate.mock.calls[0];
    expect(sessionParams).not.toHaveProperty('customer_update');
  });

  // ── Bug 2: Session-level metadata must be set ──────────────────────────────
  it('sets session-level metadata with userId (Bug 2 fix)', async () => {
    await createCheckoutSession(BASE_PARAMS);

    const [sessionParams] = mockCreate.mock.calls[0];
    expect(sessionParams.metadata).toBeDefined();
    expect(sessionParams.metadata.userId).toBe('user-abc');
    expect(sessionParams.metadata.planType).toBe('solo');
  });

  it('includes all expected fields in session-level metadata', async () => {
    await createCheckoutSession(BASE_PARAMS);

    const [sessionParams] = mockCreate.mock.calls[0];
    expect(sessionParams.metadata).toMatchObject({
      userId: 'user-abc',
      planType: 'solo',
      businessName: 'Test Grooming Co',
      planName: 'Solo',
      planPrice: '2900',
      isTrial: 'true',
      clientId: 'client-123',
    });
  });

  it('uses planType as planName fallback when planData is absent', async () => {
    await createCheckoutSession({ ...BASE_PARAMS, planData: undefined });

    const [sessionParams] = mockCreate.mock.calls[0];
    expect(sessionParams.metadata.planName).toBe('solo');
    expect(sessionParams.metadata.planPrice).toBe('0');
  });

  it('sets empty string for clientId when not provided', async () => {
    await createCheckoutSession({ ...BASE_PARAMS, clientId: undefined });

    const [sessionParams] = mockCreate.mock.calls[0];
    expect(sessionParams.metadata.clientId).toBe('');
  });

  // ── subscription_data metadata still present ────────────────────────────────
  it('also sets subscription_data.metadata for subscription-level events', async () => {
    await createCheckoutSession(BASE_PARAMS);

    const [sessionParams] = mockCreate.mock.calls[0];
    expect(sessionParams.subscription_data?.metadata?.userId).toBe('user-abc');
    expect(sessionParams.subscription_data?.metadata?.planType).toBe('solo');
  });

  // ── Basic structure ────────────────────────────────────────────────────────
  it('uses subscription mode', async () => {
    await createCheckoutSession(BASE_PARAMS);
    const [sessionParams] = mockCreate.mock.calls[0];
    expect(sessionParams.mode).toBe('subscription');
  });

  it('sets a 14-day trial period', async () => {
    await createCheckoutSession(BASE_PARAMS);
    const [sessionParams] = mockCreate.mock.calls[0];
    expect(sessionParams.subscription_data?.trial_period_days).toBe(14);
  });

  it('returns the session from Stripe', async () => {
    const result = await createCheckoutSession(BASE_PARAMS);
    expect(result.id).toBe('cs_test_abc');
    expect(result.url).toBe('https://checkout.stripe.com/c/pay/cs_test_abc');
  });
});
