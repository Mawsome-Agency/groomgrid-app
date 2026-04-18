import { Check, Star } from 'lucide-react';
import { Plan } from '@/types';
import NoHiddenFeesSeal from '@/components/trust/NoHiddenFeesSeal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';

interface PlanCardProps {
  plan: Plan;
  selected: boolean;
  onSelect: (plan: Plan) => void;
  isLoading?: boolean;
  isDimmed?: boolean;
  hasError?: boolean;
  discountedPrice?: number;
}

export default function PlanCard({ plan, selected, onSelect, isLoading, isDimmed, hasError, discountedPrice }: PlanCardProps) {
  return (
    <div
      onClick={() => !isLoading && onSelect(plan)}
      className={cn(
        "relative p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg",
        selected
          ? "border-green-500 bg-green-50"
          : "border-stone-200 bg-white hover:border-green-300",
        isDimmed && "opacity-60",
        isLoading && "pointer-events-none",
        hasError && "animate-shake"
      )}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl z-10">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
            <Star className="w-3 h-3" />
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-stone-900 mb-1">{plan.name}</h3>
        {discountedPrice !== undefined ? (
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-bold text-stone-400 line-through">${plan.price}</span>
            <span className="text-4xl font-bold text-green-600">${discountedPrice}</span>
            <span className="text-stone-500">/mo</span>
          </div>
        ) : (
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-green-600">${plan.price}</span>
            <span className="text-stone-500">/mo</span>
          </div>
        )}
        <p className="text-xs text-green-600 mt-2">14-day free trial</p>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-stone-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        disabled={isLoading}
        className={cn(
          "w-full py-3 rounded-xl font-semibold transition-all",
          selected
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-stone-100 text-stone-700 hover:bg-stone-200",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
      >
        {selected ? 'Selected' : 'Choose Plan'}
      </button>

      {/* Trust Signal: No Hidden Fees */}
      <NoHiddenFeesSeal className="justify-center" />
    </div>
  );
}
