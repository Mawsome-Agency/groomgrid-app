import { Suspense } from 'react';
import { CheckoutSuccessContent } from './CheckoutSuccessContent';

export const dynamic = 'force-dynamic';

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
