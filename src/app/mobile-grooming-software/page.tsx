import type { Metadata } from 'next';
import Link from 'next/link';
import { BOFUAnalyticsWrapper } from '@/components/analytics';

export const metadata: Metadata = {
  title: 'Mobile Grooming Software | GroomGrid',
  description: 'Best software for mobile dog groomers.',
};

export default function MobileGroomingSoftwarePage() {
  return (
    <BOFUAnalyticsWrapper
      pageType="software-guide"
      pageName="mobile-grooming-software">
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
