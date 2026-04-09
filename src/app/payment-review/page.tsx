'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PlanType } from '@/types';
import { getPlanDetails, isValidPlanType } from '@/lib/payment-utils';
import BillingSummary from '@/components/payment/BillingSummary';
import SecurityBadges from '@/components/payment/SecurityBadges';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { trackPageView } from '@/lib/ga4';

export default function PaymentReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const planParam = searchParams.get('plan') ?? '';
  const planType: PlanType | null = isValidPlanType(planParam) ? planParam : null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackPageView('/payment-review', 'Payment Review');
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (status === 'authenticated' && !planType) {
      router.push('/plans');
    }
  }, [status, planType, router]);

  if (status === 'loading' || !session || !planType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const plan = getPlanDetails(planType);

  const handleProceedToCheckout = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          planType,
          customerEmail: session.user.email,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to proceed to checkout';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-600">GroomGrid</h1>
          <button
            onClick={() => router.push('/plans')}
            className="text-stone-500 hover:text-stone-800 text-sm flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to plans
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        {/* Page heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-stone-900 mb-2">Review your order</h2>
          <p className="text-stone-600">
            You&apos;re choosing the <strong>{plan.name}</strong> plan. Review everything before continuing to payment.
          </p>
        </div>

        {/* What's included */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 mb-4">
          <h3 className="font-semibold text-stone-900 text-base mb-3">
            What&apos;s included in {plan.name}
          </h3>
          <ul className="space-y-2">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Billing summary */}
        <div className="mb-4">
          <BillingSummary planType={planType} />
        </div>

        {/* What happens next */}
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5 mb-6">
          <h3 className="font-semibold text-stone-900 text-sm mb-3">What happens next</h3>
          <ol className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-stone-700">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
              You&apos;ll enter your card details on Stripe&apos;s secure checkout page
            </li>
            <li className="flex items-start gap-2 text-sm text-stone-700">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">2</span>
              Your 14-day free trial starts immediately — <strong>no charge today</strong>
            </li>
            <li className="flex items-start gap-2 text-sm text-stone-700">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">3</span>
              You&apos;ll get a confirmation email with your billing details
            </li>
            <li className="flex items-start gap-2 text-sm text-stone-700">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">4</span>
              We&apos;ll guide you through setting up your account
            </li>
          </ol>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleProceedToCheckout}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-green-500 text-white hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-base font-semibold mb-4"
        >
          {loading ? 'Redirecting to Stripe...' : (
            <>
              Continue to Secure Checkout <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <SecurityBadges />
      </main>
    </div>
  );
}
