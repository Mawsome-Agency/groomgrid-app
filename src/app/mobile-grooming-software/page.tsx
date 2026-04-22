import type { Metadata } from 'next';
import Link from 'next/link';
import { BOFUAnalyticsWrapper } from '@/components/analytics';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mobile Grooming Software | GroomGrid',
  description: 'The best mobile grooming software for dog groomers on the go. Scheduling, routing, reminders, and payments — all from your phone.',
  alternates: {
    canonical: 'https://getgroomgrid.com/mobile-grooming-software',
  },
  openGraph: {
    title: 'Mobile Grooming Software | GroomGrid',
    description: 'The best mobile grooming software for dog groomers on the go. Scheduling, routing, reminders, and payments — all from your phone.',
    url: 'https://getgroomgrid.com/mobile-grooming-software',
  },
};

export default function MobileGroomingSoftwarePage() {
  return (
    <BOFUAnalyticsWrapper
      pageType="software-guide"
      sectionIds={['hero', 'cta']}
      sectionTitles={['Hero', 'CTA']}>
      <div className="min-h-screen bg-white">
        <header className="px-6 py-12 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold">Mobile Grooming Software</h1>
          <Link href="/signup" className="inline-block mt-6 px-6 py-3 bg-green-500 text-white rounded">
            Start Free Trial
          </Link>
        </header>
      </div>
    </BOFUAnalyticsWrapper>
  );
}
