'use client';

import { CheckCircle2, Circle, Users, Calendar, Clock, ArrowRight } from 'lucide-react';

interface OnboardingChecklistProps {
  onboardingStep: number;
  onboardingCompleted: boolean;
  clientCount: number;
  appointmentCount: number;
  hasBusinessHours: boolean;
}

interface ChecklistItem {
  label: string;
  description: string;
  href: string;
  completed: boolean;
  icon: React.ReactNode;
}

export default function OnboardingChecklist({
  onboardingStep,
  onboardingCompleted,
  clientCount,
  appointmentCount,
  hasBusinessHours,
}: OnboardingChecklistProps) {
  // Determine completion status for each step
  const steps: ChecklistItem[] = [
    {
      label: 'Add your first client',
      description: 'Start building your client roster',
      href: '/clients',
      completed: clientCount > 0 || onboardingStep >= 1,
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: 'Schedule an appointment',
      description: 'Book your first grooming appointment',
      href: '/schedule',
      completed: appointmentCount > 0 || onboardingStep >= 2,
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      label: 'Set business hours',
      description: 'Let clients know when you\'re available',
      href: '/onboarding',
      completed: hasBusinessHours || onboardingStep >= 3 || onboardingCompleted,
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  // Don't render if onboarding is already fully complete and they have data
  if (onboardingCompleted && completedCount === steps.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Get Started with GroomGrid</h2>
            <p className="text-green-100 text-sm mt-1">
              {completedCount === 0
                ? 'Complete these steps to set up your business'
                : completedCount === steps.length
                  ? 'All set! You\'re ready to go 🎉'
                  : `${completedCount} of ${steps.length} steps complete`}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold">{progressPercent}%</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 bg-green-400/30 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="divide-y divide-stone-100">
        {steps.map((step) => (
          <a
            key={step.label}
            href={step.completed ? undefined : step.href}
            className={`flex items-center gap-4 p-4 transition-colors ${
              step.completed
                ? 'bg-green-50/50 cursor-default'
                : 'hover:bg-stone-50 cursor-pointer'
            }`}
          >
            <div className={`flex-shrink-0 ${
              step.completed ? 'text-green-500' : 'text-stone-300'
            }`}>
              {step.completed ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Circle className="w-6 h-6" />
              )}
            </div>
            <div className={`flex-shrink-0 ${
              step.completed ? 'text-green-600' : 'text-stone-400'
            }`}>
              {step.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                step.completed ? 'text-green-700 line-through' : 'text-stone-900'
              }`}>
                {step.label}
              </p>
              <p className={`text-xs ${
                step.completed ? 'text-green-600' : 'text-stone-500'
              }`}>
                {step.description}
              </p>
            </div>
            {!step.completed && (
              <ArrowRight className="w-4 h-4 text-stone-400 flex-shrink-0" />
            )}
          </a>
        ))}
      </div>

      {/* CTA for incomplete onboarding */}
      {!onboardingCompleted && completedCount < steps.length && (
        <div className="p-4 bg-stone-50 border-t border-stone-100">
          <a
            href="/onboarding"
            className="block w-full text-center px-4 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
          >
            Complete Setup Wizard
          </a>
          <p className="text-center text-xs text-stone-500 mt-2">
            Takes about 2 minutes — you can always skip steps
          </p>
        </div>
      )}
    </div>
  );
}
