import { Check, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Plan } from '@/types';
import { trackPlanFeaturesExpanded } from '@/lib/ga4';

interface PlanCardProps {
  plan: Plan;
  selected: boolean;
  expanded: boolean;
  onSelect: (plan: Plan) => void;
  onToggleFeatures: () => void;
}

// Key benefits to show initially (first 2-3 features)
const INITIAL_FEATURES = 2;

export default function PlanCard({ plan, selected, expanded, onSelect, onToggleFeatures }: PlanCardProps) {
  const initialFeatures = plan.features.slice(0, INITIAL_FEATURES);
  const remainingFeatures = plan.features.slice(INITIAL_FEATURES);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger plan selection if clicking the expander button
    if ((e.target as HTMLElement).closest('[data-expander]')) {
      return;
    }
    onSelect(plan);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Don't trigger if clicking expander button
    if ((e.target as HTMLElement).closest('[data-expander]')) {
      return;
    }
    // Activate on Enter or Space key
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(plan);
    }
  };

  const handleToggleFeatures = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFeatures();
    // Track expansion (only when expanding, not collapsing)
    if (!expanded) {
      trackPlanFeaturesExpanded(plan.id, plan.type);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      aria-pressed={selected}
      className={cn(
        "relative p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg",
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
          <span className="text-4xl font-bold text-green-600">${plan.price}</span>
          <span className="text-stone-500">/mo</span>
        </div>
        <p className="text-xs text-green-600 mt-2">14-day free trial</p>
      </div>

      <ul className="space-y-3 mb-4">
        {initialFeatures.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-sm text-stone-700">{feature}</span>
          </li>
        ))}
        {expanded && remainingFeatures.map((feature, index) => (
          <li key={`expanded-${index}`} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span className="text-sm text-stone-700">{feature}</span>
          </li>
        ))}
      </ul>

      {remainingFeatures.length > 0 && (
        <button
          data-expander
          onClick={handleToggleFeatures}
          className="w-full flex items-center justify-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium mb-4 transition-colors"
          aria-expanded={expanded}
          aria-label={expanded ? 'Show fewer features' : 'Show all features'}
        >
          {expanded ? (
            <>
              Show fewer <ChevronUp className="w-4 h-4" aria-hidden="true" />
            </>
          ) : (
            <>
              See all {plan.features.length} features <ChevronDown className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      )}

      <button
        className={cn(
          "w-full py-3 rounded-xl font-semibold transition-all",
          selected
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
        )}
      >
        {selected ? 'Selected' : 'Choose Plan'}
      </button>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
