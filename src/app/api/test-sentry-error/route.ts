import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import * as Sentry from '@sentry/nextjs';

export async function GET() {
  // Block in production — test endpoint only
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Require auth even in non-production
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 },
    );
  }

  try {
    // Intentionally throw an error to test Sentry
    throw new Error('Test error from Sentry verification');
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { message: 'Test error captured and sent to Sentry' },
      { status: 200 }
    );
  }
}
