'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { AlertCircle, ArrowRight, Lock, Building, Mail, Check, X } from 'lucide-react';
import { trackSignupStarted, trackAccountCreated, trackValidationError, getSessionId } from '@/lib/ga4';
import { useApiTiming } from '@/hooks/use-funnel-timing';
import { validateEmail, validatePassword, validateBusinessName } from '@/lib/validators';
import { fieldId, fieldErrorId, ariaDescribedBy, ariaInvalid } from '@/lib/accessibility';

type FieldState = 'untouched' | 'touched' | 'valid' | 'invalid' | 'pending-validation';

export default function SignupPage() {
  const router = useRouter();
  const { startTiming: startSignupTiming, endTiming: endSignupTiming } = useApiTiming('/api/auth/signup');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Field-level validation states
  const [fieldStates, setFieldStates] = useState<{
    email: FieldState;
    password: FieldState;
    businessName: FieldState;
  }>({
    email: 'untouched',
    password: 'untouched',
    businessName: 'untouched',
  });

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    businessName?: string;
  }>({});

  useEffect(() => {
    if (formData.businessName) {
      trackSignupStarted(formData.businessName);
    }
  }, [formData.businessName]);

  // Async email validation (checks if email exists)
  const validateEmailAvailability = useCallback(async (email: string) => {
    try {
      const res = await fetch(`/api/auth/validate-email?email=${encodeURIComponent(email)}`);
      const data = await res.json();

      if (!data.isValid) {
        return { isValid: false, error: data.error || 'Email is not available' };
      }

      return { isValid: true };
    } catch {
      return { isValid: true }; // On API error, allow validation to proceed
    }
  }, []);

  // Blur handlers for each field
  const handleBlur = useCallback(async (field: 'email' | 'password' | 'businessName') => {
    setFieldStates(prev => ({ ...prev, [field]: 'touched' }));

    const value = formData[field];
    let validationResult;

    switch (field) {
      case 'email':
        // Async validation for email
        setFieldStates(prev => ({ ...prev, email: 'pending-validation' }));
        validationResult = await validateEmailAvailability(value);
        break;
      case 'password':
        validationResult = validatePassword(value);
        break;
      case 'businessName':
        validationResult = validateBusinessName(value);
        break;
    }

    if (validationResult.isValid) {
      setFieldStates(prev => ({ ...prev, [field]: 'valid' }));
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    } else {
      setFieldStates(prev => ({ ...prev, [field]: 'invalid' }));
      setFieldErrors(prev => ({ ...prev, [field]: validationResult.error }));
      // Track validation error to GA4
      trackValidationError(field, 'validation_error', validationResult.error || 'Invalid input');
    }
  }, [formData, validateEmailAvailability]);

  const handleFieldChange = (field: 'email' | 'password' | 'businessName', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error state while typing if field was invalid
    if (fieldStates[field] === 'invalid') {
      setFieldStates(prev => ({ ...prev, [field]: 'touched' }));
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isFormValid = (): boolean => {
    return fieldStates.email === 'valid' &&
           fieldStates.password === 'valid' &&
           fieldStates.businessName === 'valid';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    // Start timing for signup API call
    startSignupTiming();

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
        // Track API timing with error
        endSignupTiming(false, message.includes('already in use') ? 'email_exists' : 'unknown_error');
        if (message.includes('already in use')) {
          setError('An account with this email already exists. Try signing in instead.');
        } else {
          setError(message);
        }
        return;
      }

      // Track API timing success
      endSignupTiming(true);

      // Track account creation event
      trackAccountCreated(data.userId, formData.businessName);

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

      router.push('/plans');
    } catch (err: any) {
      // Track API timing with error
      endSignupTiming(false, 'network_error');
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center p-4">
      <main
        id="main-content"
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
        aria-label="Create Account"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4" aria-label="GroomGrid home">
            <span className="text-2xl font-bold text-green-600" aria-hidden="true">GroomGrid</span>
          </Link>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Create Account</h1>
          <p className="text-stone-600">Start your 14-day free trial</p>
        </div>

        {/* Error Alert — role="alert" ensures screen reader announces it immediately */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm mb-4"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Business Name Field */}
          <div>
            <label
              htmlFor={fieldId('businessName')}
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Business Name{' '}
              <span aria-hidden="true" className="text-red-500">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" aria-hidden="true" />
              <input
                id={fieldId('businessName')}
                type="text"
                value={formData.businessName}
                onChange={(e) => handleFieldChange('businessName', e.target.value)}
                onBlur={() => handleBlur('businessName')}
                placeholder="e.g., Paws on Wheels"
                required
                autoComplete="organization"
                aria-required="true"
                aria-invalid={ariaInvalid(fieldStates.businessName === 'invalid')}
                aria-describedby={ariaDescribedBy('businessName', {
                  hasError: fieldStates.businessName === 'invalid' && !!fieldErrors.businessName,
                })}
                className={`w-full pl-10 pr-10 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:border-transparent ${
                  fieldStates.businessName === 'valid'
                    ? 'border-green-500 focus:ring-green-500'
                    : fieldStates.businessName === 'invalid'
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-stone-200 focus:ring-green-500'
                }`}
              />
              {fieldStates.businessName === 'valid' && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" aria-hidden="true" />
              )}
              {fieldStates.businessName === 'invalid' && (
                <X className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" aria-hidden="true" />
              )}
            </div>
            {fieldErrors.businessName && (
              <p
                id={fieldErrorId('businessName')}
                className="mt-1 text-xs text-red-500"
                role="alert"
                aria-live="polite"
              >
                {fieldErrors.businessName}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor={fieldId('email')}
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Email Address{' '}
              <span aria-hidden="true" className="text-red-500">*</span>
              <span className="sr-only">(required)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" aria-hidden="true" />
              <input
                id={fieldId('email')}
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="you@example.com"
                required
                autoComplete="email"
                aria-required="true"
                aria-invalid={ariaInvalid(fieldStates.email === 'invalid')}
                aria-describedby={ariaDescribedBy('email', {
                  hasError: fieldStates.email === 'invalid' && !!fieldErrors.email,
                })}
                aria-busy={fieldStates.email === 'pending-validation'}
                className={`w-full pl-10 pr-10 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:border-transparent ${
                  fieldStates.email === 'valid'
                    ? 'border-green-500 focus:ring-green-500'
                    : fieldStates.email === 'invalid'
                    ? 'border-red-500 focus:ring-red-500'
                    : fieldStates.email === 'pending-validation'
                    ? 'border-amber-400'
                    : 'border-stone-200 focus:ring-green-500'
                }`}
              />
              {fieldStates.email === 'valid' && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" aria-hidden="true" />
              )}
              {fieldStates.email === 'invalid' && (
                <X className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" aria-hidden="true" />
              )}
              {fieldStates.email === 'pending-validation' && (
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  role="status"
                  aria-label="Validating email…"
                >
                  <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {fieldErrors.email && (
              <p
                id={fieldErrorId('email')}
                className="mt-1 text-xs text-red-500"
                role="alert"
                aria-live="polite"
              >
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor={fieldId('password')}
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Password{' '}
              <span aria-hidden="true" className="text-red-500">*</span>
              <span className="sr-only">(required)</span>
            </label>
            {/* Password hint always in DOM — referenced by aria-describedby */}
            <p id={fieldErrorId('password') + '-hint'} className="sr-only">
              Minimum 8 characters required
            </p>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" aria-hidden="true" />
              <input
                id={fieldId('password')}
                type="password"
                value={formData.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
                aria-required="true"
                aria-invalid={ariaInvalid(fieldStates.password === 'invalid')}
                aria-describedby={ariaDescribedBy('password', {
                  hasError: fieldStates.password === 'invalid' && !!fieldErrors.password,
                  hasHint: true,
                })}
                className={`w-full pl-10 pr-10 py-3 rounded-xl border outline-none transition-all focus:ring-2 focus:border-transparent ${
                  fieldStates.password === 'valid'
                    ? 'border-green-500 focus:ring-green-500'
                    : fieldStates.password === 'invalid'
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-stone-200 focus:ring-green-500'
                }`}
              />
              {fieldStates.password === 'valid' && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" aria-hidden="true" />
              )}
              {fieldStates.password === 'invalid' && (
                <X className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" aria-hidden="true" />
              )}
            </div>
            {fieldErrors.password && (
              <p
                id={fieldErrorId('password')}
                className="mt-1 text-xs text-red-500"
                role="alert"
                aria-live="polite"
              >
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid()}
            aria-busy={loading}
            aria-disabled={loading || !isFormValid()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                <span>Creating Account…</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
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
      </main>
    </div>
  );
}
