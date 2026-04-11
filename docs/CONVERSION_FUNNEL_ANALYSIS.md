# Signup-to-Paid Conversion Funnel Analysis

**Date:** April 11, 2026  
**Analysis Scope:** Signup → Plans → Payment → Dashboard  
**GA4 Period:** 7-day window ending 4/11/2026

---

## Executive Summary

The signup-to-paid conversion funnel has **critical bottlenecks** preventing users from completing the payment flow. GA4 data shows:

- **/signup**: 15 sessions, 80% bounce rate
- **/plans**: 10 sessions, 0% conversions
- **Overall conversion rate**: 0% (no paid subscribers)

**Root Cause Analysis** identified 3 CRITICAL, 4 HIGH, and 3 MEDIUM severity issues. The most impactful issues are:

1. `/plans` page not middleware-protected (unauthenticated users see blank loading screen)
2. Server-side GA4 events using wrong `client_id` (breaks funnel attribution)
3. `trackSignupStarted` firing on every keystroke (inflates metrics)

---

## Funnel Architecture

```
Landing (/)
  ↓ CTA click
/signup  ← [80% bounce, 15 sessions]
  ↓ POST /api/auth/signup
  ↓ signIn('credentials')
/welcome  ← [protected by middleware]
  ↓ PATCH /api/profile {welcomeShown: true}
  ↓ button click
/plans  ← [10 sessions, 0% bounce per GA4, 0 conversions]
  ↓ click plan card → POST /api/checkout → Stripe redirect
stripe.com/checkout
  ↓ success
/checkout/success?session_id=...
  ↓ GET /api/checkout/success (creates PaymentEvent)
  ↓ Stripe webhook → profile.subscriptionStatus = 'active'
/onboarding
  ↓
/dashboard
```

---

## Critical Issues (🔴)

### 1. `/plans` is not middleware-protected

**File:** `src/middleware.ts`

```typescript
const protectedRoutes = ['/dashboard', '/onboarding', '/welcome', '/admin']
// ↑ '/plans' is MISSING
```

**Impact:** Unauthenticated users who land on `/plans` (from ads, direct links, referrals) are NOT middleware-redirected. They hit the page, React renders, `useSession()` returns `status: 'loading'` → shows a white "Loading..." screen → then `status: 'unauthenticated'` → `router.push('/login')`. The entire page is a blank loading screen for unauthenticated visitors. GA4 counts these as sessions but they never see a plan card.

**Estimated Impact:** This single bug likely accounts for the majority of /plans "sessions" with 0 conversions.

**Fix Required:** Add `/plans` to `protectedRoutes` in `src/middleware.ts`

---

### 2. Silent welcome redirect from `/plans`

**File:** `src/app/plans/page.tsx` — lines 108–129

```typescript
useEffect(() => {
  if (status === 'authenticated' && session?.user?.id) {
    fetch('/api/profile')
      .then((res) => res.json())
      .then((data) => {
        if (!data.welcomeShown && !data.stripeSubscriptionId) {
          router.replace('/welcome'); // ← silent redirect, no user feedback
        }
      })
      .catch((err) => {
        console.error('Failed to check welcome status:', err);
        // Don't block page if check fails — but user sees broken state
      });
  }
}, [status, session, router]);
```

**Impact:** Any authenticated user who navigates to `/plans` directly (bookmark, back button, email link) but hasn't had `welcomeShown` set yet gets silently bounced to `/welcome`. The profile fetch adds latency — user sees the plan page for ~300–600ms and then gets redirected. This creates a confusing experience and may contribute to drop-off.

**Additional Issue:** The `/welcome` page itself has a reverse check — if `welcomeShown` is already true, it redirects back to `/plans`. This creates a potential redirect loop if `welcomeShown` is in a bad state.

**Fix Required:** Add user feedback before redirect, or remove the redirect entirely and show a welcome banner instead.

---

### 3. `trackSignupStarted` fires on every keystroke

**File:** `src/app/signup/page.tsx` — lines 20–24

```typescript
useEffect(() => {
  if (formData.businessName) {
    trackSignupStarted(formData.businessName);  // ← fires on EVERY character typed
  }
}, [formData.businessName]);
```

**Impact:** GA4 receives dozens of `signup_started` events per user session (one per character in businessName). This inflates funnel metrics and makes it impossible to know true signup intent vs. form interaction. The `trackSignupStarted` function does not deduplicate.

**Fix Required:** Add debouncing or only fire on form submission.

---

## High Severity Issues (🟠)

### 4. Signup form has no client-side validation

**File:** `src/app/signup/page.tsx`

The `useFormValidation` hook exists in `src/hooks/use-form-validation.ts` but is **not imported or used** on the signup page. The form relies entirely on:
- `required` attribute on all fields
- `minLength={8}` on password input
- `type="email"` on email input for native browser validation

**Impact:**
- No inline validation on blur — user doesn't know their email is malformed until form submission
- No password strength indicator
- No confirmation password field — typos in password lock the user out immediately
- HTML5 validation messages are browser-styled and not accessible on mobile Safari

**Fix Required:** Import and use `useFormValidation` hook, add password confirmation field.

