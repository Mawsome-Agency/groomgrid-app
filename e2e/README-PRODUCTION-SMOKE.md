# Production E2E Smoke Tests

This directory contains end-to-end tests for verifying the critical signup-to-paid funnel in production after recent fixes.

## ⚠️ Important Notice

**These tests create real user accounts on production.** Run with caution and only when:
- Verifying critical fixes have been deployed
- Validating the signup-to-paid flow works end-to-end
- Smoke testing after production deployments

## Test Coverage

The `production-smoke.spec.ts` file verifies:

1. **Signup flow works with real emails** - Creates actual user accounts
2. **Checkout session creates correctly with Stripe** - Tests Stripe integration
3. **Post-payment redirect to onboarding works** - Validates success flow
4. **Analytics events fire correctly** - Verifies GA4 tracking
5. **No 500s in production logs** - Catches server errors

## Running the Tests

### Prerequisites

Ensure you have Playwright installed:
```bash
npm install
npx playwright install
```

### Run Production Smoke Tests

```bash
# Run all production smoke tests (creates real accounts)
npx playwright test production-smoke.spec.ts --project=production

# Run with headed mode to see the browser
npx playwright test production-smoke.spec.ts --project=production --headed

# Run specific test
cd groomgrid-app && npx playwright test production-smoke.spec.ts -g "Full funnel smoke test" --project=production
```

### Environment Variables

The production tests use the hardcoded production URL:
- `PRODUCTION_URL = 'https://getgroomgrid.com'`

No additional environment variables are required, but you can override the base URL:
```bash
PLAYWRIGHT_BASE_URL=https://getgroomgrid.com npx playwright test production-smoke.spec.ts
```

## Test Structure

### Health Check Tests
- Verify `/api/health` returns 200
- Confirm critical pages load without 500 errors
- Validate provider APIs are accessible

### Signup Flow Tests
- Complete signup with real email
- Form validation
- Duplicate email prevention
- Login functionality for new users

### Checkout Flow Tests
- Plans page renders with all plan cards
- Checkout API returns valid session URL
- Checkout success/cancel/error pages render

### Onboarding Flow Tests
- Onboarding page loads for authenticated users
- Post-payment redirect works

### Analytics Tests
- Page view events fire on critical pages
- No JavaScript errors on critical pages

### Error Handling Tests
- 404 pages return proper response
- API routes return proper error codes
- Invalid checkout session returns graceful error

### Performance Tests
- Critical pages load within acceptable time (< 5s)

### Full Funnel Smoke Test
- Complete journey: landing → signup → authenticated → plans → checkout

## Test Utilities

### Helpers

The tests use helpers from `helpers/test-utils.ts`:

- `generateTestEmail()` - Creates unique test email addresses
- `generateTestPassword()` - Returns standard test password
- `generateTestBusinessName()` - Creates unique business names
- `checkProviderAvailability()` - Checks Stripe/Mailgun status
- `verifyEmailAutoVerified()` - Verifies test emails are auto-verified

### Analytics Interception

Tests intercept GA4 events to verify analytics are firing:

```typescript
const events = await setupAnalyticsInterception(page);
// ... perform actions ...
expect(events.length).toBeGreaterThan(0);
```

## Safety Features

1. **Production Detection**: Tests automatically skip if not running against `getgroomgrid.com`
2. **Rate Limit Handling**: Tests gracefully handle 429 responses
3. **Cleanup**: Tests create users with unique emails to avoid conflicts
4. **Error Reporting**: Console logs capture any issues without failing tests unnecessarily

## Interpreting Results

### Success
- All tests pass
- No 500 errors in responses
- Analytics events captured
- Pages load within time limits

### Failure Indicators
- 500/503 errors on critical pages
- JavaScript console errors
- Checkout API returning errors
- Performance timeouts

## CI/CD Integration

These tests are designed to be run manually or in a scheduled CI job:

```yaml
# Example GitHub Actions workflow
name: Production Smoke Test
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9am
  workflow_dispatch:

jobs:
  smoke-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test production-smoke.spec.ts --project=production
```

## Troubleshooting

### Rate Limiting
If tests fail with 429 errors, the signup rate limiter is active. Wait a few minutes and retry.

### Stripe Configuration
If checkout tests fail, verify:
- Stripe webhook secret is configured
- Price IDs are set in environment variables
- Stripe account is in test mode (if testing)

### Analytics Not Capturing
GA4 events may not be captured if:
- Ad blockers are active
- Network requests are blocked
- Events fire after page navigation

## Related Documentation

- [Stripe Checkout Verification](../docs/STRIPE_CHECKOUT_VERIFICATION.md)
- [Conversion Funnel Analysis](../docs/CONVERSION_FUNNEL_ANALYSIS.md)
- [E2E Test Helpers](./helpers/test-utils.ts)
