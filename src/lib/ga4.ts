// GA4 Event Tracking
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Read measurement ID dynamically so per-test env var overrides take effect
function getMeasurementId() {
  return process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
}

// Initialize GA4
export function initGA4() {
  const measurementId = getMeasurementId();
  if (!measurementId) return;

  window.dataLayer = window.dataLayer || [];

  // Preserve existing gtag (e.g. jest.fn() in tests, or real GA snippet in prod)
  window.gtag = window.gtag || function gtag() {
    window.dataLayer?.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId);
}

// Track event
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && window.gtag && getMeasurementId()) {
    window.gtag('event', eventName, params);
  }
}

// Posts a pre-signup funnel event to the local analytics endpoint alongside GA4.
// Fire-and-forget — analytics errors never break the UX.
// Uses sessionStorage to maintain a consistent session ID across the funnel
// so pre-signup events can be stitched to the eventual signup event.
function postToLocalTrack(eventName: string, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const key = 'gg_session_id';
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(key, sessionId);
  }
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ eventName, properties: properties ?? {}, sessionId }),
  }).catch(() => {}); // non-critical — never surface analytics errors to users
}

// Funnel events

// Fires when user lands on /signup page (page load, not form submit)
export function trackSignupViewed() {
  trackEvent('signup_started');
  postToLocalTrack('signup_viewed');
}

// Fires on successful POST /api/auth/signup response
export function trackSignupCompleted(userId: string, attribution?: Record<string, any>) {
  const params: Record<string, any> = {
    user_id: userId,
  };
  if (attribution?.utm_source) params.utm_source = attribution.utm_source;
  if (attribution?.utm_campaign) params.utm_campaign = attribution.utm_campaign;
  if (attribution?.utm_medium) params.utm_medium = attribution.utm_medium;
  trackEvent('signup_completed', params);
}

// Fires when user lands on /plans page (once per mount)
export function trackPlanViewed() {
  trackEvent('plan_viewed');
}

// Fires when user clicks a paid plan CTA
export function trackCheckoutStarted(planName: string, planPrice: number) {
  trackEvent('checkout_started', {
    plan_name: planName,
    plan_price: planPrice,
  });
}

