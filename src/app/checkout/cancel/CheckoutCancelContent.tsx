'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Calendar } from 'lucide-react';

export function CheckoutCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const planParam = searchParams.get('plan');
    if (planParam && ['solo', 'salon', 'enterprise'].includes(planParam)) {
      setSelectedPlan(planParam);
    }
  }, [searchParams]);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xl font-bold text-green-600">GroomGrid</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-stone-600" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900 mb-2">Payment Cancelled</h1>
              <p className="text-stone-600">
                No worries! Your checkout was cancelled and no charge was made to your account.
              </p>
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl p-6 mb-6 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-stone-900 font-medium mb-1">Good news — your trial is safe</p>
              <p className="text-stone-600 text-sm">
                When you're ready to subscribe, your 14-day free trial will still be waiting for you.
              </p>
            </div>
          </div>

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

          <Link
            href={selectedPlan ? `/plans?selected=${selectedPlan}` : '/plans'}
            className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-center"
          >
            Return to Plans
          </Link>
        </div>

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
