/**
 * Liveness Probe — GET /api/health/ping
 *
 * Lightweight endpoint for load balancers and uptime monitors that only need to
 * verify the process is alive. No database query, no env-var checks.
 * Use /api/health for a full readiness probe.
 */

import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
}
