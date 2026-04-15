'use client';

import React from 'react';
import { useNetworkStatus } from '@/context/NetworkStatusContext';

interface OfflineBannerProps {
  position?: 'top' | 'bottom';
  className?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ position = 'top', className }) => {
  const { isOffline } = useNetworkStatus();

  if (!isOffline) return null;

  const baseClasses =
    'fixed left-0 right-0 bg-red-600 text-white text-center py-2 z-50';
  const posClass = position === 'top' ? 'top-0' : 'bottom-0';

  return (
    <div className={`${baseClasses} ${posClass} ${className ?? ''}`}>
      You are currently offline. Some features may be unavailable.
    </div>
  );
};
