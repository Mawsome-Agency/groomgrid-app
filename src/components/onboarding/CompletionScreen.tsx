import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function CompletionScreen({ onDashboard }: { onDashboard: () => void }) {
  return (
    <div className="text-center space-y-6 py-8">
      <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-stone-900 mb-2">You're All Set!</h2>
        <p className="text-stone-600">
          Your GroomGrid account is ready to go. Here's what you can do now:
        </p>
      </div>

      <div className="bg-stone-50 rounded-2xl p-6 text-left space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">1</span>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Add more clients</h3>
            <p className="text-sm text-stone-600">Import clients or add them as they book</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">2</span>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Book appointments</h3>
            <p className="text-sm text-stone-600">Use the + button to book in 2 taps</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">3</span>
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">Track revenue</h3>
            <p className="text-sm text-stone-600">See your earnings at a glance on the dashboard</p>
          </div>
        </div>
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
