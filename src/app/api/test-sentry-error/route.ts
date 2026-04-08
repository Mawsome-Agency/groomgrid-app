import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function GET() {
  try {
    // Intentionally throw an error to test Sentry
    throw new Error('Test error from Sentry verification');
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { 
        message: 'Test error captured and sent to Sentry',
        errorId: error instanceof Error ? error.message : 'unknown'
      },
      { status: 200 }
    );
  }
}
