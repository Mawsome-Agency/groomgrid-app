'use client';

import { useNetworkStatus } from '@/context/NetworkStatusContext';

export interface NetworkAwareFetchOptions extends RequestInit {
  timeout?: number; // ms, default 10000
  retries?: number; // default 0
  onNetworkError?: (error: Error) => void;
}

/**
 * Returns a fetch wrapper that respects the NetworkStatusContext.
 * If offline, it rejects immediately.
 */
export const createNetworkAwareFetch = (context: ReturnType<typeof useNetworkStatus>) => {
  const { isOnline, checkConnection } = context;
  return async (input: RequestInfo, init?: NetworkAwareFetchOptions) => {
    if (!isOnline) {
      const err = new Error('Network offline');
      if (init?.onNetworkError) init.onNetworkError(err);
      throw err;
    }
    // Optionally perform a health check before request
    await checkConnection();
    const { timeout = 10000, retries = 0, onNetworkError, ...rest } = init ?? {};
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(input, { ...rest, signal: controller.signal });
      clearTimeout(id);
      if (!response.ok && onNetworkError) {
        onNetworkError(new Error(`HTTP ${response.status}`));
      }
      return response;
    } catch (e) {
      clearTimeout(id);
      if (onNetworkError) onNetworkError(e as Error);
      throw e;
    }
  };
};
