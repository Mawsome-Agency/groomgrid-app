/**
 * @jest-environment node
 */

// ── Inline mock data (defined BEFORE jest.mock hoisting, inside factory scope) ──
// We mock @/lib/stripe to avoid loading the Stripe SDK at module init time
// (it calls new Stripe(requireEnvVar(...)) which crashes in test environment).

jest.mock('@/lib/stripe', () => {
  const now = Math.floor(Date.now() / 1000);

  const baseCheckoutSession = {
    id: 'cs_test_checkout',
    object: 'checkout.session',
    payment_status: 'paid',
    status: 'complete',
    customer: 'cus_test_789',
    metadata: { userId: 'test_user_id', planType: 'solo' },
    subscription: 'sub_test_abc',
    amount_total: 2900,
    currency: 'usd',
  };

  const baseEvent = {
    id: 'evt_test_checkout_session_completed',
    object: 'event',
    api_version: '2024-08-15',
    created: now,
    data: { object: baseCheckoutSession },
    livemode: false,
    pending_webhooks: 0,
    type: 'checkout.session.completed',
    request: null,
  };

  const mockStripeEvents = {
    checkoutSessionCompleted: baseEvent,

    subscriptionUpdated: {
      ...baseEvent,
      id: 'evt_test_subscription_updated',
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_test_abc',
          object: 'subscription',
          status: 'active',
          metadata: { userId: 'test_user_id', planType: 'solo' },
          customer: 'cus_test_789',
          current_period_start: now,
          current_period_end: now + 30 * 24 * 60 * 60,
        },
      },
    },

    subscriptionDeleted: {
      ...baseEvent,
      id: 'evt_test_subscription_deleted',
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_test_abc',
          object: 'subscription',
          status: 'canceled',
          metadata: { userId: 'test_user_id' },
          customer: 'cus_test_789',
        },
      },
    },

    invoicePaymentSucceeded: {
      ...baseEvent,
      id: 'evt_test_invoice_succeeded',
      type: 'invoice.payment_succeeded',
      data: {
        object: {
          id: 'in_test_123',
          object: 'invoice',
          amount_paid: 2900,
          customer: 'cus_test_789',
          status: 'paid',
        },
      },
    },

    invoicePaymentFailed: {
      ...baseEvent,
      id: 'evt_test_invoice_failed',
      type: 'invoice.payment_failed',
      data: {
        object: {
          id: 'in_test_123',
          object: 'invoice',
          amount_paid: 0,
          customer: 'cus_test_789',
          status: 'open',
          last_payment_error: { message: 'Card declined' },
        },
      },
    },
  };

  function createMockStripeEvent(overrides: any = {}) {
    return {
      ...baseEvent,
      ...overrides,
      data: {
        ...baseEvent.data,
        object: {
          ...baseEvent.data.object,
          ...(overrides?.data?.object || {}),
        },
      },
    };
  }

  return { mockStripeEvents, createMockStripeEvent, stripe: {} };
});

