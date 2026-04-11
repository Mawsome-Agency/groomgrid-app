'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Plan } from '@/types';
import PlanCard from '@/components/funnel/PlanCard';
import Testimonial from '@/components/funnel/Testimonial';
import ValueProp from '@/components/funnel/ValueProp';
import { trackPageView, trackPlanSelected } from '@/lib/ga4';

const PLANS: Plan[] = [
  {
    id: 'solo',
    name: 'Solo',
    type: 'solo',
    price: 29,
    interval: 'monthly',
    stripe_price_id: '', // resolved server-side via STRIPE_PRICE_SOLO env var
    features: [
      '1 groomer account',
      'Unlimited clients & appointments',
      'Automated reminders',
      'Revenue tracking',
      'Mobile app access',
    ],
  },
  {
    id: 'salon',
    name: 'Salon',
    type: 'salon',
    price: 79,
    interval: 'monthly',
    stripe_price_id: '', // resolved server-side via STRIPE_PRICE_SALON env var
    popular: true,
    features: [
      'Everything in Solo',
      'Up to 5 groomer accounts',
      'Team scheduling',
      'Staff performance metrics',
      'Priority support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    type: 'enterprise',
    price: 149,
    interval: 'monthly',
    stripe_price_id: '', // resolved server-side via STRIPE_PRICE_ENTERPRISE env var
    features: [
      'Everything in Salon',
      'Unlimited groomers',
      'Custom branding',
      'API access',
      'Dedicated account manager',
    ],
  },
];

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

export default function PlansPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    trackPageView('/plans', 'Plan Selection');
    
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
          // Don't block the page if check fails
        });
    }
  }, [status, session, router]);

  const handleSelectPlan = async (plan: Plan) => {
    if (!session?.user?.id) return;

    setSelectedPlan(plan);
    setLoading(true);
    setCheckoutError(null);

    // Fire client-side GA4 event before redirect — window.gtag is available here
    trackPlanSelected(plan.type, plan.price);

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
        
        router.push(`/checkout/error?error_type=${errorType}&decline_code=${declineCode}`);
        setLoading(false);
        setSelectedPlan(null);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'Failed to proceed to checkout');
      setLoading(false);
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

      <main className="max-w-7xl mx-auto px-4 py-12">
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

        {/* Value Props */}
        <div className="mb-12">
          <ValueProp />
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan?.id === plan.id}
              onSelect={() => handleSelectPlan(plan)}
            />
          ))}
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
    </div>
  );
}
