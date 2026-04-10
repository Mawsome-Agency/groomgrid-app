'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ConfettiSuccess from '@/components/payment/ConfettiSuccess';
import { trackPaymentPageView } from '@/lib/ga4';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    setMounted(true);

    // Track payment success page view on mount
    trackPaymentPageView('success_page');

    // Validate session exists before proceeding
    if (!sessionId) {
      console.error('Checkout success page called without session_id');
      router.push('/plans');
      return;
    }
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

  const handleContinue = () => {
    router.push(`/onboarding${sessionId ? `?session_id=${sessionId}` : ''}`);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <ConfettiSuccess
      title="You're in!"
      message="Your 14-day free trial has started"
      subMessage="We'll send a confirmation to your email shortly."
      onContinue={handleContinue}
      continueText={`Set Up Your Account ${countdown > 0 ? `(${countdown}s)` : ''}`}
    />
  );
}
