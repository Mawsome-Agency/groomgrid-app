'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { AlertCircle, ArrowRight, Lock, Mail, CheckCircle } from 'lucide-react';
import { trackSignupStarted } from '@/lib/ga4';
import ProgressIndicator from '@/components/funnel/ProgressIndicator';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [emailState, setEmailState] = useState<'untouched' | 'touched' | 'valid' | 'invalid'>('untouched');
  const [passwordState, setPasswordState] = useState<'untouched' | 'touched' | 'valid' | 'invalid'>('untouched');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupTracked, setSignupTracked] = useState(false);

  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validatePassword = useCallback((password: string) => {
    return password.length >= 8;
  }, []);

  useEffect(() => {
    if (formData.email && emailState === 'untouched') {
      setEmailState('touched');
      if (!signupTracked) {
        trackSignupStarted('new_user');
        setSignupTracked(true);
      }
    }
    if (formData.email) {
      setEmailState(validateEmail(formData.email) ? 'valid' : 'invalid');
    }
  }, [formData.email, emailState, validateEmail, signupTracked]);

  useEffect(() => {
    if (formData.password && passwordState === 'untouched') {
      setPasswordState('touched');
    }
    if (formData.password) {
      setPasswordState(validatePassword(formData.password) ? 'valid' : 'invalid');
    }
  }, [formData.password, passwordState, validatePassword]);

  const isFormValid = () => {
    return validateEmail(formData.email) && validatePassword(formData.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Generate a default business name for signup (will be updated in onboarding)
      const businessName = 'My Grooming Business';

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          businessName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.error || 'Failed to create account';
        if (message.includes('already in use')) {
          setError('An account with this email already exists. Try signing in instead.');
        } else {
          setError(message);
        }
        return;
      }

      // Sign in immediately after signup
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created but sign-in failed. Please sign in manually.');
        router.push('/login');
        return;
      }

      // Redirect to plans with context that user just signed up
      router.push('/plans?new_user=true');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-bold text-green-600">GroomGrid</span>
          </Link>
          <ProgressIndicator
            currentStep={1}
            totalSteps={3}
            stepLabels={['Create account', 'Choose plan', 'Start booking']}
          />
        </div>

        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-stone-900 text-sm mb-1">Never double-book again</h3>
              <p className="text-xs text-stone-600">Start your 14-day free trial. No credit card required.</p>
            </div>
          </div>
        </div>

        {error && (
          <div role="alert" aria-live="assertive" id="signup-error" className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" aria-hidden="true" />
              <input
                id="signup-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={() => {
                  if (formData.email) {
                    setEmailState(validateEmail(formData.email) ? 'valid' : 'invalid');
                  }
                }}
                placeholder="you@example.com"
                required
                autoComplete="email"
                aria-invalid={emailState === 'invalid'}
                aria-describedby={error ? 'signup-error' : emailState === 'invalid' ? 'email-error' : undefined}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${
                  emailState === 'valid'
                    ? 'border-green-500 focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    : emailState === 'invalid'
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
                    : 'border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent'
                }`}
              />
            </div>
            {emailState === 'invalid' && (
              <p id="email-error" role="alert" className="text-xs text-red-600 mt-1">Please enter a valid email address</p>
            )}
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" aria-hidden="true" />
              <input
                id="signup-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onBlur={() => {
                  if (formData.password) {
                    setPasswordState(validatePassword(formData.password) ? 'valid' : 'invalid');
                  }
                }}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
                aria-invalid={passwordState === 'invalid'}
                aria-describedby={error ? 'signup-error' : passwordState === 'invalid' ? 'password-error' : undefined}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${
                  passwordState === 'valid'
                    ? 'border-green-500 focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    : passwordState === 'invalid'
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent'
                    : 'border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent'
                }`}
              />
            </div>
            {passwordState === 'invalid' && (
              <p id="password-error" role="alert" className="text-xs text-red-600 mt-1">Password must be at least 8 characters</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-stone-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
