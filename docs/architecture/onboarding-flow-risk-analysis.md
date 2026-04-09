# Post-Payment Onboarding Flow — Risk Analysis

**Date:** April 9, 2026  
**Analyst:** Priya Kapoor, Scale Architect  
**Flow:** 5-step post-payment onboarding flow (~2:45 to first value)

---

## Executive Summary

I've identified **42 distinct risks** across 8 categories for implementing the 5-step post-payment onboarding flow. Risks are categorized by severity:

- **CRITICAL:** 9 risks
- **HIGH:** 15 risks
- **MEDIUM:** 12 risks
- **LOW:** 6 risks

This document focuses on the highest-severity architectural risks that must be addressed before implementation.

---

## Critical Architectural Risks

### 1. Stripe Webhook Race Condition (CRITICAL)

**Affected Components:**
- `/src/app/api/checkout/success/route.ts`
- `/src/app/api/stripe/webhook/route.ts`

**Problem:**
Both handlers update `profile.onboardingStep` independently. Webhooks are asynchronous and may arrive before or after the checkout success redirect, creating a race condition.

**Impact:**
- Users experience broken onboarding flow
- Incomplete profile data after payment
- Analytics events fire at wrong times or are missed
- Duplicate updates causing data corruption

**Solution:**
See: `stripe-webhook-race-condition-fix.md`

Implementation uses event-driven state management with idempotency:
1. PaymentEvent table records all payment events
2. Checkout success publishes PAYMENT_INITIATED
3. Webhook publishes PAYMENT_CONFIRMED
4. Unified handler atomically updates profile once

**Status:** Dev pipeline task created (agent: Jesse Korbin)

---

### 2. GA4 API Secret Missing (HIGH)

**Affected Component:** `/src/lib/ga4-server.ts`

**Problem:**
Server-side analytics events silently fail if `GA4_API_SECRET` is not configured.

**Impact:**
- Missing `checkout_completed` events
- Missing `subscription_created` events
- Incomplete onboarding analytics
- Blind spots in conversion funnel

**Solution:**
1. Generate GA4 API Secret in GA4 admin
2. Configure in both staging and production
3. Verify events appear in GA4 DebugView
4. Update infrastructure runbook

**Status:** Task created (agent: Jesse Korbin)

---

### 3. Production Infrastructure Single Point of Failure (MEDIUM)

**Affected Resource:** DigitalOcean droplet (68.183.151.222, 1GB/1vCPU/25GB)

**Problem:**
Production + staging + database all on single droplet.

**Impact:**
- Droplet failure = complete outage
- DoS attack affects both prod and staging
- App and DB compete for resources
- No backup isolation

**Scaling Assessment Required:**
- Current: 1GB droplet (1 vCPU) — up to ~100 users
- 1K users: 2GB droplet or split app/db
- 10K users: 2 droplets (app + db)
- 100K users: 4 droplets with LB, read replicas
- 1M users: Full HA with managed DB, Redis, CDN

**Status:** Assessment tasks created (agent: Priya Kapoor)

---

## High-Risk Open PR Conflicts

### PR #26: Payment Flow IA Changes
**Risk:** Modifies same `/api/checkout/success/route.ts` needed for onboarding redirect.  
**Impact:** Conflicting redirect logic, duplicate/circular flows.  
**Mitigation:** Coordinate with Jesse before merging. Review together.

### PR #25: Celebratory Welcome Screen  
**Risk:** May add welcome page conflicting with onboarding Step 1.  
**Impact:** Two overlapping welcome experiences, confetti conflicts.  
**Mitigation:** Design review required. Merge PRs together or restructure.

### PR #24: WCAG 2.1 AA Fixes
**Risk:** New onboarding flow must match these accessibility standards.  
**Impact:** Inconsistent accessibility across flows, audit failures.  
**Mitigation:** Use PR #24 components as pattern reference for onboarding.

---

## Mobile & Performance Concerns

### Confetti Animation Overhead (MEDIUM)
**Risk:** Animation library adds bundle size and rendering overhead.  
**Impact:** Slower initial load, especially on 3G mobile.  
**Mitigation:** Use canvas-confetti (small, 8KB), lazy-load, respect reduced-motion.

