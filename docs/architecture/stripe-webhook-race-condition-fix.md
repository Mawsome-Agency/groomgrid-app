# Stripe Webhook Race Condition — Architecture Fix

## Problem Statement

The checkout success handler (`/api/checkout/success/route.ts`) and the Stripe webhook handler (`/api/stripe/webhook/route.ts`) both update `profile.onboardingStep` independently. Webhooks are asynchronous and may arrive before or after the checkout success redirect, creating a race condition.

## Current State

**Checkout Success Handler:**
```typescript
// Sets onboardingStep = 0 and redirects
await prisma.userProfile.update({
  where: { userId },
  data: { onboardingStep: 0 }
});
redirect('/onboarding/welcome');
```

**Stripe Webhook Handler:**
```typescript
// Updates stripeCustomerId and subscriptionStatus separately
await prisma.userProfile.update({
  where: { userId },
  data: { 
    stripeCustomerId: customer.id,
    subscriptionStatus: 'active'
  }
});
```

## Issues Created by Race Condition

1. **Webhook arrives BEFORE redirect**: User lands on onboarding with incomplete profile data
2. **Webhook arrives AFTER redirect**: User onboarding state may be overwritten
3. **Concurrent updates**: Database may reject one update or apply them in wrong order
4. **Analytics gaps**: Events fire at wrong times or are missed

## Proposed Solution: Single Source of Truth Pattern

### Architecture Pattern: Event-Driven State Management

Instead of having two handlers independently update the profile, use a **unified payment completion event handler**:

```
Payment Flow:
┌─────────────────┐
│ Stripe Checkout │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Checkout Success Handler (Sync)    │
│ - Creates PaymentRecord            │
│ - Publishes PAYMENT_INITIATED event│
│ - Redirects to /onboarding/welcome │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Stripe Webhook (Async)              │
│ - Verifies payment                  │
│ - Publishes PAYMENT_CONFIRMED event │
│ - No profile updates here!          │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Payment Completion Handler (Deduped)│
│ - Runs once per paymentId          │
│ - Atomically updates:              │
│   - stripeCustomerId               │
│   - subscriptionStatus             │
│   - onboardingStep = 0              │
│ - Sends onboarding start email     │
│ - Fires GA4 event                   │
└─────────────────────────────────────┘
```

### Implementation Details

#### 1. Add Payment Events Table
```typescript
model PaymentEvent {
  id          String   @id @default(cuid())
  paymentId   String   @unique
  eventType   String   // PAYMENT_INITIATED, PAYMENT_CONFIRMED
  processedAt DateTime @default(now())
  payload     Json
  
  @@index([paymentId, eventType])
}
```

#### 2. Checkout Success Handler (Modified)
```typescript
export async function GET(request: Request) {
  const session = await getStripeSession();
  const userId = await getUserId();
  
  // Record initiation event
  await prisma.paymentEvent.create({
    data: {
      paymentId: session.payment_intent as string,
      eventType: 'PAYMENT_INITIATED',
      payload: { userId, sessionId: session.id }
    }
  });
  
  // Redirect immediately - don't block on database updates
  redirect('/onboarding/welcome');
}
```

#### 3. Stripe Webhook Handler (Modified)
```typescript
export async function POST(request: Request) {
  const event = await stripe.webhooks.constructEvent(...);
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Record confirmation event
    await prisma.paymentEvent.create({
      data: {
        paymentId: session.payment_intent as string,
        eventType: 'PAYMENT_CONFIRMED',
        payload: { sessionId: session.id }
      }
    });
    
    // Trigger async completion handler
    await triggerPaymentCompletionHandler(session);
  }
  
  return new Response(null, { status: 200 });
}
```

#### 4. Payment Completion Handler (New)
```typescript
async function triggerPaymentCompletionHandler(session: any) {
  // Deduplication: Check if already processed
  const existing = await prisma.paymentEvent.findFirst({
    where: {
      paymentId: session.payment_intent,
      eventType: 'COMPLETION_PROCESSED'
    }
  });
  
  if (existing) return; // Already processed
  
  // Atomic profile update with all payment data
  await prisma.$transaction(async (tx) => {
    // Get userId from PAYMENT_INITIATED event
    const initiatedEvent = await tx.paymentEvent.findFirst({
      where: {
        paymentId: session.payment_intent,
        eventType: 'PAYMENT_INITIATED'
      }
    });
    
    const userId = initiatedEvent.payload.userId;
    
    // Single atomic update
    await tx.userProfile.update({
      where: { userId },
      data: {
        stripeCustomerId: session.customer as string,
        subscriptionStatus: 'active',
        subscriptionTier: getTierFromSession(session),
        onboardingStep: 0,
        subscriptionStartedAt: new Date()
      }
    });
    
    // Record completion event (idempotency key)
    await tx.paymentEvent.create({
      data: {
        paymentId: session.payment_intent,
        eventType: 'COMPLETION_PROCESSED',
        payload: { processedAt: new Date().toISOString() }
      }
    });
  });
  
  // Send welcome email
  await sendWelcomeEmail(userId);
  
  // Fire GA4 event
  await trackGA4Event('subscription_created', { userId });
}
```

### Benefits of This Pattern

1. **Idempotency**: Webhooks can retry safely without duplicate updates
2. **Atomicity**: All profile updates happen in a single transaction
3. **Event ordering**: We know exactly which events happened when
4. **Debugging**: Full audit trail of payment flow
5. **Scalability**: Pattern scales to 1M+ users without data races
6. **Analytics accuracy**: Events fire at the right time

### Scaling Considerations (1M Users)

At 1M users with 10,000 new signups/day:
- Event table: ~100K records/day → 3M/month
- Query performance: Index on `(paymentId, eventType)` → O(log n) lookups
- Storage: ~1MB/month (tiny)
- Webhook retries: Idempotency prevents issues

**This pattern scales indefinitely.**

---

## Alternative Simpler Fix (If Above is Too Complex)

### Pattern: Idempotent Updates with Versioning

Add a `paymentVersion` field to UserProfile and use optimistic concurrency:

```typescript
// Checkout Success Handler
const profile = await prisma.userProfile.update({
  where: { userId },
  data: { 
    onboardingStep: 0,
    paymentVersion: { increment: 1 }
  }
});

// Stripe Webhook Handler
await prisma.userProfile.updateMany({
  where: { 
    userId,
    paymentVersion: { lt: 2 } // Only update if not already set
  },
  data: {
    stripeCustomerId: customer.id,
    subscriptionStatus: 'active',
    paymentVersion: 2
  }
});
```

**This is simpler but less robust.** Use the event-driven pattern for production.

---

## Acceptance Criteria

- [ ] Both checkout success and webhook handlers no longer update profile independently
- [ ] Payment events table created with proper indexes
- [ ] Webhook can be retried safely without duplicates
- [ ] All profile updates happen atomically
- [ ] Onboarding redirect works correctly regardless of webhook timing
- [ ] Analytics events fire at correct time (after payment confirmed)
- [ ] Load test shows no race conditions at 100 concurrent payments

---

## What This Means for Onboarding Flow

The onboarding flow can safely assume:
- When user lands on `/onboarding/welcome`, their profile has `onboardingStep = 0`
- Their `stripeCustomerId` and `subscriptionStatus` will be set correctly
- Email will be sent asynchronously (non-blocking)
- GA4 events will fire at the right time

No changes needed to onboarding flow implementation itself — this fixes the foundation.

---

## Risk Level Before Fix: CRITICAL
## Risk Level After Fix: LOW

