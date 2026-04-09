/**
 * GA4 Measurement Protocol — server-side event tracking.
 *
 * Used for events that originate on the server (API routes, webhooks)
 * where window.gtag is unavailable. Sends events directly to the
 * GA4 Measurement Protocol endpoint.
 *
 * Requires env vars:
 *   NEXT_PUBLIC_GA4_MEASUREMENT_ID  — e.g. G-XXXXXXXXXX
 *   GA4_API_SECRET                  — from GA4 Admin → Data Streams → Measurement Protocol
 *
 * If GA4_API_SECRET is not set, events are logged to console (no-op in prod).
 */

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const API_SECRET = process.env.GA4_API_SECRET;
const MP_ENDPOINT = 'https://www.google-analytics.com/mp/collect';

interface GA4ServerEvent {
  name: string;
  params?: Record<string, string | number | boolean>;
}

/**
 * Send one or more events to GA4 via the Measurement Protocol.
 * client_id is required — use userId or a deterministic ID derived from userId.
 * Silently no-ops if credentials are not configured.
 */
export async function trackServerEvent(
  clientId: string,
  events: GA4ServerEvent | GA4ServerEvent[],
  userId?: string
): Promise<void> {
  if (!MEASUREMENT_ID) {
    console.warn('[GA4 Server] NEXT_PUBLIC_GA4_MEASUREMENT_ID not set — skipping event');
    return;
  }

  if (!API_SECRET) {
    // Log in development so the gap is visible; don't throw in production
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[GA4 Server] GA4_API_SECRET not set — event not sent:', events);
    } else {
      console.warn('[GA4 Server] GA4_API_SECRET missing — server-side GA4 events disabled');
    }
    return;
  }

  const eventList = Array.isArray(events) ? events : [events];

  const payload: Record<string, unknown> = {
    client_id: clientId,
    events: eventList.map((e) => ({
      name: e.name,
      params: {
        engagement_time_msec: '100',
        ...e.params,
      },
    })),
  };

  if (userId) {
    payload.user_id = userId;
  }

  try {
    const url = `${MP_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok && process.env.NODE_ENV !== 'production') {
      const text = await res.text();
      console.warn(`[GA4 Server] Measurement Protocol returned ${res.status}:`, text);
    }
  } catch (err) {
    // Never let analytics errors break the request path
    console.error('[GA4 Server] Failed to send event:', err);
  }
}

// ── Typed helpers ────────────────────────────────────────────────────────────

export async function trackCheckoutCompletedServer(
  userId: string,
  sessionId: string,
  planType: string,
  trialStarted: boolean
): Promise<void> {
  await trackServerEvent(
    userId, // use userId as client_id; GA4 will dedupe on user_id
    {
      name: 'checkout_completed',
      params: {
        session_id: sessionId,
        plan_type: planType,
        trial_started: trialStarted,
      },
    },
    userId
  );
}

export async function trackSubscriptionCreatedServer(
  userId: string,
  subscriptionId: string,
  planType: string,
  status: string
): Promise<void> {
  await trackServerEvent(
    userId,
    {
      name: 'subscription_created',
      params: {
        subscription_id: subscriptionId,
        plan_type: planType,
        subscription_status: status,
      },
    },
    userId
  );
}

export async function trackSubscriptionUpdatedServer(
  userId: string,
  subscriptionId: string,
  status: string
): Promise<void> {
  await trackServerEvent(
    userId,
    {
      name: 'subscription_updated',
      params: {
        subscription_id: subscriptionId,
        subscription_status: status,
      },
    },
    userId
  );
}

export async function trackSubscriptionCancelledServer(
  userId: string,
  subscriptionId: string
): Promise<void> {
  await trackServerEvent(
    userId,
    {
      name: 'subscription_cancelled',
      params: { subscription_id: subscriptionId },
    },
    userId
  );
}

export async function trackSubscriptionStartedServer(
  userId: string,
  subscriptionId: string,
  planType: string,
  status: string,
  price: number
): Promise<void> {
  await trackServerEvent(
    userId,
    {
      name: 'subscription_started',
      params: {
        subscription_id: subscriptionId,
        plan_type: planType,
        subscription_status: status,
        price: price,
        currency: 'USD',
      },
    },
    userId
  );
}

export async function trackPaymentInitiatedServer(
  userId: string,
  sessionId: string,
  planType: string
): Promise<void> {
  await trackServerEvent(
    userId,
    {
      name: 'payment_initiated',
      params: {
        session_id: sessionId,
        plan_type: planType,
      },
    },
    userId
  );
}

export async function trackPaymentSuccessServer(
  userId: string,
  invoiceId: string,
  amount: number
): Promise<void> {
  await trackServerEvent(
    userId,
    {
      name: 'payment_success',
      params: {
        invoice_id: invoiceId,
        amount,
        currency: 'USD',
      },
    },
    userId
  );
}

export async function trackPaymentFailedServer(
  userId: string,
  invoiceId: string,
  reason: string
): Promise<void> {
  await trackServerEvent(
    userId,
    {
      name: 'payment_failed',
      params: {
        invoice_id: invoiceId,
        reason,
      },
    },
    userId
  );
}