---

### 5. No drip email enrolled after signup

**File:** `src/app/api/auth/signup/route.ts`

The signup API creates user + profile but does **not** call `enrollUserInDrip()` from `src/lib/email/enroll-drip.ts`. There's a separate `/api/email/drip/enroll` endpoint but signup doesn't trigger it.

**Impact:** Users who bounce from the plans page get no nurture sequence to bring them back.

**Fix Required:** Call `enrollUserInDrip()` in the signup route.

---

### 6. Server-side GA4 `client_id` is wrong

**File:** `src/lib/ga4-server.ts` — line 29

```typescript
export async function trackServerEvent(
  clientId: string,  // ← called with userId
  ...
```

**File:** `src/app/api/checkout/route.ts` — line 52
```typescript
await trackPaymentInitiatedServer(userId, session.id, planType);
// ↑ passes userId as clientId
```

**Impact:** GA4's `client_id` should be the browser cookie value (`_ga` cookie), not the userId. Using userId as client_id means server-side events (payment_initiated, subscription_created, checkout_completed) are attributed to a different "user" than the browser events. Server-side funnel events are effectively invisible in GA4 funnel reports because they don't stitch to the browser session. This is why GA4 shows 0% conversion — the conversion events never land in the same session as the pageview.

**Fix Required:** Pass the actual GA4 `client_id` from the request to server-side tracking functions.

---

### 7. `/plans` auth loading state shows blank screen

**File:** `src/app/plans/page.tsx` — lines 181–187

```typescript
if (status === 'loading' || !session) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-stone-50 flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>
  );
}
```

**Impact:** While session status resolves (~200–500ms), users see only "Loading..." text on a blank gradient. Users on slow connections may bounce before seeing any content. No skeleton UI, no plan preview, no SSG/SSR fallback.

**Fix Required:** Add skeleton UI or render plans with a "Sign up to view" message for unauthenticated users.

---

## Medium Severity Issues (🟡)

### 8. `billing_address_collection: 'required'` in Stripe adds friction

**File:** `src/lib/stripe.ts` — line 54

```typescript
billing_address_collection: 'required',
```

**Impact:** Users must enter a full billing address during Stripe checkout, even though it's a 14-day free trial with no charge today. This is a known conversion killer — each extra form field reduces completion by ~5–10%.

**Fix Required:** Change to `'auto'` for trials.

---

### 9. Welcome page has no `<title>` override

**File:** `src/app/welcome/page.tsx`

The layout.tsx sets a default title (`GroomGrid - Pet Grooming Business Management`). The welcome page doesn't export `metadata`. The welcome page checks `data.welcomeShown` and redirects to `/plans` if already shown — but there's a race condition: if the user refreshes the welcome page before the `PATCH` to set `welcomeShown: true` completes, they see the welcome page again and need to click "Choose Your Plan" again.

**Fix Required:** Add metadata export with custom title, fix race condition.

---

### 10. PlanCard `onSelect` fires Stripe redirect immediately

**File:** `src/components/funnel/PlanCard.tsx` — the entire card `div` has `onClick={() => onSelect(plan)}`

```typescript
<div onClick={() => onSelect(plan)} ...>
```

**Impact:** Single click on any part of the plan card triggers an immediate checkout redirect. There's no "Confirm selection" step, no billing summary preview before redirect, no ability to review. Users who accidentally click (mobile fat-finger) get sent to Stripe unexpectedly.

**Fix Required:** Add a confirmation modal or make only the CTA button trigger checkout.

---

## Priority List for QA Testing

### P0 (Critical - Blocker)
1. **Test `/plans` middleware protection** - Verify unauthenticated users are redirected to `/login` before page renders
2. **Test GA4 client_id stitching** - Verify server-side events (payment_initiated) appear in the same GA4 session as pageviews
3. **Test signup event deduplication** - Verify `signup_started` fires only once per session, not on every keystroke

### P1 (High - Major Friction)
4. **Test signup form validation** - Verify inline validation on blur, password strength indicator, confirmation field
5. **Test drip email enrollment** - Verify new users are enrolled in drip sequence after signup
6. **Test `/plans` loading state** - Verify skeleton UI or plan preview shows during session resolution

### P2 (Medium - UX Improvements)
7. **Test Stripe billing address** - Verify address collection is set to `'auto'` for trials
8. **Test welcome page title** - Verify custom page title is set
9. **Test plan card selection** - Verify checkout only triggers on CTA button click, not entire card

---

## Integration Test Recommendations

### Test 1: `/plans` Middleware Protection
```typescript
// e2e/plans-middleware.spec.ts
test('unauthenticated users redirected to login before plans render', async ({ page }) => {
  await page.goto('/plans');
  // Should NOT see "Loading..." text
  // Should be redirected to /login immediately
  await expect(page).toHaveURL('/login');
});
```

