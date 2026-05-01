# Implementation Plan: Standardize Error Response Format Across All API Routes

## Problem
API routes have inconsistent error handling:
- Some use `apiError()` from `@/lib/api-errors`, some manually construct `NextResponse.json({ error, errorType })`
- Some catch blocks use `catch(error: any)` instead of `catch(error: unknown)`
- Payment routes don't consistently use `getStripeErrorMessage()` for Stripe errors
- A couple routes return errors without `errorType` field at all

## Solution
1. Replace all `catch(error: any)` with `catch(error: unknown)` + proper type narrowing
2. Replace all manual `NextResponse.json({ error, errorType: 'generic' })` with `apiError()`
3. Ensure payment routes use `getStripeErrorMessage()` for Stripe-caught errors
4. Fix the few routes that return errors without `errorType`

## Files to Modify

### Already correct (use `apiError()` + `catch(error: unknown)`):
- `src/app/api/checkout/route.ts` ✅
- `src/app/api/checkout/session/route.ts` ✅
- `src/app/api/checkout/success/route.ts` ✅
- `src/app/api/checkout/funnel-diagnostic/route.ts` ✅
- `src/app/api/appointments/route.ts` ✅
- `src/app/api/analytics/track/route.ts` ✅ (uses `catch(error: unknown)`, missing `errorType` — minor fix)

### Need updating — replace manual error JSON with `apiError()` + fix `catch`:
1. `src/app/api/payment/check-status/route.ts` — `catch(error: any)` → `catch(error: unknown)`, manual error JSON → `apiError()`
2. `src/app/api/payment/lockout/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
3. `src/app/api/feedback/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
4. `src/app/api/stripe/webhook/route.ts` — manual error JSON → `apiError()`
5. `src/app/api/admin/engagement/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
6. `src/app/api/book/[userId]/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
7. `src/app/api/clients/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
8. `src/app/api/clients/[id]/pets/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
9. `src/app/api/appointments/[id]/route.ts` — `catch(error)` → `catch(error: unknown)`, mixed `apiError`/raw JSON → `apiError()`
10. `src/app/api/auth/signup/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
11. `src/app/api/auth/resend-verification/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
12. `src/app/api/auth/forgot-password/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
13. `src/app/api/auth/reset-password/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
14. `src/app/api/auth/session/extend/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
15. `src/app/api/business-hours/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
16. `src/app/api/profile/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
17. `src/app/api/ab-test/assign/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
18. `src/app/api/ab-test/conversion/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
19. `src/app/api/ab-tests/track/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
20. `src/app/api/admin/ab-tests/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
21. `src/app/api/admin/ab-tests/[id]/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
22. `src/app/api/admin/ab-tests/[id]/results/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
23. `src/app/api/analytics/verify/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
24. `src/app/api/test-sentry-error/route.ts` — `catch(error)` → `catch(error: unknown)`, missing `errorType` → `apiError()`
25. `src/app/api/seo/quick-wins/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
26. `src/app/api/seo/keywords/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
27. `src/app/api/seo/gap-analysis/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
28. `src/app/api/seo/competitors/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
29. `src/app/api/seo/questions/route.ts` — `catch(error)` → `catch(error: unknown)`, manual error JSON → `apiError()`
30. `src/app/api/services/estimate/route.ts` — missing `errorType`, manual error JSON → `apiError()`
31. `src/app/api/stripe/route.ts` — missing `errorType`, manual error JSON → `apiError()`
32. `src/app/api/email/drip/enroll/route.ts` — `catch(err)` → `catch(error: unknown)`, manual error JSON → `apiError()`
33. `src/app/api/email/drip/process/route.ts` — manual error JSON → `apiError()`
34. `src/app/api/email/unsubscribe/route.ts` — manual error JSON → `apiError()`
35. `src/app/api/cron/reminder-check/route.ts` — manual error JSON → `apiError()`

## Approach
- Import `apiError` from `@/lib/api-errors` in each file
- Replace `NextResponse.json({ error: 'msg', errorType: 'generic' }, { status: N })` with `apiError('msg', N)`
- Replace `catch(error: any)` and `catch(error)` with `catch(error: unknown)` — no further narrowing needed since `apiError` doesn't depend on error type
- Payment routes: use `getStripeErrorMessage()` in catch block and pass result to `apiError()`
- Routes with `retryAfter` (rate limit): use `apiError('msg', 429, { retryAfter: N })`
- Keep redirect responses (verify-email, forgot-password success) as-is — they're not error JSON responses
- The webhook route's `constructEvent` catch should use `apiError()`
- The `auth/verify-email/route.ts` uses redirects, not JSON errors — leave as-is

## Tests
- Run `npx tsc --noEmit` to verify types compile
- Run existing test suite