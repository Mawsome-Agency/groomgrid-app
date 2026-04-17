import { handleStripeEvent } from '@/app/api/stripe/webhook/_handler';
import type Stripe from 'stripe';

// Mock dependencies so module loads without side effects
jest.mock('@/lib/prisma', () => ({
  prisma: {
    paymentEvent: { create: jest.fn(), findFirst: jest.fn() },
    profile: { update: jest.fn(), findFirst: jest.fn() },
    paymentLockout: { findFirst: jest.fn(), update: jest.fn() },
    $transaction: jest.fn(),
  },
}));
jest.mock('@/lib/ga4-server');
jest.mock('@/lib/payment-completion', () => ({
  triggerPaymentCompletionHandler: jest.fn(),
}));
jest.mock('@/lib/payment-lockout', () => ({
  updatePaymentLockoutStatus: jest.fn(),
}));

test('handleStripeEvent handles unknown event type without throwing', async () => {
  const mockEvent = {
    id: 'evt_test',
    type: 'unknown.event',
    data: { object: {} },
  } as unknown as Stripe.Event;
  await expect(handleStripeEvent(mockEvent)).resolves.toBeUndefined();
});