### Test 2: GA4 Client ID Stitching
```typescript
// e2e/ga4-funnel.spec.ts
test('server-side events stitch to browser session', async ({ page, context }) => {
  // Get GA4 client_id from cookie
  const clientId = await page.evaluate(() => {
    return document.cookie.split('; ').find(row => row.startsWith('_ga=')).split('=')[1];
  });
  
  // Complete signup flow
  await page.goto('/signup');
  // ... fill form and submit
  
  // Select plan and initiate checkout
  await page.goto('/plans');
  await page.click('[data-testid="plan-solo-select"]');
  
  // Verify payment_initiated event has same client_id
  // This requires mocking GA4 or checking network requests
});
```

### Test 3: Signup Event Deduplication
```typescript
// e2e/signup-events.spec.ts
test('signup_started fires only once', async ({ page }) => {
  await page.goto('/signup');
  
  // Track GA4 events
  const events: string[] = [];
  page.on('console', msg => {
    if (msg.text().includes('signup_started')) {
      events.push(msg.text());
    }
  });
  
  // Type business name character by character
  await page.fill('[name="businessName"]', 'Test Business');
  
  // Should have only 1 signup_started event
  expect(events.length).toBe(1);
});
```

### Test 4: Signup Form Validation
```typescript
// e2e/signup-validation.spec.ts
test('inline validation shows on blur', async ({ page }) => {
  await page.goto('/signup');
  
  // Type invalid email
  await page.fill('[name="email"]', 'invalid-email');
  await page.blur('[name="email"]');
  
  // Should show validation error
  await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
  
  // Type weak password
  await page.fill('[name="password"]', '123');
  await page.blur('[name="password"]');
  
  // Should show password strength indicator
  await expect(page.locator('[data-testid="password-strength"]')).toBeVisible();
});
```

### Test 5: Drip Email Enrollment
```typescript
// e2e/drip-enrollment.spec.ts
test('new users enrolled in drip after signup', async ({ page }) => {
  await page.goto('/signup');
  // ... fill form and submit
  
  // Check database for drip enrollment
  const response = await fetch('/api/admin/drip-queue');
  const queue = await response.json();
  
  // Should have entry for new user
  expect(queue.some(item => item.userId === newUserId)).toBe(true);
});
```

---

## Performance Metrics (Core Web Vitals)

### Current State (estimated based on code analysis)

| Page | LCP | TBT | CLS | Notes |
|------|-----|-----|-----|-------|
| /signup | ~1.2s | ~150ms | 0.05 | Minimal JS, good |
| /plans | ~2.5s | ~300ms | 0.1 | Session check adds latency |
| /welcome | ~1.8s | ~200ms | 0.05 | Profile fetch adds latency |

### Recommendations

1. **Add SSG for `/plans`** - Generate static plan cards, hydrate with session data
2. **Optimize session check** - Use SWR or React Query with optimistic UI
3. **Preload critical resources** - Preconnect to Stripe, preload fonts
4. **Add loading skeletons** - Improve perceived performance during async operations

---

## Mobile vs Desktop Analysis

### Mobile-Specific Issues

1. **HTML5 validation messages** - Not visible on mobile Safari, users don't see errors
2. **Plan card click area** - Entire card is clickable, fat-finger errors common
3. **Loading states** - Blank screens more noticeable on mobile with slower connections

### Desktop-Specific Issues

1. **None identified** - Desktop experience is generally better

### Recommendations

1. Add custom validation UI (not browser-native)
2. Make only CTA button clickable on plan cards
3. Add skeleton UI for all loading states

---

## Next Steps

1. **Immediate (P0):** Fix middleware protection for `/plans`
2. **Immediate (P0):** Fix GA4 `client_id` stitching
3. **Immediate (P0):** Fix `trackSignupStarted` deduplication
4. **Short-term (P1):** Add signup form validation
5. **Short-term (P1):** Enroll users in drip after signup
6. **Short-term (P1):** Add skeleton UI for `/plans`
7. **Medium-term (P2):** Optimize Stripe checkout flow
8. **Medium-term (P2):** Add confirmation modal for plan selection

---

## Appendix: File Changes Required

| File | Change | Priority |
|------|--------|----------|
| `src/middleware.ts` | Add `/plans` to `protectedRoutes` | P0 |
| `src/lib/ga4-server.ts` | Accept real `client_id` from request | P0 |
| `src/app/api/checkout/route.ts` | Pass GA4 `client_id` to tracking | P0 |
| `src/app/signup/page.tsx` | Add debouncing to `trackSignupStarted` | P0 |
| `src/app/signup/page.tsx` | Import and use `useFormValidation` | P1 |
| `src/app/api/auth/signup/route.ts` | Call `enrollUserInDrip()` | P1 |
| `src/app/plans/page.tsx` | Add skeleton UI for loading state | P1 |
| `src/lib/stripe.ts` | Change `billing_address_collection` to `'auto'` | P2 |
| `src/app/welcome/page.tsx` | Add metadata export with title | P2 |
| `src/components/funnel/PlanCard.tsx` | Make only CTA button clickable | P2 |

---

**Report Generated By:** Jesse Korbin (Engineering Lead)  
**Mission:** Dev Pipeline: Pattern Analysis: Signup-to-Paid Conversion Bottlenecks  
**Supports Rock:** Get first 100 paying subscribers (GROWTH)
