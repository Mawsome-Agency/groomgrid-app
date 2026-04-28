/**
 * Health Check API
 *
 * GET /api/health
 * Returns system connectivity status: database reachability,
 * environment variable presence, and aggregate health.
 */

import { NextResponse } from 'next/server';
import { buildHealthReport, HealthReport } from '@/lib/health-check';

export async function GET(): Promise<NextResponse<HealthReport>> {
  const report = await buildHealthReport();

  // Return 503 only when critical (core infra down). Degraded (analytics missing) returns 200.
  const httpStatus = report.status === 'critical' ? 503 : 200;

  return NextResponse.json(report, { status: httpStatus });
}