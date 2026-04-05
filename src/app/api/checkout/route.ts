import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { getProfile } from '@/lib/supabase';
import { trackPlanSelected } from '@/lib/ga4';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

export async function POST(req: NextRequest) {
  try {
    const { userId, planType, customerEmail } = await req.json();

    if (!userId || !planType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const profile = await getProfile(userId) as Profile | null;
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const prices: Record<string, number> = { solo: 29, salon: 79, enterprise: 149 };
    trackPlanSelected(planType, prices[planType]);

    const session = await createCheckoutSession({
      userId,
      planType: planType as 'solo' | 'salon' | 'enterprise',
      customerEmail: customerEmail || `${userId}@groomgrid.app`,
      businessName: profile.business_name,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create checkout session' }, { status: 500 });
  }
}
