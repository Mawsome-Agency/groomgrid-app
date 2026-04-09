'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import NextStepsCard from '@/components/payment/NextStepsCard';
import SecurityBadges from '@/components/payment/SecurityBadges';
import { trackPageView } from '@/lib/ga4';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    trackPageView('/payment-success', 'Payment Success');
  }, []);

  const handleStartSetup = () => {
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-green-600">GroomGrid</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        {/* Success indicator */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-stone-900 mb-2">You&apos;re in!</h2>
          <p className="text-stone-600">
            Your 14-day free trial has started. No charge until your trial ends.
          </p>
        </div>

        {/* Trial active banner */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-green-700 text-sm font-medium">
            Trial active &mdash; full access for 14 days, nothing charged today
          </p>
          <p className="text-green-600 text-xs mt-1">
            A confirmation has been sent to your email
          </p>
        </div>

        {/* Next steps */}
        <div className="mb-6">
          <NextStepsCard />
        </div>

        {/* Primary CTA */}
        <button
          onClick={handleStartSetup}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors text-base font-semibold mb-2"
        >
          Set Up My Account <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full px-6 py-3 rounded-xl text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors"
        >
          Skip setup, go to dashboard
        </button>

        <SecurityBadges />

        {sessionId && (
          <p className="text-center text-xs text-stone-400 mt-2">
            Reference: {sessionId.slice(0, 16)}...
          </p>
        )}
      </main>
    </div>
  );
}
