/**
 * @jest-environment node
 */

// Mock heavy server dependencies so module loads cleanly in test environment
jest.mock('@/lib/stripe', () => ({
  stripe: { checkout: { sessions: { create: jest.fn() } } },
  createCheckoutSession: jest.fn(),
  getStripeErrorMessage: jest.fn(),
}));
jest.mock('@/lib/prisma', () => ({
  prisma: { paymentLockout: { findFirst: jest.fn(), create: jest.fn() } },
}));
jest.mock('@/lib/ga4-server', () => ({
  trackPaymentInitiatedServer: jest.fn(),
}));

import { validatePlan } from '@/app/api/checkout/route';

test('validatePlan returns true for known plans', () => {
  expect(validatePlan('solo')).toBe(true);
  expect(validatePlan('salon')).toBe(true);
  expect(validatePlan('enterprise')).toBe(true);
});

test('validatePlan returns false for unknown plan', () => {
  expect(validatePlan('premium')).toBe(false);
});