export function trackSignupStarted(businessName: string) {
  trackEvent('signup_started', {
    business_name: businessName,
    timestamp: new Date().toISOString(),
  });
  postToLocalTrack('signup_started', { business_name: businessName });
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

export function trackAccountCreated(userId: string, businessName: string, attribution?: Record<string, any>) {
  const params: Record<string, any> = {
    user_id: userId,
    business_name: businessName,
    timestamp: new Date().toISOString(),
  };
  if (attribution?.utm_source) params.utm_source = attribution.utm_source;
  if (attribution?.utm_campaign) params.utm_campaign = attribution.utm_campaign;
  if (attribution?.utm_medium) params.utm_medium = attribution.utm_medium;
  trackEvent('account_created', params);
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

export function trackWelcomeViewed(userId: string, businessName: string) {
  trackEvent('welcome_viewed', {
    user_id: userId,
    business_name: businessName,
    timestamp: new Date().toISOString(),
  });
}

export function trackSignupError(error: string, context: string) {
  trackEvent('signup_error', {
    error,
    context,
    timestamp: new Date().toISOString(),
  });
}

// Payment page view event - tracks when user reaches checkout success page
export function trackPaymentPageView(context: string, planType?: string) {
  trackEvent('payment_page_view', {
    context,
    plan_type: planType || 'unknown',
    timestamp: new Date().toISOString(),
  });
}

// Onboarding completed event - one-time event when user finishes onboarding
// Use useRef in component to prevent duplicate fires from React strict mode
export function trackOnboardingCompleted(userId: string) {
  trackEvent('onboarding_completed', {
    user_id: userId,
    timestamp: new Date().toISOString(),
  });
}

// Dashboard first view event - one-time event when user first sees dashboard
// Uses localStorage to prevent re-fires (key is userId-prefixed)
export function trackDashboardFirstView(userId: string) {
  if (!getMeasurementId()) return;

  const storageKey = `dashboard_first_view_seen_${userId}`;
  const hasStorage = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  const alreadySeen = hasStorage ? localStorage.getItem(storageKey) : false;

  if (!alreadySeen) {
    trackEvent('dashboard_first_view', {
      user_id: userId,
      timestamp: new Date().toISOString(),
    });

    if (hasStorage) {
      localStorage.setItem(storageKey, 'true');
    }
  }
}

// Trust signal tracking events
export function trackTrustBadgeInteracted(badgeType: 'pci' | 'cancel_anytime' | 'secure_header', location: 'plans' | 'success' | 'billing') {
  trackEvent('trust_badge_interacted', { badge_type: badgeType, location, timestamp: new Date().toISOString() });
}

export function trackBillingSummaryViewed(planName: string, amount: number, isTrial: boolean) {
  trackEvent('billing_summary_viewed', {
    plan_name: planName,
    amount,
    is_trial: isTrial,
    timestamp: new Date().toISOString()
  });
}

export function trackFaqOpened(faqType: string) {
  trackEvent('faq_opened', { faq_type: faqType, timestamp: new Date().toISOString() });
}

export function trackABTestAssigned(testName: string, variant: 'A' | 'B', userId?: string) {
  trackEvent('ab_test_assigned', {
    test_name: testName,
    variant,
    user_id: userId,
    timestamp: new Date().toISOString(),
  });
}

export function trackABTestConverted(testName: string, variant: 'A' | 'B', event: string, userId?: string) {
  trackEvent('ab_test_converted', {
    test_name: testName,
    variant,
    conversion_event: event,
    user_id: userId,
    timestamp: new Date().toISOString(),
  });
}

// Get GA4 Client ID from cookie
export function getGA4ClientId(): string | null {
  if (typeof window === 'undefined') return null;
  
  const gaCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('_ga='));
    
  if (!gaCookie) return null;
  
  // _ga cookie format: _ga=GA1.2.1234567890.1234567890
  // We want the client ID: 1234567890.1234567890
  const gaParts = gaCookie.split('=');
  if (gaParts.length !== 2) return null;
  
  const gaValue = gaParts[1];
  const clientIdParts = gaValue.split('.');
  if (clientIdParts.length < 4) return null;
  
  // Return the last two parts joined by a period (client ID)
  return `${clientIdParts[2]}.${clientIdParts[3]}`;
}

// ============================================================================
// BOFU (Bottom of Funnel) Comparison Page Analytics
// ============================================================================

/**
 * Track when a user views a BOFU comparison page
 * @param pageType - Type of BOFU page (e.g., 'mobile-grooming-business', 'grooming-business-operations')
 * @param referrer - Where the user came from (if available)
 */
export function trackBofuPageViewed(pageType: string, referrer?: string) {
  trackEvent('bofu_page_viewed', {
    page_type: pageType,
    referrer: referrer || 'direct',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track scroll depth milestones on BOFU pages
 * @param pageType - Type of BOFU page
 * @param depthPercentage - Scroll depth reached (25, 50, 75, 100)
 */
export function trackBofuScrollDepth(pageType: string, depthPercentage: number) {
  trackEvent('bofu_scroll_depth', {
    page_type: pageType,
    depth_percentage: depthPercentage,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track when a user views a specific section on a BOFU page
 * @param pageType - Type of BOFU page
 * @param sectionId - ID of the section viewed
 * @param sectionTitle - Human-readable title of the section
 */
export function trackBofuSectionViewed(pageType: string, sectionId: string, sectionTitle: string) {
  trackEvent('bofu_section_viewed', {
    page_type: pageType,
    section_id: sectionId,
    section_title: sectionTitle,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track time spent on a BOFU page
 * @param pageType - Type of BOFU page
 * @param timeSpentMs - Time spent in milliseconds
 * @param sectionsViewed - Number of sections viewed
 */
export function trackBofuEngagementTime(pageType: string, timeSpentMs: number, sectionsViewed: number) {
  trackEvent('bofu_engagement_time', {
    page_type: pageType,
    time_spent_ms: timeSpentMs,
    time_spent_seconds: Math.round(timeSpentMs / 1000),
    sections_viewed: sectionsViewed,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track CTA clicks on BOFU pages
 * @param pageType - Type of BOFU page
 * @param ctaType - Type of CTA (e.g., 'see_plans', 'start_trial', 'learn_more')
 * @param ctaLocation - Location of CTA on page (e.g., 'hero', 'footer', 'inline')
 * @param sectionId - Section where CTA was clicked (if applicable)
 */
export function trackBofuCtaClick(
  pageType: string,
  ctaType: string,
  ctaLocation: string,
  sectionId?: string
) {
  trackEvent('bofu_cta_click', {
    page_type: pageType,
    cta_type: ctaType,
    cta_location: ctaLocation,
    section_id: sectionId || null,
    timestamp: new Date().toISOString(),
  });
}
