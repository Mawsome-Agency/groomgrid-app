import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { collectLoadTestMetrics } from '@/lib/load-testing/metrics';

/**
 * GET /api/load-testing
 * Collect and return load testing metrics
 * 
 * This endpoint is rate-limited to prevent abuse.
 * It does not require authentication to allow for easy load testing.
 */
export async function GET(req: NextRequest) {
  try {
    // Check rate limit (10 requests per minute for public metrics)
    const rateLimitKey = `load-testing-public:${req.ip || 'unknown'}`;
    const rateLimit = checkRateLimit(rateLimitKey, 10, 60 * 1000); // 10 requests per minute
    
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

/**
 * POST /api/load-testing
 * Endpoint for submitting load test results
 * 
 * This endpoint is for internal use to submit load test results for analysis.
 */
export async function POST(req: NextRequest) {
  try {
    // Check rate limit (5 requests per minute for submissions)
    const rateLimitKey = `load-testing-submit:${req.ip || 'unknown'}`;
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

    // Parse the submitted data
    const data = await req.json();
    
    // In a real implementation, you would store this data
    // For now, we'll just acknowledge receipt
    console.log('Load test results received:', data);
    
    return NextResponse.json({ 
      message: 'Load test results received successfully',
      receivedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to process load test submission:', error);
    return NextResponse.json(
      { error: 'Failed to process load test submission' }, 
      { status: 500 }
    );
  }
}