# GA4 Conversion Funnel Tracking Plan

## Overview

This document outlines the complete GA4 event tracking implementation for GroomGrid's signup-to-paid conversion funnel. All events are tracked using Google Analytics 4 via the `gtag()` function.

## Funnel Flow

```
Signup Started → Email Verified → Plan Selected → Payment Initiated →
Checkout Completed → Onboarding Started → Onboarding Completed → Dashboard First View
```

## Event Schema

### 1. signup_started

**When:** User starts signup flow by entering business name

**Location:** `src/app/signup/page.tsx`

**Parameters:**
- `business_name` (string): Name entered by user
- `timestamp` (string): ISO-8601 timestamp

**Example:**
```typescript
trackSignupStarted('Fluffy Paws Grooming');
```

---

### 2. email_verified

**When:** User's email is verified after signup

**Location:** Server-side (auth flow)

**Parameters:**
- `user_id` (string): User ID
- `timestamp` (string): ISO-8601 timestamp

**Example:**
```typescript
trackEmailVerified('user_123');
```

---

### 3. signup_error

**When:** An error occurs during signup

**Location:** `src/app/signup/page.tsx`

**Parameters:**
- `error` (string): Error message
- `context` (string): Where in the flow the error occurred
- `timestamp` (string): ISO-8601 timestamp

**Example:**
```typescript
trackSignupError('Email already exists', 'email_validation');
```

---

### 4. plan_selected

**When:** User selects a plan on the plans page

**Location:** `src/app/plans/page.tsx`

**Parameters:**
- `plan_type` (string): 'solo', 'salon', or 'enterprise'
- `plan_price` (number): Price in USD
- `timestamp` (string): ISO-8601 timestamp

**Example:**
```typescript
trackPlanSelected('solo', 29);
```

---

### 5. payment_initiated

**When:** User initiates Stripe checkout (before payment)

**Location:** Server-side (`src/app/api/checkout/route.ts`)

**Parameters:**
- `user_id` (string): User ID
- `session_id` (string): Stripe checkout session ID
- `plan_type` (string): 'solo', 'salon', or 'enterprise'
- `timestamp` (string): ISO-8601 timestamp

**Example:**
```typescript
await trackPaymentInitiatedServer('user_123', 'cs_abc123', 'solo');
```

---

### 6. payment_page_view

**When:** User views the checkout success page

**Location:** `src/app/checkout/success/page.tsx`

**Parameters:**
- `context` (string): Page context (e.g., 'success_page')
- `plan_type` (string): Selected plan type or 'unknown'
- `timestamp` (string): ISO-8601 timestamp

**Example:**
```typescript
trackPaymentPageView('success_page', 'solo');
```

---

### 7. checkout_completed

**When:** Payment is confirmed via webhook

**Location:** Server-side (webhook handler)

**Parameters:**
- `session_id` (string): Stripe session ID
- `plan_type` (string): 'solo', 'salon', or 'enterprise'
- `trial_started` (boolean): Whether a trial was started
- `timestamp` (string): ISO-8601 timestamp

**Example:**
```typescript
trackCheckoutCompleted('cs_abc123', 'solo', true);
```

---

### 8. onboarding_step_completed

**When:** User completes an onboarding step

**Location:** `src/app/onboarding/page.tsx`

**Parameters:**
- `step` (number): Step number (1, 2, or 3)
- `timestamp` (string): ISO-8601 timestamp

**Example:**
```typescript
trackOnboardingStep(1);
```

---

### 9. onboarding_completed

**When:** User completes all onboarding steps and sees completion screen

**Location:** `src/app/onboarding/page.tsx`

**Parameters:**
- `user_id` (string): User ID
- `timestamp` (string): ISO-8601 timestamp

**Notes:**
- Uses `useRef` guard to prevent duplicate fires from React strict mode
- Mutually exclusive with `onboarding_skipped`

**Example:**
```typescript
trackOnboardingCompleted('user_123');
```

---

### 10. onboarding_skipped

**When:** User skips onboarding tutorial

**Location:** `src/app/onboarding/page.tsx`

**Parameters:**
- `reason` (string): Reason for skipping (defaults to 'user_choice')
- `timestamp` (string): ISO-8601 timestamp

**Notes:**
- Mutually exclusive with `onboarding_completed`
- Uses ref guard to ensure only one fires per user

**Example:**
```typescript
trackOnboardingSkipped('user_choice');
```

---

### 11. dashboard_first_view

**When:** User views dashboard for the first time

**Location:** `src/app/dashboard/page.tsx`

**Parameters:**
- `user_id` (string): User ID
- `timestamp` (string): ISO-8601 timestamp

**Notes:**
- Uses `localStorage` with userId-prefixed key to prevent re-fires
- Storage key: `dashboard_first_view_seen_${userId}`
- Only fires once per user

**Example:**
```typescript
trackDashboardFirstView('user_123');
```

---

### 12. account_created

**When:** New account is created (after signup)

**Location:** Server-side (auth flow)

