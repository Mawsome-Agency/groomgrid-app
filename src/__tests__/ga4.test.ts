/**
 * Tests for ga4.ts - Client-side GA4 tracking functions.
 *
 * Testing strategy:
 * - Happy path: Valid inputs produce expected gtag calls
 * - Edge cases: undefined/null inputs, missing env vars
 * - Blocked analytics: window.gtag undefined, no measurement ID
 * - All 12 exported functions tested with comprehensive coverage
 *
 * Note: ga4.ts captures NEXT_PUBLIC_GA4_MEASUREMENT_ID at module init time.
 * We use jest.isolateModules() to reload the module with the correct env var
 * state for each test group, ensuring type-checked behavior is verifiable.
 */

// Type-only import for IDE support — actual module loaded per-test via isolateModules
import type * as GA4Module from '../lib/ga4';

// Helper to load the GA4 module with a given measurement ID (or without one)
function loadGA4(measurementId?: string): typeof GA4Module {
  if (measurementId !== undefined) {
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = measurementId;
  } else {
    delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../lib/ga4');
}

describe('ga4.ts', () => {
  beforeEach(() => {
    jest.resetModules();
    window.dataLayer = [];
    window.gtag = jest.fn();
    localStorage.clear();
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  });

  // ─── initGA4 ────────────────────────────────────────────────────────────────

  describe('initGA4', () => {
    it('should initialize gtag with measurement ID', () => {
      const { initGA4 } = loadGA4('G-TEST123');
      initGA4();

      // initGA4 replaces window.gtag with its own function and calls it
      // verify through dataLayer which receives the arguments pushed by the internal gtag
      expect(window.gtag).toBeDefined();
      expect(typeof window.gtag).toBe('function');
      // dataLayer should have received 'js' call and 'config' call
      const dataLayerEntries = Array.from(window.dataLayer as ArrayLike<any>[]);
      expect(dataLayerEntries.some((e) => e[0] === 'js')).toBe(true);
      expect(dataLayerEntries.some((e) => e[0] === 'config' && e[1] === 'G-TEST123')).toBe(true);
    });

    it('should initialize dataLayer if not exists', () => {
      const { initGA4 } = loadGA4('G-TEST123');
      delete (window as any).dataLayer;
      initGA4();

      // initGA4 should have created window.dataLayer
      expect(window.dataLayer).toBeDefined();
      expect(typeof window.gtag).toBe('function');
    });

    it('should reuse existing dataLayer if present', () => {
      const { initGA4 } = loadGA4('G-TEST123');
      window.dataLayer = ['existing' as any, 'data' as any];
      initGA4();

      // initGA4 appends to existing dataLayer rather than replacing it
      expect(window.dataLayer).toEqual(expect.arrayContaining(['existing', 'data']));
    });

    it('should return early if measurement ID not set', () => {
      const { initGA4 } = loadGA4(undefined);
      initGA4();

      expect(window.gtag).not.toHaveBeenCalled();
    });

    it('should return early if measurement ID is empty string', () => {
      const { initGA4 } = loadGA4('');
      initGA4();

      expect(window.gtag).not.toHaveBeenCalled();
    });

    it('should return early if measurement ID is set to undefined', () => {
      const { initGA4 } = loadGA4(undefined);
      initGA4();

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  // ─── trackEvent ─────────────────────────────────────────────────────────────

  describe('trackEvent', () => {
    it('should call gtag with event name and params', () => {
      const { trackEvent } = loadGA4('G-TEST123');
      trackEvent('test_event', { param1: 'value1', param2: 'value2' });

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {
        param1: 'value1',
        param2: 'value2',
      });
    });

    it('should call gtag with empty params object if not provided', () => {
      const { trackEvent } = loadGA4('G-TEST123');
      trackEvent('test_event');

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {});
    });

    it('should not call gtag if window.gtag is undefined', () => {
      const { trackEvent } = loadGA4('G-TEST123');
      delete (window as any).gtag;

      trackEvent('test_event', { param: 'value' });

      expect(window.gtag).toBeUndefined();
    });

    it('should not call gtag if measurement ID is not set', () => {
      const { trackEvent } = loadGA4(undefined);
      trackEvent('test_event', { param: 'value' });

      expect(window.gtag).not.toHaveBeenCalled();
    });

    it('should handle boolean params correctly', () => {
      const { trackEvent } = loadGA4('G-TEST123');
      trackEvent('test_event', { flag: true, disabled: false });

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {
        flag: true,
        disabled: false,
      });
    });

    it('should handle numeric params correctly', () => {
      const { trackEvent } = loadGA4('G-TEST123');
      trackEvent('test_event', { count: 42, price: 29.99 });

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {
        count: 42,
        price: 29.99,
      });
    });

    it('should handle array params correctly', () => {
      const { trackEvent } = loadGA4('G-TEST123');
      const tags = ['tag1', 'tag2', 'tag3'];
      trackEvent('test_event', { tags });

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', { tags });
    });
  });

  // ─── trackSignupStarted ─────────────────────────────────────────────────────

  describe('trackSignupStarted', () => {
    it('should fire event with business_name and timestamp', () => {
      const { trackSignupStarted } = loadGA4('G-TEST123');
      trackSignupStarted('My Pet Grooming Business');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_started', {
        business_name: 'My Pet Grooming Business',
        timestamp: expect.any(String),
      });
    });

    it('should generate valid ISO timestamp', () => {
      const { trackSignupStarted } = loadGA4('G-TEST123');
      trackSignupStarted('Test Business');

      const callArgs = (window.gtag as jest.Mock).mock.calls[0];
      const timestamp = callArgs[2].timestamp;
      const date = new Date(timestamp);

      expect(date.toISOString()).toBe(timestamp);
      expect(date.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should handle empty business name', () => {
      const { trackSignupStarted } = loadGA4('G-TEST123');
      trackSignupStarted('');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_started', {
        business_name: '',
        timestamp: expect.any(String),
      });
    });

    it('should handle special characters in business name', () => {
      const { trackSignupStarted } = loadGA4('G-TEST123');
      trackSignupStarted('Paws & Claws: "Premium" Grooming');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_started', {
        business_name: 'Paws & Claws: "Premium" Grooming',
        timestamp: expect.any(String),
      });
    });

    it('should handle very long business names', () => {
      const { trackSignupStarted } = loadGA4('G-TEST123');
      const longName = 'A'.repeat(200);
      trackSignupStarted(longName);

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_started', {
        business_name: longName,
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      const { trackSignupStarted } = loadGA4(undefined);
      trackSignupStarted('Test Business');

      expect(window.gtag).not.toHaveBeenCalled();
    });

    it('should handle null business name', () => {
      const { trackSignupStarted } = loadGA4('G-TEST123');
      trackSignupStarted(null as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_started', {
        business_name: null,
        timestamp: expect.any(String),
      });
    });

    it('should handle undefined business name', () => {
      const { trackSignupStarted } = loadGA4('G-TEST123');
      trackSignupStarted(undefined as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_started', {
        business_name: undefined,
        timestamp: expect.any(String),
      });
    });
  });

  // ─── trackEmailVerified ─────────────────────────────────────────────────────

  describe('trackEmailVerified', () => {
    it('should fire event with user_id and timestamp', () => {
      const { trackEmailVerified } = loadGA4('G-TEST123');
      trackEmailVerified('user_12345');

      expect(window.gtag).toHaveBeenCalledWith('event', 'email_verified', {
        user_id: 'user_12345',
        timestamp: expect.any(String),
      });
    });

    it('should handle empty user ID', () => {
      const { trackEmailVerified } = loadGA4('G-TEST123');
      trackEmailVerified('');

      expect(window.gtag).toHaveBeenCalledWith('event', 'email_verified', {
        user_id: '',
        timestamp: expect.any(String),
      });
    });

    it('should handle null user ID', () => {
      const { trackEmailVerified } = loadGA4('G-TEST123');
      trackEmailVerified(null as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'email_verified', {
        user_id: null,
        timestamp: expect.any(String),
      });
    });

    it('should handle undefined user ID', () => {
      const { trackEmailVerified } = loadGA4('G-TEST123');
      trackEmailVerified(undefined as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'email_verified', {
        user_id: undefined,
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      const { trackEmailVerified } = loadGA4(undefined);
      trackEmailVerified('user_12345');

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  // ─── trackPlanSelected ──────────────────────────────────────────────────────

  describe('trackPlanSelected', () => {
    it('should fire event with plan_type, plan_price, and timestamp', () => {
      const { trackPlanSelected } = loadGA4('G-TEST123');
      trackPlanSelected('solo', 29);

      expect(window.gtag).toHaveBeenCalledWith('event', 'plan_selected', {
        plan_type: 'solo',
        plan_price: 29,
        timestamp: expect.any(String),
      });
    });

    it('should handle float plan price', () => {
      const { trackPlanSelected } = loadGA4('G-TEST123');
      trackPlanSelected('enterprise', 149.99);

      expect(window.gtag).toHaveBeenCalledWith('event', 'plan_selected', {
        plan_type: 'enterprise',
        plan_price: 149.99,
        timestamp: expect.any(String),
      });
    });

    it('should handle zero plan price', () => {
      const { trackPlanSelected } = loadGA4('G-TEST123');
      trackPlanSelected('free', 0);

      expect(window.gtag).toHaveBeenCalledWith('event', 'plan_selected', {
        plan_type: 'free',
        plan_price: 0,
        timestamp: expect.any(String),
      });
    });

    it('should handle null plan type', () => {
      const { trackPlanSelected } = loadGA4('G-TEST123');
      trackPlanSelected(null as any, 29);

      expect(window.gtag).toHaveBeenCalledWith('event', 'plan_selected', {
        plan_type: null,
        plan_price: 29,
        timestamp: expect.any(String),
      });
    });

    it('should handle undefined plan type', () => {
      const { trackPlanSelected } = loadGA4('G-TEST123');
      trackPlanSelected(undefined as any, 29);

      expect(window.gtag).toHaveBeenCalledWith('event', 'plan_selected', {
        plan_type: undefined,
        plan_price: 29,
        timestamp: expect.any(String),
      });
    });

    it('should handle negative plan price', () => {
      const { trackPlanSelected } = loadGA4('G-TEST123');
      trackPlanSelected('solo', -10);

      expect(window.gtag).toHaveBeenCalledWith('event', 'plan_selected', {
        plan_type: 'solo',
        plan_price: -10,
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      const { trackPlanSelected } = loadGA4(undefined);
      trackPlanSelected('solo', 29);

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  // ─── trackCheckoutCompleted ─────────────────────────────────────────────────

  describe('trackCheckoutCompleted', () => {
    it('should fire event with session_id, plan_type, trial_started, and timestamp', () => {
      const { trackCheckoutCompleted } = loadGA4('G-TEST123');
      trackCheckoutCompleted('sess_12345', 'solo', true);

      expect(window.gtag).toHaveBeenCalledWith('event', 'checkout_completed', {
        session_id: 'sess_12345',
        plan_type: 'solo',
        trial_started: true,
        timestamp: expect.any(String),
      });
    });

    it('should handle trial_started false', () => {
      const { trackCheckoutCompleted } = loadGA4('G-TEST123');
      trackCheckoutCompleted('sess_12345', 'enterprise', false);

      expect(window.gtag).toHaveBeenCalledWith('event', 'checkout_completed', {
        session_id: 'sess_12345',
        plan_type: 'enterprise',
        trial_started: false,
        timestamp: expect.any(String),
      });
    });

    it('should handle empty session ID', () => {
      const { trackCheckoutCompleted } = loadGA4('G-TEST123');
      trackCheckoutCompleted('', 'solo', true);

      expect(window.gtag).toHaveBeenCalledWith('event', 'checkout_completed', {
        session_id: '',
        plan_type: 'solo',
        trial_started: true,
        timestamp: expect.any(String),
      });
    });

    it('should handle null session ID', () => {
      const { trackCheckoutCompleted } = loadGA4('G-TEST123');
      trackCheckoutCompleted(null as any, 'solo', true);

      expect(window.gtag).toHaveBeenCalledWith('event', 'checkout_completed', {
        session_id: null,
        plan_type: 'solo',
        trial_started: true,
        timestamp: expect.any(String),
      });
    });

    it('should handle null plan type', () => {
      const { trackCheckoutCompleted } = loadGA4('G-TEST123');
      trackCheckoutCompleted('sess_12345', null as any, true);

      expect(window.gtag).toHaveBeenCalledWith('event', 'checkout_completed', {
        session_id: 'sess_12345',
        plan_type: null,
        trial_started: true,
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      const { trackCheckoutCompleted } = loadGA4(undefined);
      trackCheckoutCompleted('sess_12345', 'solo', true);

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  // ─── trackOnboardingStep ────────────────────────────────────────────────────

  describe('trackOnboardingStep', () => {
    it('should fire event with step and timestamp', () => {
      const { trackOnboardingStep } = loadGA4('G-TEST123');
      trackOnboardingStep(1);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_step_completed', {
        step: 1,
        timestamp: expect.any(String),
      });
    });

    it('should handle step 0', () => {
      const { trackOnboardingStep } = loadGA4('G-TEST123');
      trackOnboardingStep(0);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_step_completed', {
        step: 0,
        timestamp: expect.any(String),
      });
    });

    it('should handle negative step', () => {
      const { trackOnboardingStep } = loadGA4('G-TEST123');
      trackOnboardingStep(-1);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_step_completed', {
        step: -1,
        timestamp: expect.any(String),
      });
    });

    it('should handle large step number', () => {
      const { trackOnboardingStep } = loadGA4('G-TEST123');
      trackOnboardingStep(100);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_step_completed', {
        step: 100,
        timestamp: expect.any(String),
      });
    });

    it('should handle NaN step', () => {
      const { trackOnboardingStep } = loadGA4('G-TEST123');
      trackOnboardingStep(NaN);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_step_completed', {
        step: NaN,
        timestamp: expect.any(String),
      });
    });

    it('should handle float step number', () => {
      const { trackOnboardingStep } = loadGA4('G-TEST123');
      trackOnboardingStep(2.5);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_step_completed', {
        step: 2.5,
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      const { trackOnboardingStep } = loadGA4(undefined);
      trackOnboardingStep(1);

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  // ─── trackOnboardingSkipped ─────────────────────────────────────────────────

  describe('trackOnboardingSkipped', () => {
    it('should fire event with default reason "user_choice" if not provided', () => {
      const { trackOnboardingSkipped } = loadGA4('G-TEST123');
      trackOnboardingSkipped();

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_skipped', {
        reason: 'user_choice',
        timestamp: expect.any(String),
      });
    });

    it('should fire event with custom reason', () => {
      const { trackOnboardingSkipped } = loadGA4('G-TEST123');
      trackOnboardingSkipped('already_has_clients');

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_skipped', {
        reason: 'already_has_clients',
        timestamp: expect.any(String),
      });
    });

    it('should handle empty reason (falls back to user_choice)', () => {
      const { trackOnboardingSkipped } = loadGA4('G-TEST123');
      trackOnboardingSkipped('');

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_skipped', {
        reason: 'user_choice',
        timestamp: expect.any(String),
      });
    });

    it('should handle null reason', () => {
      const { trackOnboardingSkipped } = loadGA4('G-TEST123');
      trackOnboardingSkipped(null as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_skipped', {
        reason: 'user_choice',
        timestamp: expect.any(String),
      });
    });

    it('should handle undefined reason', () => {
      const { trackOnboardingSkipped } = loadGA4('G-TEST123');
      trackOnboardingSkipped(undefined as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_skipped', {
        reason: 'user_choice',
        timestamp: expect.any(String),
      });
    });

    it('should handle long reason strings', () => {
      const { trackOnboardingSkipped } = loadGA4('G-TEST123');
      const longReason = 'A'.repeat(200);
      trackOnboardingSkipped(longReason);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_skipped', {
        reason: longReason,
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      const { trackOnboardingSkipped } = loadGA4(undefined);
      trackOnboardingSkipped();

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  // ─── trackAccountCreated ────────────────────────────────────────────────────

  describe('trackAccountCreated', () => {
    it('should fire event with user_id, business_name, and timestamp', () => {
      const { trackAccountCreated } = loadGA4('G-TEST123');
      trackAccountCreated('user_12345', 'My Business');

      expect(window.gtag).toHaveBeenCalledWith('event', 'account_created', {
        user_id: 'user_12345',
        business_name: 'My Business',
        timestamp: expect.any(String),
      });
    });

    it('should handle empty user ID', () => {
      const { trackAccountCreated } = loadGA4('G-TEST123');
      trackAccountCreated('', 'My Business');

      expect(window.gtag).toHaveBeenCalledWith('event', 'account_created', {
        user_id: '',
        business_name: 'My Business',
        timestamp: expect.any(String),
      });
    });

    it('should handle empty business name', () => {
      const { trackAccountCreated } = loadGA4('G-TEST123');
      trackAccountCreated('user_12345', '');

      expect(window.gtag).toHaveBeenCalledWith('event', 'account_created', {
        user_id: 'user_12345',
        business_name: '',
        timestamp: expect.any(String),
      });
    });

    it('should handle null user ID', () => {
      const { trackAccountCreated } = loadGA4('G-TEST123');
      trackAccountCreated(null as any, 'My Business');

      expect(window.gtag).toHaveBeenCalledWith('event', 'account_created', {
        user_id: null,
        business_name: 'My Business',
        timestamp: expect.any(String),
      });
    });

    it('should handle null business name', () => {
      const { trackAccountCreated } = loadGA4('G-TEST123');
      trackAccountCreated('user_12345', null as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'account_created', {
        user_id: 'user_12345',
        business_name: null,
        timestamp: expect.any(String),
      });
    });

    it('should handle special characters in business name', () => {
      const { trackAccountCreated } = loadGA4('G-TEST123');
      trackAccountCreated('user_12345', 'Test & "Co" LLC');

      expect(window.gtag).toHaveBeenCalledWith('event', 'account_created', {
        user_id: 'user_12345',
        business_name: 'Test & "Co" LLC',
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      const { trackAccountCreated } = loadGA4(undefined);
      trackAccountCreated('user_12345', 'My Business');

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  // ─── trackSubscriptionStarted ───────────────────────────────────────────────

  describe('trackSubscriptionStarted', () => {
    it('should fire event with user_id, plan_type, price, currency, and timestamp', () => {
      const { trackSubscriptionStarted } = loadGA4('G-TEST123');
      trackSubscriptionStarted('user_12345', 'solo', 29, 'USD');

      expect(window.gtag).toHaveBeenCalledWith('event', 'subscription_started', {
        user_id: 'user_12345',
        plan_type: 'solo',
        price: 29,
        currency: 'USD',
        timestamp: expect.any(String),
      });
    });

    it('should use default currency USD if not provided', () => {
      const { trackSubscriptionStarted } = loadGA4('G-TEST123');
      trackSubscriptionStarted('user_12345', 'enterprise', 149);

      expect(window.gtag).toHaveBeenCalledWith('event', 'subscription_started', {
        user_id: 'user_12345',
        plan_type: 'enterprise',
        price: 149,
        currency: 'USD',
        timestamp: expect.any(String),
      });
    });

    it('should handle custom currency', () => {
      const { trackSubscriptionStarted } = loadGA4('G-TEST123');
      trackSubscriptionStarted('user_12345', 'salon', 79, 'EUR');

      expect(window.gtag).toHaveBeenCalledWith('event', 'subscription_started', {
        user_id: 'user_12345',
        plan_type: 'salon',
        price: 79,
        currency: 'EUR',
        timestamp: expect.any(String),
      });
    });

    it('should handle float price', () => {
      const { trackSubscriptionStarted } = loadGA4('G-TEST123');
      trackSubscriptionStarted('user_12345', 'solo', 29.99, 'USD');

      expect(window.gtag).toHaveBeenCalledWith('event', 'subscription_started', {
        user_id: 'user_12345',
        plan_type: 'solo',
        price: 29.99,
        currency: 'USD',
        timestamp: expect.any(String),
      });
    });

    it('should handle zero price', () => {
      const { trackSubscriptionStarted } = loadGA4('G-TEST123');
      trackSubscriptionStarted('user_12345', 'free', 0, 'USD');

      expect(window.gtag).toHaveBeenCalledWith('event', 'subscription_started', {
        user_id: 'user_12345',
        plan_type: 'free',
        price: 0,
        currency: 'USD',
        timestamp: expect.any(String),
      });
    });

    it('should handle negative price', () => {
      const { trackSubscriptionStarted } = loadGA4('G-TEST123');
      trackSubscriptionStarted('user_12345', 'solo', -10, 'USD');

      expect(window.gtag).toHaveBeenCalledWith('event', 'subscription_started', {
        user_id: 'user_12345',
        plan_type: 'solo',
        price: -10,
        currency: 'USD',
        timestamp: expect.any(String),
      });
    });

    it('should handle null user ID', () => {
      const { trackSubscriptionStarted } = loadGA4('G-TEST123');
      trackSubscriptionStarted(null as any, 'solo', 29, 'USD');

      expect(window.gtag).toHaveBeenCalledWith('event', 'subscription_started', {
        user_id: null,
        plan_type: 'solo',
        price: 29,
        currency: 'USD',
        timestamp: expect.any(String),
      });
    });

    it('should handle null plan type', () => {
      const { trackSubscriptionStarted } = loadGA4('G-TEST123');
      trackSubscriptionStarted('user_12345', null as any, 29, 'USD');

      expect(window.gtag).toHaveBeenCalledWith('event', 'subscription_started', {
        user_id: 'user_12345',
        plan_type: null,
        price: 29,
        currency: 'USD',
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      const { trackSubscriptionStarted } = loadGA4(undefined);
      trackSubscriptionStarted('user_12345', 'solo', 29, 'USD');

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  // ─── trackPageView ──────────────────────────────────────────────────────────

  describe('trackPageView', () => {
    it('should fire event with page_path and page_title', () => {
      const { trackPageView } = loadGA4('G-TEST123');
      trackPageView('/dashboard', 'Dashboard');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/dashboard',
        page_title: 'Dashboard',
      });
    });

    it('should handle empty page path', () => {
      const { trackPageView } = loadGA4('G-TEST123');
      trackPageView('', 'Home');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '',
        page_title: 'Home',
      });
    });

    it('should handle empty page title', () => {
      const { trackPageView } = loadGA4('G-TEST123');
      trackPageView('/dashboard', '');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/dashboard',
        page_title: '',
      });
    });

    it('should handle null page path', () => {
      const { trackPageView } = loadGA4('G-TEST123');
      trackPageView(null as any, 'Dashboard');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: null,
        page_title: 'Dashboard',
      });
    });

    it('should handle null page title', () => {
      const { trackPageView } = loadGA4('G-TEST123');
      trackPageView('/dashboard', null as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/dashboard',
        page_title: null,
      });
    });

    it('should handle special characters in page path and title', () => {
      const { trackPageView } = loadGA4('G-TEST123');
      trackPageView('/settings/billing?tab=payment', 'Billing & Payment');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/settings/billing?tab=payment',
        page_title: 'Billing & Payment',
      });
    });

    it('should not fire if analytics disabled', () => {
      const { trackPageView } = loadGA4(undefined);
      trackPageView('/dashboard', 'Dashboard');

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  // ─── trackSignupError ───────────────────────────────────────────────────────

  describe('trackSignupError', () => {
    it('should fire event with error, context, and timestamp', () => {
      const { trackSignupError } = loadGA4('G-TEST123');
      trackSignupError('Email already exists', 'signup_form');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_error', {
        error: 'Email already exists',
        context: 'signup_form',
        timestamp: expect.any(String),
      });
    });

    it('should handle empty error message', () => {
      const { trackSignupError } = loadGA4('G-TEST123');
      trackSignupError('', 'signup_form');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_error', {
        error: '',
        context: 'signup_form',
        timestamp: expect.any(String),
      });
    });

    it('should handle empty context', () => {
      const { trackSignupError } = loadGA4('G-TEST123');
      trackSignupError('Email already exists', '');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_error', {
        error: 'Email already exists',
        context: '',
        timestamp: expect.any(String),
      });
    });

    it('should handle null error', () => {
      const { trackSignupError } = loadGA4('G-TEST123');
      trackSignupError(null as any, 'signup_form');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_error', {
        error: null,
        context: 'signup_form',
        timestamp: expect.any(String),
      });
    });

    it('should handle null context', () => {
      const { trackSignupError } = loadGA4('G-TEST123');
      trackSignupError('Email already exists', null as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_error', {
        error: 'Email already exists',
        context: null,
        timestamp: expect.any(String),
      });
    });

    it('should handle long error messages', () => {
      const { trackSignupError } = loadGA4('G-TEST123');
      const longError = 'A'.repeat(500);
      trackSignupError(longError, 'signup_form');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_error', {
        error: longError,
        context: 'signup_form',
        timestamp: expect.any(String),
      });
    });

    it('should handle special characters in error and context', () => {
      const { trackSignupError } = loadGA4('G-TEST123');
      trackSignupError('Error: "test" & <script>', 'form_submit');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_error', {
        error: 'Error: "test" & <script>',
        context: 'form_submit',
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      const { trackSignupError } = loadGA4(undefined);
      trackSignupError('Email already exists', 'signup_form');

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  // ─── Integration: signup flow ────────────────────────────────────────────────

  describe('Integration tests - signup flow', () => {
    it('should track signup flow in correct order', () => {
      const { trackSignupStarted, trackAccountCreated } = loadGA4('G-TEST123');
      const userId = 'user_flow_test';

      trackSignupStarted('Test Business');
      const signupStartedCall = (window.gtag as jest.Mock).mock.calls[0];
      expect(signupStartedCall[0]).toBe('event');
      expect(signupStartedCall[1]).toBe('signup_started');
      expect(signupStartedCall[2].business_name).toBe('Test Business');

      trackAccountCreated(userId, 'Test Business');
      const accountCreatedCall = (window.gtag as jest.Mock).mock.calls[1];
      expect(accountCreatedCall[0]).toBe('event');
      expect(accountCreatedCall[1]).toBe('account_created');
      expect(accountCreatedCall[2].user_id).toBe(userId);
    });

    it('should track signup error when fails', () => {
      const { trackSignupStarted, trackSignupError } = loadGA4('G-TEST123');

      trackSignupStarted('Test Business');
      trackSignupError('Email already exists', 'signup_form');

      const calls = (window.gtag as jest.Mock).mock.calls;
      expect(calls).toHaveLength(2);
      expect(calls[0][1]).toBe('signup_started');
      expect(calls[1][1]).toBe('signup_error');
      expect(calls[1][2].error).toBe('Email already exists');
    });
  });

  // ─── Integration: payment flow ───────────────────────────────────────────────

  describe('Integration tests - payment flow', () => {
    it('should track payment flow in correct order', () => {
      const { trackPlanSelected, trackCheckoutCompleted, trackSubscriptionStarted } =
        loadGA4('G-TEST123');
      const sessionId = 'sess_test_123';

      trackPlanSelected('solo', 29);
      expect((window.gtag as jest.Mock).mock.calls[0][1]).toBe('plan_selected');

      trackCheckoutCompleted(sessionId, 'solo', true);
      const checkoutCall = (window.gtag as jest.Mock).mock.calls[1];
      expect(checkoutCall[1]).toBe('checkout_completed');
      expect(checkoutCall[2].session_id).toBe(sessionId);

      trackSubscriptionStarted('user_12345', 'solo', 29, 'USD');
      const subCall = (window.gtag as jest.Mock).mock.calls[2];
      expect(subCall[1]).toBe('subscription_started');
      expect(subCall[2].price).toBe(29);
    });
  });

  // ─── Integration: onboarding flow ───────────────────────────────────────────

  describe('Integration tests - onboarding flow', () => {
    it('should track onboarding steps in sequence', () => {
      const { trackOnboardingStep } = loadGA4('G-TEST123');

      trackOnboardingStep(1);
      expect((window.gtag as jest.Mock).mock.calls[0][2].step).toBe(1);

      trackOnboardingStep(2);
      expect((window.gtag as jest.Mock).mock.calls[1][2].step).toBe(2);

      trackOnboardingStep(3);
      expect((window.gtag as jest.Mock).mock.calls[2][2].step).toBe(3);
    });

    it('should track onboarding skipped', () => {
      const { trackOnboardingSkipped } = loadGA4('G-TEST123');
      trackOnboardingSkipped('user_choice');

      const skippedCall = (window.gtag as jest.Mock).mock.calls[0];
      expect(skippedCall[1]).toBe('onboarding_skipped');
      expect(skippedCall[2].reason).toBe('user_choice');
    });
  });
});
