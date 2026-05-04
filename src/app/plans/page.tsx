'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signOut, SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import Script from 'next/script';
import Link from 'next/link';
import { Plan } from '@/types';
import { PLANS, TESTIMONIALS, FAQ_ITEMS } from '@/app/pricing/pricing-data';
import PlanCard from '@/components/funnel/PlanCard';
import PricingCarousel from '@/components/funnel/PricingCarousel';
import TrustSignals from '@/components/trust/TrustSignals';
import StickyPlanBar from '@/components/funnel/StickyPlanBar';
import { BillingSummaryData } from '@/components/trust/BillingSummary';
import SiteFooter from '@/components/marketing/SiteFooter';
import { trackPageView, trackPlanViewed, trackPlanSelected, trackCheckoutStarted, trackBillingSummaryViewed } from '@/lib/ga4';

/** Schema.org SoftwareApplication + OfferCatalog structured data */
const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'GroomGrid',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'AI-powered pet grooming business management — scheduling, client records, automated reminders, and payments.',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '29',
    highPrice: '149',
    priceCurrency: 'USD',
    offerCount: PLANS.length,
  },
};

const offerCatalogSchema = {
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: 'GroomGrid Pricing Plans',
  itemListElement: PLANS.map((plan, i) => ({
    '@type': 'Offer',
    position: i + 1,
    name: plan.name,
    price: plan.price,
    priceCurrency: 'USD',
    description: plan.features.join(', '),
  })),
};

function PlansSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-8 w-48 bg-stone-200 rounded animate-pulse mx-auto mb-4" />
        <div className="h-5 w-64 bg-stone-200 rounded animate-pulse mx-auto mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-stone-200 p-6 animate-pulse">
              <div className="h-6 w-24 bg-stone-200 rounded mx-auto mb-4" />
              <div className="h-10 w-20 bg-stone-200 rounded mx-auto mb-2" />
              <div className="h-4 w-32 bg-stone-200 rounded mx-auto mb-6" />
              <div className="space-y-3">
                {[0, 1, 2, 3].map((j) => (
                  <div key={j} className="h-4 bg-stone-200 rounded" />
                ))}
              </div>
              <div className="h-12 bg-stone-200 rounded-xl mt-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Known promo codes — labels and discount info for the UI.
// Unknown codes are still passed to Stripe (which validates them server-side).
const KNOWN_PROMO_CODES: Record<string, { label: string; discount: string; description: string }> = {
  BETA50: {
    label: 'BETA50',
    discount: '50% off first month',
    description: 'Launch pricing — lock in $14.50/mo for Solo Groomer',
  },
  GROOMERFOUNDING: {
    label: 'GROOMERFOUNDING',
    discount: '100% off — FREE forever',
    description: 'Founding Member — free for life. Our thank-you for being an early believer.',
  },
};

function PlansPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  // useState (not useRef) so mutations trigger re-renders and the loading UI actually shows
  const [isCheckoutInFlight, setIsCheckoutInFlight] = useState<boolean>(false);
  const planGridRef = useRef<HTMLDivElement>(null);
  const planViewedFiredRef = useRef(false);
  const [isOnTrial, setIsOnTrial] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<Date | null>(null);

  const coupon = searchParams.get('coupon') || undefined;

  // Promo code input state
  const [promoInput, setPromoInput] = useState(coupon || '');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(coupon || null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoError('Enter a promo code');
      return;
    }
    // Apply the code — Stripe validates server-side on checkout
    setAppliedPromo(code);
    setPromoError(null);
    // Update URL search params so coupon persists through navigation
    const params = new URLSearchParams(searchParams.toString());
    params.set('coupon', code);
    router.replace(`/plans?${params.toString()}`, { scroll: false });
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('coupon');
    router.replace(`/plans?${params.toString() || ''}`, { scroll: false });
  };

  // Sync coupon param with promo state
  const effectiveCoupon = appliedPromo || coupon;

  // Get billing summary data for selected plan
  const getBillingData = (): BillingSummaryData | null => {
    if (!selectedPlan) return null;

    const promoInfo = effectiveCoupon ? KNOWN_PROMO_CODES[effectiveCoupon] : null;

    return {
      planName: selectedPlan.name,
      todayAmount: 0, // Trial is free
      recurringAmount: selectedPlan.price * 100, // Convert to cents
      currency: "$",
      isTrial: true,
      trialDays: 14,
      promoCode: effectiveCoupon || undefined,
      promoDescription: promoInfo?.description,
    };
  };

  // Fetch profile to determine trial status for authenticated users
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          const profile = data.profile;
          const isTrial = profile?.subscriptionStatus === 'trial';
          const endsAt = profile?.trialEndsAt ? new Date(profile.trialEndsAt) : null;
          const isActive = isTrial && endsAt && endsAt > new Date();
          setIsOnTrial(!!isActive);
          setTrialEndsAt(endsAt);
        } else {
          // Profile fetch failed — default to trial-safe behavior.
          // ALL authenticated users start as trial users, so this is the safe default
          // that prevents accidentally sending them to Stripe (which demands a card).
          setIsOnTrial(true);
        }
      } catch {
        // Network error — default to trial-safe behavior for the same reason.
        setIsOnTrial(true);
      }
    };

    fetchProfile();
  }, [status, session]);

  useEffect(() => {
    trackPageView('/plans', 'Plan Selection');

    // Fire plan_viewed once per mount (ref guard prevents StrictMode double-fire)
    if (!planViewedFiredRef.current) {
      planViewedFiredRef.current = true;
      trackPlanViewed();
    }

    // Check for previously selected plan from URL
    const planParam = searchParams.get('selected');
    if (planParam && PLANS.find(p => p.id === planParam)) {
      setSelectedPlan(PLANS.find(p => p.id === planParam) || null);
    }
  }, [searchParams]);

  /**
   * Handle plan selection:
   * - Trial users → save plan choice to profile (no Stripe), redirect to dashboard
   * - Non-trial authenticated users → proceed to Stripe checkout
   * - Unauthenticated users → redirect to signup with coupon preserved
   */
  const handleSelectPlan = async (plan: Plan) => {
    if (isCheckoutInFlight) return;

    setSelectedPlan(plan);
    setCheckoutError(null);

    // Unauthenticated users → send to signup with plan + coupon context
    if (status !== 'authenticated' || !session?.user?.id) {
      const signupUrl = effectiveCoupon
        ? `/signup?coupon=${encodeURIComponent(effectiveCoupon)}&plan=${plan.id}`
        : `/signup?plan=${plan.id}`;
      router.push(signupUrl);
      return;
    }

    setIsCheckoutInFlight(true);

    // Fire client-side GA4 events
    trackPlanSelected(plan.type, plan.price);

    // All authenticated users proceed to Stripe checkout (trial users will see $0 today)
    trackCheckoutStarted(plan.name, plan.price);
    trackBillingSummaryViewed(plan.name, plan.price * 100, true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          planType: plan.type,
          customerEmail: session.user.email,
          coupon: effectiveCoupon,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors with redirect to error page
        const errorType = data.errorType || 'generic';
        const declineCode = data.declineCode || '';

        setIsCheckoutInFlight(false);
        router.push(`/checkout/error?error_type=${errorType}&decline_code=${declineCode}`);
        setSelectedPlan(null);
        return;
      }

      // Stripe checkout URL received — redirect to checkout
      if (data.url) {
        setIsCheckoutInFlight(false);
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'Failed to proceed to checkout');
      setIsCheckoutInFlight(false);
      setSelectedPlan(null);
    }
  };

  // Render content immediately — don't block on session loading.
  // The plans page is public-first; session status only affects the
  // header button (Log In vs Sign Out) and the checkout handler,
  // both of which degrade gracefully while the session resolves.
  const isAuthenticated = status === 'authenticated' && session?.user?.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-green-600">
            GroomGrid
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-stone-600 hover:text-stone-900 text-sm"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="text-stone-600 hover:text-stone-900 text-sm"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Promo Banner — dynamic based on applied coupon */}
      {effectiveCoupon && KNOWN_PROMO_CODES[effectiveCoupon] ? (
        <div className="bg-green-600 text-white text-center py-3 px-4">
          <p className="text-sm font-semibold">
            🐾 {KNOWN_PROMO_CODES[effectiveCoupon].description}
          </p>
        </div>
      ) : (
        <div className="bg-green-600 text-white text-center py-3 px-4">
          <p className="text-sm font-semibold">
            🐾 Launch pricing — <span className="font-bold">$14.50/mo for founding groomers</span> (code BETA50). Lock it in forever.
          </p>
        </div>
      )}

      {/* Promo Code Input */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-2">
          {appliedPromo ? (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <span className="text-green-800 font-medium text-sm">
                ✅ Code <strong>{appliedPromo}</strong> applied
                {KNOWN_PROMO_CODES[appliedPromo] && (
                  <span className="text-green-600 ml-1">— {KNOWN_PROMO_CODES[appliedPromo].discount}</span>
                )}
              </span>
              <button
                onClick={handleRemovePromo}
                className="text-green-600 hover:text-green-800 text-sm font-medium ml-1"
                aria-label="Remove promo code"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <label htmlFor="promo-code" className="text-sm text-stone-600 font-medium">
                Promo code:
              </label>
              <input
                id="promo-code"
                type="text"
                value={promoInput}
                onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyPromo(); } }}
                placeholder="BETA50"
                className="w-36 px-3 py-1.5 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                disabled={isCheckoutInFlight}
              />
              <button
                onClick={handleApplyPromo}
                disabled={isCheckoutInFlight || !promoInput.trim()}
                className="px-4 py-1.5 text-sm font-medium bg-stone-800 text-white rounded-lg hover:bg-stone-900 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
              >
                Apply
              </button>
              {promoError && (
                <span className="text-red-600 text-sm">{promoError}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Schema.org SoftwareApplication structured data for rich results */}
        <Script
          id="software-app-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareAppSchema),
          }}
        />
        {/* Schema.org OfferCatalog structured data */}
        <Script
          id="pricing-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(offerCatalogSchema),
          }}
        />

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-stone-900 mb-4">Pick Your Plan — Cancel Anytime</h2>
          <p className="text-xl text-stone-600">14-day free trial on every plan. Solo Groomer is $29/mo — less than one no-show.</p>
        </div>

        {/* Checkout Error Alert */}
        {checkoutError && (
          <div
            className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-8"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden="true">⚠️</span>
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Payment Trouble</h3>
                <p className="text-amber-800 mb-4">{checkoutError}</p>
                <button
                  onClick={() => router.push('/checkout/error?error_type=generic')}
                  className="text-amber-700 hover:text-amber-900 font-medium underline"
                >
                  View detailed error and recovery options
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Plan Cards — horizontal scroll carousel on mobile, grid on desktop */}
        <div ref={planGridRef}>
          <PricingCarousel defaultIndex={0} className="mb-12">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selectedPlan?.id === plan.id}
                onSelect={() => handleSelectPlan(plan)}
                isLoading={selectedPlan?.id === plan.id && isCheckoutInFlight}
                isDimmed={isCheckoutInFlight && selectedPlan?.id !== plan.id}
                hasError={!!checkoutError && selectedPlan?.id === plan.id}
                discountedPrice={effectiveCoupon === 'GROOMERFOUNDING' ? 0 : undefined}
              />
            ))}
          </PricingCarousel>
        </div>

        {/* Trust Signals */}
        <div className="mb-8">
          <TrustSignals
            showBillingSummary={!!selectedPlan}
            billingData={getBillingData() || undefined}
            location="plans"
            compact={true}
          />
        </div>

        {/* Value Props */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-stone-200">
              <div className="text-2xl mb-2">📅</div>
              <h4 className="font-semibold text-stone-900 mb-1">Smart Scheduling</h4>
              <p className="text-sm text-stone-600">Automated reminders cut no-shows by up to 40%. Mobile-first so you can manage from the van.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-stone-200">
              <div className="text-2xl mb-2">🐾</div>
              <h4 className="font-semibold text-stone-900 mb-1">Pet & Client Profiles</h4>
              <p className="text-sm text-stone-600">Allergies, breed notes, vaccination records — everything in one place, not scattered across paper.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-stone-200">
              <div className="text-2xl mb-2">💳</div>
              <h4 className="font-semibold text-stone-900 mb-1">Built-In Payments</h4>
              <p className="text-sm text-stone-600">No more chasing checks. Clients pay at booking or after the groom — you get paid faster.</p>
            </div>
          </div>
        </div>

        {/* Why GroomGrid vs Competitors */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-stone-900 mb-6 text-center">
            Why GroomGrid, Not MoeGo or DaySmart?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border-2 border-green-300">
              <p className="font-bold text-green-600 mb-2">GroomGrid</p>
              <p className="text-3xl font-extrabold text-stone-900 mb-1">$29<span className="text-sm font-normal text-stone-500">/mo</span></p>
              <p className="text-sm text-stone-600">Solo Groomer plan. Mobile-first. Auto reminders. Built-in payments. No per-booking fees.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-stone-200">
              <p className="font-bold text-stone-800 mb-2">MoeGo</p>
              <p className="text-3xl font-extrabold text-stone-400 mb-1">$129<span className="text-sm font-normal text-stone-400">/mo</span></p>
              <p className="text-sm text-stone-500">Similar features, 4× the price. Better for large salons, overkill for mobile groomers.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-stone-200">
              <p className="font-bold text-stone-800 mb-2">DaySmart</p>
              <p className="text-3xl font-extrabold text-stone-400 mb-1">$59<span className="text-sm font-normal text-stone-400">/mo</span></p>
              <p className="text-sm text-stone-500">Legacy software. Desktop-first. Clunky on mobile. No automated payment collection.</p>
            </div>
          </div>
          <p className="text-center text-sm text-stone-500 mt-4">$29/mo = less than one no-show. That&apos;s the math.</p>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-stone-900 mb-6 text-center">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6">
                <h4 className="font-semibold text-stone-900 mb-2">{faq.question}</h4>
                <p className="text-stone-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA for unauthenticated users */}
        {!isAuthenticated && (
          <div className="text-center mt-12">
            <Link
              href={effectiveCoupon ? `/signup?coupon=${encodeURIComponent(effectiveCoupon)}` : '/signup'}
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Start Free Trial — 14 Days Free
            </Link>
            <p className="text-stone-500 text-sm mt-3">No credit card · Cancel anytime · No lock-in</p>
          </div>
        )}
      </main>

      {/* Sticky Plan Bar (mobile only) */}
      <StickyPlanBar
        selectedPlan={selectedPlan}
        onSelectPlan={handleSelectPlan}
        planGridRef={planGridRef}
      />

      <SiteFooter />
    </div>
  );
}

export default function PlansPage() {
  return (
    <NextAuthSessionProvider>
      <Suspense fallback={<PlansSkeleton />}>
        <PlansPageInner />
      </Suspense>
    </NextAuthSessionProvider>
  );
}
