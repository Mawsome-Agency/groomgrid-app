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

export function trackAccountCreated(userId: string, businessName: string) {
  trackEvent('account_created', {
    user_id: userId,
    business_name: businessName,
    timestamp: new Date().toISOString(),
  });
}

export function trackSubscriptionStarted(
  userId: string,
  planType: string,
  price: number,
  currency: string = 'USD'
) {
  trackEvent('subscription_started', {
    user_id: userId,
    plan_type: planType,
    price: price,
    currency: currency,
    timestamp: new Date().toISOString(),
  });
}

export function trackPageView(pagePath: string, pageTitle: string) {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
}

// ── Funnel Analysis Tracking ─────────────────────────────────────────────────

/**
 * Get or create a session ID for funnel tracking
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'gg_session_id';
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

/**
 * Track field validation error
 */
export function trackValidationError(
  fieldName: string,
  errorType: string,
  errorMessage: string
) {
  trackEvent('field_validation_error', {
    field_name: fieldName,
    error_type: errorType,
    error_message: errorMessage,
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track API timing (client-side)
 */
export function trackApiTiming(
  apiEndpoint: string,
  durationMs: number,
  success: boolean,
  errorType?: string
) {
  trackEvent('api_timing', {
    api_endpoint: apiEndpoint,
    duration_ms: durationMs,
    success,
    error_type: errorType || null,
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track funnel exit (when user abandons)
 */
export function trackFunnelExit(
  stage: string,
  exitPoint: string,
  reason?: string
) {
  trackEvent('funnel_exit', {
    stage,
    exit_point: exitPoint,
    reason: reason || 'unknown',
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track payment gateway failure
 */
export function trackPaymentFailure(
  errorType: string,
  declineCode?: string,
  errorMessage?: string
) {
  trackEvent('payment_failure', {
    error_type: errorType,
    decline_code: declineCode || null,
    error_message: errorMessage || null,
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track step duration
 */
export function trackStepDuration(
  stepName: string,
  stepNumber: number,
  durationMs: number
) {
  trackEvent('step_duration', {
    step_name: stepName,
    step_number: stepNumber,
    duration_ms: durationMs,
    session_id: getSessionId(),
    timestamp: new Date().toISOString(),
  });
}
