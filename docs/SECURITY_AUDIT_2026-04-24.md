# GroomGrid Security Audit Report
**Date**: 2026-04-24
**Auditor**: Omar Khalil, AppSec Auditor (Mawsome Agency)
**Framework**: OWASP Top 10 (2021)

---

## Executive Summary

A comprehensive security review was conducted on the GroomGrid MVP codebase, focusing on recent commits and the signup-to-paid funnel. **One critical vulnerability was found** (Broken Access Control on admin routes) and has been submitted as a HOTFIX to the dev pipeline.

### Overall Risk Assessment
| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 1 | HOTFIX in pipeline |
| 🟡 Medium | 0 | — |
| 🔵 Low | 2 | Accepted for MVP, tracked for post-launch |

---

## Findings

### 🔴 CRITICAL: Broken Access Control on Admin API Routes (OWASP A01:2021)

**File**: `src/lib/auth.ts:76-85` + 5 admin route files  
**CWE**: CWE-862 (Missing Authorization)  
**CVSS**: 8.1 (High)

**Description**: The `requireAuth()` function only validates that a user is authenticated (has a session with `user.id`), but does NOT validate that the user has admin privileges. The User model has no `role` field. As a result, **any authenticated user** can access all admin API endpoints.

**Affected Endpoints**:
- `GET /api/admin/pipeline` — exposes GitHub PR data, internal development pipeline
- `GET /api/admin/ab-tests` — list all A/B tests
- `GET /api/admin/ab-tests/[id]` — view test details
- `GET/POST/PATCH/DELETE /api/admin/ab-tests/[id]/*` — manipulate tests and results
- `GET /api/admin/engagement` — exposes ALL user PII (emails, business names, plan types, engagement scores)

**Attack Scenario**: A subscriber (or trial user) navigates to `/api/admin/engagement` while logged in. They receive a JSON dump of every user's email, business name, subscription status, and engagement metrics.

**Remediation** (HOTFIX submitted to dev pipeline):
1. Add `role` field to User model (`@default("user")`)
2. Create `requireAdmin()` guard that checks `user.role === "admin"`, returns 403 for non-admin
3. Replace `requireAuth()` with `requireAdmin()` in all 5 admin routes
4. Add role check to middleware for `/admin/*` and `/api/admin/*` paths
5. Add tests for 401 (unauthenticated), 403 (non-admin), 200 (admin)

---

### 🔵 LOW: In-Memory Rate Limiter on Resend Verification

**File**: `src/app/api/auth/resend-verification/route.ts:10`  
**CWE**: CWE-770 (Allocation of Resources Without Limits)

**Description**: The rate limiter uses an in-memory `Map<string, number>` that resets on server restart and doesn't persist across instances. While functional for the current single-droplet MVP, it won't survive deployments or scale to multiple instances.

**Impact**: Low for MVP. After a server restart, rate limits reset, potentially allowing brief burst of verification emails.

**Remediation** (post-launch): Migrate to Redis-backed or database-backed rate limiter before multi-instance scaling.

---

### 🔵 LOW: Verification Token in URL

**File**: `src/app/api/auth/resend-verification/route.ts:59`  
**CWE**: CWE-200 (Exposure of Sensitive Information)

**Description**: Email verification tokens are passed as URL query parameters (`/api/auth/verify-email?token=...`). This is industry-standard practice but tokens can appear in browser history, referrer headers, and server access logs.

**Mitigating Factors**: 
- 24-hour token expiry
- Tokens are single-use (marked `usedAt` after first verification)
- 32-byte cryptographic randomness (`crypto.randomBytes(32)`)

**Remediation**: Acceptable for MVP. Post-launch, consider one-time token pages that POST to verify.

---

## Positive Security Findings

The following security practices were verified and found to be correctly implemented:

### ✅ Stripe Webhook Security
- **Signature verification**: `stripe.webhooks.constructEvent()` validates Stripe signature in production
- **Rate limiting**: 100 req/min per IP (10/min in test mode)
- **Bot detection**: Returns 200 (not error) for requests without `stripe-signature` header to prevent retry loops
- **Environment-aware test bypass**: 3-layer protection (env check, test key, origin validation)

### ✅ Webhook Idempotency (commit fbd0144)
- **Race condition fixed**: Idempotency marker now written AFTER completion handler succeeds
- **Field rename defense-in-depth**: `eventId` → `webhookEventId` in PAYMENT_CONFIRMED payload
- **Upsert for retry safety**: `create` → `upsert` prevents duplicate key errors on Stripe retries
- **Normalized type filtering**: `isEventProcessed()` filters by event type to prevent false positives

### ✅ Redirect Security
- **Open redirect eliminated**: All redirect URLs use `NEXT_PUBLIC_APP_URL` (not `req.url`)
- **Hardcoded fallback**: `https://app.getgroomgrid.com` as fallback prevents Host header manipulation

### ✅ Authentication & Session Security
- **Secure cookies**: `httpOnly`, `SameSite=Lax`, `Secure` in production
- **Cross-domain session sharing**: `.getgroomgrid.com` domain for app + marketing site
- **Cookie name prefix**: `__Secure-` prefix in production for additional browser protections
- **JWT expiry**: 30-minute max age

### ✅ Email Enumeration Protection
- **Resend verification**: Always returns `{ success: true }` regardless of email existence
- **No timing leaks**: DB query runs even for non-existent users

### ✅ Input Validation
- **Checkout route**: Validates plan type against `PLAN_DATA_CENTS` keys
- **Missing env vars**: `ensureEnv()` and `requireEnvVar()` fail fast with clear errors
- **Pricing validation**: Server-side startup warning for missing Stripe price IDs

### ✅ Cryptographic Security
- **Token generation**: `crypto.randomBytes(32)` — CSPRNG, not Math.random()
- **Token expiry**: 24-hour expiration on email verification tokens
- **Token invalidation**: Existing tokens marked as used before creating new ones

---

## Pre-Launch Security Checklist

| Item | Status |
|------|--------|
| Admin API authorization | 🔴 HOTFIX in pipeline |
| Stripe webhook signature verification | ✅ Pass |
| Open redirect protection | ✅ Pass |
| Rate limiting (webhook) | ✅ Pass |
| Rate limiting (resend-verification) | 🔵 In-memory (MVP ok) |
| CSRF protection | ⚠️ No global CSRF middleware |
| Security headers | ⚠️ Not implemented (post-launch) |
| Content-Security-Policy | ⚠️ Not implemented (post-launch) |
| Session security | ✅ Pass |
| Email enumeration protection | ✅ Pass |
| Input validation | ✅ Pass |
| Cryptographic practices | ✅ Pass |

---

## Post-Launch Security Roadmap

1. **Security headers middleware** (CSP, HSTS, X-Frame-Options, etc.)
2. **Checkout rate limiting** (prevent checkout session spam)
3. **Redis-backed rate limiter** (replace in-memory Maps)
4. **CSRF protection** (double-submit cookie or SameSite strict)
5. **Content Security Policy** (prevent XSS code execution)
6. **Security logging & monitoring** (failed auth attempts, admin access patterns)
7. **Penetration testing** (external validation before enterprise tier)

---

*Report generated by Omar Khalil, AppSec Auditor — Mawsome Agency*  
*"You trust user input. That's your first mistake."*
