/**
 * Tests for payment-completion.ts
 *
 * Testing strategy:
 * - Happy path: full flow creates COMPLETION_PROCESSED event and updates profile
 * - Idempotency: skips when already processed
 * - Edge cases: missing userId, missing stripeCustomerId/subscriptionId
 * - GA4 events fire after transaction
 * - Transaction errors propagate for Stripe retry
 */

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    paymentEvent: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    profile: {
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock('@/lib/ga4-server', () => ({
  __esModule: true,
  trackCheckoutCompletedServer: jest.fn(),
  trackSubscriptionStartedServer: jest.fn(),
}));

import prisma from '@/lib/prisma';
import { trackCheckoutCompletedServer, trackSubscriptionStartedServer } from '@/lib/ga4-server';
import { triggerPaymentCompletionHandler } from '../payment-completion';

const mockFindUnique = prisma.paymentEvent.findUnique as jest.MockedFunction<typeof prisma.paymentEvent.findUnique>;
const mockTransaction = prisma.$transaction as jest.MockedFunction<typeof prisma.$transaction>;
const mockTrackCheckout = trackCheckoutCompletedServer as jest.MockedFunction<typeof trackCheckoutCompletedServer>;
const mockTrackSubscription = trackSubscriptionStartedServer as jest.MockedFunction<typeof trackSubscriptionStartedServer>;

const BASE_SESSION = {
  id: 'cs_test_abc',
  customer: 'cus_test_123',
  subscription: 'sub_test_456',
  metadata: {
    userId: 'user-abc',
    planType: 'solo',
    clientId: 'ga4-client-id',
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  // Default: not yet processed
  mockFindUnique.mockResolvedValue(null);
  // Default: transaction succeeds by calling the callback
  mockTransaction.mockImplementation(async (callback: any) => {
    const txClient = {
      profile: { update: jest.fn().mockResolvedValue({}) },
      paymentEvent: { create: jest.fn().mockResolvedValue({}) },
    };
    return callback(txClient);
  });
  mockTrackCheckout.mockResolvedValue(undefined);
  mockTrackSubscription.mockResolvedValue(undefined);
});

// ─────────────────────────────────────────────
// Idempotency checks
// ─────────────────────────────────────────────
describe('triggerPaymentCompletionHandler — idempotency', () => {
  it('returns early without transaction if COMPLETION_PROCESSED event exists', async () => {
    mockFindUnique.mockResolvedValueOnce({ id: 'event-1' } as any);

    await triggerPaymentCompletionHandler(BASE_SESSION);

    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it('does not fire GA4 events when already processed', async () => {
    mockFindUnique.mockResolvedValueOnce({ id: 'event-1' } as any);

    await triggerPaymentCompletionHandler(BASE_SESSION);

    expect(mockTrackCheckout).not.toHaveBeenCalled();
    expect(mockTrackSubscription).not.toHaveBeenCalled();
  });

  it('checks for COMPLETION_PROCESSED event using paymentId_eventType composite key', async () => {
    await triggerPaymentCompletionHandler(BASE_SESSION);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: {
        paymentId_eventType: {
          paymentId: 'cs_test_abc',
          eventType: 'COMPLETION_PROCESSED',
        },
      },
    });
  });
});

// ─────────────────────────────────────────────
// Missing userId guard
// ─────────────────────────────────────────────
describe('triggerPaymentCompletionHandler — missing userId', () => {
  it('returns early when metadata.userId is absent', async () => {
    const sessionNoUser = { ...BASE_SESSION, metadata: { planType: 'solo' } };

    await triggerPaymentCompletionHandler(sessionNoUser as any);

    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it('does not fire GA4 events when userId is missing', async () => {
    const sessionNoUser = { ...BASE_SESSION, metadata: {} };

    await triggerPaymentCompletionHandler(sessionNoUser as any);

    expect(mockTrackCheckout).not.toHaveBeenCalled();
  });

  it('handles session with null metadata gracefully', async () => {
    const sessionNullMeta = { ...BASE_SESSION, metadata: undefined };

    await triggerPaymentCompletionHandler(sessionNullMeta as any);

    expect(mockTransaction).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────
// Happy path — transaction
// ─────────────────────────────────────────────
describe('triggerPaymentCompletionHandler — happy path', () => {
  it('executes a transaction on first call', async () => {
    await triggerPaymentCompletionHandler(BASE_SESSION);

    expect(mockTransaction).toHaveBeenCalledTimes(1);
  });

  it('updates profile inside transaction with correct userId', async () => {
    let capturedTx: any;
    mockTransaction.mockImplementationOnce(async (callback: any) => {
      capturedTx = {
        profile: { update: jest.fn().mockResolvedValue({}) },
        paymentEvent: { create: jest.fn().mockResolvedValue({}) },
      };
      return callback(capturedTx);
    });

    await triggerPaymentCompletionHandler(BASE_SESSION);

    expect(capturedTx.profile.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user-abc' } })
    );
  });

  it('sets subscriptionStatus to "trial" in profile update', async () => {
    let capturedTx: any;
    mockTransaction.mockImplementationOnce(async (callback: any) => {
      capturedTx = {
        profile: { update: jest.fn().mockResolvedValue({}) },
        paymentEvent: { create: jest.fn().mockResolvedValue({}) },
      };
      return callback(capturedTx);
    });

    await triggerPaymentCompletionHandler(BASE_SESSION);

    expect(capturedTx.profile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ subscriptionStatus: 'trial' }),
      })
    );
  });

  it('sets planType in profile update', async () => {
    let capturedTx: any;
    mockTransaction.mockImplementationOnce(async (callback: any) => {
      capturedTx = {
        profile: { update: jest.fn().mockResolvedValue({}) },
        paymentEvent: { create: jest.fn().mockResolvedValue({}) },
      };
      return callback(capturedTx);
    });

    await triggerPaymentCompletionHandler(BASE_SESSION);

    expect(capturedTx.profile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ planType: 'solo' }),
      })
    );
  });

  it('sets stripeCustomerId in profile update', async () => {
    let capturedTx: any;
    mockTransaction.mockImplementationOnce(async (callback: any) => {
      capturedTx = {
        profile: { update: jest.fn().mockResolvedValue({}) },
        paymentEvent: { create: jest.fn().mockResolvedValue({}) },
      };
      return callback(capturedTx);
    });

    await triggerPaymentCompletionHandler(BASE_SESSION);

    expect(capturedTx.profile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ stripeCustomerId: 'cus_test_123' }),
      })
    );
  });

  it('creates COMPLETION_PROCESSED event inside transaction', async () => {
    let capturedTx: any;
    mockTransaction.mockImplementationOnce(async (callback: any) => {
      capturedTx = {
        profile: { update: jest.fn().mockResolvedValue({}) },
        paymentEvent: { create: jest.fn().mockResolvedValue({}) },
      };
      return callback(capturedTx);
    });

    await triggerPaymentCompletionHandler(BASE_SESSION);

    expect(capturedTx.paymentEvent.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          paymentId: 'cs_test_abc',
          eventType: 'COMPLETION_PROCESSED',
        }),
      })
    );
  });

  it('fires GA4 checkout completed event after transaction', async () => {
    await triggerPaymentCompletionHandler(BASE_SESSION);

    expect(mockTrackCheckout).toHaveBeenCalledWith(
      'ga4-client-id',
      'user-abc',
      'cs_test_abc',
      'solo',
      true
    );
  });

  it('fires GA4 subscription started event when subscription ID exists', async () => {
    await triggerPaymentCompletionHandler(BASE_SESSION);

    expect(mockTrackSubscription).toHaveBeenCalledWith(
      'user-abc',
      'sub_test_456',
      'solo',
      'trial',
      expect.any(Number)
    );
  });

  it('uses userId as clientId fallback when clientId is absent', async () => {
    const sessionNoClientId = {
      ...BASE_SESSION,
      metadata: { userId: 'user-abc', planType: 'solo' },
    };

    await triggerPaymentCompletionHandler(sessionNoClientId);

    expect(mockTrackCheckout).toHaveBeenCalledWith(
      'user-abc',  // userId as fallback
      'user-abc',
      'cs_test_abc',
      'solo',
      true
    );
  });

  it('does not fire subscription GA4 when subscription is null', async () => {
    const sessionNoSub = { ...BASE_SESSION, subscription: null };

    await triggerPaymentCompletionHandler(sessionNoSub);

    expect(mockTrackSubscription).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────
// Stripe customer/subscription extraction
// ─────────────────────────────────────────────
describe('triggerPaymentCompletionHandler — type guards', () => {
  it('extracts stripeCustomerId from string customer field', async () => {
    let capturedTx: any;
    mockTransaction.mockImplementationOnce(async (callback: any) => {
      capturedTx = {
        profile: { update: jest.fn().mockResolvedValue({}) },
        paymentEvent: { create: jest.fn().mockResolvedValue({}) },
      };
      return callback(capturedTx);
    });

    await triggerPaymentCompletionHandler({ ...BASE_SESSION, customer: 'cus_direct_string' });

    expect(capturedTx.profile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ stripeCustomerId: 'cus_direct_string' }),
      })
    );
  });

  it('sets stripeCustomerId to undefined when customer is an object (not string)', async () => {
    let capturedTx: any;
    mockTransaction.mockImplementationOnce(async (callback: any) => {
      capturedTx = {
        profile: { update: jest.fn().mockResolvedValue({}) },
        paymentEvent: { create: jest.fn().mockResolvedValue({}) },
      };
      return callback(capturedTx);
    });

    await triggerPaymentCompletionHandler({ ...BASE_SESSION, customer: { id: 'cus_obj' } as any });

    expect(capturedTx.profile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ stripeCustomerId: undefined }),
      })
    );
  });

  it('uses "unknown" planType when planType is absent from metadata', async () => {
    let capturedTx: any;
    mockTransaction.mockImplementationOnce(async (callback: any) => {
      capturedTx = {
        profile: { update: jest.fn().mockResolvedValue({}) },
        paymentEvent: { create: jest.fn().mockResolvedValue({}) },
      };
      return callback(capturedTx);
    });

    await triggerPaymentCompletionHandler({
      ...BASE_SESSION,
      metadata: { userId: 'user-abc' },
    });

    expect(capturedTx.profile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ planType: 'unknown' }),
      })
    );
  });
});

