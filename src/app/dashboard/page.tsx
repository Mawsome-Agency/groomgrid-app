'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Calendar, Users, DollarSign, Plus, LogOut, Settings, Menu, X, AlertCircle, RefreshCw } from 'lucide-react';
import { trackPageView } from '@/lib/ga4';
import PaymentProcessingBanner from '@/components/PaymentProcessingBanner';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Appointment {
  id: string;
  service: string;
  startTime: string;
  status: string;
  client: { name: string };
  pet?: { name: string };
}

interface Client {
  id: string;
  name: string;
  _count: { appointments: number };
}

interface DashboardError {
  type: 'network' | 'timeout' | 'server' | 'parse' | 'unknown';
  message: string;
  retryable: boolean;
}

const FETCH_TIMEOUT = 15000; // 15 seconds

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [clientCount, setClientCount] = useState(0);
  const [weekRevenue, setWeekRevenue] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DashboardError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    trackPageView('/dashboard', 'Dashboard');
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      fetchDashboardData();
    }
  }, [status, session]);

  const fetchDashboardData = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      // Combine the passed signal with our timeout signal
      const combinedSignal = signal ?
        AbortSignal.any([signal, controller.signal]) :
        controller.signal;

      const [profileRes, appointmentsRes, clientsRes] = await Promise.all([
        fetch(`/api/profile?userId=${session?.user?.id}`, { signal: combinedSignal }),
        fetch('/api/clients', { signal: combinedSignal }),
        fetch('/api/appointments', { signal: combinedSignal }),
      ]);

      clearTimeout(timeoutId);

      // Check for HTTP errors
      const errors: string[] = [];

      if (!profileRes.ok) {
        errors.push(`Profile: ${profileRes.status}`);
      }
      if (!clientsRes.ok) {
        errors.push(`Clients: ${clientsRes.status}`);
      }
      if (!appointmentsRes.ok) {
        errors.push(`Appointments: ${appointmentsRes.status}`);
      }

      if (errors.length > 0) {
        throw new Error(`Server errors: ${errors.join(', ')}`);
      }

      // Parse responses
      let profileData, clientsData, appointmentsData;

      try {
        profileData = await profileRes.json();
        clientsData = await clientsRes.json();
        appointmentsData = await appointmentsRes.json();
      } catch (parseErr) {
        console.error('Failed to parse API responses:', parseErr);
        throw new Error('Unable to process server response');
      }

      // Set state with parsed data
      setProfile(profileData.profile);
      setClientCount(clientsData.clients.length);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);

      const todayApps = appointmentsData.appointments.filter((appt: Appointment) => {
        const apptTime = new Date(appt.startTime);
        return apptTime >= today && apptTime <= endOfToday;
      });
      setTodayAppointments(todayApps);

      // Calculate revenue for the last 7 days (completed appointments only)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekApps = appointmentsData.appointments.filter((appt: Appointment) => {
        const apptTime = new Date(appt.startTime);
        return apptTime >= weekAgo && appt.status === 'completed';
      });
      const revenue = weekApps.reduce((sum: number, appt: Appointment) => {
        const servicePrices: Record<string, number> = {
          'Full Groom': 65,
          'Bath + Brush': 40,
          'Nail Trim': 20,
          'Teeth Brushing': 15,
        };
        return sum + (servicePrices[appt.service] || 0);
      }, 0);
      setWeekRevenue(revenue);

    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);

      // Determine error type and user-friendly message
      let errorType: DashboardError['type'] = 'unknown';
      let errorMessage = 'Unable to load your dashboard';
      let retryable = true;

      if (err.name === 'AbortError') {
        errorType = 'timeout';
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        errorType = 'network';
        errorMessage = 'Network connection issue. Please check your internet connection.';
      } else if (err.message?.includes('Server errors')) {
        errorType = 'server';
        errorMessage = 'Server is temporarily unavailable. Please try again later.';
      } else if (err.message?.includes('parse') || err.message?.includes('JSON')) {
        errorType = 'parse';
        errorMessage = 'Unable to process data. Please try again.';
        retryable = false;
      }

      setError({
        type: errorType,
        message: errorMessage,
        retryable,
      });

      // Log to Sentry if available (non-blocking)
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(err, {
          tags: { component: 'dashboard', errorType },
          extra: { userId: session?.user?.id },
        });
      }
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  const handleRetry = () => {
    setIsRetrying(true);
    fetchDashboardData();
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchDashboardData();
    } catch (err) {
      console.error('Failed to update appointment:', err);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-stone-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-stone-900">Unable to Load Dashboard</h2>
          </div>
          <p className="text-stone-600 mb-6">{error.message}</p>
          {error.retryable && (
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRetrying ? (
                <>
                  <LoadingSpinner size="sm" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </>
              )}
            </button>
          )}
          <button
            onClick={() => router.push('/')}
            className="w-full mt-3 px-4 py-3 text-stone-600 hover:text-stone-900 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const isTrial = profile?.subscription_status === 'trial';
  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

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
                <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 text-green-700 font-medium">
                  <Calendar className="w-5 h-5" /> Today
                </a>
                <a href="/schedule" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors">
                  <Calendar className="w-5 h-5" /> Schedule
                </a>
                <a href="/clients" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors">
                  <Users className="w-5 h-5" /> Clients
                </a>
                <a href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors">
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
            {/* Payment Processing Banner */}
            <PaymentProcessingBanner />

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
                <p className="text-3xl font-bold text-stone-900">{todayAppointments.length}</p>
                <p className="text-xs text-stone-500 mt-1">appointment{todayAppointments.length !== 1 ? 's' : ''}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-stone-500">Clients</span>
                </div>
                <p className="text-3xl font-bold text-stone-900">{clientCount}</p>
                <p className="text-xs text-stone-500 mt-1">total</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm text-stone-500">Revenue</span>
                </div>
                <p className="text-3xl font-bold text-stone-900">${weekRevenue}</p>
                <p className="text-xs text-stone-500 mt-1">this week</p>
              </div>
            </div>

            {/* Today's Appointments */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-stone-900">Today's Appointments</h2>
                <a href="/schedule" className="text-sm text-green-600 hover:text-green-700">
                  View Calendar →
                </a>
              </div>

              {todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-stone-500 mb-4">No appointments scheduled for today</p>
                  <a
                    href="/schedule"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Book Appointment
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayAppointments
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                    .map((appt) => (
                      <div
                        key={appt.id}
                        className={`border rounded-xl p-4 ${
                          appt.status === 'completed' ? 'border-green-200 bg-green-50' :
                          appt.status === 'cancelled' ? 'border-stone-200 bg-stone-50' :
                          'border-stone-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-stone-900">{appt.service}</p>
                            <p className="text-sm text-stone-600">
                              {new Date(appt.startTime).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit'
                              })} · {appt.client.name}
                              {appt.pet && <span> · {appt.pet.name}</span>}
                            </p>
                          </div>
                          {appt.status === 'scheduled' && (
                            <button
                              onClick={() => handleStatusChange(appt.id, 'completed')}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                              title="Mark as complete"
                            >
                              <Calendar className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* FAB */}
            <button
              onClick={() => router.push('/schedule')}
              className="fixed bottom-6 right-6 lg:hidden w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <Plus className="w-6 h-6" />
            </button>

            {/* Welcome Card (shown only if no data) */}
            {todayAppointments.length === 0 && clientCount === 0 && weekRevenue === 0 && (
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome to GroomGrid!</h2>
                <p className="text-green-100 mb-6">
                  Your account is set up and ready. Here's how to get started:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm flex-shrink-0">1</div>
                    <p>Add your first client from the <a href="/clients" className="underline">Clients tab</a></p>
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
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
