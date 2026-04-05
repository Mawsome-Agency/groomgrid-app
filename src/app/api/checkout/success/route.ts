import { NextRequest, NextResponse } from 'next/server';
import { getCheckoutSession } from '@/lib/stripe';
import { updateProfile } from '@/lib/supabase';
import { trackCheckoutCompleted } from '@/lib/ga4';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get('session_id');

    if (!session_id) {
      return NextResponse.redirect(new URL('/plans', req.url));
    }

    const session = await getCheckoutSession(session_id);
    
    if (!session.metadata?.userId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
    }

    await updateProfile(session.metadata.userId, {
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      plan_type: session.metadata.planType as 'solo' | 'salon' | 'enterprise',
      subscription_status: 'trial',
      trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    });

    trackCheckoutCompleted(session_id, session.metadata.planType, true);

    return NextResponse.redirect(new URL(`/onboarding?session_id=${session_id}`, req.url));
  } catch (error: any) {
    console.error('Checkout success error:', error);
    return NextResponse.redirect(new URL('/plans', req.url));
  }
}