jest.mock('@/lib/payment-completion');
// Explicit factory so every export is a proper jest.fn() (auto-mock doesn't reliably
// create jest spies for async functions in the node test environment)
jest.mock('@/lib/ga4-server', () => ({
  trackServerEvent: jest.fn().mockResolvedValue(undefined),
  trackCheckoutCompletedServer: jest.fn().mockResolvedValue(undefined),
  trackSubscriptionCreatedServer: jest.fn().mockResolvedValue(undefined),
  trackSubscriptionUpdatedServer: jest.fn().mockResolvedValue(undefined),
  trackSubscriptionCancelledServer: jest.fn().mockResolvedValue(undefined),
  trackSubscriptionStartedServer: jest.fn().mockResolvedValue(undefined),
  trackPaymentInitiatedServer: jest.fn().mockResolvedValue(undefined),
  trackPaymentSuccessServer: jest.fn().mockResolvedValue(undefined),
  trackPaymentFailedServer: jest.fn().mockResolvedValue(undefined),
  trackABTestAssignedServer: jest.fn().mockResolvedValue(undefined),
  trackABTestConvertedServer: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('@/lib/payment-lockout', () => ({
  updatePaymentLockoutStatus: jest.fn(),
}));

// Define mock inline so it's available when jest.mock() factory runs (avoids TDZ).
// Access the live mock after setup via jest.requireMock().
jest.mock('@/lib/prisma', () => ({
  prisma: {
    paymentEvent: {
      create: jest.fn().mockResolvedValue({}),
      upsert: jest.fn().mockResolvedValue({}),
      findFirst: jest.fn().mockResolvedValue(null),
      findUnique: jest.fn().mockResolvedValue(null),
    },
    profile: {
      update: jest.fn().mockResolvedValue({}),
      findFirst: jest.fn().mockResolvedValue(null),
    },
    paymentLockout: {
      findFirst: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue({}),
    },
    dripEmailQueue: {
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    $transaction: jest.fn(),
  },
}));

import { handleStripeEvent } from '../_handler';
import { mockStripeEvents, createMockStripeEvent } from '@/lib/stripe';
import { triggerPaymentCompletionHandler } from '@/lib/payment-completion';
import * as ga4 from '@/lib/ga4-server';

describe('handleStripeEvent', () => {
  // Access the mock after jest.mock() is fully set up
  const mockPrisma = jest.requireMock('@/lib/prisma').prisma as Record<string, any>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.paymentEvent.findFirst.mockResolvedValue(null);
    // Re-wire $transaction after clearAllMocks resets its implementation
    mockPrisma.$transaction.mockImplementation((fn: Function) => fn(mockPrisma));
  });

  describe('idempotency', () => {
    it('should skip processing if event already processed', async () => {
      // Simulate event already processed
      mockPrisma.paymentEvent.findFirst.mockResolvedValueOnce({ id: 'existing' });

      const event = mockStripeEvents.checkoutSessionCompleted;
      await handleStripeEvent(event);

      // Should not create paymentEvent or call triggerPaymentCompletionHandler
      expect(mockPrisma.paymentEvent.create).not.toHaveBeenCalled();
      expect(triggerPaymentCompletionHandler).not.toHaveBeenCalled();
    });

    it('should write idempotency marker AFTER triggerPaymentCompletionHandler succeeds', async () => {
      // Regression test for race condition: if recordEventProcessed fires before the
      // completion handler and the handler throws, Stripe retries would see the
      // marker and skip — leaving the user's profile unupdated after a real payment.
      const callOrder: string[] = [];

      (triggerPaymentCompletionHandler as jest.Mock).mockImplementationOnce(async () => {
        callOrder.push('completionHandler');
      });
      mockPrisma.paymentEvent.create.mockImplementationOnce(async () => {
        callOrder.push('recordEventProcessed');
        return {};
      });

      const event = mockStripeEvents.checkoutSessionCompleted;
      await handleStripeEvent(event);

      expect(callOrder).toEqual(['completionHandler', 'recordEventProcessed']);
    });

    it('should retry completion handler if it failed on a previous attempt (PAYMENT_CONFIRMED already exists)', async () => {
      // Simulates: transaction committed PAYMENT_CONFIRMED, but triggerPaymentCompletionHandler
      // threw on the first attempt. Stripe retries. isEventProcessed must return false so
      // the completion handler runs again.
      // The upsert ensures the transaction doesn't throw on PAYMENT_CONFIRMED duplicate.
      // isEventProcessed filters by eventType=CHECKOUT_SESSION_COMPLETED and finds nothing
      // (because recordEventProcessed was never called on the first attempt).
      mockPrisma.paymentEvent.findFirst.mockResolvedValueOnce(null); // no idempotency record yet

      const event = mockStripeEvents.checkoutSessionCompleted;
      await handleStripeEvent(event);

      expect(triggerPaymentCompletionHandler).toHaveBeenCalledTimes(1);
      // Idempotency marker created after completion
      expect(mockPrisma.paymentEvent.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            eventType: 'CHECKOUT_SESSION_COMPLETED',
            payload: expect.objectContaining({
              eventId: event.id,
            }),
          }),
        })
      );
    });
  });

  describe('checkout.session.completed', () => {
    it('should process checkout session with userId', async () => {
      const event = mockStripeEvents.checkoutSessionCompleted;
      await handleStripeEvent(event);

      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(triggerPaymentCompletionHandler).toHaveBeenCalled();
    });

    it('should skip processing if no userId in metadata', async () => {
      const event = createMockStripeEvent({
        data: {
          object: {
            metadata: {},
          },
        },
      } as any);

      await handleStripeEvent(event);

      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
      expect(triggerPaymentCompletionHandler).not.toHaveBeenCalled();
    });
  });

  describe('customer.subscription.updated', () => {
    it('should update profile for active subscription', async () => {
      const event = mockStripeEvents.subscriptionUpdated;
      await handleStripeEvent(event);

      expect(mockPrisma.profile.update).toHaveBeenCalledWith({
        where: { userId: 'test_user_id' },
        data: {
          subscriptionStatus: 'active',
          planType: 'solo',
        },
      });
      expect(ga4.trackSubscriptionUpdatedServer).toHaveBeenCalled();
    });

    it('should set trial status for trialing subscriptions', async () => {
      const event = createMockStripeEvent({
        type: 'customer.subscription.updated',
        data: {
          object: {
            id: 'sub_test',
            status: 'trialing',
            metadata: { userId: 'test_user', planType: 'salon' },
            customer: 'cus_test',
          },
        },
      } as any);

      mockPrisma.paymentEvent.findFirst.mockResolvedValue(null);

      await handleStripeEvent(event);

      expect(mockPrisma.profile.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            subscriptionStatus: 'trial',
          }),
        })
      );
    });

    it('should skip if no userId in metadata', async () => {
      const event = createMockStripeEvent({
        type: 'customer.subscription.updated',
        data: {
          object: {
            status: 'active',
            metadata: {},
          },
        },
      } as any);

      await handleStripeEvent(event);

      expect(mockPrisma.profile.update).not.toHaveBeenCalled();
    });
  });

  describe('customer.subscription.deleted', () => {
    it('should set subscription status to cancelled', async () => {
      const event = mockStripeEvents.subscriptionDeleted;
      await handleStripeEvent(event);

      expect(mockPrisma.profile.update).toHaveBeenCalledWith({
        where: { userId: 'test_user_id' },
        data: { subscriptionStatus: 'cancelled' },
      });
      expect(ga4.trackSubscriptionCancelledServer).toHaveBeenCalled();
    });
  });

  describe('customer.subscription.created', () => {
    it('should log subscription creation and fire subscription_started tracking', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const event = createMockStripeEvent({
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_new',
            status: 'active',
            metadata: { userId: 'test_user', planType: 'solo' },
            plan: { amount: 2900 },
          },
        },
      } as any);

      await handleStripeEvent(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('subscription.created for user test_user')
      );
      expect(ga4.trackSubscriptionStartedServer).toHaveBeenCalledWith(
        'test_user',
        'test_user',
        'sub_new',
        'solo',
        'active',
        2900
      );
      consoleSpy.mockRestore();
    });
  });

  describe('invoice.payment_succeeded', () => {
    it('should update profile for customer invoice', async () => {
      mockPrisma.profile.findFirst.mockResolvedValueOnce({
        userId: 'profile_user',
        stripeCustomerId: 'cus_test_789',
      });

      const event = mockStripeEvents.invoicePaymentSucceeded;
      await handleStripeEvent(event);

      expect(mockPrisma.profile.update).toHaveBeenCalledWith({
        where: { userId: 'profile_user' },
        data: { subscriptionStatus: 'active' },
      });
      expect(ga4.trackPaymentSuccessServer).toHaveBeenCalledWith(
        'profile_user',
        'in_test_123',
        2900
      );
    });

    it('should skip if customer not found', async () => {
      mockPrisma.profile.findFirst.mockResolvedValueOnce(null);

      const event = mockStripeEvents.invoicePaymentSucceeded;
      await handleStripeEvent(event);

      expect(mockPrisma.profile.update).not.toHaveBeenCalled();
    });
  });

  describe('invoice.payment_failed', () => {
    it('should set past_due status on payment failure', async () => {
      mockPrisma.profile.findFirst.mockResolvedValueOnce({
        userId: 'profile_user',
        stripeCustomerId: 'cus_test_789',
      });

      const event = mockStripeEvents.invoicePaymentFailed;
      await handleStripeEvent(event);

      expect(mockPrisma.profile.update).toHaveBeenCalledWith({
        where: { userId: 'profile_user' },
        data: { subscriptionStatus: 'past_due' },
      });
      expect(ga4.trackPaymentFailedServer).toHaveBeenCalledWith(
        'profile_user',
        'in_test_123',
        'Card declined'
      );
    });
  });

  describe('unhandled event types', () => {
    it('should log unhandled event type', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const event = createMockStripeEvent({
        type: 'unknown.event.type' as any,
      });

      await handleStripeEvent(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Unhandled event type: unknown.event.type'
      );
      consoleSpy.mockRestore();
    });
  });
});
