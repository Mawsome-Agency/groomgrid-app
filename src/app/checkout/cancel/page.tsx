import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CheckoutCancelContent } from './CheckoutCancelContent';

export const dynamic = 'force-dynamic';

/** Checkout cancel is session-dependent — no SEO value, prevent indexing */
export const metadata: Metadata = {
  title: 'Checkout Cancelled | GroomGrid',
  robots: { index: false, follow: false },
};

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <CheckoutCancelContent />
    </Suspense>
  );
}
