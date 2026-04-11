"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/hooks/use-analytics";

export interface BillingSummaryData {
  planName: string;
  todayAmount: number;  // in cents
  recurringAmount: number;  // in cents
  currency: string;
  isTrial: boolean;
  trialDays?: number;
}

interface BillingSummaryProps {
  data: BillingSummaryData;
  className?: string;
  compact?: boolean;
}

export default function BillingSummary({ data, className, compact = false }: BillingSummaryProps) {
  const [hasViewed, setHasViewed] = useState(false);
  const { track } = useAnalytics();

  useEffect(() => {
    if (!hasViewed) {
      setHasViewed(true);
      track("billing_summary_viewed", {
        plan_name: data.planName,
        amount: data.recurringAmount,
        is_trial: data.isTrial,
      });
    }
  }, [data, track, hasViewed]);

  const formatAmount = (cents: number) => {
    return `${data.currency}${Math.round(cents / 100)}`;
  };

  if (compact) {
    return (
      <div className={cn("bg-green-50 border border-green-200 rounded-lg p-4", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-stone-700">{data.planName}</p>
              <p className="text-xs text-stone-500">
                {data.isTrial 
                  ? `Free for ${data.trialDays || 14} days, then ${formatAmount(data.recurringAmount)}/mo` 
                  : `${formatAmount(data.recurringAmount)}/mo`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white border border-stone-200 rounded-lg p-5", className)}>
      <div className="flex items-start gap-3 mb-4">
        <Info className="w-5 h-5 text-stone-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h3 className="text-sm font-semibold text-stone-900 mb-1">Billing Summary</h3>
          <p className="text-xs text-stone-500">
            Review your plan details before proceeding
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Plan name */}
        <div className="flex items-center justify-between py-2 border-b border-stone-100">
          <span className="text-sm text-stone-600">Plan</span>
          <span className="text-sm font-semibold text-stone-900">{data.planName}</span>
        </div>

        {/* Today's amount */}
        <div className="flex items-center justify-between py-2 border-b border-stone-100">
          <span className="text-sm text-stone-600">
            {data.isTrial ? "Today (trial)" : "Today"}
          </span>
          <span className="text-lg font-bold text-green-600">
            {formatAmount(data.todayAmount)}
          </span>
        </div>

        {/* Recurring amount */}
        <div className="flex items-center justify-between py-2 border-b border-stone-100">
          <span className="text-sm text-stone-600">Recurring</span>
          <span className="text-lg font-bold text-stone-900">
            {formatAmount(data.recurringAmount)}/month
          </span>
        </div>

        {/* Trial note */}
        {data.isTrial && data.trialDays && (
          <div className="flex items-start gap-2 py-2 bg-green-50 rounded-md px-3">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-green-700">
              <span className="font-medium">{data.trialDays}-day free trial</span>
              {" "}No charge until trial ends. Cancel anytime.
            </p>
          </div>
        )}

        {/* Cancel note */}
        <div className="flex items-start gap-2 py-2">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-stone-600">
            Cancel anytime from Settings → Billing. No fees.
          </p>
        </div>
      </div>
    </div>
  );
}
