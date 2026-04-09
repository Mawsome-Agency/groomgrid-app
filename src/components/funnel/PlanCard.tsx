import { Check, Star } from 'lucide-react';
import { Plan } from '@/types';

interface PlanCardProps {
  plan: Plan;
  selected: boolean;
  onSelect: (plan: Plan) => void;
}

export default function PlanCard({ plan, selected, onSelect }: PlanCardProps) {
  return (
    /**
     * Accessibility: The entire card is a <button> so keyboard users can navigate
     * and activate it with Enter/Space. aria-pressed communicates selected state to
     * screen readers without relying on color alone.
     */
    <button
      type="button"
      onClick={() => onSelect(plan)}
      aria-pressed={selected}
      aria-label={`Select ${plan.name} plan — $${plan.price} per month${plan.popular ? ' — most popular' : ''}`}
      className={cn(
        "relative p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg text-left w-full",
        selected
          ? "border-green-500 bg-green-50"
          : "border-stone-200 bg-white hover:border-green-300"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
            <Star className="w-3 h-3" aria-hidden="true" />
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-stone-900 mb-1">{plan.name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          {/* aria-label on the price container provides a natural reading for screen readers */}
          <span className="text-4xl font-bold text-green-600" aria-label={`$${plan.price} per month`}>
            ${plan.price}
          </span>
          <span className="text-stone-500" aria-hidden="true">/mo</span>
        </div>
        <p className="text-xs text-green-600 mt-2">14-day free trial</p>
      </div>

      <ul className="space-y-3 mb-6" aria-label={`${plan.name} plan features`}>
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-sm text-stone-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Visual CTA inside the button — decorative; the actual action is on the button */}
      <div
        aria-hidden="true"
        className={cn(
          "w-full py-3 rounded-xl font-semibold transition-all text-center",
          selected
            ? "bg-green-500 text-white"
            : "bg-stone-100 text-stone-700"
        )}
      >
        {selected ? 'Selected' : 'Choose Plan'}
      </div>
    </button>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
