import type { Metadata } from 'next';
import Link from 'next/link';
import SiteFooter from '@/components/marketing/SiteFooter';

export const metadata: Metadata = {
  title: 'Privacy Policy | GroomGrid',
  description:
    'GroomGrid privacy policy — how we collect, use, and protect your personal information when you use our pet grooming business management platform.',
  alternates: {
    canonical: 'https://getgroomgrid.com/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | GroomGrid',
    description:
      'How GroomGrid collects, uses, and protects your personal information.',
    url: 'https://getgroomgrid.com/privacy',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors mb-8"
        >
          &larr; Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-stone-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-stone-500 mb-8">Last updated: April 2026</p>

        <div className="prose prose-stone max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-stone-800 mt-8 mb-3">
              Information We Collect
            </h2>
            <p className="text-stone-600 leading-relaxed">
              When you use GroomGrid, we collect information you provide directly —
              including your business name, email address, phone number, and payment
              information. We also collect usage data such as pages visited, features
              used, and device information to improve our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mt-8 mb-3">
              How We Use Your Information
            </h2>
            <p className="text-stone-600 leading-relaxed">
              We use your information to provide and improve our grooming business
              management platform, process payments, send appointment reminders and
              business notifications, and communicate about your account. We do not
              sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mt-8 mb-3">
              Data Security
            </h2>
            <p className="text-stone-600 leading-relaxed">
              We implement industry-standard security measures including encryption in
              transit (TLS) and at rest, secure authentication, and regular security
              audits. Your payment information is processed through Stripe and is never
              stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mt-8 mb-3">
              Your Rights
            </h2>
            <p className="text-stone-600 leading-relaxed">
              You can access, update, or delete your personal information at any time
              through your account settings. You may also request a copy of your data
              or ask us to stop processing it by contacting us at{' '}
              <a href="mailto:hello@getgroomgrid.com" className="text-green-600 hover:text-green-700 underline">
                hello@getgroomgrid.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-800 mt-8 mb-3">
              Contact Us
            </h2>
            <p className="text-stone-600 leading-relaxed">
              If you have questions about this privacy policy or our data practices,
              please reach out to{' '}
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
