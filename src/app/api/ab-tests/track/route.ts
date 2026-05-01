import { NextRequest, NextResponse } from 'next/server';
import { trackConversion as trackConversionDB } from '@/lib/ab-test';
import { trackABTestConvertedServer } from '@/lib/ga4-server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { testId, userId, event, metadata } = body;

    if (!testId || !userId || !event) {
      return NextResponse.json(
        { error: 'Missing required fields: testId, userId, event' },
        { status: 400 }
      );
    }

    // Get test name from testId
    const { prisma } = await import('@/lib/prisma');
    const test = await prisma.aBTest.findUnique({
      where: { id: testId },
    });

    if (!test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Track in local database
    await trackConversionDB(test.name, userId, event, metadata);

    // Track in GA4 server-side
    const { prisma: prisma2 } = await import('@/lib/prisma');
    const assignment = await prisma2.aBTestAssignment.findUnique({
      where: {
        testId_userId: {
          testId,
          userId,
        },
      },
    });

    if (assignment) {
      await trackABTestConvertedServer(userId, test.name, assignment.variant as 'A' | 'B', event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[AB Test Track] Error:', error);
    return NextResponse.json(
      { error: 'Failed to track conversion' },
      { status: 500 }
    );
  }
}
