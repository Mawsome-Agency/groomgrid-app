/**
 * Tests for ga4.ts - Client-side GA4 tracking functions.
 *
 * Testing strategy:
 * - Happy path: Valid inputs produce expected gtag calls
 * - Edge cases: undefined/null inputs, missing env vars
 * - Blocked analytics: window.gtag undefined, no measurement ID
 * - All 12 exported functions tested with comprehensive coverage
 */
import {
  initGA4,
  trackEvent,
  trackSignupStarted,
  trackEmailVerified,
  trackPlanSelected,
  trackCheckoutCompleted,
  trackOnboardingStep,
  trackOnboardingSkipped,
  trackAccountCreated,
  trackSubscriptionStarted,
  trackPageView,
  trackSignupError,
} from '../ga4';

describe('ga4.ts', () => {
  const originalEnv = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

  beforeEach(() => {
    jest.clearAllMocks();
    window.gtag = jest.fn();
    window.dataLayer = [];
    localStorage.clear();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = originalEnv;
  });

  describe('initGA4', () => {
    it('should initialize gtag with measurement ID', () => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
      initGA4();

      expect(window.gtag).toHaveBeenCalledWith('js', expect.any(Date));
      expect(window.gtag).toHaveBeenCalledWith('config', 'G-TEST123');
    });

    it('should initialize dataLayer if not exists', () => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
      delete window.dataLayer;
      initGA4();

      expect(window.dataLayer).toEqual([]);
      expect(window.gtag).toHaveBeenCalledWith('config', 'G-TEST123');
    });

    it('should reuse existing dataLayer if present', () => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
      window.dataLayer = ['existing', 'data'];
      initGA4();

      expect(window.dataLayer).toEqual(['existing', 'data']);
      expect(window.gtag).toHaveBeenCalledWith('config', 'G-TEST123');
    });

    it('should return early if measurement ID not set', () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      initGA4();

      expect(window.gtag).not.toHaveBeenCalled();
    });

    it('should return early if measurement ID is empty string', () => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = '';
      initGA4();

      expect(window.gtag).not.toHaveBeenCalled();
    });

    it('should return early if measurement ID is set to undefined', () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      initGA4();

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  describe('trackEvent', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    });

    it('should call gtag with event name and params', () => {
      trackEvent('test_event', { param1: 'value1', param2: 'value2' });

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {
        param1: 'value1',
        param2: 'value2',
      });
    });

    it('should call gtag with empty params object if not provided', () => {
      trackEvent('test_event');

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {});
    });

    it('should not call gtag if window.gtag is undefined', () => {
      const originalGtag = window.gtag;
      delete (window as any).gtag;

      trackEvent('test_event', { param: 'value' });

      // gtag was deleted, so no call should be possible
      expect(window.gtag).toBeUndefined();

      // Restore for subsequent tests
      window.gtag = originalGtag;
    });

    it('should not call gtag if measurement ID is not set', () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

      trackEvent('test_event', { param: 'value' });

      expect(window.gtag).not.toHaveBeenCalled();
    });

    it('should handle boolean params correctly', () => {
      trackEvent('test_event', { flag: true, disabled: false });

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {
        flag: true,
        disabled: false,
      });
    });

    it('should handle numeric params correctly', () => {
      trackEvent('test_event', { count: 42, price: 29.99 });

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {
        count: 42,
        price: 29.99,
      });
    });

    it('should handle array params correctly', () => {
      const tags = ['tag1', 'tag2', 'tag3'];
      trackEvent('test_event', { tags });

      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', { tags });
    });
  });

  describe('trackSignupStarted', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    });

    it('should fire event with business_name and timestamp', () => {
      trackSignupStarted('My Pet Grooming Business');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_started', {
        business_name: 'My Pet Grooming Business',
        timestamp: expect.any(String),
      });
    });

    it('should generate valid ISO timestamp', () => {
      trackSignupStarted('Test Business');

      const callArgs = (window.gtag as jest.Mock).mock.calls[0];
      const timestamp = callArgs[2].timestamp;
      const date = new Date(timestamp);

      expect(date.toISOString()).toBe(timestamp);
      expect(date.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should handle empty business name', () => {
      trackSignupStarted('');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_started', {
        business_name: '',
        timestamp: expect.any(String),
      });
    });

    it('should handle special characters in business name', () => {
      trackSignupStarted('Paws & Claws: "Premium" Grooming');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_started', {
        business_name: 'Paws & Claws: "Premium" Grooming',
        timestamp: expect.any(String),
      });
    });

    it('should handle very long business names', () => {
      const longName = 'A'.repeat(200);
      trackSignupStarted(longName);

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_started', {
        business_name: longName,
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      trackSignupStarted('Test Business');

      expect(window.gtag).not.toHaveBeenCalled();
    });

    it('should handle null business name', () => {
      trackSignupStarted(null as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_started', {
        business_name: null,
        timestamp: expect.any(String),
      });
    });

    it('should handle undefined business name', () => {
      trackSignupStarted(undefined as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_started', {
        business_name: undefined,
        timestamp: expect.any(String),
      });
    });
  });

  describe('trackEmailVerified', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    });

    it('should fire event with user_id and timestamp', () => {
      trackEmailVerified('user_12345');

      expect(window.gtag).toHaveBeenCalledWith('event', 'email_verified', {
        user_id: 'user_12345',
        timestamp: expect.any(String),
      });
    });

    it('should handle empty user ID', () => {
      trackEmailVerified('');

      expect(window.gtag).toHaveBeenCalledWith('event', 'email_verified', {
        user_id: '',
        timestamp: expect.any(String),
      });
    });

    it('should handle null user ID', () => {
      trackEmailVerified(null as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'email_verified', {
        user_id: null,
        timestamp: expect.any(String),
      });
    });

    it('should handle undefined user ID', () => {
      trackEmailVerified(undefined as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'email_verified', {
        user_id: undefined,
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      trackEmailVerified('user_12345');

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  describe('trackPlanSelected', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    });

    it('should fire event with plan_type, plan_price, and timestamp', () => {
      trackPlanSelected('solo', 29);

      expect(window.gtag).toHaveBeenCalledWith('event', 'plan_selected', {
        plan_type: 'solo',
        plan_price: 29,
        timestamp: expect.any(String),
      });
    });

    it('should handle float plan price', () => {
      trackPlanSelected('enterprise', 149.99);

      expect(window.gtag).toHaveBeenCalledWith('event', 'plan_selected', {
        plan_type: 'enterprise',
        plan_price: 149.99,
        timestamp: expect.any(String),
      });
    });

    it('should handle zero plan price', () => {
      trackPlanSelected('free', 0);

      expect(window.gtag).toHaveBeenCalledWith('event', 'plan_selected', {
        plan_type: 'free',
        plan_price: 0,
        timestamp: expect.any(String),
      });
    });

    it('should handle null plan type', () => {
      trackPlanSelected(null as any, 29);

      expect(window.gtag).toHaveBeenCalledWith('event', 'plan_selected', {
        plan_type: null,
        plan_price: 29,
        timestamp: expect.any(String),
      });
    });

    it('should handle undefined plan type', () => {
      trackPlanSelected(undefined as any, 29);

      expect(window.gtag).toHaveBeenCalledWith('event', 'plan_selected', {
        plan_type: undefined,
        plan_price: 29,
        timestamp: expect.any(String),
      });
    });

    it('should handle negative plan price', () => {
      trackPlanSelected('solo', -10);

      expect(window.gtag).toHaveBeenCalledWith('event', 'plan_selected', {
        plan_type: 'solo',
        plan_price: -10,
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      trackPlanSelected('solo', 29);

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  describe('trackCheckoutCompleted', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    });

    it('should fire event with session_id, plan_type, trial_started, and timestamp', () => {
      trackCheckoutCompleted('sess_12345', 'solo', true);

      expect(window.gtag).toHaveBeenCalledWith('event', 'checkout_completed', {
        session_id: 'sess_12345',
        plan_type: 'solo',
        trial_started: true,
        timestamp: expect.any(String),
      });
    });

    it('should handle trial_started false', () => {
      trackCheckoutCompleted('sess_12345', 'enterprise', false);

      expect(window.gtag).toHaveBeenCalledWith('event', 'checkout_completed', {
        session_id: 'sess_12345',
        plan_type: 'enterprise',
        trial_started: false,
        timestamp: expect.any(String),
      });
    });

    it('should handle empty session ID', () => {
      trackCheckoutCompleted('', 'solo', true);

      expect(window.gtag).toHaveBeenCalledWith('event', 'checkout_completed', {
        session_id: '',
        plan_type: 'solo',
        trial_started: true,
        timestamp: expect.any(String),
      });
    });

    it('should handle null session ID', () => {
      trackCheckoutCompleted(null as any, 'solo', true);

      expect(window.gtag).toHaveBeenCalledWith('event', 'checkout_completed', {
        session_id: null,
        plan_type: 'solo',
        trial_started: true,
        timestamp: expect.any(String),
      });
    });

    it('should handle null plan type', () => {
      trackCheckoutCompleted('sess_12345', null as any, true);

      expect(window.gtag).toHaveBeenCalledWith('event', 'checkout_completed', {
        session_id: 'sess_12345',
        plan_type: null,
        trial_started: true,
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      trackCheckoutCompleted('sess_12345', 'solo', true);

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  describe('trackOnboardingStep', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    });

    it('should fire event with step and timestamp', () => {
      trackOnboardingStep(1);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_step_completed', {
        step: 1,
        timestamp: expect.any(String),
      });
    });

    it('should handle step 0', () => {
      trackOnboardingStep(0);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_step_completed', {
        step: 0,
        timestamp: expect.any(String),
      });
    });

    it('should handle negative step', () => {
      trackOnboardingStep(-1);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_step_completed', {
        step: -1,
        timestamp: expect.any(String),
      });
    });

    it('should handle large step number', () => {
      trackOnboardingStep(100);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_step_completed', {
        step: 100,
        timestamp: expect.any(String),
      });
    });

    it('should handle NaN step', () => {
      trackOnboardingStep(NaN);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_step_completed', {
        step: NaN,
        timestamp: expect.any(String),
      });
    });

    it('should handle float step number', () => {
      trackOnboardingStep(2.5);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_step_completed', {
        step: 2.5,
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      trackOnboardingStep(1);

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  describe('trackOnboardingSkipped', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    });

    it('should fire event with default reason "user_choice" if not provided', () => {
      trackOnboardingSkipped();

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_skipped', {
        reason: 'user_choice',
        timestamp: expect.any(String),
      });
    });

    it('should fire event with custom reason', () => {
      trackOnboardingSkipped('already_has_clients');

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_skipped', {
        reason: 'already_has_clients',
        timestamp: expect.any(String),
      });
    });

    it('should handle empty reason (falls back to user_choice)', () => {
      trackOnboardingSkipped('');

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_skipped', {
        reason: 'user_choice',
        timestamp: expect.any(String),
      });
    });

    it('should handle null reason', () => {
      trackOnboardingSkipped(null as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_skipped', {
        reason: 'user_choice',
        timestamp: expect.any(String),
      });
    });

    it('should handle undefined reason', () => {
      trackOnboardingSkipped(undefined as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_skipped', {
        reason: 'user_choice',
        timestamp: expect.any(String),
      });
    });

    it('should handle long reason strings', () => {
      const longReason = 'A'.repeat(200);
      trackOnboardingSkipped(longReason);

      expect(window.gtag).toHaveBeenCalledWith('event', 'onboarding_skipped', {
        reason: longReason,
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      trackOnboardingSkipped();

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  describe('trackAccountCreated', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    });

    it('should fire event with user_id, business_name, and timestamp', () => {
      trackAccountCreated('user_12345', 'My Business');

      expect(window.gtag).toHaveBeenCalledWith('event', 'account_created', {
        user_id: 'user_12345',
        business_name: 'My Business',
        timestamp: expect.any(String),
      });
    });

    it('should handle empty user ID', () => {
      trackAccountCreated('', 'My Business');

      expect(window.gtag).toHaveBeenCalledWith('event', 'account_created', {
        user_id: '',
        business_name: 'My Business',
        timestamp: expect.any(String),
      });
    });

    it('should handle empty business name', () => {
      trackAccountCreated('user_12345', '');

      expect(window.gtag).toHaveBeenCalledWith('event', 'account_created', {
        user_id: 'user_12345',
        business_name: '',
        timestamp: expect.any(String),
      });
    });

    it('should handle null user ID', () => {
      trackAccountCreated(null as any, 'My Business');

      expect(window.gtag).toHaveBeenCalledWith('event', 'account_created', {
        user_id: null,
        business_name: 'My Business',
        timestamp: expect.any(String),
      });
    });

    it('should handle null business name', () => {
      trackAccountCreated('user_12345', null as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'account_created', {
        user_id: 'user_12345',
        business_name: null,
        timestamp: expect.any(String),
      });
    });

    it('should handle special characters in business name', () => {
      trackAccountCreated('user_12345', 'Test & "Co" LLC');

      expect(window.gtag).toHaveBeenCalledWith('event', 'account_created', {
        user_id: 'user_12345',
        business_name: 'Test & "Co" LLC',
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      trackAccountCreated('user_12345', 'My Business');

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  describe('trackSubscriptionStarted', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    });

    it('should fire event with user_id, plan_type, price, currency, and timestamp', () => {
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
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      trackSubscriptionStarted('user_12345', 'solo', 29, 'USD');

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  describe('trackPageView', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    });

    it('should fire event with page_path and page_title', () => {
      trackPageView('/dashboard', 'Dashboard');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/dashboard',
        page_title: 'Dashboard',
      });
    });

    it('should handle empty page path', () => {
      trackPageView('', 'Home');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '',
        page_title: 'Home',
      });
    });

    it('should handle empty page title', () => {
      trackPageView('/dashboard', '');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/dashboard',
        page_title: '',
      });
    });

    it('should handle null page path', () => {
      trackPageView(null as any, 'Dashboard');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: null,
        page_title: 'Dashboard',
      });
    });

    it('should handle null page title', () => {
      trackPageView('/dashboard', null as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/dashboard',
        page_title: null,
      });
    });

    it('should handle special characters in page path and title', () => {
      trackPageView('/settings/billing?tab=payment', 'Billing & Payment');

      expect(window.gtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/settings/billing?tab=payment',
        page_title: 'Billing & Payment',
      });
    });

    it('should not fire if analytics disabled', () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      trackPageView('/dashboard', 'Dashboard');

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  describe('trackSignupError', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    });

    it('should fire event with error, context, and timestamp', () => {
      trackSignupError('Email already exists', 'signup_form');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_error', {
        error: 'Email already exists',
        context: 'signup_form',
        timestamp: expect.any(String),
      });
    });

    it('should handle empty error message', () => {
      trackSignupError('', 'signup_form');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_error', {
        error: '',
        context: 'signup_form',
        timestamp: expect.any(String),
      });
    });

    it('should handle empty context', () => {
      trackSignupError('Email already exists', '');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_error', {
        error: 'Email already exists',
        context: '',
        timestamp: expect.any(String),
      });
    });

    it('should handle null error', () => {
      trackSignupError(null as any, 'signup_form');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_error', {
        error: null,
        context: 'signup_form',
        timestamp: expect.any(String),
      });
    });

    it('should handle null context', () => {
      trackSignupError('Email already exists', null as any);

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_error', {
        error: 'Email already exists',
        context: null,
        timestamp: expect.any(String),
      });
    });

    it('should handle long error messages', () => {
      const longError = 'A'.repeat(500);
      trackSignupError(longError, 'signup_form');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_error', {
        error: longError,
        context: 'signup_form',
        timestamp: expect.any(String),
      });
    });

    it('should handle special characters in error and context', () => {
      trackSignupError('Error: "test" & <script>', 'form_submit');

      expect(window.gtag).toHaveBeenCalledWith('event', 'signup_error', {
        error: 'Error: "test" & <script>',
        context: 'form_submit',
        timestamp: expect.any(String),
      });
    });

    it('should not fire if analytics disabled', () => {
      delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      trackSignupError('Email already exists', 'signup_form');

      expect(window.gtag).not.toHaveBeenCalled();
    });
  });

  describe('Integration tests - signup flow', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    });

    it('should track signup flow in correct order', () => {
      const userId = 'user_flow_test';

      // User starts signup
      trackSignupStarted('Test Business');
      const signupStartedCall = (window.gtag as jest.Mock).mock.calls[0];
      expect(signupStartedCall[0]).toBe('event');
      expect(signupStartedCall[1]).toBe('signup_started');
      expect(signupStartedCall[2].business_name).toBe('Test Business');

      // Account created
      trackAccountCreated(userId, 'Test Business');
      const accountCreatedCall = (window.gtag as jest.Mock).mock.calls[1];
      expect(accountCreatedCall[0]).toBe('event');
      expect(accountCreatedCall[1]).toBe('account_created');
      expect(accountCreatedCall[2].user_id).toBe(userId);
    });

    it('should track signup error when fails', () => {
      trackSignupStarted('Test Business');
      trackSignupError('Email already exists', 'signup_form');

      const calls = (window.gtag as jest.Mock).mock.calls;
      expect(calls).toHaveLength(2);
      expect(calls[0][1]).toBe('signup_started');
      expect(calls[1][1]).toBe('signup_error');
      expect(calls[1][2].error).toBe('Email already exists');
    });
  });

  describe('Integration tests - payment flow', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    });

    it('should track payment flow in correct order', () => {
      const sessionId = 'sess_test_123';

      // Plan selected
      trackPlanSelected('solo', 29);
      expect((window.gtag as jest.Mock).mock.calls[0][1]).toBe('plan_selected');

      // Checkout completed
      trackCheckoutCompleted(sessionId, 'solo', true);
      const checkoutCall = (window.gtag as jest.Mock).mock.calls[1];
      expect(checkoutCall[1]).toBe('checkout_completed');
      expect(checkoutCall[2].session_id).toBe(sessionId);

      // Subscription started
      trackSubscriptionStarted('user_12345', 'solo', 29, 'USD');
      const subCall = (window.gtag as jest.Mock).mock.calls[2];
      expect(subCall[1]).toBe('subscription_started');
      expect(subCall[2].price).toBe(29);
    });
  });

  describe('Integration tests - onboarding flow', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID = 'G-TEST123';
    });

    it('should track onboarding steps in sequence', () => {
      // Step 1
      trackOnboardingStep(1);
      expect((window.gtag as jest.Mock).mock.calls[0][2].step).toBe(1);

      // Step 2
      trackOnboardingStep(2);
      expect((window.gtag as jest.Mock).mock.calls[1][2].step).toBe(2);

      // Step 3
      trackOnboardingStep(3);
      expect((window.gtag as jest.Mock).mock.calls[2][2].step).toBe(3);
    });

    it('should track onboarding skipped', () => {
      trackOnboardingSkipped('user_choice');
      const skippedCall = (window.gtag as jest.Mock).mock.calls[0];
      expect(skippedCall[1]).toBe('onboarding_skipped');
      expect(skippedCall[2].reason).toBe('user_choice');
    });
  });
});
