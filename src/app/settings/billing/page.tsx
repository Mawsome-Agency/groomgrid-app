'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Settings, Calendar, Users, LogOut, Menu, X,
  ArrowLeft, CreditCard, Check, AlertCircle, ExternalLink, RefreshCw, Mail,
} from 'lucide-react';
import { trackPageView } from '@/lib/ga4';

const PLANS = [
  {
    id: 'solo',
    name: 'Solo',
    price: '$29',
    period: '/month',
    description: 'Perfect for independent mobile groomers',
    features: [
      'Unlimited appointments',
      'Client & pet profiles',
      'Automated reminders',
      'Payment tracking',
      'Invoice generation',
    ],
  },
  {
    id: 'salon',
    name: 'Salon',
    price: '$79',
    period: '/month',
    description: 'Ideal for salons with 2–5 groomers',
    popular: true,
    features: [
      'Everything in Solo',
      'Staff scheduling',
      'Multi-groomer calendar',
      'Revenue analytics',
      'Priority support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$149',
    period: '/month',
    description: 'For large operations',
    features: [
      'Everything in Salon',
      'Unlimited staff',
      'Custom integrations',
      'Dedicated account manager',
      'SLA support',
    ],
  },
];

const PLAN_DISPLAY: Record<string, { label: string; color: string }> = {
  trial: { label: 'Free Trial', color: 'bg-green-100 text-green-700' },
  solo: { label: 'Solo', color: 'bg-blue-100 text-blue-700' },
  salon: { label: 'Salon', color: 'bg-purple-100 text-purple-700' },
  enterprise: { label: 'Enterprise', color: 'bg-orange-100 text-orange-700' },
};

const SUBSCRIPTION_DISPLAY: Record<string, { label: string; color: string; icon: string }> = {
  trial: { label: 'Free Trial', color: 'bg-green-100 text-green-700', icon: '✨' },
  active: { label: 'Active', color: 'bg-green-100 text-green-700', icon: '✓' },
  past_due: { label: 'Payment Issue', color: 'bg-amber-100 text-amber-700', icon: '⚠️' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: '○' },
};

export default function BillingSettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paymentFailedDismissed, setPaymentFailedDismissed] = useState(false);

  useEffect(() => {
    trackPageView('/settings/billing', 'Settings - Billing');
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated' && session?.user?.id) {
      fetchProfile();
    }
  }, [status, session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile?userId=${session?.user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => signOut({ callbackUrl: '/' });

  const handleRetryPayment = () => {
    router.push('/plans');
  };

  const handleContactSupport = () => {
    window.location.href = 'mailto:help@getgroomgrid.com?subject=Payment%20Issue&body=' + encodeURIComponent(`I'm having trouble with my subscription payment.\n\nPlan: ${planType}\nStatus: ${subStatus}\n\nPlease help me resolve this issue.`);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Loading...</div>
      </div>
    );
  }

  const planType = profile?.plan_type || profile?.planType || 'trial';
  const subStatus = profile?.subscription_status || 'trial';
  const trialEndsAt = profile?.trial_ends_at || profile?.trialEndsAt;
  const trialDaysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / 86400000))
    : 0;
  const planDisplay = PLAN_DISPLAY[planType] || PLAN_DISPLAY.trial;
  const subDisplay = SUBSCRIPTION_DISPLAY[subStatus] || SUBSCRIPTION_DISPLAY.trial;
  const showPaymentFailed = subStatus === 'past_due' && !paymentFailedDismissed;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Mobile Header */}
      <header className="bg-white border-b border-stone-200 lg:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 text-stone-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-stone-900">Billing & Plan</h1>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-stone-600">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-3">
          <a href="/dashboard" className="flex items-center gap-2 text-stone-600">
            <Calendar className="w-5 h-5" /> Today
          </a>
          <a href="/settings" className="flex items-center gap-2 text-green-700 font-medium">
            <Settings className="w-5 h-5" /> Settings
          </a>
          <button onClick={handleSignOut} className="flex items-center gap-2 text-red-600 w-full">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h1 className="text-2xl font-bold text-green-600 mb-6">GroomGrid</h1>
              <nav className="space-y-1">
                <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors">
                  <Calendar className="w-5 h-5" /> Today
                </a>
                <a href="/schedule" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors">
                  <Calendar className="w-5 h-5" /> Schedule
                </a>
                <a href="/clients" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors">
                  <Users className="w-5 h-5" /> Clients
                </a>
                <a href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 text-green-700 font-medium">
                  <Settings className="w-5 h-5" /> Settings
                </a>
              </nav>
              <div className="mt-8 pt-6 border-t border-stone-200">
                <button onClick={handleSignOut} className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Breadcrumb */}
            <div className="hidden lg:flex items-center gap-2 mb-6 text-sm text-stone-500">
              <a href="/settings" className="hover:text-green-600 transition-colors">Settings</a>
              <span>/</span>
              <span className="text-stone-900 font-medium">Billing & Plan</span>
            </div>

            {/* Payment Failed Banner */}
            {showPaymentFailed && (
              <div
                className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl" aria-hidden="true">⚠️</span>
                    <div>
                      <h2 className="text-lg font-semibold text-amber-900 mb-2">Payment Issue</h2>
                      <p className="text-amber-800">
                        We couldn't process your last payment. Don't worry — your trial is still active and you won't lose access.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPaymentFailedDismissed(true)}
                    className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                    aria-label="Dismiss payment warning"
                  >
                    Dismiss
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleRetryPayment}
                    className="flex-1 bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-xl hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                    aria-label="Retry payment"
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                    Retry Payment
                  </button>
                  <button
                    onClick={handleContactSupport}
                    className="flex-1 bg-white text-amber-700 font-semibold py-2.5 px-4 rounded-xl hover:bg-amber-50 border-2 border-amber-300 transition-colors flex items-center justify-center gap-2"
                    aria-label="Contact support for help"
                  >
                    <Mail className="w-4 h-4" aria-hidden="true" />
                    Contact Support
                  </button>
                </div>

                <div className="mt-4 bg-amber-100 rounded-xl p-4 flex items-start gap-2">
                  <span aria-hidden="true" className="text-base">💡</span>
                  <p className="text-amber-900 text-sm">
                    Your 14-day free trial continues while you resolve this. Take your time!
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Current plan summary */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-stone-900">Billing & Plan</h2>
                      <p className="text-stone-500 text-sm">Manage your subscription</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border-2 border-stone-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-stone-900">Current Plan</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${planDisplay.color}`}>
                          {planDisplay.label}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${subDisplay.color}`}>
                          <span aria-hidden="true">{subDisplay.icon}</span> {subDisplay.label}
                        </span>
                      </div>
                      {subStatus === 'trial' && (
                        <p className="text-sm text-stone-500">
                          {trialDaysLeft > 0
                            ? `Trial expires in ${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''}`
                            : 'Trial has expired'}
                        </p>
                      )}
                      {subStatus === 'active' && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Active subscription
                        </p>
                      )}
                    </div>
                    {subStatus === 'active' && (
                      <a
                        href="/plans"
                        className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 border border-stone-300 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors"
                      >
                        Manage <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {subStatus === 'trial' && (
                  <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">
                        Upgrade before your trial ends
                      </p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        After trial, your account will be read-only until you subscribe.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Plan cards */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="font-semibold text-stone-900 mb-1">Choose a Plan</h3>
                <p className="text-sm text-stone-500 mb-5">
                  All plans include a 14-day free trial. Cancel anytime.
                </p>
                <div className="space-y-4">
                  {PLANS.map((plan) => {
                    const isCurrent = planType === plan.id;
                    return (
                      <div
                        key={plan.id}
                        className={`rounded-xl border-2 p-5 transition-all ${
                          isCurrent ? 'border-green-400 bg-green-50' : 'border-stone-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 text-lg">{plan.name}</span>
                              {plan.popular && !isCurrent && (
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                  Most Popular
                                </span>
                              )}
                              {isCurrent && (
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500 text-white">
                                  Current
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-stone-500 mt-0.5">{plan.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-stone-900">{plan.price}</span>
                            <span className="text-stone-500 text-sm">{plan.period}</span>
                          </div>
                        </div>

                        <ul className="space-y-1.5 mb-4">
                          {plan.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-stone-600">
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>

                        {!isCurrent && (
                          <a
                            href="/plans"
                            className="block w-full text-center px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium"
                          >
                            {subStatus === 'trial' ? 'Start with' : 'Switch to'} {plan.name}
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer note */}
              <div className="bg-stone-50 rounded-xl p-4 text-sm text-stone-500 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-stone-400" />
                Payments are processed securely by Stripe. Need help with billing?{' '}
                <a href="mailto:help@getgroomgrid.com" className="text-green-600 hover:underline ml-1">
                  Contact support
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
