# GroomGrid Performance Audit Report
**Date**: 2026-05-01  
**Auditor**: Layla Hassan (QA & Testing Lead)  
**Scope**: Production site performance, test health, database health  

---

## Executive Summary

**The GroomGrid production site is paying a 742KB JS tax on every page — including marketing pages that drive SEO and conversions.** With a 79% bounce rate and only 36 organic sessions/month, this is the #1 issue blocking growth. Mobile users on 3G connections wait 4-6 seconds just for JS to download before the page becomes interactive.

### Top 3 Findings

| # | Finding | Impact | Severity |
|---|---------|--------|----------|
| 1 | **742KB JS loaded on every page** — Stripe (~189KB), NextAuth (~88KB), Sentry (26KB) loaded on marketing pages that don't need them | 79% bounce rate, mobile users can't interact for 4-6s | CRITICAL |
| 2 | **ABTestProvider wrapping every page** — Empty A/B testing system (0 rows in DB) adds code to every page load | ~50KB+ dead weight per page | CRITICAL |
| 3 | **6 failing unit tests** — CompletionScreen syntax error, CheckoutErrorContent needs Suspense boundary | CI pipeline unreliable, tests can't catch regressions | MEDIUM |

---

## Detailed Findings

### 1. JavaScript Bundle Bloat (CRITICAL)

Every page loads exactly 12 JS chunks totaling 742KB (uncompressed).

| Chunk | Size | Contains |
|-------|------|----------|
| 0v9c2uadhpd-i.js | 226KB | Next.js runtime/deployment |
| 0p3meucego.jp.js | 137KB | Next.js core |
| 03~yq9q893hmn.js | 112KB | React + polyfills |
| 10tcfuxzl~dzy.js | 61KB | Stripe SDK |
| 0d3shmwh5_nmn.js | 55KB | Mixed |
| 0deqx5rmtksk3.js | 51KB | NextAuth + Stripe |
| 0pqt~8bl3ukh4.js | 44KB | Mixed |
| 0yyyy2gb8pamo.js | 44KB | Stripe |
| 0z9so04mh.wx6.js | 37KB | NextAuth + Lucide |
| CSS | 17KB | Styles |
| Other chunks | ~70KB | Various |

**Root Cause**: layout.tsx wraps ALL pages with:
- SessionProvider (NextAuth) — only needed on authenticated pages
- ABTestProvider — dead code, DB tables are empty
- NetworkStatusProvider — only needed on dashboard
- RequestQueueProvider — only needed on dashboard
- OfflineBanner — only needed on dashboard
- SessionExpirationDetector — only needed on authenticated pages
- DeploymentVersionCheck — only needed on authenticated pages

**Marketing pages (/, /plans, /signup, /login) are loading ~200-300KB of auth/payment/offline JS they don't need.**

#### Server-Side Performance (Good)

| Metric | Value | Rating |
|--------|-------|--------|
| TTFB (from server) | ~100ms | Excellent |
| TLS handshake | ~145ms | Fast |
| DNS resolution | ~3ms | Cached |
| HTTP/200 | All pages | Working |

#### Client-Side Performance (Needs Work)

| Metric | Value | Target | Rating |
|--------|-------|--------|--------|
| JS Bundle (uncompressed) | 742KB | <200KB | CRITICAL |
| JS Chunks per page | 12 | <6 | CRITICAL |
| CSS | 16KB | <30KB | Good |
| Bounce Rate | 79% | <40% | CRITICAL |

### 2. Dead A/B Testing Code (CRITICAL)

The ABTestProvider is imported in layout.tsx and wraps every page. However:

- ab_tests table: 0 rows
- ab_test_assignments table: 0 rows  
- ab_test_conversions table: 0 rows
- 24 unused indexes on these empty tables

