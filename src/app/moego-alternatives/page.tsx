import type { Metadata } from 'next';
import Link from 'next/link';
import { BOFUAnalyticsWrapper } from '@/components/analytics';

export const metadata: Metadata = {
  title: 'MoeGo Alternatives | GroomGrid',
  description: 'See why groomers are switching from MoeGo to GroomGrid.',
  alternates: {
    canonical: 'https://getgroomgrid.com/moego-alternatives',
  },
  openGraph: {
    title: 'MoeGo Alternatives | GroomGrid',
    description: 'See why groomers are switching from MoeGo to GroomGrid.',
    url: 'https://getgroomgrid.com/moego-alternatives',
  },
};

export default function MoeGoAlternativesPage() {
  return (
    <BOFUAnalyticsWrapper
      pageType="alternative"
      pageName="moego-alternatives"
      competitorName="MoeGo">
      <div className="min-h-screen bg-white">
        <header className="px-6 py-12 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold">MoeGo Alternatives</h1>
          <Link href="/signup" className="inline-block mt-6 px-6 py-3 bg-green-500 text-white rounded">
            Start Free Trial
          </Link>
        </header>
      </div>
    </BOFUAnalyticsWrapper>
  );
}
