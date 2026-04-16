import { createNetworkAwareFetch } from '@/lib/network-fetch';
import { RequestQueueContextValue } from '@/context/RequestQueueContext';

// Mock fetch
global.fetch = jest.fn();

describe('createNetworkAwareFetch', () => {
  let mockNetworkContext: any;
  let mockQueueContext: RequestQueueContextValue;
  let addRequestCalls: string[] = [];
  let removeRequestCalls: string[] = [];

  beforeEach(() => {
    addRequestCalls = [];
    removeRequestCalls = [];

    mockNetworkContext = {
      isOnline: true,
      checkConnection: jest.fn().mockResolvedValue(true),
    };

    mockQueueContext = {
      pendingCount: 0,
      requestIds: new Set(),
      addRequest: (id: string) => { addRequestCalls.push(id); },
      removeRequest: (id: string) => { removeRequestCalls.push(id); },
      clearRequests: () => {},
    };

    (global.fetch as jest.Mock).mockClear();
  });

  it('creates a fetch function', () => {
    const fetch = createNetworkAwareFetch(mockNetworkContext);
    expect(typeof fetch).toBe('function');
  });

  it('works without queueContext (backward compatibility)', async () => {
    const fetch = createNetworkAwareFetch(mockNetworkContext);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
    });

    await fetch('https://example.com');

    expect(global.fetch).toHaveBeenCalled();
  });

  it('generates and uses request IDs when queueContext is provided', async () => {
    const fetch = createNetworkAwareFetch(mockNetworkContext, mockQueueContext);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
    });

    await fetch('https://example.com');

    // Should have called addRequest and removeRequest with the same ID
    expect(addRequestCalls.length).toBe(1);
    expect(removeRequestCalls.length).toBe(1);
    expect(addRequestCalls[0]).toBe(removeRequestCalls[0]);
    expect(addRequestCalls[0]).toMatch(/^req_\d+_[a-z0-9]+$/);
  });

  it('checks connection before adding request to queue', async () => {
    const fetch = createNetworkAwareFetch(mockNetworkContext, mockQueueContext);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
    });

    await fetch('https://example.com');

    // Should call checkConnection before making the request
    expect(mockNetworkContext.checkConnection).toHaveBeenCalled();
    // Should have added request after checking connection
    expect(addRequestCalls.length).toBe(1);
  });

  it('rejects immediately when offline without adding to queue', async () => {
    mockNetworkContext.isOnline = false;
    const fetch = createNetworkAwareFetch(mockNetworkContext, mockQueueContext);

    await expect(fetch('https://example.com')).rejects.toThrow('Network offline');

    expect(global.fetch).not.toHaveBeenCalled();
    // Should not have added to queue when offline
    expect(addRequestCalls.length).toBe(0);
  });

  it('still cleans up request ID even when offline', async () => {
    mockNetworkContext.isOnline = false;
    const fetch = createNetworkAwareFetch(mockNetworkContext, mockQueueContext);

    await expect(fetch('https://example.com')).rejects.toThrow('Network offline');

    // Still should have called add and remove (even though it failed early)
    expect(addRequestCalls.length).toBe(1);
    expect(removeRequestCalls.length).toBe(1);
  });

  it('cleans up request ID even when request fails', async () => {
    const fetch = createNetworkAwareFetch(mockNetworkContext, mockQueueContext);
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(fetch('https://example.com')).rejects.toThrow('Network error');

    expect(addRequestCalls.length).toBe(1);
    expect(removeRequestCalls.length).toBe(1);
  });

  it('cleans up request ID even when request times out', async () => {
    const fetch = createNetworkAwareFetch(mockNetworkContext, mockQueueContext);
    (global.fetch as jest.Mock).mockImplementation(() => {
      return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 100);
      });
    });

    await expect(fetch('https://example.com', { timeout: 50 })).rejects.toThrow();

    expect(addRequestCalls.length).toBe(1);
    expect(removeRequestCalls.length).toBe(1);
  });

  it('passes through request options', async () => {
    const fetch = createNetworkAwareFetch(mockNetworkContext, mockQueueContext);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
    });

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' }),
    };

    await fetch('https://example.com', options);

    expect(global.fetch).toHaveBeenCalledWith('https://example.com', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' }),
    }));
  });

  it('handles timeout correctly', async () => {
    const fetch = createNetworkAwareFetch(mockNetworkContext, mockQueueContext);
    (global.fetch as jest.Mock).mockImplementation(() => {
      return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 100);
      });
    });

    await expect(fetch('https://example.com', { timeout: 50 })).rejects.toThrow();

    expect(addRequestCalls.length).toBe(1);
    expect(removeRequestCalls.length).toBe(1);
  });

  it('calls onNetworkError callback on HTTP error', async () => {
    const onNetworkError = jest.fn();
    const fetch = createNetworkAwareFetch(mockNetworkContext, mockQueueContext);
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    });

    await fetch('https://example.com', { onNetworkError });

    expect(onNetworkError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('calls onNetworkError callback on network error', async () => {
    const onNetworkError = jest.fn();
    const fetch = createNetworkAwareFetch(mockNetworkContext, mockQueueContext);
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(fetch('https://example.com', { onNetworkError })).rejects.toThrow();

    expect(onNetworkError).toHaveBeenCalledWith(expect.any(Error));
  });
});
