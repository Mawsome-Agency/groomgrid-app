import { NextRequest, NextResponse } from 'next/server';
import { trackConversion } from '@/lib/ab-test';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testName, event, userId, metadata } = body;

    if (!testName || !event) {
      return NextResponse.json({ error: 'testName and event required' }, { status: 400 });
    }

    // Verify session if userId is provided
    if (userId) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id || session.user.id !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    await trackConversion(testName, event, userId, undefined, metadata);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('AB test conversion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
