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
  description: 'AI-powered pet grooming business management platform',
  alternates: {
    canonical: 'https://getgroomgrid.com',
  },
  openGraph: {
    title: 'GroomGrid - Pet Grooming Business Management',
    description: 'AI-powered pet grooming business management platform',
    url: 'https://getgroomgrid.com',
    siteName: 'GroomGrid',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
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
