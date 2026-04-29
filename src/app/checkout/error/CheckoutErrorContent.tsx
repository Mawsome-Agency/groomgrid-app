'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, RefreshCw, Mail, ArrowLeft, CreditCard, Tag } from 'lucide-react';
import { trackEvent } from '@/lib/ga4';

type ErrorType = 'declined' | 'insufficient' | 'expired' | 'generic' | 'maxRetries';

interface ErrorConfig {
  title: string;
  description: string;
  list: string[];
  primaryAction: string;
  secondaryAction?: string;
  tip?: string;
  ariaAnnouncement: string;
}

const ERROR_CONFIG: Record<ErrorType, ErrorConfig> = {
  declined: {
    title: "Payment Trouble",
    description: "We couldn't process your card. This sometimes happens — let's try again.",
    list: [
      "Card declined by bank",
      "Incorrect card number or CVC",
      "Card not authorized for this purchase",
    ],
    primaryAction: "Try Again",
    secondaryAction: "View Plans",
    tip: "Contact your bank if this persists — they can often unblock transactions instantly",
    ariaAnnouncement: "Payment declined. We couldn't process your card. Please check your card details or try a different card.",
  },
  insufficient: {
    title: "Payment On Hold",
    description: "We couldn't complete your subscription. Your card has insufficient funds.",
    list: [
      "Try a different payment method",
      "Add funds to your account",
      "Choose a lower tier plan",
    ],
    primaryAction: "Try Different Card",
    secondaryAction: "View Plans",
    tip: "Good news: Your 14-day trial is still active! Take your time getting set up.",
    ariaAnnouncement: "Payment could not be completed due to insufficient funds. Please try a different payment method or choose a different plan.",
  },
  expired: {
    title: "Card Expired",
    description: "It looks like your card has expired. No worries — just grab your new card.",
    list: [
      "New card number",
      "New expiration date",
      "CVC (3-4 digits on back)",
    ],
    primaryAction: "Update Card Information",
    tip: "We'll keep your spot in the queue while you update your details!",
    ariaAnnouncement: "Your card has expired. Please update your card information.",
  },
  generic: {
    title: "Something Unexpected Happened",
    description: "Your payment was declined or we're having trouble processing it right now. This is on us.",
    list: [
      "Try again in a moment",
      "Refresh the page and retry",
      "Contact support if it continues",
    ],
    primaryAction: "Try Again",
    secondaryAction: "Contact Support",
    tip: "We've logged this issue and are looking into it.",
    ariaAnnouncement: "We encountered an error processing your payment. This is on us. Please try again or contact support.",
  },
  maxRetries: {
    title: "Too Many Retries",
    description: "We've tried several times but haven't been able to process this payment.",
    list: [
      "Contact our support team",
      "Try a different payment method",
    ],
    primaryAction: "Contact Support",
    secondaryAction: "Different Card",
    tip: "Your trial is still active — no rush! We're here to help when you're ready.",
    ariaAnnouncement: "Maximum retry attempts reached. Please contact support or try a different card.",
  },
};

const ERROR_TYPE_ALIASES: Record<string, ErrorType> = {
  card_declined: 'declined',
};

export function CheckoutErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorType, setErrorType] = useState<ErrorType>('generic');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const errorParam = searchParams.get('error_type');
    const declineCode = searchParams.get('decline_code');

    if (errorParam && errorParam in ERROR_CONFIG) {
      setErrorType(errorParam as ErrorType);
    } else if (errorParam && errorParam in ERROR_TYPE_ALIASES) {
      setErrorType(ERROR_TYPE_ALIASES[errorParam]);
    } else if (declineCode) {
      if (declineCode === 'insufficient_funds') {
        setErrorType('insufficient');
      } else if (declineCode === 'expired_card') {
        setErrorType('expired');
      } else {
        setErrorType('declined');
      }
    }
  }, [searchParams]);

  const config = ERROR_CONFIG[errorType];

  // Track page view on mount
  useEffect(() => {
    if (mounted) {
      trackEvent('checkout_error_viewed', {
        error_type: errorType,
        timestamp: new Date().toISOString(),
      });
    }
  }, [mounted, errorType]);

  const handleContactSupport = () => {
    trackEvent('checkout_error_support_clicked', {
      error_type: errorType,
      timestamp: new Date().toISOString(),
    });
    window.location.href = 'mailto:hello@getgroomgrid.com?subject=Payment%20Error&body=' + encodeURIComponent(`Error Type: ${errorType}\n\nPlease describe what happened:\n\n`);
  };

  const handleRetry = () => {
    trackEvent('checkout_error_retry_clicked', {
      error_type: errorType,
      timestamp: new Date().toISOString(),
    });
    router.push('/plans');
  };

  const handleTryDifferentCard = () => {
    trackEvent('checkout_error_different_card_clicked', {
      error_type: errorType,
      timestamp: new Date().toISOString(),
    });
    router.push('/plans');
  };

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
        <h1 className="text-3xl font-bold text-stone-900 mb-6">Payment Failed</h1>

        <div
          className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 mb-8"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-amber-600" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-amber-900 mb-2">{config.title}</h2>
              <p className="text-amber-800">{config.description}</p>
            </div>
          </div>

          <ul className="space-y-2 mb-6" role="list">
            {config.list.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-amber-900">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-amber-600 rounded-full mt-2" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {config.tip && (
            <div className="bg-amber-100 rounded-xl p-4 flex items-start gap-3">
              <span aria-hidden="true" className="text-lg">💡</span>
              <p className="text-amber-900 text-sm font-medium">{config.tip}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={handleRetry}
            className="flex-1 bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            aria-label={config.primaryAction}
          >
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
            {config.primaryAction}
          </button>

          {config.secondaryAction === 'Contact Support' ? (
            <button
              onClick={handleContactSupport}
              className="flex-1 bg-white text-stone-700 font-semibold py-3 px-6 rounded-xl hover:bg-stone-50 border-2 border-stone-300 transition-colors flex items-center justify-center gap-2"
              aria-label={config.secondaryAction}
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              {config.secondaryAction}
            </button>
          ) : (
            config.secondaryAction && (
              <button
                onClick={handleTryDifferentCard}
                className="flex-1 bg-white text-stone-700 font-semibold py-3 px-6 rounded-xl hover:bg-stone-50 border-2 border-stone-300 transition-colors flex items-center justify-center gap-2"
                aria-label={config.secondaryAction}
              >
                <CreditCard className="w-5 h-5" aria-hidden="true" />
                {config.secondaryAction}
              </button>
            )
          )}
        </div>

        {/* BETA50 Founding Pricing Reminder */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Tag className="w-5 h-5 text-green-600" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-green-900 mb-1">Don't Miss Your Founding Pricing</h3>
              <p className="text-green-800 text-sm mb-3">
                Use code <span className="font-bold bg-green-200 px-2 py-0.5 rounded">BETA50</span> for 50% off —
                lock in $14.50/mo forever. Less than half a grooming session.
              </p>
              <button
                onClick={handleRetry}
                className="text-green-700 font-semibold text-sm hover:text-green-900 underline"
              >
                Try checkout again with BETA50 →
              </button>
            </div>
          </div>
        </div>

        <div className="bg-stone-50 rounded-xl p-6 text-center">
          <p className="text-stone-600 mb-2">
            Still having trouble? We're here to help.
          </p>
          <a
            href="mailto:hello@getgroomgrid.com"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            hello@getgroomgrid.com
          </a>
        </div>
      </main>
    </div>
  );
}
