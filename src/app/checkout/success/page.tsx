'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      router.push(`/onboarding${sessionId ? `?session_id=${sessionId}` : ''}`);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router, sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-stone-900 mb-3">You&apos;re in!</h1>
        <p className="text-stone-600 mb-2">
          Your 14-day free trial has started. No charge until your trial ends.
        </p>
        <p className="text-stone-500 text-sm mb-8">
          We&apos;ll send a confirmation to your email shortly.
        </p>

        <div className="bg-green-50 rounded-xl p-4 mb-8">
          <p className="text-green-700 text-sm font-medium">
            Trial active &mdash; full access for 14 days
          </p>
        </div>

        <button
          onClick={() => router.push(`/onboarding${sessionId ? `?session_id=${sessionId}` : ''}`)}
          className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors mb-4"
        >
          Set Up Your Account
        </button>

        <p className="text-stone-400 text-xs">
          Redirecting automatically in {countdown} second{countdown !== 1 ? 's' : ''}...
        </p>
      </div>
    </div>
  );
}
