/**
 * Analytics Verification API
 *
 * GET /api/analytics/verify
 * Returns the current analytics configuration status for BOFU tracking
 *
 * POST /api/analytics/verify
 * Verifies a specific event payload structure
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyClientAnalyticsConfig,
  verifyServerAnalyticsConfig,
  verifyBOFUEventPayload,
  getBOFUEventSummary,
  AnalyticsVerificationResult,
} from '@/lib/analytics-verification';

interface VerificationResponse {
  timestamp: string;
  environment: string;
  summary: {
    totalEvents: number;
    events: Array<{ name: string; description: string; requiredParams: string[] }>;
  };
  clientConfig: AnalyticsVerificationResult[];
  serverConfig: AnalyticsVerificationResult[];
  status: 'healthy' | 'degraded' | 'critical';
}

export async function GET(): Promise<NextResponse<VerificationResponse>> {
  const clientConfig = verifyClientAnalyticsConfig();
  const serverConfig = verifyServerAnalyticsConfig();

  // Calculate overall status
  const allResults = [...clientConfig, ...serverConfig];
  const failures = allResults.filter((r) => r.status === 'fail').length;
  const warnings = allResults.filter((r) => r.status === 'warning').length;

  let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
  if (failures > 0) {
    status = 'critical';
  } else if (warnings > 0) {
    status = 'degraded';
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    summary: getBOFUEventSummary(),
    clientConfig,
    serverConfig,
    status,
  });
}

interface VerifyPayloadRequest {
  eventName: string;
  payload: Record<string, unknown>;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: Partial<VerifyPayloadRequest> = await req.json();

    if (!body.eventName || !body.payload) {
      return NextResponse.json(
        { error: 'eventName and payload are required' },
        { status: 400 }
      );
    }

    const result = verifyBOFUEventPayload(body.eventName, body.payload);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body', details: String(error) },
      { status: 400 }
    );
  }
}
