'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Settings, Calendar, Users, LogOut, Menu, X, ArrowLeft, Bell } from 'lucide-react';
import { trackPageView } from '@/lib/ga4';

const NOTIFICATION_PREFS = [
  {
    id: 'appointment_reminders',
    title: 'Appointment Reminders',
    description: 'Automatically email clients 24h before their appointment',
    active: true,
    status: 'live' as const,
  },
  {
    id: 'no_show_alerts',
    title: 'No-Show Alerts',
    description: 'Get notified when a client misses their appointment',
    active: true,
    status: 'live' as const,
  },
  {
    id: 'new_booking',
    title: 'New Booking Notifications',
    description: 'Receive an alert when a new appointment is booked',
    active: false,
    status: 'coming_soon' as const,
  },
  {
    id: 'weekly_summary',
    title: 'Weekly Summary',
    description: 'A weekly email digest of bookings and revenue',
    active: false,
    status: 'coming_soon' as const,
  },
  {
    id: 'payment_received',
    title: 'Payment Received',
    description: 'Confirm when a client payment is processed',
    active: false,
    status: 'coming_soon' as const,
  },
];

export default function NotificationsSettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    trackPageView('/settings/notifications', 'Settings - Notifications');
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  const handleSignOut = async () => {
    const { signOut } = await import('next-auth/react');
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Mobile Header */}
      <header className="bg-white border-b border-stone-200 lg:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 text-stone-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-stone-900">Notifications</h1>
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
              <span className="text-stone-900 font-medium">Notifications</span>
            </div>

            <div className="space-y-6">
              {/* Notifications list */}
              <div className="bg-white rounded-2xl shadow-sm">
                <div className="p-6 border-b border-stone-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">Notifications</h2>
                    <p className="text-stone-500 text-sm">Control how GroomGrid communicates with you and your clients</p>
                  </div>
                </div>

                <div className="divide-y divide-stone-100">
                  {NOTIFICATION_PREFS.map((pref) => (
                    <div key={pref.id} className="flex items-start justify-between px-6 py-4">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-stone-900">{pref.title}</p>
                          {pref.status === 'live' && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                              Active
                            </span>
                          )}
                          {pref.status === 'coming_soon' && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-200 text-stone-600">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">{pref.description}</p>
                      </div>

                      {/* Toggle — display only */}
                      <div
                        className={`relative w-10 h-5 rounded-full flex-shrink-0 ${
                          pref.status === 'coming_soon' ? 'opacity-40 cursor-not-allowed' : ''
                        } ${pref.active ? 'bg-green-500' : 'bg-stone-300'}`}
                        title={pref.status === 'coming_soon' ? 'Coming soon' : undefined}
                      >
                        <span
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                            pref.active ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info banner */}
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                <Bell className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-800">Reminders are already live</p>
                  <p className="text-xs text-green-700 mt-0.5">
                    GroomGrid automatically sends clients a 24-hour reminder email before their
                    appointment. Full notification controls are coming soon.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
