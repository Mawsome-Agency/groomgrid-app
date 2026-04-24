import { POST } from '../route';
import {
  mockStripeWebhookEvent,
  generateStripeSignature,
  createMockStripeEvent,
} from '@/lib/stripe';
import { triggerPaymentCompletionHandler } from '@/lib/payment-completion';

// Mock dependencies
jest.mock('@/lib/payment-completion', () => ({
  triggerPaymentCompletionHandler: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn((fn: Function) => fn({
      paymentEvent: { create: jest.fn().mockResolvedValue({}) },
      paymentLockout: { findFirst: jest.fn().mockResolvedValue(null), update: jest.fn().mockResolvedValue({}) },
    })),
    paymentEvent: { create: jest.fn().mockResolvedValue({}), findFirst: jest.fn().mockResolvedValue(null) },
    profile: {
      update: jest.fn().mockResolvedValue({}),
      findFirst: jest.fn().mockResolvedValue(null),
    },
    paymentLockout: { findFirst: jest.fn().mockResolvedValue(null) },
  },
  prisma: {
    paymentEvent: { create: jest.fn().mockResolvedValue({}), findFirst: jest.fn().mockResolvedValue(null) },
    profile: {
      update: jest.fn().mockResolvedValue({}),
      findFirst: jest.fn().mockResolvedValue(null),
    },
    paymentLockout: { findFirst: jest.fn().mockResolvedValue(null) },
  },
}));

describe('Stripe webhook route (test mode)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, NODE_ENV: 'test', ENABLE_TEST_WEBHOOK_BYPASS: 'true', STRIPE_WEBHOOK_TEST_KEY: 'test_key_123', STRIPE_WEBHOOK_SECRET: 'whsec_test' };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should reject test mode without test key header', async () => {
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json).toEqual({ error: 'Invalid test key' });
  });

  it('should reject test mode with invalid test key', async () => {
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'x-test-webhook-key': 'wrong_key' },
    });

    const response = await POST(req);
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json).toEqual({ error: 'Invalid test key' });
  });

  it('should process mock event with valid test key and return 200', async () => {
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'x-test-webhook-key': 'test_key_123' },
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({ received: true });

    // Verify that the payment completion handler was invoked with the mock session
    expect(triggerPaymentCompletionHandler).toHaveBeenCalled();
    const callArg = (triggerPaymentCompletionHandler as jest.Mock).mock.calls[0][0];
    expect(callArg.id).toBe('cs_test_123');
    expect(callArg.metadata.userId).toBe('test_user_id');
  });

  it('should return 200 for requests missing stripe-signature header (bot traffic)', async () => {
    process.env.NODE_ENV = 'production';
    process.env.ENABLE_TEST_WEBHOOK_BYPASS = 'false';

    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify({}),
      // No stripe-signature header
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({ received: true });
  });

  it('should verify Stripe signature in production mode', async () => {
    process.env.NODE_ENV = 'production';
    process.env.ENABLE_TEST_WEBHOOK_BYPASS = 'false';

    const payload = JSON.stringify(mockStripeWebhookEvent);
    const signature = generateStripeSignature(payload, 'whsec_test');

    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: payload,
      headers: { 'stripe-signature': signature },
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({ received: true });
  });

  it('should reject invalid signature in production mode', async () => {
    process.env.NODE_ENV = 'production';
    process.env.ENABLE_TEST_WEBHOOK_BYPASS = 'false';

    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      body: JSON.stringify(mockStripeWebhookEvent),
      headers: { 'stripe-signature': 'invalid_signature' },
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json).toEqual({ error: 'Invalid signature' });
  });

  it('should handle custom mock event via createMockStripeEvent', async () => {
    const customEvent = createMockStripeEvent({
      id: 'evt_custom_123',
      data: {
        object: {
          metadata: { userId: 'custom_user', planType: 'salon' },
        },
      },
    } as any);

    // Custom event should have the overridden values
    expect(customEvent.id).toBe('evt_custom_123');
    expect((customEvent.data.object as any).metadata.userId).toBe('custom_user');
    expect((customEvent.data.object as any).metadata.planType).toBe('salon');
  });
});
