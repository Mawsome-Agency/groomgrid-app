'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Calendar, Clock, CreditCard, HelpCircle, ChevronDown, ChevronUp, Sparkles, Users } from 'lucide-react';
import { trackEvent } from '@/lib/ga4';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How long is the free trial?',
    answer: '14 days — full access to all features. No credit card required to start.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. No contracts, no cancellation fees. Export your data anytime.',
  },
  {
    question: 'What happens after the trial?',
    answer: 'Choose a plan that fits your business. Founding members keep 50% off forever.',
  },
];

// Simulated remaining spots (would come from API in production)
const INITIAL_SPOTS = 23;

export function CheckoutCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showRecovery, setShowRecovery] = useState(true);
  const [spotsRemaining, setSpotsRemaining] = useState(INITIAL_SPOTS);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    setMounted(true);

    const planParam = searchParams.get('plan');
    if (planParam && ['solo', 'salon', 'enterprise'].includes(planParam)) {
      setSelectedPlan(planParam);
    }

    // Track page view once
    if (!trackedRef.current) {
      trackedRef.current = true;
      trackEvent('checkout_cancel_viewed', {
        plan: planParam || 'unknown',
        timestamp: new Date().toISOString(),
      });
    }
  }, [searchParams]);

  const handleContinueSetup = () => {
    trackEvent('checkout_cancel_continue_clicked', {
      plan: selectedPlan || 'unknown',
      timestamp: new Date().toISOString(),
    });
    router.push(selectedPlan ? `/plans?selected=${selectedPlan}` : '/plans');
  };

  const handleNotReady = () => {
    trackEvent('checkout_cancel_not_ready_clicked', {
      plan: selectedPlan || 'unknown',
      timestamp: new Date().toISOString(),
    });
    setShowRecovery(false);
  };

  const handleFaqToggle = (index: number) => {
    const isExpanding = expandedFaq !== index;
    setExpandedFaq(isExpanding ? index : null);

    if (isExpanding) {
      trackEvent('checkout_cancel_faq_opened', {
        faq_index: index,
        faq_question: FAQ_ITEMS[index].question,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleSupportClick = () => {
    trackEvent('checkout_cancel_support_clicked', {
      timestamp: new Date().toISOString(),
    });
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xl font-bold text-green-600">GroomGrid</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Recovery Offer - Show First */}
        {showRecovery && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-600" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2">
                  You were so close!
                </h1>
                <p className="text-stone-600">
                  Don't miss your founding pricing. Lock in 50% off forever.
                </p>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-xl p-6 mb-6 border border-amber-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full mb-2">
                    BETA50 CODE APPLIED
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-stone-900">$14.50</span>
                    <span className="text-stone-500">/mo</span>
                  </div>
                  <p className="text-sm text-stone-500 line-through">$29/mo</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-700 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>Limited spots</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-600 text-sm mt-1">
                    <Users className="w-4 h-4" />
                    <span>{spotsRemaining} remaining</span>
                  </div>
                </div>
              </div>

              {/* Key Benefits */}
              <ul className="space-y-2 text-sm text-stone-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>50% off forever — founders price locked in</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>14-day free trial, no credit card required</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Cancel anytime, export your data</span>
                </li>
              </ul>
            </div>

            {/* Yes/No Choice */}
            <div className="space-y-3">
              <button
                onClick={handleContinueSetup}
                className="w-full bg-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                Yes — Continue Setup & Lock In $14.50/mo
              </button>

              <button
                onClick={handleNotReady}
                className="w-full bg-white text-stone-600 font-medium py-3 px-6 rounded-xl hover:bg-stone-50 border-2 border-stone-300 transition-colors"
              >
                I'm not ready yet
              </button>
            </div>

            {/* Trust Signal */}
            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-stone-500">
              <span className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                No card required for trial
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                14 days free
              </span>
            </div>
          </div>
        )}

        {/* Cancelled State (shown after "Not Ready" or initially without recovery) */}
        {!showRecovery && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-stone-600" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-stone-900 mb-2">Checkout Cancelled</h1>
                <p className="text-stone-600">
                  No worries! Your checkout was cancelled and no charge was made to your account.
                </p>
              </div>
            </div>

            <div className="bg-stone-50 rounded-xl p-6 mb-6 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-stone-900 font-medium mb-1">Good news — your trial is safe</p>
                <p className="text-stone-600 text-sm">
                  When you're ready to subscribe, your 14-day free trial will still be waiting for you.
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-stone-400 mt-0.5" aria-hidden="true">📅</span>
                <div>
                  <p className="text-stone-900 font-medium">Come back anytime</p>
                  <p className="text-stone-600 text-sm">
                    Your account setup is saved — just pick up where you left off.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-stone-400 mt-0.5" aria-hidden="true">🐾</span>
                <div>
                  <p className="text-stone-900 font-medium">Full access on your terms</p>
                  <p className="text-stone-600 text-sm">
                    Start your free trial whenever you're ready to grow your grooming business.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={selectedPlan ? `/plans?selected=${selectedPlan}` : '/plans'}
              className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-center"
            >
              Return to Plans
            </Link>

            {/* Bring back the offer */}
            <button
              onClick={() => setShowRecovery(true)}
              className="w-full text-center text-stone-500 hover:text-stone-700 text-sm mt-4 underline"
            >
              Wait — I want the $14.50/mo founding pricing
            </button>
          </div>
        )}

        {/* Quick FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-stone-900">Quick Answers</h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((faq, index) => (
              <div key={index} className="border border-stone-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleFaqToggle(index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-stone-50 transition-colors"
                  aria-expanded={expandedFaq === index}
                >
                  <span className="font-medium text-stone-900 text-sm md:text-base">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-stone-400 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 flex-shrink-0 ml-2" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-stone-600 text-sm">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-stone-50 rounded-xl p-6 text-center">
          <p className="text-stone-600 mb-2">
            Questions about plans or pricing?
          </p>
          <a
            href="mailto:hello@getgroomgrid.com"
            onClick={handleSupportClick}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            hello@getgroomgrid.com
          </a>
        </div>
      </main>
    </div>
  );
}
