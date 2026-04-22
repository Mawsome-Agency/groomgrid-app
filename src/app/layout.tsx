import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { SessionProvider } from '@/components/SessionProvider';
import { ABTestProvider } from '@/components/ab-test';
import SessionExpirationDetector from '@/components/session-expiration/SessionExpirationDetector';
import { NetworkStatusProvider } from '@/context/NetworkStatusContext';
import { RequestQueueProvider } from '@/context/RequestQueueContext';
import { OfflineBanner } from '@/components/network';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GroomGrid - Pet Grooming Business Management',
  description:
    'Stop losing money to no-shows and double bookings. AI-powered scheduling, client records, automated reminders, and payments — built for pet groomers.',
  alternates: {
    canonical: 'https://getgroomgrid.com',
  },
  openGraph: {
    title: 'GroomGrid - Pet Grooming Business Management',
    description:
      'Stop losing money to no-shows and double bookings. AI-powered scheduling, client records, automated reminders, and payments — built for pet groomers.',
    url: 'https://getgroomgrid.com',
    siteName: 'GroomGrid',
    type: 'website',
  },
};

/** Schema.org structured data for GroomGrid Organization + WebSite */
const schemaOrg = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://getgroomgrid.com/#organization',
      name: 'GroomGrid',
      url: 'https://getgroomgrid.com',
      logo: 'https://getgroomgrid.com/logo.png',
      description:
        'AI-powered pet grooming business management platform — scheduling, client records, reminders, and payments.',
      foundingDate: '2025',
      sameAs: [],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@getgroomgrid.com',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://getgroomgrid.com/#website',
      url: 'https://getgroomgrid.com',
      name: 'GroomGrid',
      publisher: { '@id': 'https://getgroomgrid.com/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://getgroomgrid.com/blog?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'GroomGrid',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: [
        {
          '@type': 'Offer',
          name: 'Solo',
          price: '29',
          priceCurrency: 'USD',
          description: 'For independent mobile groomers',
        },
        {
          '@type': 'Offer',
          name: 'Salon',
          price: '79',
          priceCurrency: 'USD',
          description: 'For grooming salons with 2–5 groomers',
        },
        {
          '@type': 'Offer',
          name: 'Enterprise',
          price: '149',
          priceCurrency: 'USD',
          description: 'For multi-location grooming businesses',
        },
      ],
    },
  ],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Schema.org structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaOrg }}
        />
        {/* GA4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <ABTestProvider>
            <NetworkStatusProvider>
              <RequestQueueProvider>
                <OfflineBanner position="top" className="fixed inset-x-0 top-0" />
                {children}
                <SessionExpirationDetector />
              </RequestQueueProvider>
            </NetworkStatusProvider>
          </ABTestProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
