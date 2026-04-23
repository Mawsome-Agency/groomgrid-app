# CORTEX_PLAN.md — Configure GA4_API_SECRET for Production Server-Side Event Tracking

## Scope: BUGFIX | Branch: cortex/jesse-korbin/dev-pipeline-build-configure-ga4-api-sec

## Problem
All server-side GA4 BOFU events (checkout_completed, subscription_started, purchase_completed,
payment_success, etc.) are silently dropped in production because `GA4_API_SECRET` is not set
in the production environment. The code early-returns with a console.warn that goes undetected
in Sentry, leaving the bottom-of-funnel conversion funnel completely dark.

A secondary bug: `payment-completion.ts` was calling `trackSubscriptionStartedServer` with 5
args in the wrong order (userId/subscriptionId/planType swapped). This would have sent garbled
data once the env var was fixed.

## Root Cause
1. `GA4_API_SECRET` missing from production `.env.local` on the droplet.
2. `payment-completion.ts` had wrong arg order for `trackSubscriptionStartedServer`.
3. Production missing secret logged as `console.warn` (not captured by Sentry).

## Code Changes Made

### 1. `src/lib/payment-completion.ts`
Fixed `trackSubscriptionStartedServer` call — was passing 5 args in wrong order:
- Before: `(userId, stripeSubscriptionId, planType, 'trial', planPrice)`
- After:  `(clientId || userId, userId, stripeSubscriptionId, planType, 'trial', planPrice)`

### 2. `src/lib/ga4-server.ts`
Changed production log from `console.warn` → `console.error` for missing `GA4_API_SECRET`.
Sentry captures errors, not warnings — this ensures the gap is visible in error monitoring.

### 3. `ecosystem.config.js`
Added documentation comments listing all required `.env.local` entries, explicitly calling out
`GA4_API_SECRET` and `NEXT_PUBLIC_GA4_MEASUREMENT_ID` with instructions for where to find them.

### 4. `.env.example`
Improved GA4 section with step-by-step instructions for obtaining the Measurement ID and
API Secret from GA4 Admin.

## Test Changes

### `src/lib/__tests__/ga4-server.test.ts`
- Updated "should not warn in production" → "should error in production" to check `console.error`.

### `src/lib/__tests__/payment-completion.test.ts`
- Updated all 3 `trackSubscriptionStartedServer` assertion to use correct 6-arg signature.

## Deploy Checklist (for deploy agent)

The following must be done on the production droplet for events to fire:

1. **Create GA4 API Secret** (manual — Matt):
   GA4 Admin → Data Streams → Web stream → Measurement Protocol API Secrets → Create
   Copy the secret value.

2. **Add to `/home/deployer/cortex/groomgrid-app/.env.local`**:
   ```
   GA4_API_SECRET=<secret_from_step_1>
   NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX   # real value from GA4 Data Streams
   ```

3. **Restart PM2**:
   ```
   pm2 restart groomgrid-app
   ```

4. **Verify**: Trigger a test checkout and check GA4 DebugView for `checkout_completed`.

## Risks
- Blast radius: Low — only server-side GA4 events affected.
- Regression risk: Low — code changes are env-var guard + arg order fix.
