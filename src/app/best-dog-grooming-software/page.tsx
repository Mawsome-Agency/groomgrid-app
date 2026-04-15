import type { Metadata } from 'next';
import Link from 'next/link';
import { BOFUAnalyticsWrapper } from '@/components/analytics';

export const metadata: Metadata = {
  title: 'Best Dog Grooming Software 2025 | GroomGrid',
  description: 'Compare top grooming software options for your business.',
};

export default function BestDogGroomingSoftwarePage() {
  return (
    <BOFUAnalyticsWrapper
      pageType="software-guide"
      pageName="best-dog-grooming-software">
      <div className="min-h-screen bg-white">
        <header className="px-6 py-12 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold">Best Dog Grooming Software</h1>
          <Link href="/signup" className="inline-block mt-6 px-6 py-3 bg-green-500 text-white rounded">
            Start Free Trial
          </Link>
        </header>
      </div>
    </BOFUAnalyticsWrapper>
  );
}
