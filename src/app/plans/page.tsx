'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Script from 'next/script';
import { Plan } from '@/types';
import { PLANS } from '@/app/pricing/pricing-data';
import PlanCard from '@/components/funnel/PlanCard';
import Testimonial from '@/components/funnel/Testimonial';
import ValueProp from '@/components/funnel/ValueProp';
import TrustSignals from '@/components/trust/TrustSignals';
import StickyPlanBar from '@/components/funnel/StickyPlanBar';
import { BillingSummaryData } from '@/components/trust/BillingSummary';
import { trackPageView, trackPlanViewed, trackPlanSelected, trackCheckoutStarted, trackBillingSummaryViewed } from '@/lib/ga4';

const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    business: 'Paws on Wheels',
    quote: 'GroomGrid cut my booking time in half. I can focus on dogs, not paperwork.',
  },
  {
    name: 'James Rodriguez',
    business: 'Fur Perfect Salon',
    quote: 'My team loves mobile app. We can check schedules from anywhere and no-shows dropped 40%.',
  },
];

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

  // Get billing summary data for selected plan
  const getBillingData = (): BillingSummaryData | null => {
    if (!selectedPlan) return null;

    return {
      planName: selectedPlan.name,
      todayAmount: 0, // Trial is free
      recurringAmount: selectedPlan.price * 100, // Convert to cents
      currency: "$",
      isTrial: true,
      trialDays: 14,
    };
  };

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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Check if welcome screen has been shown
    if (status === 'authenticated' && session?.user?.id) {
      fetch('/api/profile')
        .then((res) => res.json())
        .then((data) => {
          // If welcome hasn't been shown and user hasn't selected a plan yet, redirect to welcome
          if (!data.welcomeShown && !data.stripeSubscriptionId) {
            router.replace('/welcome');
          }
        })
        .catch((err) => {
          console.error('Failed to check welcome status:', err);
          // Don't block page if check fails
        });
    }
  }, [status, session, router]);

  const handleSelectPlan = async (plan: Plan) => {
    if (!session?.user?.id) return;
    if (isCheckoutInFlight) return;

    setSelectedPlan(plan);
    setCheckoutError(null);
    setIsCheckoutInFlight(true);

    // Fire client-side GA4 events before redirect — window.gtag is available here
    trackPlanSelected(plan.type, plan.price);
    trackCheckoutStarted(plan.name, plan.price);

    // Track billing summary viewed
    trackBillingSummaryViewed(plan.name, plan.price * 100, true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          planType: plan.type,
          customerEmail: session.user.email,
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

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-600">GroomGrid</h1>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-stone-600 hover:text-stone-900 text-sm"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* BETA50 Promo Banner */}
      <div className="bg-green-600 text-white text-center py-3 px-4">
        <p className="text-sm font-semibold">
          🎉 Launch Special: Use code <span className="font-bold underline">BETA50</span> for 50% off your first month! Limited to first 100 users.
        </p>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Schema.org OfferCatalog structured data for rich results */}
        <Script
          id="pricing-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "OfferCatalog",
              "name": "GroomGrid Pricing Plans",
              "itemListElement": PLANS.map((plan, i) => ({
                "@type": "Offer",
                "position": i + 1,
                "name": plan.name,
                "price": plan.price,
                "priceCurrency": "USD",
                "description": plan.features.join(', '),
              })),
            }),
          }}
        />

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-stone-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-stone-600">All plans include a 14-day free trial</p>
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

        {/* Mobile layout: Plan Cards → Trust Signals → Value Props → Testimonials → FAQ */}
        {/* Desktop layout: Value Props → Trust Signals → Plan Cards → Testimonials → FAQ */}

        {/* Plan Cards — shown first on mobile, after ValueProp on desktop */}
        <div ref={planGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 order-first md:order-none">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan?.id === plan.id}
              onSelect={() => handleSelectPlan(plan)}
              isLoading={selectedPlan?.id === plan.id && isCheckoutInFlight}
              isDimmed={isCheckoutInFlight && selectedPlan?.id !== plan.id}
              hasError={!!checkoutError && selectedPlan?.id === plan.id}
            />
          ))}
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

        {/* Value Props — hidden on mobile (shown above plan cards on desktop via flex order) */}
        <div className="hidden md:block mb-8">
          <ValueProp />
        </div>

        {/* Value Props — shown below Trust Signals on mobile only */}
        <div className="md:hidden mb-8">
          <ValueProp />
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-stone-900 mb-6 text-center">
            Trusted by Professional Groomers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {TESTIMONIALS.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-stone-900 mb-6 text-center">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-semibold text-stone-900 mb-2">What happens after the free trial?</h4>
              <p className="text-stone-600 text-sm">
                After 14 days, you'll be charged for your chosen plan. You can cancel anytime before the trial ends with no charge.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-semibold text-stone-900 mb-2">Can I change plans later?</h4>
              <p className="text-stone-600 text-sm">
                Yes! You can upgrade or downgrade your plan at any time from your account settings.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-semibold text-stone-900 mb-2">Is my data secure?</h4>
              <p className="text-stone-600 text-sm">
                Absolutely. We use industry-standard encryption and your data is backed up daily.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Plan Bar (mobile only) */}
      <StickyPlanBar
        selectedPlan={selectedPlan}
        onSelectPlan={handleSelectPlan}
        planGridRef={planGridRef}
      />
    </div>
  );
}

export default function PlansPage() {
  return (
    <Suspense fallback={<PlansSkeleton />}>
      <PlansPageInner />
    </Suspense>
  );
}
