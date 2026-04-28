/**
 * Unit tests for middleware route protection
 *
 * Verifies that protected routes redirect unauthenticated users to /login
 * and that public routes remain accessible.
 */

import { NextRequest } from 'next/server';

// Mock next-auth/jwt before importing middleware
jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}));

import { getToken } from 'next-auth/jwt';
import { middleware } from '../middleware';

const mockGetToken = getToken as jest.MockedFunction<typeof getToken>;

describe('middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Helper to create a NextRequest for a given path.
   * Next.js middleware expects the full URL including protocol.
   */
  function makeRequest(path: string): NextRequest {
    return new NextRequest(new URL(path, 'https://getgroomgrid.com'));
  }

  describe('protected routes', () => {
    const protectedPaths = [
      '/dashboard',
      '/dashboard/settings',
      '/onboarding',
      '/onboarding/step-2',
      '/welcome',
      '/plans',
      '/plans?coupon=BETA50',
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
      mockGetToken.mockResolvedValue({ sub: 'user-123', email: 'test@example.com' });

      for (const path of protectedPaths) {
        const req = makeRequest(path);
        const response = await middleware(req);

        expect(response.status).toBe(200);
      }
    });
  });

  describe('public routes', () => {
    const publicPaths = [
      '/',
      '/signup',
      '/login',
      '/blog',
      '/blog/best-dog-grooming-software',
      '/book/user-123',
      '/checkout/success?session_id=cs_test',
      '/checkout/cancel',
      '/api/health',
    ];

    it('allows unauthenticated users to access public routes', async () => {
      mockGetToken.mockResolvedValue(null);

      for (const path of publicPaths) {
        const req = makeRequest(path);
        const response = await middleware(req);

        expect(response.status).toBe(200);
      }
    });

    it('allows authenticated users to access public routes', async () => {
      mockGetToken.mockResolvedValue({ sub: 'user-123', email: 'test@example.com' });

      for (const path of publicPaths) {
        const req = makeRequest(path);
        const response = await middleware(req);

        expect(response.status).toBe(200);
      }
    });
  });

  describe('auth routes', () => {
    it('redirects authenticated users from /login to /dashboard', async () => {
      mockGetToken.mockResolvedValue({ sub: 'user-123', email: 'test@example.com' });

      const req = makeRequest('/login');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      const redirectUrl = response.headers.get('location');
      expect(redirectUrl).toContain('/dashboard');
    });

    it('redirects authenticated users from /signup to /dashboard', async () => {
      mockGetToken.mockResolvedValue({ sub: 'user-123', email: 'test@example.com' });

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

  describe('/plans specifically (P0 fix)', () => {
    it('redirects unauthenticated /plans to /login with next parameter', async () => {
      mockGetToken.mockResolvedValue(null);

      const req = makeRequest('/plans');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      const redirectUrl = response.headers.get('location');
      expect(redirectUrl).toContain('/login');
      expect(redirectUrl).toContain('next=%2Fplans');
    });

    it('preserves query parameters when redirecting /plans to login', async () => {
      mockGetToken.mockResolvedValue(null);

      const req = makeRequest('/plans?coupon=BETA50');
      const response = await middleware(req);

      expect(response.status).toBe(307);
      const redirectUrl = response.headers.get('location');
      expect(redirectUrl).toContain('/login');
      expect(redirectUrl).toContain('next=%2Fplans%3Fcoupon%3DBETA50');
    });

    it('allows authenticated users to access /plans', async () => {
      mockGetToken.mockResolvedValue({ sub: 'user-123', email: 'test@example.com' });

      const req = makeRequest('/plans');
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

      const req = new NextRequest(new URL('/api/auth/signup', 'https://getgroomgrid.com'), {
        method: 'POST',
      });
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
      mockGetToken.mockResolvedValue({ sub: 'user-123', email: 'test@example.com' });

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
