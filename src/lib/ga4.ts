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
  const storageKey = `dashboard_first_view_seen_${userId}`;
  const alreadySeen = typeof window !== 'undefined'
    ? localStorage.getItem(storageKey)
    : false;

  if (!alreadySeen) {
    trackEvent('dashboard_first_view', {
      user_id: userId,
      timestamp: new Date().toISOString(),
    });

    if (typeof window !== 'undefined') {
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
