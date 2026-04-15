import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { SessionProvider } from '@/components/SessionProvider';
import { ABTestProvider } from '@/components/ab-test';
import SessionExpirationDetector from '@/components/session-expiration/SessionExpirationDetector';
import { NetworkStatusProvider } from '@/context/NetworkStatusContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GroomGrid - Pet Grooming Business Management',
  description: 'AI-powered pet grooming business management platform',
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
              {children}
              <SessionExpirationDetector />
            </NetworkStatusProvider>
          </ABTestProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
