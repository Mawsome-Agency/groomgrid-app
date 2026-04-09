// GA4 Event Tracking
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

// Initialize GA4
export function initGA4() {
  if (!GA4_MEASUREMENT_ID) return;

  window.dataLayer = window.dataLayer || [];

  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA4_MEASUREMENT_ID);
}

// Track event
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && window.gtag && GA4_MEASUREMENT_ID) {
    window.gtag('event', eventName, params);
  }
}

// Funnel events
export function trackSignupStarted(businessName: string) {
  trackEvent('signup_started', {
    business_name: businessName,
    timestamp: new Date().toISOString(),
  });
}

export function trackAccountCreated(userId: string, businessName: string) {
  trackEvent('account_created', {
    user_id: userId,
    business_name: businessName,
    timestamp: new Date().toISOString(),
  });
}

export function trackSignupWelcomeViewed() {
  trackEvent('signup_welcome_viewed', {
    timestamp: new Date().toISOString(),
  });
}

export function trackEmailVerified(userId: string) {
  trackEvent('email_verified', {
    user_id: userId,
    timestamp: new Date().toISOString(),
  });
}

export function trackPlanSelected(planType: string, planPrice: number) {
  trackEvent('plan_selected', {
    plan_type: planType,
    plan_price: planPrice,
    timestamp: new Date().toISOString(),
  });
}

export function trackPlanReviewShown(planType?: string) {
  trackEvent('plan_review_shown', {
    plan_type: planType || 'none',
    timestamp: new Date().toISOString(),
  });
}

export function trackPlanFeaturesExpanded(planId: string, planType: string) {
  trackEvent('plan_features_expanded', {
    plan_id: planId,
    plan_type: planType,
    timestamp: new Date().toISOString(),
  });
}

export function trackCheckoutCompleted(
  sessionId: string,
  planType: string,
  trialStarted: boolean
) {
  trackEvent('checkout_completed', {
    session_id: sessionId,
    plan_type: planType,
    trial_started: trialStarted,
    timestamp: new Date().toISOString(),
  });
}

export function trackOnboardingStepViewed(step: number) {
  trackEvent('onboarding_step_viewed', {
    step,
    timestamp: new Date().toISOString(),
  });
}

export function trackOnboardingStep(step: number) {
  trackEvent('onboarding_step_completed', {
    step,
    timestamp: new Date().toISOString(),
  });
}

export function trackOnboardingSkipped(reason?: string) {
  trackEvent('onboarding_skipped', {
    reason: reason || 'user_choice',
    timestamp: new Date().toISOString(),
  });
}

export function trackPageView(pagePath: string, pageTitle: string) {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
}

export function trackEmptyStateCta(location: string, ctaLabel: string) {
  trackEvent('empty_state_cta_clicked', {
    location,
    cta_label: ctaLabel,
    timestamp: new Date().toISOString(),
  });
}
