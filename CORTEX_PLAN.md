# Fix Checkout Funnel: Remove Credit Card Requirement for Trial Signup

## Problem
Homepage, signup, plans, and welcome pages all promise "No credit card required" and "14-day free trial."
But ALL 20 checkout sessions expired unpaid — Stripe subscription mode ALWAYS collects card info, even with trial_period_days.

## Root Cause
1. `GET /api/checkout/session` has NO trial guard — always creates Stripe checkout session
2. Plans page profile fetch failure silently falls through to Stripe checkout
3. `POST /api/checkout` returns error for trial users instead of handling plan selection gracefully
4. `createCheckoutSession()` uses `mode: 'subscription'` which Stripe always requires card for

## Fix Strategy
Make "No credit card required" actually true:
- Trial users select plans WITHOUT touching Stripe — just save planType to profile
- Only send users to Stripe when their trial ends and they need to pay

## File Changes

### 1. `src/app/api/checkout/session/route.ts` (GET)
- Add trial guard: check profile before creating Stripe session
- If user has active trial, redirect to `/plans` instead of Stripe

### 2. `src/app/plans/page.tsx`
- Fix profile fetch failure: default `isOnTrial=true` for authenticated users when profile fetch fails
- All authenticated users start as trial users, so this is the safe default
- Handle `trial_active` errorType from checkout API gracefully

### 3. `src/app/api/checkout/route.ts` (POST)
- Instead of returning 400 error for trial users, update their plan via profile
- Return success with `{ trial: true, planType }` so client knows to redirect to dashboard

### 4. `src/app/api/profile/route.ts` (PATCH)
- When `planType` is updated, ensure `trialEndsAt` is set if not already
- Trial users selecting a plan should keep `subscriptionStatus: 'trial'`

### 5. `src/lib/stripe.ts`
- Add `payment_method_collection: 'if_required'` to `createCheckoutSession`
- For trial subscriptions, this lets Stripe skip card collection when possible

## Testing
- Verify trial user on /plans can select plan without seeing Stripe
- Verify GET /api/checkout/session redirects trial users away from Stripe
- Verify profile PATCH correctly saves plan selection with trial dates
- Verify promo code flow still works for non-trial users