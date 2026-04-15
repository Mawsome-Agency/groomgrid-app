import { checkRateLimit } from '../rate-limit';

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Clear the store before each test
    jest.resetModules();
  });

  it('should allow requests within the limit', () => {
    const key = 'test-ip-1';
    const limit = 5;
    const windowMs = 60000; // 1 minute

    // First request should be allowed
    let result = checkRateLimit(key, limit, windowMs);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);

    // Fourth request should still be allowed
    result = checkRateLimit(key, limit, windowMs);
    result = checkRateLimit(key, limit, windowMs);
    result = checkRateLimit(key, limit, windowMs);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1);
  });

  it('should reject requests exceeding the limit', () => {
    const key = 'test-ip-2';
    const limit = 2;
    const windowMs = 60000; // 1 minute

    // First two requests should be allowed
    checkRateLimit(key, limit, windowMs);
    let result = checkRateLimit(key, limit, windowMs);
    
    // Third request should be rejected
    result = checkRateLimit(key, limit, windowMs);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('should reset the limit after the window expires', async () => {
    const key = 'test-ip-3';
    const limit = 1;
    const windowMs = 100; // 100ms for testing

    // First request should be allowed
    let result = checkRateLimit(key, limit, windowMs);
    expect(result.allowed).toBe(true);

    // Second request should be rejected
    result = checkRateLimit(key, limit, windowMs);
    expect(result.allowed).toBe(false);

    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, windowMs + 10));

    // Next request should be allowed again
    result = checkRateLimit(key, limit, windowMs);
    expect(result.allowed).toBe(true);
  });
});