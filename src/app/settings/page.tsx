'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Settings, Calendar, Users, LogOut, Menu, X, ArrowLeft, Clock, CreditCard, Bell, User, Shield } from 'lucide-react';
import { trackPageView } from '@/lib/ga4';

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    trackPageView('/settings', 'Settings');
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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isTrial = profile?.subscription_status === 'trial';
  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const businessName = profile?.business_name || session?.user?.name || 'My Business';

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Mobile Header */}
      <header className="bg-white border-b border-stone-200 lg:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-green-600">GroomGrid</h1>
            <p className="text-xs text-stone-500">{businessName}</p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-600"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-3">
          <a href="/dashboard" className="flex items-center gap-2 text-stone-900 font-medium">
            <Calendar className="w-5 h-5" /> Today
          </a>
          <a href="/schedule" className="flex items-center gap-2 text-stone-600">
            <Calendar className="w-5 h-5" /> Schedule
          </a>
          <a href="/clients" className="flex items-center gap-2 text-stone-600">
            <Users className="w-5 h-5" /> Clients
          </a>
          <a href="/settings" className="flex items-center gap-2 text-stone-600">
            <Settings className="w-5 h-5" /> Settings
          </a>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-red-600 w-full"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar (Desktop) */}
          <aside className="hidden lg:block">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h1 className="text-2xl font-bold text-green-600 mb-6">GroomGrid</h1>

              <nav className="space-y-2">
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
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            {/* Subscription Banner */}
            {isTrial && (
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Free Trial Active</h2>
                    <p className="text-green-100 text-sm">
                      {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining · <a href="/plans" className="underline hover:text-white">Upgrade to unlock all features</a>
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )}

            {/* Settings Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-stone-900">Settings</h1>
                <p className="text-stone-600">Manage your account and business preferences</p>
              </div>
            </div>

            {/* Settings Sections */}
            <div className="space-y-4">
              {/* Business Settings */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-200">
                  <h2 className="font-semibold text-stone-900">Business</h2>
                  <p className="text-sm text-stone-500">Configure your business details</p>
                </div>
                <div className="divide-y divide-stone-100">
                  <a
                    href="/settings/business-hours"
                    className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">Business Hours</p>
                        <p className="text-sm text-stone-500">Set your operating hours for bookings</p>
                      </div>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-stone-400 rotate-180" />
                  </a>
                </div>
              </div>

              {/* Account Settings */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-200">
                  <h2 className="font-semibold text-stone-900">Account</h2>
                  <p className="text-sm text-stone-500">Manage your account settings</p>
                </div>
                <div className="divide-y divide-stone-100">
                  <a
                    href="/settings/business-hours"
                    className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors opacity-50 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-stone-500" />
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">Profile</p>
                        <p className="text-sm text-stone-500">Edit your profile information</p>
                      </div>
                    </div>
                    <span className="text-xs bg-stone-200 text-stone-600 px-2 py-1 rounded-full">Coming Soon</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors opacity-50 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-stone-500" />
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">Billing & Subscription</p>
                        <p className="text-sm text-stone-500">Manage your payment methods and plan</p>
                      </div>
                    </div>
                    <span className="text-xs bg-stone-200 text-stone-600 px-2 py-1 rounded-full">Coming Soon</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors opacity-50 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-stone-500" />
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">Notifications</p>
                        <p className="text-sm text-stone-500">Configure email and push notifications</p>
                      </div>
                    </div>
                    <span className="text-xs bg-stone-200 text-stone-600 px-2 py-1 rounded-full">Coming Soon</span>
                  </a>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-200">
                  <h2 className="font-semibold text-stone-900">Security</h2>
                  <p className="text-sm text-stone-500">Protect your account</p>
                </div>
                <div className="divide-y divide-stone-100">
                  <a
                    href="#"
                    className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors opacity-50 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-stone-500" />
                      </div>
                      <div>
                        <p className="font-medium text-stone-900">Password & Security</p>
                        <p className="text-sm text-stone-500">Change your password and security settings</p>
                      </div>
                    </div>
                    <span className="text-xs bg-stone-200 text-stone-600 px-2 py-1 rounded-full">Coming Soon</span>
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
