'use client';

import { useNetworkStatus } from '@/context/NetworkStatusContext';
import type { RequestQueueContextValue } from '@/context/RequestQueueContext';

export interface NetworkAwareFetchOptions extends RequestInit {
  timeout?: number; // ms, default 10000
  retries?: number; // default 0
  onNetworkError?: (error: Error) => void;
}

export type NetworkAwareFetch = (
  input: RequestInfo,
  init?: NetworkAwareFetchOptions
) => Promise<Response>;

/**
 * Returns a fetch wrapper that respects the NetworkStatusContext.
 * If offline, it rejects immediately.
 * If queueContext is provided, it increments/decrements the pending request counter.
 */
export const createNetworkAwareFetch = (
  context: ReturnType<typeof useNetworkStatus>,
  queueContext?: RequestQueueContextValue
): NetworkAwareFetch => {
  const { isOnline, checkConnection } = context;

  // Generate a unique ID for each request
  const generateRequestId = (): string => {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  return async (input: RequestInfo, init?: NetworkAwareFetchOptions) => {
    const requestId = generateRequestId();

    // Check connection first to prevent incrementing counter for failed pre-checks
    if (!isOnline) {
      const err = new Error('Network offline');
      if (init?.onNetworkError) init.onNetworkError(err);
      throw err;
    }

    // Add request to queue after confirming we're online
    queueContext?.addRequest(requestId);

    try {
      // Perform a health check before request
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
    } finally {
      // Remove request from queue when complete
      queueContext?.removeRequest(requestId);
    }
  };
};
