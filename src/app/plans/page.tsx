'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Plan } from '@/types';
import PlanCard from '@/components/funnel/PlanCard';
import Testimonial from '@/components/funnel/Testimonial';
import ValueProp from '@/components/funnel/ValueProp';
import { trackPageView, trackPlanSelected, trackFunnelExit } from '@/lib/ga4';
import { useApiTiming } from '@/hooks/use-funnel-timing';

const PLANS: Plan[] = [
  {
    id: 'solo',
    name: 'Solo',
    type: 'solo',
    price: 29,
    interval: 'monthly',
    stripe_price_id: 'price_solo_placeholder',
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
    stripe_price_id: 'price_salon_placeholder',
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
    stripe_price_id: 'price_enterprise_placeholder',
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
    quote: 'GroomGrid cut my booking time in half. I can focus on the dogs, not the paperwork.',
  },
  {
    name: 'James Rodriguez',
    business: 'Fur Perfect Salon',
    quote: 'My team loves the mobile app. We can check schedules from anywhere and no-shows dropped 40%.',
  },
];

export default function PlansPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { startTiming: startCheckoutTiming, endTiming: endCheckoutTiming } = useApiTiming('/api/checkout');

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  // Track exit when user leaves page without selecting a plan
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!selectedPlan && !loading) {
        trackFunnelExit('plans', 'page_exit', 'user_navigated_away');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [selectedPlan, loading]);

  useEffect(() => {
    trackPageView('/plans', 'Plan Selection');
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status]);

  const handleSelectPlan = async (plan: Plan) => {
    if (!session?.user?.id) return;

    setSelectedPlan(plan);
    setLoading(true);

    // Fire client-side GA4 event before redirect — window.gtag is available here
    trackPlanSelected(plan.type, plan.price);

    // Start timing for checkout API call
    startCheckoutTiming();

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

      if (data.url) {
        // Track API timing success
        endCheckoutTiming(true);
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      // Track API timing with error
      endCheckoutTiming(false, err.message || 'unknown_error');
      alert(err.message || 'Failed to proceed to checkout');
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
