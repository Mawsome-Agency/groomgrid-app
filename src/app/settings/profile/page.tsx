'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Settings, Calendar, Users, LogOut, Menu, X,
  ArrowLeft, Save, CheckCircle, AlertCircle, User,
} from 'lucide-react';
import { trackPageView } from '@/lib/ga4';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const [form, setForm] = useState({ businessName: '', phone: '' });
  const [original, setOriginal] = useState({ businessName: '', phone: '' });

  useEffect(() => {
    trackPageView('/settings/profile', 'Settings - Profile');
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

  useEffect(() => {
    setHasChanges(JSON.stringify(form) !== JSON.stringify(original));
  }, [form, original]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        const loaded = {
          businessName: data?.business_name || data?.businessName || '',
          phone: data?.phone || '',
        };
        setForm(loaded);
        setOriginal(loaded);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: form.businessName, phone: form.phone }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }
      setOriginal({ ...form });
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ ...original });
    setError('');
  };

  const handleSignOut = async () => signOut({ callbackUrl: '/' });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Loading...</div>
      </div>
    );
  }

  const businessName = form.businessName || session?.user?.name || 'My Business';

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Mobile Header */}
      <header className="bg-white border-b border-stone-200 lg:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 text-stone-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-stone-900">Business Profile</h1>
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
              <span className="text-stone-900 font-medium">Business Profile</span>
            </div>

            <div className="space-y-6">
              {/* Profile Form */}
              <div className="bg-white rounded-2xl shadow-sm">
                <div className="p-6 border-b border-stone-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">Business Profile</h2>
                    <p className="text-stone-500 text-sm">Your business name and contact details</p>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.businessName}
                      onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                      placeholder="Fluffy Paws Grooming"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                    <p className="text-xs text-stone-400 mt-1">
                      This name appears on client communications and invoices.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="(555) 555-5555"
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={session?.user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-stone-100 bg-stone-50 text-stone-400 text-sm cursor-not-allowed"
                    />
                    <p className="text-xs text-stone-400 mt-1">
                      Email cannot be changed here. Contact support if needed.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl p-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-3">
                      {saveSuccess && (
                        <span className="text-sm text-green-600 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4" /> Saved!
                        </span>
                      )}
                      {hasChanges && !saving && !saveSuccess && (
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={!hasChanges || saving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                    >
                      {saving ? 'Saving…' : <><Save className="w-4 h-4" /> Save Changes</>}
                    </button>
                  </div>
                </div>
              </div>

              {/* Account info (read-only display) */}
              <div className="bg-stone-50 rounded-xl p-4 text-sm text-stone-500">
                Signed in as <strong className="text-stone-700">{session?.user?.email}</strong>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
