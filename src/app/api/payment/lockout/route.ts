import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import prisma from '@/lib/prisma';

/**
 * GET /api/payment/lockout
 * 
 * Get the current payment lockout status for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get the most recent payment lockout for this user
    const lockout = await prisma.paymentLockout.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ lockout });
  } catch (error: any) {
    console.error('Payment lockout fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch payment lockout status' }, { status: 500 });
  }
}