import { PlanType } from '@/types';
import { getPlanDetails, formatTrialEndDate } from '@/lib/payment-utils';

interface BillingSummaryProps {
  planType: PlanType;
}

export default function BillingSummary({ planType }: BillingSummaryProps) {
  const plan = getPlanDetails(planType);
  const trialEndDate = formatTrialEndDate();

  return (
    <div className="bg-stone-50 rounded-xl border border-stone-200 p-5 space-y-4">
      <h3 className="font-semibold text-stone-900 text-base">Order Summary</h3>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-stone-600 text-sm">Plan</span>
          <span className="font-semibold text-stone-900">{plan.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-stone-600 text-sm">14-day free trial</span>
          <span className="font-semibold text-green-600">$0.00 today</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-stone-600 text-sm">After trial ends</span>
          <span className="font-semibold text-stone-900">${plan.price}/month</span>
        </div>
      </div>

      <div className="border-t border-stone-200 pt-3">
        <p className="text-xs text-stone-500">
          Your free trial runs until <strong>{trialEndDate}</strong>. You won&apos;t be charged until then, and you can cancel any time before with no fee.
        </p>
      </div>
    </div>
  );
}
