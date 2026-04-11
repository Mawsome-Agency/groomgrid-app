export const dynamic = 'force-dynamic';
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, Calendar } from 'lucide-react';

export default function CheckoutCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    // Get selected plan from URL params
    const planParam = searchParams.get('plan');
    if (planParam && ['solo', 'salon', 'enterprise'].includes(planParam)) {
      setSelectedPlan(planParam);
    }
  }, [searchParams]);

  const handleReturnToPlans = () => {
    // Preserve selected plan if exists
    if (selectedPlan) {
      router.push(`/plans?selected=${selectedPlan}`);
    } else {
      router.push('/plans');
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-green-600">GroomGrid</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Cancellation Notice */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-stone-600" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Checkout Cancelled</h2>
              <p className="text-stone-600">
                No worries! Your checkout was cancelled, and you haven't been charged.
              </p>
            </div>
          </div>

          {/* Reassurance */}
          <div className="bg-stone-50 rounded-xl p-6 mb-6 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-stone-900 font-medium mb-1">Good news — your trial is safe</p>
              <p className="text-stone-600 text-sm">
                When you're ready to subscribe, your 14-day free trial will still be waiting for you.
              </p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-stone-400 mt-0.5" aria-hidden="true">📅</span>
              <div>
                <p className="text-stone-900 font-medium">Come back anytime</p>
                <p className="text-stone-600 text-sm">
                  Your account setup is saved — just pick up where you left off.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-stone-400 mt-0.5" aria-hidden="true">🐾</span>
              <div>
                <p className="text-stone-900 font-medium">Full access on your terms</p>
                <p className="text-stone-600 text-sm">
                  Start your free trial whenever you're ready to grow your grooming business.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleReturnToPlans}
            className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            aria-label="Return to plans"
          >
            {selectedPlan ? `Continue with ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan` : 'Choose a Plan'}
          </button>
        </div>

        {/* Support Info */}
        <div className="bg-stone-50 rounded-xl p-6 text-center">
          <p className="text-stone-600 mb-2">
            Questions about plans or pricing?
          </p>
          <a
            href="mailto:help@getgroomgrid.com"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            help@getgroomgrid.com
          </a>
        </div>
      </main>
    </div>
  );
}
