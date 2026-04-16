import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe, mockStripeWebhookEvent, generateStripeSignature } from '@/lib/stripe';
import { handleStripeEvent } from './_handler';
import { checkRateLimit } from '@/lib/rate-limit';
import { requireEnvVar } from '@/lib/validation';

export async function POST(req: Request) {
  // Validate required environment variables
  const webhookSecret = requireEnvVar('STRIPE_WEBHOOK_SECRET');

  // Rate limiting: prevent webhook spam
  // Use IP address as key, allow 100 requests per minute (stricter in test mode: 10/min)
  const ip = headers().get('x-forwarded-for') || headers().get('x-real-ip') || 'unknown';
  const isTestEnv = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';
  const rateLimit = isTestEnv ? 10 : 100;
  const rateLimitResult = checkRateLimit(`webhook:${ip}`, rateLimit, 60 * 1000);

  if (!rateLimitResult.allowed) {
    console.warn(`[Webhook] Rate limited for IP ${ip}: ${rateLimitResult.retryAfter}s until reset`);
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: rateLimitResult.retryAfter },
      { status: 429 }
    );
  }

  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event;

  // Layer 1: Environment check - only test/development allowed for bypass
  if (isTestEnv && process.env.ENABLE_TEST_WEBHOOK_BYPASS === 'true') {
    // Layer 2: Secret test key header (required in test mode)
    const testKey = headers().get('x-test-webhook-key');
    const expectedKey = process.env.STRIPE_WEBHOOK_TEST_KEY;

    if (!expectedKey) {
      console.error('[Webhook] STRIPE_WEBHOOK_TEST_KEY not configured');
      return NextResponse.json({ error: 'Test key not configured' }, { status: 500 });
    }

    if (!testKey || testKey !== expectedKey) {
      console.warn('[Webhook] Invalid or missing test key');
      return NextResponse.json({ error: 'Invalid test key' }, { status: 401 });
    }

    // Layer 3: Request origin validation (for E2E tests)
    const origin = headers().get('origin') || headers().get('referer') || '';
    const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
    if (!allowedOrigins.some(o => origin.includes(o))) {
      console.warn('[Webhook] Test request from unexpected origin:', origin);
    }

    // Use mock event in test mode
    event = mockStripeWebhookEvent;
  } else {
    // Production: always require valid Stripe signature
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: any) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  }

  try {
    await handleStripeEvent(event);
    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
