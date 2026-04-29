import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CheckoutErrorContent } from './CheckoutErrorContent';

export const dynamic = 'force-dynamic';

/** Checkout error is session-dependent — no SEO value, prevent indexing */
export const metadata: Metadata = {
  title: 'Checkout Error | GroomGrid',
  robots: { index: false, follow: false },
};

export default function CheckoutErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <CheckoutErrorContent />
    </Suspense>
  );
}