Files that should be removed:
- src/components/ab-test/ (3 files)
- src/lib/ab-test.ts
- src/lib/ab-test-client.ts
- src/lib/ab-test-metrics.ts
- src/app/admin/ab-tests/ (admin page)
- src/app/api/admin/ab-tests/ (2 API routes)
- src/app/api/ab-test/ (2 API routes)

### 3. Test Failures (MEDIUM)

6 tests failing across 2 suites:

#### CompletionScreen.unit.test.tsx — SyntaxError
- Line 41: it('shows "You're All Set!" heading', () => {
- The apostrophe in "You're" is unescaped inside a single-quoted string
- Fix: Change to template literal or escape the apostrophe

#### CheckoutErrorContent.unit.test.tsx — useState null error
- Tests in "Error Type: declined", "insufficient", "expired", "maxRetries" blocks fail
- Root cause: useSearchParams() in Next.js 14+ requires a Suspense boundary
- The jest.resetModules() + dynamic import() pattern breaks React context
- Fix: Wrap component render in Suspense fallback={null} or use React.use() pattern

**Pattern risk**: 10 components use useSearchParams() across the codebase. Only 3 have tests. All will have the same testability issue.

### 4. Database Health (MEDIUM)

| Table | Live Rows | Dead Rows | Bloat % | Last VACUUM |
|-------|-----------|-----------|---------|-------------|
| email_verification_tokens | 7 | 41 | 85% | Never |
| drip_email_queue | 40 | 36 | 47% | Auto (4/24) |
| _prisma_migrations | 14 | 16 | 53% | Never |
| users | 8 | 3 | 27% | Auto (4/24) |
| profiles | 8 | 3 | 27% | Auto (4/24) |

24 indexes have 0 scans — all write overhead, zero read benefit.

### 5. Production Server Health (OK)

| Metric | Value | Status |
|--------|-------|--------|
| RAM (Next.js prod) | 195MB | High for 1GB droplet |
| RAM (Next.js staging) | 48MB | Normal |
| Disk usage | 46% (11GB/24GB) | OK |
| Load average | 0.02 | Minimal |
| Swap usage | 236MB/2559MB | Some pressure |
| Uptime | 26 days | Stable |

### 6. Production Error (LOW)

PM2 error log shows:
Error: Failed to find Server Action "x". This request might be from an older or newer deployment.

This indicates a deployment mismatch — server actions from a previous deployment are still being called.

---

## Recommendations (Priority Order)

### P0 — This Week

1. **Split root layout providers** — Move auth/payment/offline providers to (dashboard)/layout.tsx. Marketing pages should only load Inter font, globals.css, and GA4. Expected impact: -200 to -300KB JS on marketing pages, bounce rate should drop 20-30 points.

2. **Remove ABTestProvider and all A/B testing code** — Dead code adding weight to every page. Delete the component, the lib files, the admin page, the API routes, and drop the empty database tables. Expected impact: -30 to -50KB per page.

### P1 — This Week

3. **Fix 6 failing unit tests** — CompletionScreen apostrophe + CheckoutErrorContent Suspense boundary.

4. **VACUUM bloated database tables** — email_verification_tokens at 85% bloat and drip_email_queue at 47% bloat.

### P2 — Next Week

5. **Lazy-load Stripe SDK** — The 189KB Stripe SDK should only load on /checkout/* pages.

6. **Lazy-load Sentry** — 26KB of error tracking loading on every page should be deferred.

7. **Investigate "Failed to find Server Action" error** — Check deployment process for stale action IDs.

---

## Impact on Rocks

| Rock | How This Helps |
|------|----------------|
| Get first 100 paying subscribers | Faster pages = lower bounce rate = more signups. 79% bounce rate is killing conversions. |
| Establish organic search presence (500 visits/month) | Core Web Vitals are a Google ranking factor. 742KB JS will push LCP and FID into "poor" territory, hurting SEO. |
| Deploy stable MVP | 6 failing tests + production Server Action error = unstable. Fix these before scaling. |

---

*Audit conducted by Layla Hassan, Performance Auditor, QA & Testing Dept.*
