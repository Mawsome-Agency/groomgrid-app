# GroomGrid Architecture Decisions

## ADR-001: Single-Domain Architecture (Root Domain Only)

**Status:** PERMANENT — not open for revision  
**Date:** 2026-04-05  
**Authority:** Matt Tims (Founder)

---

### Decision

The entire GroomGrid application — marketing site, blog, signup, onboarding, dashboard, and all API routes — lives on the **root domain `getgroomgrid.com`** as a single unified Next.js app.

There is **no** `app.getgroomgrid.com` subdomain.  
There is **no** `api.getgroomgrid.com` subdomain.  
There is **no** `dashboard.getgroomgrid.com` subdomain.

---

### URL Structure

All routes are served from `getgroomgrid.com`:

```
getgroomgrid.com/           → Marketing homepage
getgroomgrid.com/blog/      → Blog / content
getgroomgrid.com/signup     → User registration
getgroomgrid.com/onboarding → Onboarding flow
getgroomgrid.com/dashboard  → Authenticated app
getgroomgrid.com/plans      → Pricing / plan selection
getgroomgrid.com/api/*      → All API routes
```

---

### Rationale

1. **SEO consolidation** — All domain authority, backlinks, and organic traffic flow into a single domain. Splitting to a subdomain would require building authority from zero on a second property.
2. **Simplicity** — One Vercel project, one DNS record, one SSL cert, one `NEXT_PUBLIC_APP_URL`.
3. **User experience** — Users stay on the same domain throughout their journey (landing → signup → app). No jarring domain switch mid-funnel.
4. **Next.js is designed for this** — Route groups and middleware handle the marketing/app split cleanly within a single Next.js deployment.

---

### Implementation

- **Hosting:** Vercel, single project, single deployment
- **DNS:** Root `@` CNAME → `cname.vercel-dns.com` (plus `www` redirect)
- **App URL env var:** `NEXT_PUBLIC_APP_URL=https://getgroomgrid.com`
- **Auth callbacks:** `https://getgroomgrid.com/auth/callback`
- **Stripe webhook:** `https://getgroomgrid.com/api/stripe/webhook`

---

### What NOT to do

- Do **not** create an `app.getgroomgrid.com` Vercel domain or DNS record
- Do **not** set `NEXT_PUBLIC_APP_URL` to any subdomain
- Do **not** configure Supabase redirect URLs for any subdomain
- Do **not** split marketing and app into separate Next.js projects/repos
