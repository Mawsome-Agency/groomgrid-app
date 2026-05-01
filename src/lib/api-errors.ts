import { NextResponse } from 'next/server';

/**
 * Options for apiError() — all optional, pick what you need.
 */
export interface ApiErrorOptions {
  /** Error type classification (default: 'generic'). Payment routes use 'declined'|'insufficient'|'expired'|'network'. */
  type?: string;
  /** Stripe decline code — only set by payment routes. */
  declineCode?: string;
  /** Seconds until the client may retry (rate-limit responses). */
  retryAfter?: number;
  /** Per-field validation errors (400 validation responses). */
  fields?: Record<string, string>;
  /** Extra HTTP response headers. */
  headers?: Record<string, string>;
}

/**
 * Standardized API error response helper.
 *
 * Returns a NextResponse with the consistent error shape:
 *   { error: string, errorType: string, declineCode?: string, retryAfter?: number, fields?: Record<string, string> }
 *
 * Use this for ALL API route errors. Payment routes should call
 * getStripeErrorMessage() first, then pass the result here so
 * decline codes are forwarded correctly.
 */
export function apiError(
  message: string,
  status: number = 500,
  options?: ApiErrorOptions,
): NextResponse {
  const body: Record<string, unknown> = {
    error: message,
    errorType: options?.type ?? 'generic',
  };

  if (options?.declineCode !== undefined) {
    body.declineCode = options.declineCode;
  }
  if (options?.retryAfter !== undefined) {
    body.retryAfter = options.retryAfter;
  }
  if (options?.fields !== undefined) {
    body.fields = options.fields;
  }

  const responseInit: ResponseInit = { status };
  if (options?.headers) {
    responseInit.headers = options.headers;
  }

  return NextResponse.json(body, responseInit);
}
