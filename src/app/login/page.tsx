'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { AlertCircle, ArrowRight, CheckCircle2, Lock, Mail, Send } from 'lucide-react';
import TrustSignals from '@/components/trust/TrustSignals';
import SiteFooter from '@/components/marketing/SiteFooter';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    const urlError = searchParams.get('error');
    if (urlError) {
      const decoded = decodeURIComponent(urlError);
      if (decoded === 'EMAIL_NOT_VERIFIED' || urlError === 'EMAIL_NOT_VERIFIED') {
        setNeedsVerification(true);
      } else {
        setError(decoded);
      }
    }
    // Show success message after email verification
  }, [searchParams]);

  const justVerified = searchParams.get('verified') === 'true';

  // Mobile keyboard handling: scroll focused inputs into view
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') {
        // Small delay so the keyboard has time to appear
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    };

    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, []);

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      if (res.ok) {
        setResendSent(true);
      }
    } catch {
      setResendSent(true); // Don't reveal whether email exists
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // Check if this is our custom email verification error
        if (result.error === 'EMAIL_NOT_VERIFIED' || result.error.includes('EMAIL_NOT_VERIFIED')) {
          setNeedsVerification(true);
          return;
        }
        // For CredentialsSignin, could be wrong password or unverified email
        if (result.error === 'CredentialsSignin') {
          // Try to check if this user needs verification
          try {
            const checkRes = await fetch('/api/auth/check-verification', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: formData.email }),
            });
            if (checkRes.ok) {
              const checkData = await checkRes.json();
              if (checkData.needsVerification) {
                setNeedsVerification(true);
                return;
              }
            }
          } catch {
            // Fall through to generic error
          }
          setError('Invalid email or password. Please check your credentials and try again.');
        } else {
          setError(result.error);
        }
        return;
      }

      const next = searchParams.get('next') || '/dashboard';
      router.push(next);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-bold text-green-600">GroomGrid</span>
          </Link>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Welcome back</h1>
          <p className="text-stone-600">Sign in to your account</p>
        </div>

        {/* Email Verified Success Banner */}
        {justVerified && !needsVerification && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 text-green-700 text-sm mb-6">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-medium">Email verified!</span> You can now sign in with your credentials.
            </div>
          </div>
        )}

        {/* Email Verification Required Banner */}
        {needsVerification && (
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 mb-6">
            <div className="flex items-start gap-2 mb-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="text-amber-800 font-medium">Please verify your email</p>
                <p className="text-amber-700 text-sm mt-1">
                  We sent a verification link to <strong>{formData.email}</strong>. Check your inbox and spam folder.
                </p>
              </div>
            </div>
            {resendSent ? (
              <div className="flex items-center gap-2 text-green-700 text-sm mt-2">
                <CheckCircle2 className="w-4 h-4" />
                Verification email resent! Check your inbox.
              </div>
            ) : (
              <button
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="flex items-center gap-2 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors mt-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {resendLoading ? 'Sending...' : 'Resend verification email'}
              </button>
            )}
          </div>
        )}

        {/* Error Alert */}
        {error && !needsVerification && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setNeedsVerification(false); setError(''); }}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-stone-700">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs text-green-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Your password"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone-600 mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-green-600 hover:underline font-medium">
            Start free trial
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-stone-100">
          <TrustSignals location="login" compact={true} />
        </div>
      </div>
      </div>
      <SiteFooter />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
