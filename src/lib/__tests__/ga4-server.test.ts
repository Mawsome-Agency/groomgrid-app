/**
 * Tests for ga4-server.ts - Server-side GA4 tracking via Measurement Protocol.
 *
 * Testing strategy:
 * - Happy path: Valid inputs produce correct fetch calls
 * - Edge cases: missing env vars, network failures
 * - Single vs array events
 * - All 9 server functions tested
 */
import {
  trackServerEvent,
  trackCheckoutCompletedServer,
  trackSubscriptionCreatedServer,
  trackSubscriptionUpdatedServer,
  trackSubscriptionCancelledServer,
  trackSubscriptionStartedServer,
  trackPaymentInitiatedServer,
  trackPaymentSuccessServer,
  trackPaymentFailedServer,
  trackPurchaseCompletedServer,
} from '../ga4-server';

describe('ga4-server.ts', () => {
  const originalEnv = {
    MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
    API_SECRET: process.env.GA4_API_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    process.env.GA4_API_SECRET = 'test-secret';
    (process.env as any).NODE_ENV = 'test';
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = originalEnv.MEASUREMENT_ID;
    process.env.GA4_API_SECRET = originalEnv.API_SECRET;
    (process.env as any).NODE_ENV = originalEnv.NODE_ENV;
  });

  describe('trackServerEvent', () => {
    it('should send single event to Measurement Protocol', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackServerEvent('client_123', {
        name: 'test_event',
        params: { param1: 'value1' },
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('measurement_id=G-TEST123'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
    });

    it('should send array of events to Measurement Protocol', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackServerEvent('client_123', [
        { name: 'event1', params: { a: 1 } },
        { name: 'event2', params: { b: 2 } },
      ]);

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events).toHaveLength(2);
      expect(fetchBody.events[0].name).toBe('event1');
      expect(fetchBody.events[1].name).toBe('event2');
    });

    it('should include client_id in payload', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackServerEvent('client_123', {
        name: 'test_event',
        params: {},
      });

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.client_id).toBe('client_123');
    });

    it('should include user_id in payload when provided', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackServerEvent('client_123', {
        name: 'test_event',
        params: {},
      }, 'user_456');

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.user_id).toBe('user_456');
    });

    it('should add engagement_time_msec to params', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackServerEvent('client_123', {
        name: 'test_event',
        params: { custom: 'value' },
      });

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].params.engagement_time_msec).toBe('100');
      expect(fetchBody.events[0].params.custom).toBe('value');
    });

    it('should return early if MEASUREMENT_ID not set', async () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      (global as any).fetch = jest.fn();

      await trackServerEvent('client_123', { name: 'test_event' });

      expect(fetch).not.toHaveBeenCalled();
    });

    it('should warn if MEASUREMENT_ID not set', async () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      const consoleWarn = jest.spyOn(console, 'warn');

      await trackServerEvent('client_123', { name: 'test_event' });

      expect(consoleWarn).toHaveBeenCalledWith(
        '[GA4 Server] NEXT_PUBLIC_GA4_MEASUREMENT_ID not set — skipping event'
      );
      consoleWarn.mockRestore();
    });

    it('should return early if API_SECRET not set in development', async () => {
      (process.env as any).NODE_ENV = 'development';
      delete process.env.GA4_API_SECRET;
      (global as any).fetch = jest.fn();
      const consoleWarn = jest.spyOn(console, 'warn');

      await trackServerEvent('client_123', { name: 'test_event' });

      expect(fetch).not.toHaveBeenCalled();
      expect(consoleWarn).toHaveBeenCalledWith(
        '[GA4 Server] GA4_API_SECRET not set — event not sent:',
        expect.any(Object)
      );
      consoleWarn.mockRestore();
    });

    it('should error in production if API_SECRET not set', async () => {
      (process.env as any).NODE_ENV = 'production';
      delete process.env.GA4_API_SECRET;
      (global as any).fetch = jest.fn();
      const consoleError = jest.spyOn(console, 'error');

      await trackServerEvent('client_123', { name: 'test_event' });

      expect(fetch).not.toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledWith(
        '[GA4 Server] GA4_API_SECRET missing — server-side GA4 events disabled. Set GA4_API_SECRET in production environment.'
      );
      consoleError.mockRestore();
    });

    it('should handle network errors gracefully', async () => {
      const error = new Error('Network failed');
      (global as any).fetch = jest.fn().mockRejectedValue(error);
      const consoleError = jest.spyOn(console, 'error');

      await expect(trackServerEvent('client_123', { name: 'test_event' })).resolves.not.toThrow();

      expect(consoleError).toHaveBeenCalledWith(
        '[GA4 Server] Failed to send event:',
        error
      );
      consoleError.mockRestore();
    });

    it('should warn on non-ok response in development', async () => {
      (process.env as any).NODE_ENV = 'development';
      (global as any).fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: jest.fn().mockResolvedValue('Bad Request'),
      });
      const consoleWarn = jest.spyOn(console, 'warn');

      await trackServerEvent('client_123', { name: 'test_event' });

      expect(consoleWarn).toHaveBeenCalledWith(
        '[GA4 Server] Measurement Protocol returned 400:',
        expect.any(String)
      );
      consoleWarn.mockRestore();
    });

    it('should not warn on non-ok response in production', async () => {
      (process.env as any).NODE_ENV = 'production';
      (global as any).fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: jest.fn().mockResolvedValue('Bad Request'),
      });
      const consoleWarn = jest.spyOn(console, 'warn');

      await trackServerEvent('client_123', { name: 'test_event' });

      expect(consoleWarn).not.toHaveBeenCalled();
      consoleWarn.mockRestore();
    });
  });

  describe('trackCheckoutCompletedServer', () => {
    it('should call trackServerEvent with correct params', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackCheckoutCompletedServer('user_123', 'user_123', 'sess_456', 'solo', true);

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.client_id).toBe('user_123');
      expect(fetchBody.user_id).toBe('user_123');
      expect(fetchBody.events[0].name).toBe('checkout_completed');
      expect(fetchBody.events[0].params.session_id).toBe('sess_456');
      expect(fetchBody.events[0].params.plan_type).toBe('solo');
      expect(fetchBody.events[0].params.trial_started).toBe(true);
    });

    it('should handle false trial_started', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackCheckoutCompletedServer('user_123', 'user_123', 'sess_456', 'enterprise', false);

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].params.trial_started).toBe(false);
    });

    it('should handle null session ID', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackCheckoutCompletedServer('user_123', 'user_123', null as any, 'solo', true);

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].params.session_id).toBeNull();
    });
  });

  describe('trackSubscriptionCreatedServer', () => {
    it('should call trackServerEvent with correct params', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackSubscriptionCreatedServer('user_123', 'user_123', 'sub_456', 'solo', 'active');

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].name).toBe('subscription_created');
      expect(fetchBody.events[0].params.subscription_id).toBe('sub_456');
      expect(fetchBody.events[0].params.plan_type).toBe('solo');
      expect(fetchBody.events[0].params.subscription_status).toBe('active');
    });
  });

  describe('trackSubscriptionUpdatedServer', () => {
    it('should call trackServerEvent with correct params', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackSubscriptionUpdatedServer('user_123', 'sub_456', 'past_due');

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].name).toBe('subscription_updated');
      expect(fetchBody.events[0].params.subscription_id).toBe('sub_456');
      expect(fetchBody.events[0].params.subscription_status).toBe('past_due');
    });
  });

  describe('trackSubscriptionCancelledServer', () => {
    it('should call trackServerEvent with correct params', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackSubscriptionCancelledServer('user_123', 'sub_456');

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].name).toBe('subscription_cancelled');
      expect(fetchBody.events[0].params.subscription_id).toBe('sub_456');
    });
  });

  describe('trackSubscriptionStartedServer', () => {
    it('should call trackServerEvent with correct params', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackSubscriptionStartedServer('user_123', 'user_123', 'sub_456', 'solo', 'active', 29);

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].name).toBe('subscription_started');
      expect(fetchBody.events[0].params.subscription_id).toBe('sub_456');
      expect(fetchBody.events[0].params.plan_type).toBe('solo');
      expect(fetchBody.events[0].params.subscription_status).toBe('active');
      expect(fetchBody.events[0].params.price).toBe(29);
      expect(fetchBody.events[0].params.currency).toBe('USD');
    });

    it('should handle float price', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackSubscriptionStartedServer('user_123', 'user_123', 'sub_456', 'enterprise', 'active', 149.99);

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].params.price).toBe(149.99);
    });
  });

  describe('trackPaymentInitiatedServer', () => {
    it('should call trackServerEvent with correct params', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackPaymentInitiatedServer('user_123', 'sess_456', 'solo');

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].name).toBe('payment_initiated');
      expect(fetchBody.events[0].params.session_id).toBe('sess_456');
      expect(fetchBody.events[0].params.plan_type).toBe('solo');
    });
  });

  describe('trackPaymentSuccessServer', () => {
    it('should call trackServerEvent with correct params', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackPaymentSuccessServer('user_123', 'inv_456', 2999);

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].name).toBe('payment_success');
      expect(fetchBody.events[0].params.invoice_id).toBe('inv_456');
      expect(fetchBody.events[0].params.amount).toBe(2999);
      expect(fetchBody.events[0].params.currency).toBe('USD');
    });

    it('should handle zero amount', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackPaymentSuccessServer('user_123', 'inv_456', 0);

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].params.amount).toBe(0);
    });

    it('should handle negative amount', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackPaymentSuccessServer('user_123', 'inv_456', -100);

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].params.amount).toBe(-100);
    });
  });

  describe('trackPaymentFailedServer', () => {
    it('should call trackServerEvent with correct params', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackPaymentFailedServer('user_123', 'inv_456', 'card_declined');

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].name).toBe('payment_failed');
      expect(fetchBody.events[0].params.invoice_id).toBe('inv_456');
      expect(fetchBody.events[0].params.reason).toBe('card_declined');
    });

    it('should handle empty reason', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackPaymentFailedServer('user_123', 'inv_456', '');

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].params.reason).toBe('');
    });

    it('should handle null reason', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackPaymentFailedServer('user_123', 'inv_456', null as any);

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].params.reason).toBeNull();
    });

    it('should handle long reason strings', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackPaymentFailedServer('user_123', 'inv_456', 'A'.repeat(500));

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].params.reason).toHaveLength(500);
    });
  });

  describe('trackPurchaseCompletedServer', () => {
    it('should call trackServerEvent with correct params', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackPurchaseCompletedServer('client_123', 'user_123', 'sess_456', 'Solo', 29);

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.client_id).toBe('client_123');
      expect(fetchBody.user_id).toBe('user_123');
      expect(fetchBody.events[0].name).toBe('purchase_completed');
      expect(fetchBody.events[0].params.plan_name).toBe('Solo');
      expect(fetchBody.events[0].params.plan_price).toBe(29);
      expect(fetchBody.events[0].params.session_id).toBe('sess_456');
    });

    it('should fall back to userId as clientId when clientId is empty', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackPurchaseCompletedServer('', 'user_123', 'sess_456', 'Salon', 79);

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.client_id).toBe('user_123');
    });

    it('should handle float plan price', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackPurchaseCompletedServer('client_123', 'user_123', 'sess_456', 'Enterprise', 149.99);

      const fetchBody = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(fetchBody.events[0].params.plan_price).toBe(149.99);
    });
  });

  describe('Integration tests - payment flow server events', () => {
    it('should track payment initiated followed by success', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackPaymentInitiatedServer('user_123', 'sess_456', 'solo');
      const body1 = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body1.events[0].name).toBe('payment_initiated');

      await trackPaymentSuccessServer('user_123', 'inv_456', 2999);
      const body2 = JSON.parse((fetch as jest.Mock).mock.calls[1][1].body);
      expect(body2.events[0].name).toBe('payment_success');
    });

    it('should track payment initiated followed by failure', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: true });

      await trackPaymentInitiatedServer('user_123', 'sess_456', 'solo');
      const body1 = JSON.parse((fetch as jest.Mock).mock.calls[0][1].body);
      expect(body1.events[0].name).toBe('payment_initiated');

      await trackPaymentFailedServer('user_123', 'inv_456', 'insufficient_funds');
      const body2 = JSON.parse((fetch as jest.Mock).mock.calls[1][1].body);
      expect(body2.events[0].name).toBe('payment_failed');
    });
  });
});
