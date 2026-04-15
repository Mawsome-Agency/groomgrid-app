import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      );
    }

    // In a real implementation, you might want to:
    // 1. Validate the session is still valid in your database
    // 2. Update the session expiration time
    // 3. Generate a new JWT token with extended expiration

    // For now, we'll just return a success response
    // The client-side code will handle updating the timeouts

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error extending session:', error);
    return NextResponse.json(
      { error: 'Failed to extend session' },
      { status: 500 }
    );
  }
}