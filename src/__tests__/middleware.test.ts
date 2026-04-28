/**
 * Unit tests for middleware route protection and Cache-Control headers
 *
 * Verifies that protected routes redirect unauthenticated users to /login,
 * public routes remain accessible, and no-cache headers are set on
 * POST requests, API routes, and conversion-critical pages.
 *
 * Mocks next/server and next-auth/jwt to avoid Next.js runtime deps in jsdom.
 */

// ── Mock next-auth/jwt before importing middleware ──
jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}));

// ── Mock next/server to provide lightweight NextRequest / NextResponse ──
// Next.js internals don't load in jsdom, so we mock the minimal surface
// the middleware needs: URL/method on request, status/headers on response.
jest.mock('next/server', () => {
  class MockHeaders extends Map {
    constructor(init?: Record<string, string>) {
      super();
      if (init) {
        for (const [k, v] of Object.entries(init)) this.set(k, v);
      }
    }
    get(name: string) { return super.get(name.toLowerCase()) ?? null; }
    set(name: string, value: string) { super.set(name.toLowerCase(), value); return this; }
  }

  class MockNextRequest {
    readonly nextUrl: URL;
    readonly url: string;
    readonly method: string;
    constructor(input: string | URL, init?: RequestInit) {
      this.nextUrl = typeof input === 'string' ? new URL(input) : new URL(input.toString());
      this.url = this.nextUrl.toString();
      this.method = init?.method ?? 'GET';
    }
  }

  class MockNextResponse {
    readonly status: number;
    readonly headers: MockHeaders;
    constructor(status: number, headers?: Record<string, string>) {
      this.status = status;
      this.headers = new MockHeaders(headers);
    }
    static redirect(url: string | URL) {
      const dest = typeof url === 'string' ? url : url.toString();
      return new MockNextResponse(307, { location: dest });
    }
    static next() {
      return new MockNextResponse(200);
    }
  }

  return { NextRequest: MockNextRequest, NextResponse: MockNextResponse };
});

import { getToken } from 'next-auth/jwt';
import { middleware } from '../middleware';

const mockGetToken = getToken as jest.MockedFunction<typeof getToken>;

