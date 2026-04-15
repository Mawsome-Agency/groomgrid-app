'use client';

import { useCallback } from 'react';
import { useNetworkStatus } from '@/context/NetworkStatusContext';

/**
 * Hook to get the current online status and a memoized function to manually check.
 */
export const useOnlineStatus = () => {
  const { isOnline, checkConnection } = useNetworkStatus();
  const manualCheck = useCallback(() => {
    checkConnection();
  }, [checkConnection]);
  return { isOnline, manualCheck };
};
