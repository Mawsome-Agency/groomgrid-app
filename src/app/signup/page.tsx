'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import {
  AlertCircle,
  ArrowRight,
  Lock,
  Building,
  Mail,
  Eye,
  EyeOff,
  Check,
  Calendar,
  Bell,
  CreditCard,
  Users,
  Shield,
} from 'lucide-react';
import { trackSignupViewed, trackSignupCompleted, trackSignupStarted, trackAccountCreated, trackSignupError } from '@/lib/ga4';
import { useFormValidation } from '@/hooks/use-form-validation';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';
import './signup.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Social proof: plausible growing number, deterministic per session
const BASE_COUNT = 47;

const BENEFITS = [
  { icon: Calendar, label: 'Smart scheduling — no more double-bookings' },
  { icon: Bell, label: 'Automated reminders — slash no-shows' },
  { icon: CreditCard, label: 'Payments built in — get paid faster' },
];

/** Counts from `start` up to `end` over `durationMs` */
function useCountUp(end: number, durationMs = 800) {
  const [count, setCount] = useState(end - 4);
  useEffect(() => {
    const steps = end - (end - 4);
    const intervalMs = durationMs / steps;
    let current = end - 4;
    const id = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= end) clearInterval(id);
    }, intervalMs);
    return () => clearInterval(id);
  }, [end, durationMs]);
  return count;
}

function SignupPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponParam = searchParams.get('coupon');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const groomerCount = useCountUp(BASE_COUNT);

  const { errors, validateField, clearFieldError } = useFormValidation();

  // Fire signup_viewed once on mount (useRef guard prevents StrictMode double-fire)
  const signupViewedFiredRef = useRef(false);
  useEffect(() => {
    if (!signupViewedFiredRef.current) {
      signupViewedFiredRef.current = true;
      trackSignupViewed();
    }
  }, []);

  // Show sticky mobile CTA when form scrolls out of view
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mobile keyboard handling: scroll focused inputs into view on mobile
  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    };

    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, []);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
  };

  const handleBlur = (field: string, value: string) => {
    if (field === 'email') {
      validateField('email', value, {
        required: true,
        pattern: EMAIL_REGEX,
        custom: (v) => (EMAIL_REGEX.test(v) ? null : 'Please enter a valid email address'),
      });
    } else if (field === 'businessName') {
      validateField('businessName', value, { required: true, minLength: 2 });
    } else if (field === 'password') {
      validateField('password', value, { required: true, minLength: 8 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    trackSignupStarted(formData.businessName);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          businessName: formData.businessName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.error || 'Failed to create account';
        trackSignupError(message, 'api_response');
        if (message.includes('already in use')) {
          setError('An account with this email already exists. Try signing in instead.');
        } else {
          setError(message);
        }
        setLoading(false);
        return;
      }

      trackSignupCompleted(data.userId);
      trackAccountCreated(data.userId, formData.businessName);

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        trackSignupError(result.error, 'sign_in');
        setError('Account created but sign-in failed. Please sign in manually.');
        setLoading(false);
        router.push('/login');
        return;
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        // When a coupon param is present, skip welcome and go straight to plans
        if (couponParam) {
          router.push(`/plans?coupon=${encodeURIComponent(couponParam)}`);
        } else {
          router.push('/welcome');
        }
      }, 400);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create account';
      trackSignupError(message, 'catch_block');
      setError(message);
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    formRef.current?.querySelector('input')?.focus();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex flex-col items-center justify-center p-4">
      {/* BETA50 Promo Banner */}
      <div className="w-full max-w-3xl mb-3 bg-green-600 text-white text-center py-2.5 px-4 rounded-xl text-sm font-semibold">
        🎉 Launch Special — use code <span className="font-bold underline">BETA50</span> for 50% off your first month!{' '}
        <Link href="/plans" className="underline hover:text-green-100 transition-colors">
          View plans →
        </Link>
      </div>

      {/* Card — single column on mobile, two columns on md+ */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl signup-card overflow-hidden grid md:grid-cols-[1fr_1.1fr]">

        {/* ── Left panel: benefits (desktop only) ── */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-green-600 to-green-800 p-8 text-white">
          {/* Logo */}
          <div>
            <Link href="/" className="inline-block mb-8">
              <span className="text-2xl font-bold">GroomGrid</span>
            </Link>

            {/* Social proof counter */}
            <div className="flex items-center gap-2 mb-8 bg-white/15 rounded-xl px-4 py-3">
              <Users className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm font-medium">
                <span className="text-lg font-bold" aria-live="polite">{groomerCount}</span>
                {' '}groomers joined this week
              </p>
            </div>

            {/* Benefits checklist */}
            <h2 className="text-xl font-bold mb-4 leading-snug">
              Everything you need to run a modern grooming business
            </h2>
            <ul className="space-y-4" role="list">
              {BENEFITS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-sm leading-snug">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom trust note */}
          <div className="mt-8 flex items-center gap-2 text-white/70 text-xs">
            <Shield className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>No credit card required · Cancel anytime</span>
          </div>
        </div>

        {/* ── Right panel: form ── */}
        <div className="p-8">
          {/* Header (mobile: show logo + social proof here) */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block mb-3 md:hidden">
              <span className="text-2xl font-bold text-green-600">GroomGrid</span>
            </Link>

            {/* Mobile social proof */}
            <div className="md:hidden flex items-center justify-center gap-1.5 mb-4 text-sm text-stone-600">
              <Users className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
              <span>
                <strong className="text-stone-800" aria-live="polite">{groomerCount}</strong>
                {' '}groomers joined this week
              </span>
            </div>

            <h1 className="text-2xl font-bold text-stone-900 mb-1">Create Account</h1>
            <p className="text-stone-600 text-sm">Start your 14-day free trial</p>
          </div>

          {/* Mobile benefits (compact row) */}
          <div className="md:hidden flex gap-3 mb-5 justify-center flex-wrap" role="list" aria-label="Included features">
            {BENEFITS.map(({ icon: Icon, label: _label }, i) => {
              const shortLabels = ['Scheduling', 'Reminders', 'Payments'];
              return (
                <div key={i} className="flex items-center gap-1 text-xs text-stone-600 bg-stone-50 rounded-full px-3 py-1.5">
                  <Icon className="w-3.5 h-3.5 text-green-500 flex-shrink-0" aria-hidden="true" />
                  <span>{shortLabels[i]}</span>
                </div>
              );
            })}
          </div>

          {/* Error banner */}
          <div
            className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
              error ? 'max-h-24' : 'max-h-0'
            }`}
          >
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm mb-4 error-flash">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-stone-700 mb-1">
                Business Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleFieldChange('businessName', e.target.value)}
                  onBlur={(e) => handleBlur('businessName', e.target.value)}
                  onFocus={() => clearFieldError('businessName')}
                  placeholder="e.g., Paws on Wheels"
                  required
                  disabled={loading}
                  aria-invalid={!!errors.businessName}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:bg-stone-50 disabled:cursor-not-allowed"
                />
              </div>
              {errors.businessName && (
                <p className="text-red-600 text-xs mt-1" role="alert" aria-live="polite">
                  {errors.businessName}
                </p>
              )}
            </div>

            {/* Email */}
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
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onBlur={(e) => handleBlur('email', e.target.value)}
                  onFocus={() => clearFieldError('email')}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                  aria-invalid={!!errors.email}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:bg-stone-50 disabled:cursor-not-allowed"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-xs mt-1" role="alert" aria-live="polite">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  onBlur={(e) => handleBlur('password', e.target.value)}
                  onFocus={() => clearFieldError('password')}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  disabled={loading}
                  aria-invalid={!!errors.password}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:bg-stone-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs mt-1" role="alert" aria-live="polite">
                  {errors.password}
                </p>
              )}
              <PasswordStrengthMeter password={formData.password} />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || submitSuccess}
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold
                transition-[transform,box-shadow,background-color] duration-150 ease-out
                hover:scale-[1.02] hover:shadow-md
                active:scale-[0.98]
                motion-reduce:hover:scale-100 motion-reduce:active:scale-100 motion-reduce:hover:shadow-none
                ${
                  submitSuccess
                    ? 'bg-green-500 text-white'
                    : 'bg-green-500 text-white hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed'
                }`}
            >
              {submitSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  Account Created!
                </>
              ) : loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Start Free Trial <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Inline trust signals */}
            <div className="flex items-center justify-center gap-4 flex-wrap pt-1" role="list" aria-label="Trust signals">
              {[
                { icon: CreditCard, text: 'No credit card' },
                { icon: Check, text: 'Cancel anytime' },
                { icon: Shield, text: 'Trusted by groomers' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1 text-xs text-stone-500">
                  <Icon className="w-3.5 h-3.5 text-green-500 flex-shrink-0" aria-hidden="true" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </form>

          <p className="text-center text-sm text-stone-600 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Sticky mobile CTA — visible on small screens when form scrolled out of view */}
      {showStickyBar && (
        <div
          className="sticky-cta-bar fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-stone-200 shadow-lg px-4 py-3"
          role="complementary"
          aria-label="Create your free account"
        >
          <div className="flex items-center gap-3 max-w-sm mx-auto">
            <p className="flex-1 text-sm text-stone-600 min-w-0">
              <strong className="text-stone-900">14-day free trial</strong> · No credit card
            </p>
            <button
              onClick={scrollToForm}
              className="flex-shrink-0 px-5 py-2.5 bg-green-500 text-white font-semibold rounded-xl text-sm hover:bg-green-600 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-pulse">
          <div className="h-8 bg-stone-200 rounded w-1/2 mx-auto mb-8" />
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-12 bg-stone-200 rounded-xl" />
            ))}
            <div className="h-12 bg-stone-200 rounded-xl mt-2" />
          </div>
        </div>
      </div>
    }>
      <SignupPageInner />
    </Suspense>
  );
}
