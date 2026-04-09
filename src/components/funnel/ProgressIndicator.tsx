import { CheckCircle, AlertCircle, MinusCircle } from 'lucide-react';
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
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          // Use stepStates if provided, otherwise calculate from currentStep
          const stepState = stepStates?.[index] ?? (() => {
            if (stepNumber < currentStep) return 'completed';
            if (stepNumber === currentStep) return 'current';
            return 'upcoming';
          })();

          return (
            <div key={stepNumber} className="flex-1 flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all",
                  stepState === 'completed' && "bg-green-500 text-white",
                  stepState === 'current' && "bg-green-500 text-white ring-4 ring-green-100",
                  stepState === 'upcoming' && "bg-stone-100 text-stone-400",
                  stepState === 'error' && "bg-red-500 text-white ring-4 ring-red-100",
                  stepState === 'skipped' && "bg-stone-200 text-stone-500"
                )}
              >
                {stepState === 'completed' && <CheckCircle className="w-6 h-6" />}
                {stepState === 'error' && <AlertCircle className="w-6 h-6" />}
                {stepState === 'skipped' && <MinusCircle className="w-6 h-6" />}
                {(stepState === 'current' || stepState === 'upcoming') && (
                  <span className="text-sm font-semibold">{stepNumber}</span>
                )}
              </div>
              <span
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
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="relative mt-2">
        <div className="absolute top-0 left-0 h-1 bg-stone-200 w-full rounded-full" aria-hidden="true" />
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Step ${currentStep} of ${totalSteps}`}
          className="absolute top-0 left-0 h-1 bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
