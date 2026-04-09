import { CheckCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export default function ProgressIndicator({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) {
  const progressPercent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <div
      className="w-full max-w-2xl mx-auto mb-8"
      role="navigation"
      aria-label="Onboarding progress"
    >
      {/* Screen reader status announcement */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
      </div>

      <ol className="flex items-center justify-between list-none p-0 m-0">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <li key={stepNumber} className="flex-1 flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all",
                  isCompleted && "bg-green-500 text-white",
                  isCurrent && "bg-green-500 text-white ring-4 ring-green-100",
                  isUpcoming && "bg-stone-100 text-stone-400"
                )}
                aria-hidden="true"
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="text-sm font-semibold">{stepNumber}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium text-center max-w-[80px]",
                  isCurrent && "text-green-700",
                  isCompleted && "text-stone-600",
                  isUpcoming && "text-stone-400"
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted && <span className="sr-only">Completed: </span>}
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Progress bar — visible to sighted users; screen readers use the ol above */}
      <div
        className="relative mt-2"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Onboarding ${progressPercent}% complete`}
      >
        <div className="absolute top-0 left-0 h-1 bg-stone-200 w-full rounded-full" />
        <div
          className="absolute top-0 left-0 h-1 bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
