import { ReactNode } from 'react';
import { CheckCircle2, Calendar, Users, BarChart2 } from 'lucide-react';
import Link from 'next/link';

interface NextStep {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  cta: string;
}

const NEXT_STEPS: NextStep[] = [
  {
    icon: <Users className="w-5 h-5 text-green-500" />,
    title: 'Set up your profile',
    description: 'Add your business info, services, and working hours',
    href: '/onboarding',
    cta: 'Start setup',
  },
  {
    icon: <Calendar className="w-5 h-5 text-green-500" />,
    title: 'Book your first appointment',
    description: 'Add a client and schedule their first visit',
    href: '/dashboard',
    cta: 'Go to dashboard',
  },
  {
    icon: <BarChart2 className="w-5 h-5 text-green-500" />,
    title: 'Share your booking page',
    description: 'Let clients book directly from a link you control',
    href: '/dashboard',
    cta: 'Get your link',
  },
];

export default function NextStepsCard() {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <h3 className="font-semibold text-stone-900 text-base">What to do next</h3>
      </div>

      <div className="space-y-3">
        {NEXT_STEPS.map((step, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-stone-50">
            <div className="flex-shrink-0 mt-0.5">{step.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-900">{step.title}</p>
              <p className="text-xs text-stone-500 mt-0.5">{step.description}</p>
            </div>
            <Link
              href={step.href}
              className="flex-shrink-0 text-xs font-medium text-green-600 hover:text-green-700 whitespace-nowrap"
            >
              {step.cta} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
