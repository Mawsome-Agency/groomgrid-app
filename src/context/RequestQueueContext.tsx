'use client';

/**
 * RequestQueueContext - React Context for tracking in-flight network requests.
 * Provides a pending request counter that can be incremented/decremented
 * to show users how many requests are queued when offline.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface RequestQueueContextValue {
  pendingCount: number;
  requestIds: ReadonlySet<string>;
  addRequest: (id: string) => void;
  removeRequest: (id: string) => void;
  clearRequests: () => void;
}

// Context – undefined means "outside provider"
const RequestQueueContext = createContext<RequestQueueContextValue | undefined>(undefined);

/**
 * Provider – keeps a Set of request IDs to track pending requests.
 * Guarantees pendingCount never drops below 0.
 */
export const RequestQueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requestIds, setRequestIds] = useState<Set<string>>(new Set());

  const addRequest = useCallback((id: string) => {
    setRequestIds(prev => new Set([...prev, id]));
  }, []);

  const removeRequest = useCallback((id: string) => {
    setRequestIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const clearRequests = useCallback(() => {
    setRequestIds(new Set());
  }, []);

  // pendingCount is derived from Set size - never goes below 0 naturally
  const pendingCount = requestIds.size;

  return (
    <RequestQueueContext.Provider value={{
      pendingCount,
      requestIds,
      addRequest,
      removeRequest,
      clearRequests
    }}>
      {children}
    </RequestQueueContext.Provider>
  );
};

/**
 * Hook – throws a clear error if used incorrectly.
 */
export const useRequestQueue = (): RequestQueueContextValue => {
  const ctx = useContext(RequestQueueContext);
  if (!ctx) {
    throw new Error('useRequestQueue must be used within a RequestQueueProvider');
  }
  return ctx;
};
