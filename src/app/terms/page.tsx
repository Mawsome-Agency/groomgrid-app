import type { Metadata } from 'next';
import Link from 'next/link';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Terms of Service | GroomGrid',
  description:
    'GroomGrid terms of service — the agreement that governs your use of our pet grooming business management platform, including subscriptions, payments, and account responsibilities.',
  alternates: {
    canonical: 'https://getgroomgrid.com/terms',
  },
  openGraph: {
    title: 'Terms of Service | GroomGrid',
    description:
      'Terms governing your use of the GroomGrid pet grooming business management platform.',
    url: 'https://getgroomgrid.com/terms',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors mb-8"
        >
          &larr; Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-stone-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-stone-500 mb-8">Last updated: April 2026</p>

        <div className="prose prose-stone max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-stone-800 mt-8 mb-3">
              Acceptance of Terms
            </h2>
            <p className="text-stone-600 leading-relaxed">
              By accessing or using GroomGrid, you agree to be bound by these Terms
              of Service. If you do not agree to these terms, please do not use our
              platform. These terms apply to all users including groomers, salon
              owners, and their clients.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mt-8 mb-3">
              Subscription and Payments
            </h2>
            <p className="text-stone-600 leading-relaxed">
              GroomGrid offers paid subscription plans. You are responsible for all
              charges incurred under your account. Subscriptions auto-renew at the
              end of each billing period. You may cancel your subscription at any
              time through your account settings. Refunds are handled in accordance
              with our cancellation policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mt-8 mb-3">
              Your Responsibilities
            </h2>
            <p className="text-stone-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account
              credentials and for all activities under your account. You agree to
              provide accurate business information, use the platform lawfully, and
              not misuse or attempt to disrupt our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mt-8 mb-3">
              Limitation of Liability
            </h2>
            <p className="text-stone-600 leading-relaxed">
              GroomGrid is provided &ldquo;as is&rdquo; without warranties of any
              kind. We are not liable for any indirect, incidental, or consequential
              damages arising from your use of the platform. Our total liability
              shall not exceed the amount you paid in the twelve months prior to the
              claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mt-8 mb-3">
              Contact Us
            </h2>
            <p className="text-stone-600 leading-relaxed">
              If you have questions about these terms, please contact us at{' '}
              <a href="mailto:hello@getgroomgrid.com" className="text-green-600 hover:text-green-700 underline">
                hello@getgroomgrid.com
              </a>.
            </p>
          </section>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
