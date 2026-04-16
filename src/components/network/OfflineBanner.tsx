'use client';

import React from 'react';
import { useNetworkStatus } from '@/context/NetworkStatusContext';
import { useRequestQueue } from '@/context/RequestQueueContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface OfflineBannerProps {
  position?: 'top' | 'bottom';
  className?: string;
  onRetry?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  position = 'top',
  className,
  onRetry
}) => {
  const { isOffline, goOnline } = useNetworkStatus();
  const { pendingCount } = useRequestQueue();

  // State 1: online - hidden
  if (!isOffline) return null;

  const baseClasses = 'fixed left-0 right-0 bg-red-600 text-white py-2 z-50 flex items-center justify-center';
  const posClass = position === 'top' ? 'top-0' : 'bottom-0';
  const hasPendingRequests = pendingCount > 0;

  // State 2: offline-empty (generic offline message)
  if (!hasPendingRequests) {
    return (
      <div
        className={`${baseClasses} ${posClass} ${className ?? ''}`}
        role="status"
        aria-live="polite"
      >
        <span>You are currently offline. Some features may be unavailable.</span>
      </div>
    );
  }

  // State 3: offline-queued (show pendingCount with spinner and Retry button)
  return (
    <div
      className={`${baseClasses} gap-2 ${posClass} ${className ?? ''}`}
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size="sm" className="text-white" />
      <span>
        You are currently offline. {pendingCount} request{pendingCount !== 1 ? 's' : ''} queued.
      </span>
      <button
        onClick={() => {
          goOnline();
          onRetry?.();
        }}
        className="ml-2 px-3 py-1 bg-white text-red-600 rounded text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-white"
        type="button"
      >
        Retry
      </button>
    </div>
  );
};
