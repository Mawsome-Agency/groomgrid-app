import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';
import { createCheckoutSession, getStripeErrorMessage } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { trackPaymentInitiatedServer } from '@/lib/ga4-server';

// Plan data for metadata
const PLAN_DATA = {
  solo: { name: 'Solo', price: 2900 },
  salon: { name: 'Salon', price: 7900 },
  enterprise: { name: 'Enterprise', price: 14900 },
} as const;

// Note: trackPlanSelected is intentionally fired client-side (plans/page.tsx)
// before this API call. window.gtag is unavailable in server routes.

export async function POST(req: NextRequest) {
  try {
    const { userId, planType, customerEmail } = await req.json();

    if (!userId || !planType) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          errorType: 'generic',
        }, 
        { status: 400 }
      );
    }

    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      return NextResponse.json(
        { 
          error: 'Profile not found',
          errorType: 'generic',
        }, 
        { status: 404 }
      );
    }

    const session = await createCheckoutSession({
      userId,
      planType: planType as 'solo' | 'salon' | 'enterprise',
      customerEmail: customerEmail || `${userId}@groomgrid.app`,
      businessName: profile.businessName,
      planData: PLAN_DATA[planType as keyof typeof PLAN_DATA], // Pass plan data for metadata
    });

    // Track payment initiated event
    await trackPaymentInitiatedServer(userId, session.id, planType);

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Checkout error:', error);
    
    // Extract structured error information
    const errorDetails = getStripeErrorMessage(error);
    
    return NextResponse.json(
      { 
        error: errorDetails.message,
        errorType: errorDetails.type,
        declineCode: errorDetails.declineCode,
      }, 
      { status: 500 }
    );
  }
}
