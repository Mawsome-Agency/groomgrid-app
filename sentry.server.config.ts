import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.httpIntegration(),
    Sentry.expressIntegration(),
  ],
  beforeSend(event, hint) {
    // Filter out known issues
    if (event.exception) {
      const error = hint.originalException;
      // Don't send errors from localhost in development
      if (process.env.NODE_ENV === 'development') {
        return null;
      }
    }
    return event;
  },
});
