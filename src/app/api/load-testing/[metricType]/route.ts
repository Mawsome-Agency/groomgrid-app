import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { 
  collectDatabaseMetrics, 
  collectStripeMetrics, 
  collectSystemMetrics 
} from '@/lib/load-testing/metrics';

/**
 * GET /api/load-testing/[metricType]
 * Collect and return specific load testing metrics
 * 
 * @param req - The incoming request
 * @param params - The route parameters containing metricType
 * @returns JSON response with the requested metrics
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { metricType: string } }
) {
  try {
    // Check rate limit (15 requests per minute for specific metrics)
    const rateLimitKey = `load-testing-${params.metricType}:${req.ip || 'unknown'}`;
    const rateLimit = checkRateLimit(rateLimitKey, 15, 60 * 1000); // 15 requests per minute
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded', 
          retryAfter: rateLimit.retryAfter 
        }, 
        { status: 429 }
      );
    }

    let metrics: any;
    
    // Collect specific metrics based on the type
    switch (params.metricType.toLowerCase()) {
      case 'database':
        metrics = await collectDatabaseMetrics();
        break;
      case 'stripe':
        metrics = await collectStripeMetrics();
        break;
      case 'system':
        metrics = collectSystemMetrics();
        break;
      default:
        return NextResponse.json(
          { error: `Unsupported metric type: ${params.metricType}` }, 
          { status: 400 }
        );
    }

    return NextResponse.json({ 
      metricType: params.metricType,
      metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Failed to collect ${params.metricType} metrics:`, error);
    return NextResponse.json(
      { error: `Failed to collect ${params.metricType} metrics` }, 
      { status: 500 }
    );
  }
}