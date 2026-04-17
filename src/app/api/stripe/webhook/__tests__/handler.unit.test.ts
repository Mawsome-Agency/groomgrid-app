import { handleStripeEvent } from '../_handler';
import { mockStripeEvents, createMockStripeEvent } from '@/lib/stripe';
import { triggerPaymentCompletionHandler } from '@/lib/payment-completion';
import * as ga4 from '@/lib/ga4-server';

// Mock dependencies
jest.mock('@/lib/payment-completion');
jest.mock('@/lib/ga4-server');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrisma: Record<string, any> = {
  paymentEvent: {
    create: jest.fn().mockResolvedValue({}),
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
  $transaction: jest.fn((fn: Function) => fn(mockPrisma)),
};

jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}));

describe('handleStripeEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrisma.paymentEvent.findFirst.mockResolvedValue(null);
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
    it('should log subscription creation', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const event = createMockStripeEvent({
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_new',
            status: 'active',
            metadata: { userId: 'test_user' },
          },
        },
      } as any);

      await handleStripeEvent(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('subscription.created for user test_user')
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
