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

  // Return 503 when critical so load balancers / monitors detect the issue.
  const httpStatus = report.status === 'critical' ? 503 : 200;

  return NextResponse.json(report, { status: httpStatus });
}