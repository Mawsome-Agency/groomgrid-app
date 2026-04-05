import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { trackEmailVerified } from '@/lib/ga4';

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      trackEmailVerified(user.id);
    }
  }

  return NextResponse.redirect(new URL('/plans', requestUrl.origin));
}
