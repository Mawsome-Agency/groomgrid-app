'use client';

/**
 * NetworkStatusContext - React Context for online/offline status.
 * Provides global detection using browser events and a health check API.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

export type NetworkErrorType = 'offline' | 'timeout' | 'server_error' | 'unknown';

interface NetworkStatusContextValue {
  isOnline: boolean;
  isOffline: boolean;
  wasOffline: boolean;
  lastChanged: Date | null;
  lastChecked: Date | null;
  errorType: NetworkErrorType | null;
  checkConnection: () => Promise<boolean>;
  goOnline: () => void;
}

const NetworkStatusContext = createContext<NetworkStatusContextValue | undefined>(undefined);

export const NetworkStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(true); // default true for SSR
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const [lastChanged, setLastChanged] = useState<Date | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [errorType, setErrorType] = useState<NetworkErrorType | null>(null);

  // Event listeners for browser online/offline events
  useEffect(() => {
    const goOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      setLastChanged(new Date());
      setErrorType(null);
    };
    const goOffline = () => {
      setIsOnline(false);
      setLastChanged(new Date());
      setErrorType('offline');
    };
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    // Initialize based on navigator.onLine
    setIsOnline(navigator.onLine);
    if (!navigator.onLine) {
      setErrorType('offline');
    }
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setLastChecked(new Date());
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        setIsOnline(true);
        setErrorType(null);
        return true;
      }
      setIsOnline(false);
      setErrorType('server_error');
      return false;
    } catch {
      setIsOnline(false);
      setErrorType('offline');
      return false;
    }
  }, []);

  const goOnline = useCallback(() => {
    setIsOnline(true);
    setWasOffline(true);
    setLastChanged(new Date());
    setErrorType(null);
  }, []);

  const value = useMemo<NetworkStatusContextValue>(() => ({
    isOnline,
    isOffline: !isOnline,
    wasOffline,
    lastChanged,
    lastChecked,
    errorType,
    checkConnection,
    goOnline,
  }), [isOnline, wasOffline, lastChanged, lastChecked, errorType, checkConnection, goOnline]);

  return (
    <NetworkStatusContext.Provider value={value}>
      {children}
    </NetworkStatusContext.Provider>
  );
};

export const useNetworkStatus = (): NetworkStatusContextValue => {
  const context = useContext(NetworkStatusContext);
  if (!context) {
    throw new Error('useNetworkStatus must be used within a NetworkStatusProvider');
  }
  return context;
};
