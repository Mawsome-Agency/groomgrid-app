import { CheckCircle2, ArrowRight, Users, Calendar, Share2 } from 'lucide-react';

const POST_ONBOARDING_TIPS = [
  {
    icon: <Users className="w-5 h-5 text-green-500" />,
    title: 'Add more clients',
    description: 'Import clients or add them as they book',
  },
  {
    icon: <Calendar className="w-5 h-5 text-green-500" />,
    title: 'Book appointments',
    description: 'Use the + button to book in 2 taps',
  },
  {
    icon: <Share2 className="w-5 h-5 text-green-500" />,
    title: 'Share your booking page',
    description: 'Send clients your personal booking link',
  },
];

export default function CompletionScreen({ onDashboard }: { onDashboard: () => void }) {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-stone-900 mb-2">You&apos;re All Set!</h2>
        <p className="text-stone-600">
          Your GroomGrid account is ready to go. Here&apos;s what you can do now:
        </p>
      </div>

      <div className="bg-stone-50 rounded-2xl p-6 text-left space-y-4">
        {POST_ONBOARDING_TIPS.map((tip, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">{tip.icon}</div>
            <div>
              <h3 className="font-semibold text-stone-900">{tip.title}</h3>
              <p className="text-sm text-stone-600">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-xl p-4 text-left">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Check your email — we sent you a getting-started guide with links to help docs and support.
        </p>
      </div>

      <button
        onClick={onDashboard}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-colors text-lg font-semibold"
      >
        Go to Dashboard <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