// ─────────────────────────────────────────────
// Plan price mapping
// ─────────────────────────────────────────────
describe('triggerPaymentCompletionHandler — plan price in GA4', () => {
  it.each([
    ['solo', 29],
    ['salon', 79],
    ['enterprise', 149],
  ])('passes correct price for plan "%s" to GA4 subscription event', async (planType, expectedPrice) => {
    await triggerPaymentCompletionHandler({
      ...BASE_SESSION,
      metadata: { userId: 'user-abc', planType, clientId: '' },
    });

    expect(mockTrackSubscription).toHaveBeenCalledWith(
      'user-abc',
      'sub_test_456',
      planType,
      'trial',
      expectedPrice
    );
  });

  it('uses price 0 for unknown planType in GA4 subscription event', async () => {
    await triggerPaymentCompletionHandler({
      ...BASE_SESSION,
      metadata: { userId: 'user-abc', planType: 'unknown_plan', clientId: '' },
    });

    expect(mockTrackSubscription).toHaveBeenCalledWith(
      'user-abc',
      'sub_test_456',
      'unknown_plan',
      'trial',
      0
    );
  });
});

// ─────────────────────────────────────────────
// Error handling
// ─────────────────────────────────────────────
describe('triggerPaymentCompletionHandler — error handling', () => {
  it('throws when transaction fails (so Stripe can retry webhook)', async () => {
    mockTransaction.mockRejectedValueOnce(new Error('DB write failed'));

    await expect(triggerPaymentCompletionHandler(BASE_SESSION)).rejects.toThrow('DB write failed');
  });

  it('does not fire GA4 events when transaction throws', async () => {
    mockTransaction.mockRejectedValueOnce(new Error('Transaction rollback'));

    try {
      await triggerPaymentCompletionHandler(BASE_SESSION);
    } catch {
      // expected
    }

    expect(mockTrackCheckout).not.toHaveBeenCalled();
    expect(mockTrackSubscription).not.toHaveBeenCalled();
  });
});
