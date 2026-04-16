'use client';

/**
 * Request Queue Storage
 *
 * Core logic for managing queued API requests with localStorage persistence,
 * deduplication, and exponential backoff retry logic.
 */

const STORAGE_KEY = 'groomgrid_request_queue';
const MAX_QUEUE_SIZE = 100;
const DEFAULT_MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000; // 1 second
const MAX_DELAY_MS = 30000; // 30 seconds

export interface QueuedRequest {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: string;
  headers?: Record<string, string>;
  retries: number;
  maxRetries: number;
  createdAt: string;
  lastRetryAt?: string;
  nextRetryAt?: string;
  deduplicationKey: string;
}

/**
 * Calculate exponential backoff with jitter
 * @param retryCount - Current retry count (0-based)
 * @returns Delay in milliseconds
 */
export function calculateBackoff(retryCount: number): number {
  const exponentialDelay = Math.min(
    BASE_DELAY_MS * Math.pow(2, retryCount),
    MAX_DELAY_MS
  );
  // Add 30% jitter to avoid thundering herd
  const jitter = Math.random() * 0.3 * exponentialDelay;
  return exponentialDelay + jitter;
}

/**
 * Generate deduplication key for a request
 * @param url - Request URL
 * @param method - HTTP method
 * @param body - Request body (optional)
 * @returns SHA-256 hash as hex string
 */
export function generateDeduplicationKey(
  url: string,
  method: string,
  body?: string
): string {
  if (typeof window === 'undefined' || !window.crypto) {
    // Fallback for SSR or environments without crypto
    return `${method}:${url}:${body || ''}`;
  }

  const data = `${method}:${url}:${body || ''}`;
  const hashBuffer = window.crypto.subtle.digestSync(
    'SHA-256',
    new TextEncoder().encode(data)
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * RequestQueueStorage - Manages queued requests in localStorage
 */
export class RequestQueueStorage {
  /**
   * Load queue from localStorage
   * @returns Array of queued requests
   */
  load(): QueuedRequest[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];

      // Validate and filter invalid entries
      return parsed.filter((item): item is QueuedRequest => {
        return (
          item &&
          typeof item === 'object' &&
          typeof item.id === 'string' &&
          typeof item.url === 'string' &&
          typeof item.method === 'string' &&
          typeof item.retries === 'number' &&
          typeof item.maxRetries === 'number' &&
          typeof item.createdAt === 'string' &&
          typeof item.deduplicationKey === 'string'
        );
      });
    } catch (error) {
      console.error('Failed to load request queue:', error);
      return [];
    }
  }

  /**
   * Save queue to localStorage
   * @param queue - Array of queued requests
   */
  save(queue: QueuedRequest[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to save request queue:', error);
      // If quota exceeded, try to save a smaller subset
      try {
        const smallerQueue = queue.slice(0, Math.floor(queue.length / 2));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(smallerQueue));
      } catch (retryError) {
        console.error('Failed to save reduced queue:', retryError);
      }
    }
  }

  /**
   * Add request to queue with deduplication
   * @param request - Request to enqueue
   */
  enqueue(request: QueuedRequest): void {
    const queue = this.load();

    // Check for duplicate
    const existing = queue.find((r) => r.deduplicationKey === request.deduplicationKey);
    if (existing) {
      return; // Already queued
    }

    // Prune if over max size
    if (queue.length >= MAX_QUEUE_SIZE) {
      this.prune(queue);
    }

    queue.push(request);
    this.save(queue);
  }

  /**
   * Remove request from queue
   * @param id - Request ID to remove
   */
  dequeue(id: string): void {
    const queue = this.load();
    const filtered = queue.filter((r) => r.id !== id);
    this.save(filtered);
  }

  /**
   * Update retry information for a request
   * @param id - Request ID
   * @param retries - New retry count
   * @param nextRetryAt - ISO timestamp for next retry
   */
  updateRetryInfo(id: string, retries: number, nextRetryAt: string): void {
    const queue = this.load();
    const updated = queue.map((r) =>
      r.id === id
        ? {
            ...r,
            retries,
            lastRetryAt: new Date().toISOString(),
            nextRetryAt,
          }
        : r
    );
    this.save(updated);
  }

  /**
   * Get all requests ready for retry
   * @returns Array of requests whose nextRetryAt has passed
   */
  getReadyForRetry(): QueuedRequest[] {
    const queue = this.load();
    const now = new Date().toISOString();
    return queue.filter(
      (r) => !r.nextRetryAt || r.nextRetryAt <= now || r.retries >= r.maxRetries
    );
  }

  /**
   * Clear all requests from queue
   */
  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * Clear only failed requests (retries >= max)
   */
  clearFailed(): void {
    const queue = this.load();
    const active = queue.filter((r) => r.retries < r.maxRetries);
    this.save(active);
  }

  /**
   * Prune old requests to maintain max size
   * @param queue - Queue to prune (modified in place)
   */
  private prune(queue: QueuedRequest[]): void {
    if (queue.length <= MAX_QUEUE_SIZE) return;

    // Sort by creation time, oldest first
    queue.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Remove oldest entries
    const toRemove = queue.length - MAX_QUEUE_SIZE;
    queue.splice(0, toRemove);
  }

  /**
   * Get queue statistics
   * @returns Object with queue stats
   */
  getStats(): {
    total: number;
    pending: number;
    failed: number;
    readyForRetry: number;
  } {
    const queue = this.load();
    const now = new Date().toISOString();

    return {
      total: queue.length,
      pending: queue.filter((r) => r.retries < r.maxRetries).length,
      failed: queue.filter((r) => r.retries >= r.maxRetries).length,
      readyForRetry: queue.filter(
        (r) => !r.nextRetryAt || r.nextRetryAt <= now
      ).length,
    };
  }
}
