import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { SessionProvider } from '@/components/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GroomGrid - Pet Grooming Business Management',
  description: 'AI-powered pet grooming business management platform',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5, // Allows user zooming (accessibility)
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
        {/* Skip navigation - WCAG 2.4.1 */}
        <a href="#main-content" className="sr-only focus:not-sr-only fixed left-4 top-4 z-[9999] px-4 py-2 bg-green-600 text-white font-semibold rounded-lg transition-transform focus:translate-y-0 translate-y-[-100%]">
          Skip to main content
        </a>
        {/* Global live region for screen reader announcements */}
        <div
          id="sr-announcer"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          role="status"
        />
        <SessionProvider>
          <main id="main-content">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
