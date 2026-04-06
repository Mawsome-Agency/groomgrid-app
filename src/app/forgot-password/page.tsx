'use client';

import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
          <Mail className="w-10 h-10 text-green-500" />
        </div>

        <div>
          <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-bold text-green-600">GroomGrid</span>
          </Link>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Password Reset</h1>
          <p className="text-stone-600 text-sm">
            Self-service password reset is coming soon.
          </p>
        </div>

        <div className="bg-stone-50 rounded-xl p-4 text-left">
          <p className="text-sm text-stone-700 mb-1 font-medium">In the meantime:</p>
          <p className="text-sm text-stone-600">
            Email us at{' '}
            <a
              href="mailto:hello@getgroomgrid.com"
              className="text-green-600 hover:underline font-medium"
            >
              hello@getgroomgrid.com
            </a>{' '}
            and we'll reset your password within a few hours.
          </p>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
      </div>
    </div>
  );
}
