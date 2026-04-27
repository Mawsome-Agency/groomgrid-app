/**
 * Tests for the health check endpoint and utilities.
 *
 * We test the health-check utility functions directly rather than
 * trying to spin up the Next.js server — that gives us fast, deterministic
 * unit tests that cover the real logic.
 */

import {
  checkDatabase,
  checkEnvironmentVars,
  computeStatus,
  buildHealthReport,
  HealthCheckResult,
} from '@/lib/health-check';

// Mock prisma to avoid real DB connections in tests
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    $queryRaw: jest.fn(),
  },
}));

// Import the mocked prisma so we can control it in tests
import prisma from '@/lib/prisma';

const mockQueryRaw = prisma.$queryRaw as jest.MockedFunction<typeof prisma.$queryRaw>;

describe('health-check utilities', () => {
  // Snapshot and restore process.env around every test to prevent bleed
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('checkDatabase', () => {
    it('returns pass when DB query succeeds', async () => {
      mockQueryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);

      const result = await checkDatabase();

      expect(result.name).toBe('database');
      expect(result.status).toBe('pass');
      expect(result.message).toBe('PostgreSQL is reachable');
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
      expect(mockQueryRaw).toHaveBeenCalledTimes(1);
    });

    it('returns fail when DB query throws', async () => {
      mockQueryRaw.mockRejectedValueOnce(new Error('connection refused'));

      const result = await checkDatabase();

      expect(result.name).toBe('database');
      expect(result.status).toBe('fail');
      expect(result.message).toContain('connection refused');
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    });

    it('returns fail with non-Error thrown', async () => {
      mockQueryRaw.mockRejectedValueOnce('string error');

      const result = await checkDatabase();

      expect(result.status).toBe('fail');
      expect(result.message).toContain('string error');
    });
  });

  describe('checkEnvironmentVars', () => {
    it('returns pass for all vars when they are set', () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.MAILGUN_API_KEY = 'key-test123';
      process.env.MAILGUN_DOMAIN = 'sandbox.mailgun.org';
      process.env.STRIPE_SECRET_KEY = 'sk_test_123';
      process.env.STRIPE_PRICE_SOLO = 'price_test_solo';
      process.env.STRIPE_PRICE_SALON = 'price_test_salon';
      process.env.STRIPE_PRICE_ENTERPRISE = 'price_test_enterprise';

      const results = checkEnvironmentVars();

      expect(results).toHaveLength(10); // 6 core + 4 Stripe
      for (const result of results) {
        expect(result.status).toBe('pass');
      }
    });

    it('returns fail for missing DATABASE_URL', () => {
      delete process.env.DATABASE_URL;
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.MAILGUN_API_KEY = 'key-test123';
      process.env.MAILGUN_DOMAIN = 'sandbox.mailgun.org';

      const results = checkEnvironmentVars();
      const dbCheck = results.find((r) => r.name === 'env:DATABASE_URL');

      expect(dbCheck).toBeDefined();
      expect(dbCheck!.status).toBe('fail');
      expect(dbCheck!.message).toContain('DATABASE_URL');
    });

    it('returns fail for multiple missing vars', () => {
      delete process.env.DATABASE_URL;
      delete process.env.NEXTAUTH_SECRET;
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.MAILGUN_API_KEY = 'key-test123';
      process.env.MAILGUN_DOMAIN = 'sandbox.mailgun.org';

      const results = checkEnvironmentVars();
      const failures = results.filter((r) => r.status === 'fail');

      expect(failures).toHaveLength(2);
      expect(failures.map((r) => r.name)).toContain('env:DATABASE_URL');
      expect(failures.map((r) => r.name)).toContain('env:NEXTAUTH_SECRET');
    });

    it('returns fail for missing MAILGUN_API_KEY', () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      delete process.env.MAILGUN_API_KEY;
      process.env.MAILGUN_DOMAIN = 'sandbox.mailgun.org';

      const results = checkEnvironmentVars();
      const check = results.find((r) => r.name === 'env:MAILGUN_API_KEY');

      expect(check).toBeDefined();
      expect(check!.status).toBe('fail');
      expect(check!.message).toContain('MAILGUN_API_KEY');
    });

    it('returns fail for missing MAILGUN_DOMAIN', () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.MAILGUN_API_KEY = 'key-test123';
      delete process.env.MAILGUN_DOMAIN;

      const results = checkEnvironmentVars();
      const check = results.find((r) => r.name === 'env:MAILGUN_DOMAIN');

      expect(check).toBeDefined();
      expect(check!.status).toBe('fail');
      expect(check!.message).toContain('MAILGUN_DOMAIN');
    });

    it('does NOT fail when MAILGUN_FROM_EMAIL is absent (it is optional)', () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.MAILGUN_API_KEY = 'key-test123';
      process.env.MAILGUN_DOMAIN = 'sandbox.mailgun.org';
      delete process.env.MAILGUN_FROM_EMAIL;

      const results = checkEnvironmentVars();
      const failures = results.filter((r) => r.status === 'fail');
      const mailgunFromCheck = results.find((r) => r.name === 'env:MAILGUN_FROM_EMAIL');

      // MAILGUN_FROM_EMAIL is not in criticalVars — no check result for it
      expect(mailgunFromCheck).toBeUndefined();
      // All other vars are set — no failures
      expect(failures).toHaveLength(0);
    });
  });

  describe('computeStatus', () => {
    it('returns healthy when all checks pass', () => {
      const checks: HealthCheckResult[] = [
        { name: 'database', status: 'pass', message: 'ok' },
        { name: 'env:DATABASE_URL', status: 'pass', message: 'ok' },
      ];

      expect(computeStatus(checks)).toBe('healthy');
    });

    it('returns critical when any check fails', () => {
      const checks: HealthCheckResult[] = [
        { name: 'database', status: 'pass', message: 'ok' },
        { name: 'env:DATABASE_URL', status: 'fail', message: 'missing' },
      ];

      expect(computeStatus(checks)).toBe('critical');
    });

    it('returns critical when all checks fail', () => {
      const checks: HealthCheckResult[] = [
        { name: 'database', status: 'fail', message: 'down' },
        { name: 'env:DATABASE_URL', status: 'fail', message: 'missing' },
      ];

      expect(computeStatus(checks)).toBe('critical');
    });

    it('returns healthy for empty checks array', () => {
      expect(computeStatus([])).toBe('healthy');
    });
  });

  describe('buildHealthReport', () => {
    it('returns a complete report with all required fields', async () => {
      mockQueryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.MAILGUN_API_KEY = 'key-test123';
      process.env.MAILGUN_DOMAIN = 'sandbox.mailgun.org';

      const report = await buildHealthReport();

      expect(report).toHaveProperty('status');
      expect(report).toHaveProperty('timestamp');
      expect(report).toHaveProperty('version');
      expect(report).toHaveProperty('environment');
      expect(report).toHaveProperty('uptimeSeconds');
      expect(report).toHaveProperty('checks');
      expect(report.checks.length).toBeGreaterThanOrEqual(2); // at least DB + env checks
    });

    it('reports critical when database is unreachable', async () => {
      mockQueryRaw.mockRejectedValueOnce(new Error('ECONNREFUSED'));
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.MAILGUN_API_KEY = 'key-test123';
      process.env.MAILGUN_DOMAIN = 'sandbox.mailgun.org';

      const report = await buildHealthReport();

      expect(report.status).toBe('critical');
      const dbCheck = report.checks.find((c) => c.name === 'database');
      expect(dbCheck!.status).toBe('fail');
    });

    it('reports critical when env vars are missing', async () => {
      mockQueryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);
      delete process.env.DATABASE_URL;
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.MAILGUN_API_KEY = 'key-test123';
      process.env.MAILGUN_DOMAIN = 'sandbox.mailgun.org';

      const report = await buildHealthReport();

      expect(report.status).toBe('critical');
    });

    it('reports critical when MAILGUN_API_KEY is missing', async () => {
      mockQueryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      delete process.env.MAILGUN_API_KEY;
      process.env.MAILGUN_DOMAIN = 'sandbox.mailgun.org';

      const report = await buildHealthReport();

      expect(report.status).toBe('critical');
      const check = report.checks.find((c) => c.name === 'env:MAILGUN_API_KEY');
      expect(check!.status).toBe('fail');
    });

    it('reports critical when MAILGUN_DOMAIN is missing', async () => {
      mockQueryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.MAILGUN_API_KEY = 'key-test123';
      delete process.env.MAILGUN_DOMAIN;

      const report = await buildHealthReport();

      expect(report.status).toBe('critical');
      const check = report.checks.find((c) => c.name === 'env:MAILGUN_DOMAIN');
      expect(check!.status).toBe('fail');
    });

    it('reports healthy when everything is configured', async () => {
      mockQueryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.MAILGUN_API_KEY = 'key-test123';
      process.env.MAILGUN_DOMAIN = 'sandbox.mailgun.org';

      const report = await buildHealthReport();

      expect(report.status).toBe('healthy');
      for (const check of report.checks) {
        expect(check.status).toBe('pass');
      }
    });
  });
});
