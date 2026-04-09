'use client';

import { cn } from '@/lib/utils';

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export default function OnboardingProgressBar({
  currentStep,
  totalSteps,
  className,
}: OnboardingProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;
  const stepLabels = ['Welcome', 'Business Type', 'Appointment', 'AI Magic', 'Ready'];

  return (
    <div
      className={cn(
        'sticky top-0 z-50 bg-gradient-to-r from-green-500 to-green-600 shadow-md',
        'h-12 sm:h-14 px-4 flex items-center justify-between',
        className
      )}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Onboarding progress: step ${currentStep} of ${totalSteps}`}
    >
      {/* Progress bar background */}
      <div className="absolute inset-0 bg-green-500">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-white transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="relative z-10 flex items-center gap-3">
        <span className="text-white font-semibold text-sm sm:text-base">
          Step {currentStep} of {totalSteps}
        </span>
        {currentStep === totalSteps && (
          <span className="text-white text-sm">🎉 Complete!</span>
        )}
      </div>

      {/* Progress percentage */}
      <div className="relative z-10 text-white font-medium text-sm sm:text-base">
        {Math.round(progress)}%
      </div>

      {/* Screen reader announcement for accessibility */}
      <span className="sr-only" aria-live="polite">
        {stepLabels[currentStep - 1]} - {progress}% complete
      </span>
    </div>
  );
}
