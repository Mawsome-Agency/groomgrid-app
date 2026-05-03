'use client';

import { AlertCircle, CreditCard, ArrowRight } from 'lucide-react';

interface TrialExpiringBannerProps {
  daysLeft: number;
}

/**
 * Urgent warning banner displayed when 1-3 days remain on trial.
 * Uses amber/orange to create urgency without being alarming.
 */
export default function TrialExpiringBanner({ daysLeft }: TrialExpiringBannerProps) {
  const urgencyText =
    daysLeft <= 1
      ? 'Your trial expires today!'
      : `Your trial expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`;

  return (
    <div
      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-5 shadow-lg"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold">{urgencyText}</h2>
            <p className="text-amber-100 text-sm mt-1">
              After your trial ends, you won't be able to create new appointments or clients.
              Upgrade now to keep your workflow uninterrupted.
            </p>
          </div>
        </div>
        <a
          href="/plans"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-amber-700 rounded-lg text-sm font-semibold hover:bg-amber-50 transition-colors whitespace-nowrap"
        >
          <CreditCard className="w-4 h-4" />
          Upgrade Now
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
