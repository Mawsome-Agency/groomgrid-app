'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Calendar, Users, DollarSign, Plus, LogOut, Settings, Menu, X } from 'lucide-react';
import { trackPageView } from '@/lib/ga4';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    trackPageView('/dashboard', 'Dashboard');
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchProfile(session.user.id);
    }
  }, [status, session]);

  const fetchProfile = async (userId: string) => {
    try {
      const res = await fetch(`/api/profile?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const isTrial = profile?.subscription_status === 'trial';
  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const businessName = profile?.business_name || session.user.name || 'My Business';

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
          <a href="#" className="flex items-center gap-2 text-stone-900 font-medium">
            <Calendar className="w-5 h-5" /> Today
          </a>
          <a href="#" className="flex items-center gap-2 text-stone-600">
            <Calendar className="w-5 h-5" /> Schedule
          </a>
          <a href="#" className="flex items-center gap-2 text-stone-600">
            <Users className="w-5 h-5" /> Clients
          </a>
          <a href="#" className="flex items-center gap-2 text-stone-600">
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
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 text-green-700 font-medium">
                  <Calendar className="w-5 h-5" /> Today
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors">
                  <Calendar className="w-5 h-5" /> Schedule
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors">
                  <Users className="w-5 h-5" /> Clients
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors">
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
            {/* Trial Banner */}
            {isTrial && (
              <div className="bg-green-500 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Free Trial Active</h2>
                    <p className="text-green-100 text-sm">
                      {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining
                    </p>
                  </div>
                  <a
                    href="/settings"
                    className="px-4 py-2 bg-white text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                  >
                    Manage Subscription
                  </a>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-stone-500">Today</span>
                </div>
                <p className="text-3xl font-bold text-stone-900">0</p>
                <p className="text-xs text-stone-500 mt-1">appointments</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-stone-500">Clients</span>
                </div>
                <p className="text-3xl font-bold text-stone-900">0</p>
                <p className="text-xs text-stone-500 mt-1">total</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-stone-500">Revenue</span>
                </div>
                <p className="text-3xl font-bold text-stone-900">$0</p>
                <p className="text-xs text-stone-500 mt-1">this week</p>
              </div>
            </div>

            {/* FAB */}
            <button className="fixed bottom-6 right-6 lg:hidden w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </button>

            {/* Welcome Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome to GroomGrid!</h2>
              <p className="text-green-100 mb-6">
                Your account is set up and ready. Here's how to get started:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm flex-shrink-0">1</div>
                  <p>Add your first client from the Clients tab</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm flex-shrink-0">2</div>
                  <p>Book your first appointment</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm flex-shrink-0">3</div>
                  <p>Set your business hours in Settings</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