**Parameters:**
- `user_id` (string): User ID
- `business_name` (string): Business name
- `timestamp` (string): ISO-8601 timestamp

**Example:**
```typescript
trackAccountCreated('user_123', 'Fluffy Paws Grooming');
```

---

### 13. subscription_started

**When:** Subscription is successfully started

**Location:** Server-side (webhook handler)

**Parameters:**
- `user_id` (string): User ID
- `plan_type` (string): 'solo', 'salon', or 'enterprise'
- `price` (number): Price in USD
- `currency` (string): Currency code (default: 'USD')
- `timestamp` (string): ISO-8601 timestamp

**Example:**
```typescript
trackSubscriptionStarted('user_123', 'solo', 29, 'USD');
```

---

### 14. page_view

**When:** Any page is viewed (general page tracking)

**Location:** All page components

**Parameters:**
- `page_path` (string): URL path
- `page_title` (string): Page title

**Example:**
```typescript
trackPageView('/dashboard', 'Dashboard');
```

---

## Server-Side Events

The following events are tracked server-side via `ga4-server.ts`:

1. **trackPaymentInitiatedServer** - When checkout session is created
2. **trackPaymentSuccessServer** - When payment is confirmed (webhook)
3. **trackPaymentFailedServer** - When payment fails (webhook)

These are necessary because:
- Server routes don't have access to `window.gtag()`
- Stripe webhooks arrive server-side
- Payment confirmation happens asynchronously

## Implementation Notes

### Preventing Duplicate Events

**React Strict Mode (Double Fires):**
- Use `useRef` to track if an event has been fired
- Check the ref before firing the event

**Page Refreshes:**
- Use `localStorage` with user-prefixed keys
- Check if key exists before firing event

**Mutually Exclusive Events:**
- `onboarding_completed` and `onboarding_skipped` cannot both fire
- Use a shared ref guard to ensure only one fires per session

### Stripe Checkout Limitations

**Cannot Track:**
- Stripe's hosted checkout page interactions (we can't inject custom JS)

**Workaround:**
- Track `payment_initiated` before redirecting to Stripe
- Track `payment_page_view` on return to our success page
- Use webhooks for actual payment confirmation

## Testing Checklist

To verify all events are firing correctly:

1. **Enable GA4 Debug View:**
   - Install Google Analytics Debugger extension
   - Open GA4 Admin → DebugView

2. **Test Complete Flow:**
   - [ ] Sign up → verify `signup_started`
   - [ ] Verify email → verify `email_verified`
   - [ ] Select plan → verify `plan_selected`
   - [ ] Initiate checkout → verify `payment_initiated`
   - [ ] Complete payment (test mode) → verify `checkout_completed`
   - [ ] View success page → verify `payment_page_view`
   - [ ] Complete onboarding → verify `onboarding_step_completed` (1, 2, 3)
   - [ ] See completion screen → verify `onboarding_completed`
   - [ ] View dashboard → verify `dashboard_first_view`

3. **Test Skip Flow:**
   - [ ] Skip onboarding → verify `onboarding_skipped`
   - [ ] Verify `onboarding_completed` does NOT fire

4. **Test Error Flows:**
   - [ ] Trigger signup error → verify `signup_error`
   - [ ] Trigger payment failure (test mode) → verify `payment_failed` (via webhook)

## GA4 Funnel Setup

### Conversion Goals

Create these conversions in GA4:

1. **signup_completed** → Fires on `account_created`
2. **payment_completed** → Fires on `checkout_completed`
3. **onboarding_completed** → Fires on `onboarding_completed`

### Funnel Exploration

Create an exploration in GA4:

1. **Steps:** signup_started → plan_selected → payment_initiated → checkout_completed → onboarding_completed → dashboard_first_view
2. **Metrics:** Total users, Event count, Conversion rate
3. **Dimensions:** Plan type, Error type (for funnel analysis)

## Custom Events Registration

Ensure these events are registered as custom events in GA4:

- signup_started
- email_verified
- signup_error
- plan_selected
- payment_initiated
- payment_page_view
- checkout_completed
- onboarding_step_completed
- onboarding_completed
- onboarding_skipped
- dashboard_first_view
- account_created
- subscription_started

## Environment Variables

Required in `.env`:

```env
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

## File Locations

- **GA4 Client Functions:** `src/lib/ga4.ts`
- **GA4 Server Functions:** `src/lib/ga4-server.ts`
- **Pages:** `src/app/[page-name]/page.tsx`
- **API Routes:** `src/app/api/[route-name]/route.ts`
- **Webhook:** `src/app/api/webhooks/stripe/route.ts`

## Version History

- **v1.0** - Initial implementation with signup and payment tracking
- **v1.1** - Added onboarding and dashboard tracking
- **v1.2** - Added server-side payment tracking and webhooks
- **v1.3** - Added payment_page_view, onboarding_completed, dashboard_first_view (current)

## Support

For issues or questions about GA4 tracking:
- Check browser console for errors
- Verify GA4 DebugView is receiving events
- Ensure `NEXT_PUBLIC_GA4_MEASUREMENT_ID` is set correctly
