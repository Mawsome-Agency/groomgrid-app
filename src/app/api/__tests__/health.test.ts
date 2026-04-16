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
  beforeEach(() => {
    jest.clearAllMocks();
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

      const results = checkEnvironmentVars();

      expect(results).toHaveLength(4);
      for (const result of results) {
        expect(result.status).toBe('pass');
      }
    });

    it('returns fail for missing DATABASE_URL', () => {
      delete process.env.DATABASE_URL;
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

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

      const results = checkEnvironmentVars();
      const failures = results.filter((r) => r.status === 'fail');

      expect(failures).toHaveLength(2);
      expect(failures.map((r) => r.name)).toContain('env:DATABASE_URL');
      expect(failures.map((r) => r.name)).toContain('env:NEXTAUTH_SECRET');
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

      const report = await buildHealthReport();

      expect(report.status).toBe('critical');
    });

    it('reports healthy when everything is configured', async () => {
      mockQueryRaw.mockResolvedValueOnce([{ '?column?': 1 }]);
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
      process.env.NEXTAUTH_URL = 'http://localhost:3000';
      process.env.NEXTAUTH_SECRET = 'test-secret';
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

      const report = await buildHealthReport();

      expect(report.status).toBe('healthy');
      for (const check of report.checks) {
        expect(check.status).toBe('pass');
      }
    });
  });
});