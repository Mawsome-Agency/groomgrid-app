'use client';

import { CreditCard, Lock, Calendar, Users, ArrowRight } from 'lucide-react';

/**
 * Full-screen blocking overlay shown when a trial has expired.
 * The user cannot interact with the dashboard behind this.
 * They must upgrade or can still view data in read-only mode.
 */
export default function TrialExpiredOverlay() {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trial-expired-title"
      aria-describedby="trial-expired-description"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 md:p-10 text-center">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>

        {/* Heading */}
        <h1
          id="trial-expired-title"
          className="text-2xl md:text-3xl font-bold text-stone-900 mb-3"
        >
          Your 14-day free trial has ended
        </h1>

        {/* Description */}
        <p
          id="trial-expired-description"
          className="text-stone-600 mb-6 text-base"
        >
          Upgrade to keep managing your grooming business. Your data is safe — pick a plan to get back to work.
        </p>

        {/* CTA Button */}
        <a
          href="/plans"
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 bg-green-500 text-white rounded-xl text-lg font-semibold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
        >
          <CreditCard className="w-5 h-5" />
          View Plans & Upgrade
          <ArrowRight className="w-5 h-5" />
        </a>

        {/* Coupon hint */}
        <p className="mt-4 text-sm text-stone-500">
          Use code{' '}
          <span className="font-mono font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded">
            GROOMERFOUNDING
          </span>{' '}
          for founding member pricing
        </p>

        {/* Read-only access note */}
        <div className="mt-6 pt-6 border-t border-stone-200">
          <p className="text-xs text-stone-400 mb-3">
            You can still view your existing data:
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> View clients
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> View appointments
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
