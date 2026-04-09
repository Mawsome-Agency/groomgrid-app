import { CheckCircle, Circle, AlertCircle, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StepState = 'completed' | 'current' | 'upcoming' | 'error' | 'skipped';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  stepStates?: StepState[];
}

export default function ProgressIndicator({ currentStep, totalSteps, stepLabels, stepStates }: ProgressIndicatorProps) {
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <nav aria-label="Progress steps">
        <ol className="flex items-center justify-between" role="list">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            // Use stepStates if provided, otherwise calculate from currentStep
            const stepState = stepStates?.[index] ?? (() => {
              if (stepNumber < currentStep) return 'completed';
              if (stepNumber === currentStep) return 'current';
              return 'upcoming';
            })();

            let stepAriaLabel = `Step ${stepNumber}: ${label}`;
            switch (stepState) {
              case 'completed':
                stepAriaLabel += ' (completed)';
                break;
              case 'current':
                stepAriaLabel += ' (current)';
                break;
              case 'error':
                stepAriaLabel += ' (error)';
                break;
              case 'skipped':
                stepAriaLabel += ' (skipped)';
                break;
              case 'upcoming':
                stepAriaLabel += ' (upcoming)';
                break;
            }

            return (
              <li key={stepNumber} className="flex-1 flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all",
                    stepState === 'completed' && "bg-green-500 text-white",
                    stepState === 'current' && "bg-green-500 text-white ring-4 ring-green-100",
                    stepState === 'upcoming' && "bg-stone-100 text-stone-400",
                    stepState === 'error' && "bg-red-500 text-white ring-4 ring-red-100",
                    stepState === 'skipped' && "bg-stone-200 text-stone-500"
                  )}
                  aria-hidden="true"
                >
                  {stepState === 'completed' && <CheckCircle className="w-6 h-6" aria-hidden="true" />}
                  {stepState === 'error' && <AlertCircle className="w-6 h-6" aria-hidden="true" />}
                  {stepState === 'skipped' && <MinusCircle className="w-6 h-6" aria-hidden="true" />}
                  {(stepState === 'current' || stepState === 'upcoming') && (
                    <span className="text-sm font-semibold">{stepNumber}</span>
                  )}
                </div>
                <span
                  aria-current={stepState === 'current' ? 'step' : undefined}
                  aria-label={stepAriaLabel}
                  className={cn(
                    "text-xs font-medium text-center max-w-[80px]",
                    stepState === 'current' && "text-green-700",
                    stepState === 'completed' && "text-stone-600",
                    stepState === 'upcoming' && "text-stone-400",
                    stepState === 'error' && "text-red-700",
                    stepState === 'skipped' && "text-stone-500 line-through decoration-stone-400"
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Progress bar */}
      <div className="relative mt-2">
        <div className="absolute top-0 left-0 h-1 bg-stone-200 w-full rounded-full" aria-hidden="true" />
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Step ${currentStep} of ${totalSteps}`}
          className={cn(
            "absolute top-0 left-0 h-1 rounded-full transition-all duration-300",
            "bg-green-500"
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
