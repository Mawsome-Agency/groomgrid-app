import { Suspense } from 'react';
import { CheckoutErrorContent } from './CheckoutErrorContent';

export const dynamic = 'force-dynamic';

export default function CheckoutErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <CheckoutErrorContent />
    </Suspense>
  );
}
