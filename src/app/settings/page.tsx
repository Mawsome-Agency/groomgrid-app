'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Settings, Calendar, Users, LogOut, Menu, X,
  Clock, CreditCard, Bell, User, ChevronRight, Shield,
} from 'lucide-react';
import { trackPageView } from '@/lib/ga4';

const SETTINGS_SECTIONS = [
  {
    group: 'Business',
    description: 'Configure your business preferences',
    items: [
      {
        href: '/settings/business-hours',
        icon: Clock,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        title: 'Business Hours',
        description: 'Set your operating hours for bookings',
        badge: null as string | null,
      },
      {
        href: '/settings/profile',
        icon: User,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        title: 'Business Profile',
        description: 'Edit your business name and contact info',
        badge: null as string | null,
      },
    ],
  },
  {
    group: 'Account',
    description: 'Manage your subscription and notifications',
    items: [
      {
        href: '/settings/billing',
        icon: CreditCard,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        title: 'Billing & Plan',
        description: 'View your plan and manage your subscription',
        badge: null as string | null,
      },
      {
        href: '/settings/notifications',
        icon: Bell,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        title: 'Notifications',
        description: 'Configure email reminders and alerts',
        badge: null as string | null,
      },
    ],
  },
  {
    group: 'Security',
    description: 'Keep your account safe',
    items: [
      {
        href: '#',
        icon: Shield,
        iconBg: 'bg-stone-100',
        iconColor: 'text-stone-500',
        title: 'Password & Security',
        description: 'Change your password and security settings',
        badge: 'Soon',
      },
    ],
  },
];

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

  const handleSignOut = async () => signOut({ callbackUrl: '/' });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Loading...</div>
      </div>
    );
  }

  const isTrial = profile?.subscription_status === 'trial';
  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / 86400000))
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
          <a href="/schedule" className="flex items-center gap-2 text-stone-600">
            <Calendar className="w-5 h-5" /> Schedule
          </a>
          <a href="/clients" className="flex items-center gap-2 text-stone-600">
            <Users className="w-5 h-5" /> Clients
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

              {/* Settings sub-nav */}
              <div className="mt-6 pt-4 border-t border-stone-100">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-4 mb-2">
                  Jump To
                </p>
                <nav className="space-y-0.5">
                  {SETTINGS_SECTIONS.flatMap(s => s.items).filter(i => i.badge !== 'Soon').map(({ href, icon: Icon, title }) => (
                    <a
                      key={href}
                      href={href}
                      className="flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-colors"
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {title}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200">
                <button onClick={handleSignOut} className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">
            {/* Trial Banner */}
            {isTrial && (
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Free Trial Active</h2>
                    <p className="text-green-100 text-sm">
                      {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining ·{' '}
                      <a href="/settings/billing" className="underline hover:text-white">
                        Upgrade to unlock all features
                      </a>
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )}

            {/* Page header */}
            <div>
              <h2 className="text-2xl font-bold text-stone-900">Settings</h2>
              <p className="text-stone-500 text-sm mt-0.5">
                Manage your account and business preferences
              </p>
            </div>

            {/* Settings groups */}
            {SETTINGS_SECTIONS.map((section) => (
              <div key={section.group} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100">
                  <h3 className="font-semibold text-stone-900">{section.group}</h3>
                  <p className="text-sm text-stone-500">{section.description}</p>
                </div>
                <div className="divide-y divide-stone-100">
                  {section.items.map(({ href, icon: Icon, iconBg, iconColor, title, description, badge }) => {
                    const isDisabled = badge === 'Soon';
                    const Wrapper = isDisabled ? 'div' : 'a';
                    return (
                      <Wrapper
                        key={title}
                        {...(!isDisabled ? { href } : {})}
                        className={`flex items-center justify-between px-6 py-4 transition-colors ${
                          isDisabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-stone-50 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-5 h-5 ${iconColor}`} />
                          </div>
                          <div>
                            <p className="font-medium text-stone-900">{title}</p>
                            <p className="text-sm text-stone-500">{description}</p>
                          </div>
                        </div>
                        {badge ? (
                          <span className="text-xs bg-stone-200 text-stone-600 px-2.5 py-1 rounded-full font-medium">
                            {badge}
                          </span>
                        ) : (
                          <ChevronRight className="w-5 h-5 text-stone-400 flex-shrink-0" />
                        )}
                      </Wrapper>
                    );
                  })}
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
