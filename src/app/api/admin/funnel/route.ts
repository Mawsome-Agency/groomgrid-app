import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/admin/funnel
 * Returns funnel analytics data for the admin dashboard
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') ?? '30', 10);

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all analytics events in the date range
    const events = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Calculate funnel metrics
    const metrics = calculateFunnelMetrics(events);

    // Calculate drop-off points
    const dropOffs = calculateDropOffs(events);

    // Calculate error breakdown
    const errors = calculateErrorBreakdown(events);

    return NextResponse.json({
      metrics,
      dropOffs,
      errors,
      period: {
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
        days,
      },
    });
  } catch (error: any) {
    console.error('Funnel analytics error:', error);
    return NextResponse.json(
      { error: `Failed to fetch funnel analytics: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * Calculate funnel metrics by stage
 */
function calculateFunnelMetrics(events: any[]) {
  // Count unique users at each stage
  const usersByStage = new Map<string, Set<string>>();

  events.forEach((event) => {
    const userId = event.userId;
    const eventName = event.eventName;

    // Map events to funnel stages
    let stage: string | null = null;

    if (eventName === 'signup_started') {
      stage = 'signup_started';
    } else if (eventName === 'account_created') {
      stage = 'account_created';
    } else if (eventName === 'page_view') {
      const page = (event.properties as any)?.page_path;
      if (page === '/plans') stage = 'plans_viewed';
      else if (page === '/onboarding') stage = 'onboarding_started';
      else if (page === '/dashboard') stage = 'dashboard_viewed';
    } else if (eventName === 'plan_selected') {
      stage = 'plan_selected';
    } else if (eventName === 'checkout_completed') {
      stage = 'checkout_completed';
    } else if (eventName === 'subscription_started') {
      stage = 'subscription_started';
    } else if (eventName === 'onboarding_step_completed') {
      const stepNumber = (event.properties as any)?.step;
      stage = `onboarding_step_${stepNumber}`;
    } else if (eventName === 'onboarding_completed') {
      stage = 'onboarding_completed';
    }

    if (stage) {
      if (!usersByStage.has(stage)) {
        usersByStage.set(stage, new Set());
      }
      usersByStage.get(stage)!.add(userId);
    }
  });

  // Convert to metrics
  const funnelStages = [
    { key: 'signup_started', label: 'Started Signup', order: 1 },
    { key: 'account_created', label: 'Account Created', order: 2 },
    { key: 'plans_viewed', label: 'Viewed Plans', order: 3 },
    { key: 'plan_selected', label: 'Selected Plan', order: 4 },
    { key: 'checkout_completed', label: 'Completed Checkout', order: 5 },
    { key: 'subscription_started', label: 'Subscription Started', order: 6 },
    { key: 'onboarding_started', label: 'Started Onboarding', order: 7 },
    { key: 'onboarding_step_1', label: 'Onboarding Step 1', order: 8 },
    { key: 'onboarding_step_2', label: 'Onboarding Step 2', order: 9 },
    { key: 'onboarding_step_3', label: 'Onboarding Step 3', order: 10 },
    { key: 'onboarding_completed', label: 'Completed Onboarding', order: 11 },
    { key: 'dashboard_viewed', label: 'Viewed Dashboard', order: 12 },
  ];

  let previousCount = 0;
  const metrics = funnelStages
    .map((stage) => {
      const count = usersByStage.get(stage.key)?.size || 0;
      const conversionRate = previousCount > 0 ? (count / previousCount) * 100 : 100;
      previousCount = count;

      return {
        stage: stage.key,
        label: stage.label,
        order: stage.order,
        users: count,
        conversionRate: Math.round(conversionRate * 10) / 10,
      };
    })
    .sort((a, b) => a.order - b.order);

  // Calculate overall conversion rate
  const started = usersByStage.get('signup_started')?.size || 0;
  const completed = usersByStage.get('dashboard_viewed')?.size || 0;
  const overallConversion = started > 0 ? (completed / started) * 100 : 0;

  return {
    stages: metrics,
    overallConversion: Math.round(overallConversion * 10) / 10,
    totalUsers: usersByStage.get('signup_started')?.size || 0,
  };
}

/**
 * Calculate drop-off points
 */
function calculateDropOffs(events: any[]) {
  const exits = events.filter((e) => e.eventName === 'funnel_exit');

  const dropOffByStage = new Map<string, number>();
  exits.forEach((event) => {
    const stage = (event.properties as any)?.stage || 'unknown';
    const exitPoint = (event.properties as any)?.exit_point || 'unknown';
    const key = `${stage}:${exitPoint}`;
    dropOffByStage.set(key, (dropOffByStage.get(key) || 0) + 1);
  });

  return Array.from(dropOffByStage.entries()).map(([key, count]) => {
    const [stage, exitPoint] = key.split(':');
    return { stage, exitPoint, count };
  }).sort((a, b) => b.count - a.count);
}

/**
 * Calculate error breakdown
 */
function calculateErrorBreakdown(events: any[]) {
  const validationErrors = events.filter((e) => e.eventName === 'field_validation_error');
  const apiErrors = events.filter((e) => e.eventName === 'api_timing' && !(e.properties as any)?.success);
  const paymentErrors = events.filter((e) => e.eventName === 'payment_failure');

  // Field validation errors
  const fieldErrorsByType = new Map<string, number>();
  validationErrors.forEach((event) => {
    const fieldName = (event.properties as any)?.field_name || 'unknown';
    const errorType = (event.properties as any)?.error_type || 'unknown';
    const key = `${fieldName}:${errorType}`;
    fieldErrorsByType.set(key, (fieldErrorsByType.get(key) || 0) + 1);
  });

  // API errors
  const apiErrorsByEndpoint = new Map<string, number>();
  apiErrors.forEach((event) => {
    const endpoint = (event.properties as any)?.api_endpoint || 'unknown';
    const errorType = (event.properties as any)?.error_type || 'unknown';
    const key = `${endpoint}:${errorType}`;
    apiErrorsByEndpoint.set(key, (apiErrorsByEndpoint.get(key) || 0) + 1);
  });

  // Payment errors
  const paymentErrorsByType = new Map<string, number>();
  paymentErrors.forEach((event) => {
    const errorType = (event.properties as any)?.error_type || 'unknown';
    const declineCode = (event.properties as any)?.decline_code || 'unknown';
    const key = `${errorType}:${declineCode}`;
    paymentErrorsByType.set(key, (paymentErrorsByType.get(key) || 0) + 1);
  });

  return {
    fieldValidationErrors: Array.from(fieldErrorsByType.entries())
      .map(([key, count]) => {
        const [fieldName, errorType] = key.split(':');
        return { fieldName, errorType, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    apiErrors: Array.from(apiErrorsByEndpoint.entries())
      .map(([key, count]) => {
        const [endpoint, errorType] = key.split(':');
        return { endpoint, errorType, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    paymentErrors: Array.from(paymentErrorsByType.entries())
      .map(([key, count]) => {
        const [errorType, declineCode] = key.split(':');
        return { errorType, declineCode, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  };
}
