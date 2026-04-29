import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CheckoutSuccessContent } from './CheckoutSuccessContent';

export const dynamic = 'force-dynamic';

/** Checkout success is session-dependent — no SEO value, prevent indexing */
export const metadata: Metadata = {
  title: 'Checkout Success | GroomGrid',
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center">
          <div className="text-stone-500">Loading...</div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
