import { CheckCircle, Circle } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export default function ProgressIndicator({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={stepNumber} className="flex-1 flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all",
                  isCompleted && "bg-green-500 text-white",
                  isCurrent && "bg-green-500 text-white ring-4 ring-green-100",
                  isUpcoming && "bg-stone-100 text-stone-400"
                )}
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
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Progress bar */}
      <div className="relative mt-2">
        <div className="absolute top-0 left-0 h-1 bg-stone-200 w-full rounded-full" />
        <div
          className="absolute top-0 left-0 h-1 bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
