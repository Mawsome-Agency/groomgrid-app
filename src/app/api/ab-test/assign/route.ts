import { NextRequest, NextResponse } from 'next/server';
import { assignVariant } from '@/lib/ab-test';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testName, userId } = body;

    if (!testName || !userId) {
      return NextResponse.json({ error: 'testName and userId required' }, { status: 400 });
    }

    // Verify the userId matches the authenticated session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const variant = await assignVariant(testName, userId);
    return NextResponse.json({ variant });
  } catch (error) {
    console.error('AB test assign error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
