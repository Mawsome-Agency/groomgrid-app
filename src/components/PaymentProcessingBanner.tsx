'use client';

import React, { useState, useEffect } from 'react';

interface PaymentLockout {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export default function PaymentProcessingBanner() {
  const [lockout, setLockout] = useState<PaymentLockout | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // Fetch payment lockout status on component mount
    fetchPaymentLockoutStatus();
  }, []);

  const fetchPaymentLockoutStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payment/lockout');
      if (response.ok) {
        const data = await response.json();
        setLockout(data.lockout);
      }
    } catch (error) {
      console.error('Failed to fetch payment lockout status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAgain = async () => {
    try {
      setChecking(true);
      const response = await fetch('/api/payment/check-status');
      if (response.ok) {
        // Refresh the lockout status
        await fetchPaymentLockoutStatus();
      }
    } catch (error) {
      console.error('Failed to check payment status:', error);
    } finally {
      setChecking(false);
    }
  };

  // Don't show banner if no lockout or already completed
  if (!lockout || lockout.status === 'completed' || loading) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            {lockout.status === 'processing' ? 'Payment Processing' : 'Payment Failed'}
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              {lockout.status === 'processing' 
                ? 'Your payment is being confirmed. This may take a few moments. Please don\'t close this page.' 
                : 'There was an issue processing your payment. Please check your payment method.'}
            </p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <button
                onClick={handleCheckAgain}
                disabled={checking}
                className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600 disabled:opacity-50"
              >
                {checking ? 'Checking...' : 'Check Again'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}