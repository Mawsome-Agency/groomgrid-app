import { Suspense } from 'react';
import { CheckoutCancelContent } from './CheckoutCancelContent';

export const dynamic = 'force-dynamic';

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <CheckoutCancelContent />
    </Suspense>
  );
}
