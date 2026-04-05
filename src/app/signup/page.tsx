'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle, ArrowRight, Lock, Building } from 'lucide-react';
import { signUp } from '@/lib/supabase';
import { createProfile } from '@/lib/supabase';
import { trackSignupStarted } from '@/lib/ga4';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    trackSignupStarted(formData.businessName);
  }, [formData.businessName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign up user
      const data = await signUp(formData.email, formData.password, formData.businessName);
      
      if (data.user) {
        // Create profile
        await createProfile(data.user.id, formData.businessName);
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-stone-900 mb-2">Check Your Email</h1>
            <p className="text-stone-600">
              We sent a confirmation link to <strong>{formData.email}</strong>
            </p>
          </div>

          <div className="bg-stone-50 rounded-xl p-4 text-left">
            <p className="text-sm text-stone-700 mb-2">Next steps:</p>
            <ol className="text-sm text-stone-600 space-y-1 list-decimal list-inside">
              <li>Open the email we just sent you</li>
              <li>Click the confirmation link</li>
              <li>Choose your plan and start your trial</li>
            </ol>
          </div>

          <p className="text-sm text-stone-500">
            Didn't receive an email? Check your spam folder or{' '}
            <button
              onClick={() => setSuccess(false)}
              className="text-green-600 hover:underline"
            >
              try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Create Account</h1>
          <p className="text-stone-600">Start your 14-day free trial</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Business Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g., Paws on Wheels"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-5 h-5" />
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
