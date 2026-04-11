'use client';

import { useEffect, useState, RefObject } from 'react';
import { Plan } from '@/types';

interface StickyPlanBarProps {
  selectedPlan: Plan | null;
  onSelectPlan: (plan: Plan) => void;
  planGridRef: RefObject<HTMLDivElement>;
}

export default function StickyPlanBar({ selectedPlan, onSelectPlan, planGridRef }: StickyPlanBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = planGridRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show bar when plan grid is NOT visible (scrolled above viewport)
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [planGridRef]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-stone-200 shadow-lg px-4 py-3"
      role="complementary"
      aria-label="Selected plan summary"
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          {selectedPlan ? (
            <>
              <p className="text-xs text-stone-500">Selected plan</p>
              <p className="font-semibold text-stone-900 truncate">
                {selectedPlan.name} — ${selectedPlan.price}/mo
              </p>
            </>
          ) : (
            <p className="text-sm text-stone-600">Choose a plan to get started</p>
          )}
        </div>
        <button
          onClick={() => selectedPlan && onSelectPlan(selectedPlan)}
          disabled={!selectedPlan}
          className="flex-shrink-0 px-5 py-2.5 bg-green-500 text-white font-semibold rounded-xl text-sm hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
        >
          {selectedPlan ? 'Continue' : 'Select Plan'}
        </button>
      </div>
    </div>
  );
}