describe('middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Helper to create a mock NextRequest for a given path and method.
   */
  function makeRequest(path: string, method = 'GET') {
    const { NextRequest } = jest.requireMock('next/server');
    const url = new URL(path, 'https://getgroomgrid.com');
    return new NextRequest(url.toString(), method !== 'GET' ? { method } : undefined);
  }

  describe('protected routes', () => {
    const protectedPaths = [
      '/dashboard',
      '/dashboard/settings',
      '/onboarding',
      '/onboarding/step-2',
      '/welcome',
      '/admin',
      '/admin/engagement',
    ];

    it('redirects unauthenticated users to /login for each protected route', async () => {
      mockGetToken.mockResolvedValue(null);

      for (const path of protectedPaths) {
        const req = makeRequest(path);
        const response = await middleware(req);

        expect(response.status).toBe(307);
        const redirectUrl = response.headers.get('location');
        expect(redirectUrl).toContain('/login');
        expect(redirectUrl).toContain(`next=${encodeURIComponent(path)}`);
      }
    });

    it('allows authenticated users through protected routes', async () => {
      mockGetToken.mockResolvedValue({ sub: 'user-123', email: 'test@example.com', id: 'user-123' });

      for (const path of protectedPaths) {
        const req = makeRequest(path);
        const response = await middleware(req);

        expect(response.status).toBe(200);
      }
    });
  });

  describe('public routes', () => {
    // Routes accessible to ALL users (authenticated or not)
    const nonAuthPublicPaths = [
      '/',
      '/plans',
      '/plans?coupon=BETA50',
      '/blog',
      '/blog/best-dog-grooming-software',
      '/book/user-123',
      '/checkout/success?session_id=cs_test',
      '/checkout/cancel',
      '/api/health',
    ];

    // Auth pages that are public but redirect authenticated users to /dashboard
    const authPages = ['/signup', '/login'];

    it('allows unauthenticated users to access all public routes including auth pages', async () => {
      mockGetToken.mockResolvedValue(null);

      for (const path of [...nonAuthPublicPaths, ...authPages]) {
        const req = makeRequest(path);
        const response = await middleware(req);

        expect(response.status).toBe(200);
      }
    });

    it('allows authenticated users to access non-auth public routes', async () => {
      mockGetToken.mockResolvedValue({ sub: 'user-123', email: 'test@example.com', id: 'user-123' });

      for (const path of nonAuthPublicPaths) {
        const req = makeRequest(path);
        const response = await middleware(req);

        expect(response.status).toBe(200);
      }
    });
  });

  describe('auth routes', () => {
    it('redirects authenticated users from /login to /dashboard', async () => {
      mockGetToken.mockResolvedValue({ sub: 'user-123', email: 'test@example.com', id: 'user-123' });

      const req = makeRequest('/login');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      const redirectUrl = response.headers.get('location');
      expect(redirectUrl).toContain('/dashboard');
    });

    it('redirects authenticated users from /signup to /dashboard', async () => {
      mockGetToken.mockResolvedValue({ sub: 'user-123', email: 'test@example.com', id: 'user-123' });

      const req = makeRequest('/signup');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      const redirectUrl = response.headers.get('location');
      expect(redirectUrl).toContain('/dashboard');
    });

    it('allows unauthenticated users to access /login', async () => {
      mockGetToken.mockResolvedValue(null);

      const req = makeRequest('/login');
      const response = await middleware(req);

      expect(response.status).toBe(200);
    });

    it('allows unauthenticated users to access /signup', async () => {
      mockGetToken.mockResolvedValue(null);

      const req = makeRequest('/signup');
      const response = await middleware(req);

      expect(response.status).toBe(200);
    });
  });

  describe('static assets and images', () => {
    it('does not intercept _next/static files', async () => {
      const req = makeRequest('/_next/static/chunks/app-page.js');
      const response = await middleware(req);

      expect(response.status).toBe(200);
    });

    it('does not intercept image files', async () => {
      const req = makeRequest('/images/hero.png');
      const response = await middleware(req);

      expect(response.status).toBe(200);
    });
  });

  describe('Cache-Control headers (Server Action stale deployment fix)', () => {
    it('sets no-cache headers on POST requests', async () => {
      mockGetToken.mockResolvedValue(null);

      const req = makeRequest('/api/auth/signup', 'POST');
      const response = await middleware(req);

      expect(response.headers.get('Cache-Control')).toBe('no-store, must-revalidate');
      expect(response.headers.get('Pragma')).toBe('no-cache');
      expect(response.headers.get('Expires')).toBe('0');
    });

    it('sets no-cache headers on API routes for GET requests', async () => {
      mockGetToken.mockResolvedValue(null);

      const req = makeRequest('/api/health');
      const response = await middleware(req);

      expect(response.headers.get('Cache-Control')).toBe('no-store, must-revalidate');
      expect(response.headers.get('Pragma')).toBe('no-cache');
    });

    it('sets no-cache headers on conversion-critical pages', async () => {
      mockGetToken.mockResolvedValue({ sub: 'user-123', email: 'test@example.com', id: 'user-123' });

      const conversionPages = ['/signup', '/login', '/plans'];
      for (const path of conversionPages) {
        const req = makeRequest(path);
        const response = await middleware(req);

        expect(response.headers.get('Cache-Control')).toBe('no-store, must-revalidate');
        expect(response.headers.get('Pragma')).toBe('no-cache');
      }
    });

    it('sets no-cache headers on checkout pages', async () => {
      mockGetToken.mockResolvedValue(null);

      const req = makeRequest('/checkout/cancel');
      const response = await middleware(req);

      expect(response.headers.get('Cache-Control')).toBe('no-store, must-revalidate');
    });

    it('does not set cache headers on regular GET pages that are not conversion-critical', async () => {
      mockGetToken.mockResolvedValue(null);

      const req = makeRequest('/blog/best-dog-grooming-software');
      const response = await middleware(req);

      // Blog pages can be cached normally — no cache-busting needed
      expect(response.headers.get('Cache-Control')).toBeNull();
    });
  });
});
