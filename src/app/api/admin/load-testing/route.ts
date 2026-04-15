import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { isAdminUser } from '@/lib/load-testing/auth';
import { collectLoadTestMetrics } from '@/lib/load-testing/metrics';

/**
 * GET /api/admin/load-testing/metrics
 * Collect and return load testing metrics
 * 
 * This endpoint requires admin authentication and is rate-limited.
 */
export async function GET(req: NextRequest) {
  try {
    // Check authentication
    if (!(await isAdminUser())) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' }, 
        { status: 403 }
      );
    }

    // Check rate limit (5 requests per minute for admin metrics)
    const rateLimitKey = `load-testing:${req.ip || 'unknown'}`;
    const rateLimit = checkRateLimit(rateLimitKey, 5, 60 * 1000); // 5 requests per minute
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          retryAfter: rateLimit.retryAfter 
        }, 
        { status: 429 }
      );
    }

    // Collect metrics
    const metrics = await collectLoadTestMetrics();

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Failed to collect load testing metrics:', error);
    return NextResponse.json(
      { error: 'Failed to collect metrics' }, 
      { status: 500 }
    );
  }
}
