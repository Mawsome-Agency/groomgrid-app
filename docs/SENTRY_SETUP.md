# Sentry Error Monitoring Setup

## Overview
Sentry has been configured for error monitoring in the GroomGrid application.

## Installation
The following packages were installed:
- `@sentry/nextjs@10.47.0`

## Configuration Files
- `sentry.client.config.ts` - Client-side error tracking configuration
- `sentry.server.config.ts` - Server-side error tracking configuration
- `next.config.mjs` - Wrapped with Sentry SDK
- `.env.example` - Updated with required environment variables

## Environment Variables
The following environment variables need to be set:

```bash
SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
SENTRY_ORG="your-sentry-org"
SENTRY_PROJECT="groomgrid"
```

## Setup Instructions

### 1. Create Sentry Project
1. Go to https://sentry.io/signup/ and create a free account
2. Create a new project: "GroomGrid"
3. Platform: "Next.js"
4. Copy the DSN (Data Source Name)

### 2. Configure Environment Variables
Add the Sentry DSN and project details to production:
```bash
# Add to /var/www/groomgrid/prod/.env.local
SENTRY_DSN="https://xxxxx@oxxxx.ingest.sentry.io/xxxxx"
NEXT_PUBLIC_SENTRY_DSN="https://xxxxx@oxxxx.ingest.sentry.io/xxxxx"
SENTRY_ORG="your-org-name"
SENTRY_PROJECT="groomgrid"
```

### 3. Test Error Capture
Visit `/api/test-sentry-error` to trigger a test error:
```bash
curl http://localhost:3000/api/test-sentry-error
```

The error should appear in your Sentry dashboard.

### 4. Set Up Email Alerts
1. Go to Project Settings → Alerts
2. Add Matt's email (matt@mawsome.agency)
3. Configure alert rules for:
   - New errors
   - High error rate
   - Critical issues

## Features Enabled

### Error Tracking
- Automatic error capture (both client and server)
- Stack traces with source maps
- User context tracking
- Request data

### Performance Monitoring
- Transaction traces (sampled at 100%)
- Slow transactions detection
- Database query performance

### Session Replay
- Captures user sessions for debugging (10% of sessions)
- Automatically captures on errors (100% of error sessions)
- Sensitive data is masked by default

## Deployment Notes

After adding the SENTRY_DSN to production:
1. Restart the application: `pm2 restart groomgrid`
2. Visit the test endpoint to verify setup
3. Check Sentry dashboard for the test error
4. Configure email alerts in Sentry

## Troubleshooting

### Errors not appearing in Sentry
- Verify SENTRY_DSN is set correctly
- Check application logs for Sentry initialization errors
- Ensure production environment is set (not development)
- Test with the `/api/test-sentry-error` endpoint

### Too many errors in development
Sentry is configured to ignore errors in development mode. If you're seeing errors, check the NODE_ENV variable.

## Security Notes
- Sensitive data (passwords, tokens, PII) is automatically filtered
- Source maps are uploaded securely (hidden from public)
- User data is anonymized by default
- Configure additional data scrubbing in Sentry dashboard if needed
