/**
 * Health Check Utilities
 *
 * Provides functions to verify system connectivity — database reachability,
 * environment variable presence, and overall service health.
 * Follows the analytics-verification pattern of individual check results
 * with an aggregate status.
 */

export interface HealthCheckResult {
  name: string;
  status: 'pass' | 'fail' | 'degraded';
  message: string;
  latencyMs?: number;
  details?: Record<string, unknown>;
}

export interface HealthReport {
  status: 'healthy' | 'degraded' | 'critical';
  timestamp: string;
  version: string;
  buildId: string;
  environment: string;
  uptimeSeconds: number;
  checks: HealthCheckResult[];
}

/**
 * Check database connectivity by running a lightweight query.
 * Uses the existing prisma singleton — no side effects.
 */
export async function checkDatabase(): Promise<HealthCheckResult> {
  const start = Date.now();
  try {
    // Dynamic import to avoid crashes if prisma module is misconfigured.
    // The prisma singleton is cached so this doesn't create new connections.
    const { default: prisma } = await import('@/lib/prisma');
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - start;
    return {
      name: 'database',
      status: 'pass',
      message: 'PostgreSQL is reachable',
      latencyMs,
    };
  } catch (error) {
    const latencyMs = Date.now() - start;
    return {
      name: 'database',
      status: 'fail',
      message: `Database unreachable: ${error instanceof Error ? error.message : String(error)}`,
      latencyMs,
    };
  }
}

/**
 * Check that required environment variables for core app modules are present.
 * This checks the 'app' module vars (NEXTAUTH_URL, NEXTAUTH_SECRET, NEXT_PUBLIC_APP_URL)
 * plus DATABASE_URL since the health endpoint depends on DB connectivity.
 */
export function checkEnvironmentVars(): HealthCheckResult[] {
  const checks: HealthCheckResult[] = [];

  const criticalVars: Array<{ name: string; label: string }> = [
    { name: 'DATABASE_URL', label: 'Database connection string' },
    { name: 'NEXTAUTH_URL', label: 'NextAuth URL' },
    { name: 'NEXTAUTH_SECRET', label: 'NextAuth secret' },
    { name: 'NEXT_PUBLIC_APP_URL', label: 'Public app URL' },
    { name: 'MAILGUN_API_KEY', label: 'Mailgun API key' },
    { name: 'MAILGUN_DOMAIN', label: 'Mailgun sending domain' },
    // NOTE: MAILGUN_FROM_EMAIL is intentionally omitted — it's optional,
    // defaults to hello@email.mawsome.agency
  ];

  // Stripe checkout vars — required for paid plan signup funnel
  const stripeVars: Array<{ name: string; label: string }> = [
    { name: 'STRIPE_SECRET_KEY', label: 'Stripe secret key' },
    { name: 'STRIPE_PRICE_SOLO', label: 'Stripe Solo price ID' },
    { name: 'STRIPE_PRICE_SALON', label: 'Stripe Salon price ID' },
    { name: 'STRIPE_PRICE_ENTERPRISE', label: 'Stripe Enterprise price ID' },
  ];

  for (const { name, label } of criticalVars) {
    const value = process.env[name];
    if (!value) {
      checks.push({
        name: `env:${name}`,
        status: 'fail',
        message: `${label} (${name}) is not set`,
      });
    } else {
      checks.push({
        name: `env:${name}`,
        status: 'pass',
        message: `${label} is configured`,
      });
    }
  }

  // GA4 analytics vars — NOT critical; app works without them, just analytics won't fire.
  // We track them as "degraded" so health endpoint returns 200 not 503.
  const analyticsVars: Array<{ name: string; label: string }> = [
    { name: 'NEXT_PUBLIC_GA4_MEASUREMENT_ID', label: 'GA4 Measurement ID' },
    { name: 'GA4_API_SECRET', label: 'GA4 Measurement Protocol API secret' },
  ];

  for (const { name, label } of analyticsVars) {
    const value = process.env[name];
    if (!value) {
      checks.push({
        name: `env:${name}`,
        status: 'degraded',
        message: `${label} (${name}) is not set — server-side GA4 events will not fire`,
      });
    } else {
      checks.push({
        name: `env:${name}`,
        status: 'pass',
        message: `${label} is configured`,
      });
    }
  }

  // Stripe vars — fail blocks checkout but app still serves pages
  for (const { name, label } of stripeVars) {
    const value = process.env[name];
    if (!value) {
      checks.push({
        name: `env:${name}`,
        status: 'fail',
        message: `${label} (${name}) is not set — checkout will fail`,
      });
    } else {
      checks.push({
        name: `env:${name}`,
        status: 'pass',
        message: `${label} is configured`,
      });
    }
  }

  return checks;
}

/**
 * Compute aggregate status from individual check results.
 * - All pass → healthy
 * - Any fail (core infra like DB, auth, Stripe) → critical
 * - Any degraded (optional like analytics) → degraded
 * - Mixed fail + degraded → critical (fail takes precedence)
 */
export function computeStatus(checks: HealthCheckResult[]): 'healthy' | 'degraded' | 'critical' {
  const failures = checks.filter((c) => c.status === 'fail').length;
  const degraded = checks.filter((c) => c.status === 'degraded').length;
  if (failures > 0) return 'critical';
  if (degraded > 0) return 'degraded';
  return 'healthy';
}

/**
 * Build a complete health report.
 */
export async function buildHealthReport(): Promise<HealthReport> {
  const checks: HealthCheckResult[] = [];

  // Database check (async)
  checks.push(await checkDatabase());

  // Environment variable checks (sync)
  checks.push(...checkEnvironmentVars());

  // Read the Next.js build ID for version change detection
  let buildId = 'unknown';
  try {
    const fs = await import('fs');
    const path = await import('path');
    const buildIdPath = path.join(process.cwd(), '.next', 'BUILD_ID');
    buildId = fs.readFileSync(buildIdPath, 'utf-8').trim();
  } catch {
    // BUILD_ID not available (dev mode or missing file)
  }

  return {
    status: computeStatus(checks),
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || 'unknown',
    buildId,
    environment: process.env.NODE_ENV || 'unknown',
    uptimeSeconds: Math.floor(process.uptime()),
    checks,
  };
}