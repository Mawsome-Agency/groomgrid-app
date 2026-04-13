'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { AlertCircle, ArrowRight, Lock, Building, Mail, Eye, EyeOff, Check } from 'lucide-react';
import { trackSignupStarted, trackAccountCreated, trackSignupError } from '@/lib/ga4';
import { useFormValidation } from '@/hooks/use-form-validation';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { errors, validateField, clearFieldError } = useFormValidation();

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when value changes
    clearFieldError(field);
  };

  const handleBlur = (field: string, value: string) => {
    if (field === 'email') {
      validateField('email', value, {
        required: true,
        pattern: EMAIL_REGEX,
        custom: (v) => EMAIL_REGEX.test(v) ? null : 'Please enter a valid email address',
      });
    } else if (field === 'businessName') {
      validateField('businessName', value, {
        required: true,
        minLength: 2,
      });
    } else if (field === 'password') {
      validateField('password', value, {
        required: true,
        minLength: 8,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Track signup started event
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

      // Track account creation event
      trackAccountCreated(data.userId, formData.businessName);

      // Sign in immediately after signup
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

      // Show success state briefly before navigate
      setSubmitSuccess(true);
      setTimeout(() => {
        router.push('/welcome');
      }, 400);
    } catch (err: any) {
      trackSignupError(err.message || 'network_error', 'catch_block');
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-bold text-green-600">GroomGrid</span>
          </Link>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Create Account</h1>
          <p className="text-stone-600">Start your 14-day free trial</p>
        </div>

        {/* Animated error banner */}
        <div
          className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${
            error ? 'max-h-24' : 'max-h-0'
          }`}
        >
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Business Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
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
            <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
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
            <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
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

          <button
            type="submit"
            disabled={loading || submitSuccess}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
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
                Create Account <ArrowRight className="w-5 h-5" />
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
