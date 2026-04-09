'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckCircle2, ArrowRight, Sparkles, Calendar, Users, DollarSign, Zap } from 'lucide-react';
import { trackPageView } from '@/lib/ga4';

export default function WelcomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    trackPageView('/welcome', 'Welcome');
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleContinue = () => {
    router.push('/plans');
  };

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-green-600">GroomGrid</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Celebration Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6 relative">
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500 animate-pulse" />
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          
          <h2 className="text-4xl font-bold text-stone-900 mb-3">
            Welcome to GroomGrid, {session.user?.name || 'there'}!
          </h2>
          <p className="text-xl text-stone-600">
            Your account is ready. Here's what you can expect:
          </p>
        </div>

        {/* Value Props */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 mb-1">Smart Scheduling</h3>
                <p className="text-sm text-stone-600">
                  Book appointments in seconds with our intuitive calendar
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 mb-1">Client Management</h3>
                <p className="text-sm text-stone-600">
                  Keep all your clients and their pets organized in one place
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 mb-1">Auto Reminders</h3>
                <p className="text-sm text-stone-600">
                  Reduce no-shows with automated appointment reminders
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900 mb-1">Revenue Tracking</h3>
                <p className="text-sm text-stone-600">
                  See your earnings grow with real-time analytics
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trial Info */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8 text-center">
          <p className="text-green-900 font-semibold mb-2">
            🎉 Your 14-day free trial starts now!
          </p>
          <p className="text-green-700 text-sm">
            No credit card required. Cancel anytime.
          </p>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleContinue}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all text-lg font-semibold shadow-lg hover:shadow-xl"
        >
          Choose My Plan <ArrowRight className="w-6 h-6" />
        </button>
      </main>
    </div>
  );
}