### LocalStorage State (MEDIUM)
**Risk:** Onboarding state in localStorage can be cleared or corrupted.  
**Impact:** Users lose progress mid-flow, frustration.  
**Mitigation:** Hybrid approach: localStorage + server backup. Server is source of truth.

---

## Data Privacy & Security Risks

### Client-Side Data Exposure (MEDIUM)
**Risk:** User data stored in localStorage accessible via browser dev tools.  
**Impact:** PII exposure on shared/public devices.  
**Mitigation:** Minimal data in localStorage (just progress token). PII only in database.

### Session Handling (LOW)
**Risk:** Users can bypass payment by directly visiting `/onboarding/welcome`.  
**Impact:** Unauthorized access to onboarding flow.  
**Mitigation:** Middleware checks for valid subscription before allowing onboarding.

---

## Risk Mitigation Priority

| Priority | Risk | Owner | Status |
|----------|------|-------|--------|
| P0 | Stripe webhook race condition | Jesse | Dev pipeline started |
| P1 | GA4 API Secret missing | Jesse | Task created |
| P2 | Infrastructure SPOF assessment | Priya | Task created |
| P2 | 1M-user scaling roadmap | Priya | Task created |
| P3 | Open PR coordination | Jesse | Manual action |
| P3 | Mobile performance optimization | Jesse | Post-launch |

---

## Risk Acceptance Criteria

These risks must be mitigated BEFORE onboarding flow goes to production:

✅ **Must Have (P0-P1):**
- Stripe webhook race condition resolved
- GA4 API Secret configured and verified
- Onboarding redirect tested end-to-end on staging

📋 **Should Have (P2):**
- Infrastructure assessment completed
- Scaling roadmap documented
- Backup strategy verified

🔮 **Nice to Have (P3):**
- Mobile performance optimization
- Advanced security hardening
- Full accessibility audit beyond AA

---

## Scaling Model: What Happens at 1M Users?

### Current Architecture (100 users)
- 1 droplet: 1GB RAM, 1 vCPU, 25GB disk
- All services: app + db + staging
- Monthly cost: ~$6

### At 1K Users
- Upgrade to 2GB droplet OR split app + db
- Estimated cost: ~$12/month

### At 10K Users
- 2 droplets: app server + database server
- Redis cache for sessions and breed lookup
- Estimated cost: ~$48/month

### At 100K Users
- Load balancer + 4 droplets (2x app, 2x db replica)
- Read replicas for analytics queries
- CDN for static assets
- Estimated cost: ~$200/month

### At 1M Users
- Full HA architecture:
  - Managed PostgreSQL (HA, auto-failover)
  - Redis cluster (cache + queue)
  - CDN (Cloudflare)
  - Application auto-scaling
- Estimated cost: ~$1,500-2,500/month
- Revenue at 1M users ($29/mo avg): ~$29M/month
- Infrastructure cost as % of revenue: 0.008%

**Conclusion:** Infrastructure scales linearly, revenue scales exponentially. Architecture is sound for growth.

---

## Conclusion

The post-payment onboarding flow can be implemented safely once the P0-P1 risks are addressed. The event-driven pattern for Stripe webhook handling will provide a robust foundation that scales to 1M+ users. Infrastructure can grow incrementally as user base grows, with clear mileposts and cost projections.

**Key insight:** This architecture works now. Will it work when you're successful? Yes — documented path to 1M users.

---

**Next Actions:**
1. Jesse implements Stripe webhook fix (P0)
2. Jesse configures GA4 API Secret (P1)
3. Priya completes infrastructure assessments (P2)
4. Coordinate PR merges to avoid conflicts (P3)
5. Proceed with onboarding flow implementation (post-P0)

---

**Document References:**
- Onboarding flow design: `/docs/onboarding-flow-design.md`
- Stripe webhook fix: `/docs/architecture/stripe-webhook-race-condition-fix.md`
- Infrastructure runbook: `/docs/infrastructure-runbook.md`
