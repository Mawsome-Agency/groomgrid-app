'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TrustSignals from '@/components/trust/TrustSignals';
import { BillingSummaryData } from '@/components/trust/BillingSummary';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(8); // Increased from 5 to 8 for billing summary visibility
  const [mounted, setMounted] = useState(false);
  const [billingData, setBillingData] = useState<BillingSummaryData | null>(null);
  const [loadingBilling, setLoadingBilling] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Validate session exists before proceeding
    if (!sessionId) {
      console.error('Checkout success page called without session_id');
      router.push('/plans');
      return;
    }

    // Fetch Stripe session to get billing details
    async function fetchBillingData() {
      try {
        const response = await fetch(`/api/checkout/success?session_id=${sessionId}`);
        if (!response.ok) {
          console.error('Failed to fetch session data');
          setLoadingBilling(false);
          return;
        }

        const sessionData = await response.json();

        // Build billing summary from session metadata
        // Note: The session metadata will include plan details after we modify the checkout route
        const data: BillingSummaryData = {
          planName: sessionData.metadata?.planName || sessionData.metadata?.planType || 'Unknown Plan',
          todayAmount: 0, // Trial is free
          recurringAmount: parseInt(sessionData.metadata?.planPrice || '0'),
          currency: '$',
          isTrial: sessionData.metadata?.isTrial === 'true' || sessionData.trial_end_days_left === 14,
          trialDays: 14,
        };

        setBillingData(data);
        setLoadingBilling(false);
      } catch (error) {
        console.error('Error fetching billing data:', error);
        setLoadingBilling(false);
      }
    }

    fetchBillingData();
  }, [sessionId, router]);

  useEffect(() => {
    if (!mounted) return;

    if (countdown <= 0) {
      router.push(`/onboarding${sessionId ? `?session_id=${sessionId}` : ''}`);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, mounted, router, sessionId]);

  if (!mounted || loadingBilling) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
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
        <p className="text-stone-500 text-sm mb-6">
          We&apos;ll send a confirmation to your email shortly.
        </p>

        {/* Trust Signals with Billing Summary */}
        {billingData && (
          <div className="mb-6">
            <TrustSignals
              showBillingSummary={true}
              billingData={billingData}
              location="success"
              compact={false}
            />
          </div>
        )}

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

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center">
          <div className="text-stone-500">Loading...</div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
