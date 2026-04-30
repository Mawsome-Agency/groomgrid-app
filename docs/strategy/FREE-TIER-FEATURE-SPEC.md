# GroomGrid Free Tier Feature Specification

**Author:** Lucia Torres, Strategy & Planning  
**Date:** April 28, 2026  
**Status:** READY FOR ENGINEERING REVIEW  
**Supports Rock:** Build and execute pre-launch GTM playbook for first 100 subscribers  
**Priority:** P1 — Blocks May 15 paid launch  
**Engineering Owner:** Jesse Korbin  
**Spec Review By:** Sofia Mendoza, Sienna Blake

---

## 0. Why a Free Tier (Not Just a Free Trial)

| Factor | 14-Day Trial (Current) | Free Tier (Proposed) |
|--------|----------------------|---------------------|
| "Free pet grooming software" search volume | 0 captures | **270/mo captured** |
| Groomer adoption friction | "What happens in 14 days?" anxiety | "I can use this forever if I stay small" |
| Time to value | Must prove ROI in 14 days | Proves value over weeks/months naturally |
| Conversion mechanism | Time-based cliff (hard cutoff) | Usage-based triggers (soft, organic) |
| SaaS industry conversion | 25-40% trial-to-paid | 2-5% free-to-paid (but 10x more users at top) |
| Social proof generation | Users churn after trial if not paying | Free users stay, provide testimonials, refer |

**Decision:** Launch with a **freemium model** — limited free tier + paid tiers. Keep the 14-day trial as the path for users who want all features immediately.

**Math:** 250 free signups × 20% conversion = 50 paid subscribers (Q2 target). With trial-only model, 40 signups × 30% conversion = 12 paid. The free tier produces 4x more paying customers.

---

## 1. Free Tier Definition — "Starter" Plan

### Plan Identity

| Field | Value |
|-------|-------|
| **Plan ID** | `free` |
| **Plan Name** | Starter |
| **Plan Type** | `free` (new value in PlanType union) |
| **Price** | $0/mo |
| **Stripe Price ID** | No Stripe product needed (no billing) |
| **Target User** | Newbie Mobile Starter, price-sensitive groomers, evaluators |
| **Time Limit** | None — genuine free tier, not a trial |

### Feature Matrix

| Feature | Starter (Free) | Solo ($29/mo) | Salon ($79/mo) |
|---------|----------------|---------------|----------------|
| **Clients** | 10 max | Unlimited | Unlimited |
| **Pets per client** | 3 max | Unlimited | Unlimited |
| **Appointments/month** | 30 max | Unlimited | Unlimited |
| **Calendar view** | ✅ Day/Week | ✅ Day/Week/Month | ✅ Day/Week/Month |
| **Manual reminders** | ✅ (in-app only) | ✅ | ✅ |
| **SMS reminders** | ❌ | ✅ (48h + 2h auto) | ✅ (48h + 2h auto) |
| **Email reminders** | ❌ | ✅ Auto | ✅ Auto |
| **Online booking widget** | ❌ | ✅ | ✅ |
| **Payment collection** | ❌ | ✅ (Stripe integration) | ✅ (Stripe integration) |
| **Pet profiles** | ✅ Basic (name, breed, notes) | ✅ Full (allergies, vaccines, behavior, weight) | ✅ Full |
| **Revenue tracking** | ❌ | ✅ | ✅ |
| **Grooming report cards** | ❌ | ❌ | ✅ |
| **Team features** | ❌ | ❌ | ✅ Up to 5 groomers |
| **Analytics dashboard** | ❌ | ✅ Basic | ✅ Full |
| **Client data export** | ✅ CSV | ✅ CSV | ✅ CSV |
| **Mobile-responsive** | ✅ | ✅ | ✅ |
| **AI scheduling assistant** | ❌ | ✅ | ✅ |
| **Support** | Community (email, 48h) | Email (24h) | Priority (4h) |

### What's Intentionally Included in Free

1. **Calendar view (day/week)** — Groomers need to see their schedule. Without it, the app is useless.
2. **Basic pet profiles** — Name, breed, notes. Enough to be functional but not comprehensive.
3. **Client data export** — **Critical for trust.** "Try free, leave anytime, keep your data" eliminates the #1 objection ("What if I want to leave?").
4. **Manual reminders** — Can mark appointments as "reminder sent" but no automated SMS/email.

### What's Intentionally Gated

1. **SMS/email reminders** — #1 buying trigger (MoeGo: 387% appointment surge). This is the upgrade hook.
2. **Online booking** — High-value feature that makes groomers want to upgrade.
3. **Payment collection** — Revenue feature, obvious paid value.
4. **Full pet profiles** — Breed specialists and cat groomers need the allergy/vaccine/behavior fields. Creates natural upgrade pressure.
5. **AI scheduling** — Differentiator. Should only be in paid.

---

## 2. Technical Implementation Requirements

### 2.1 Type System Changes

```typescript
// src/types/index.ts

// BEFORE:
export type PlanType = 'solo' | 'salon' | 'enterprise';
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'cancelled';

// AFTER:
export type PlanType = 'free' | 'solo' | 'salon' | 'enterprise';
export type SubscriptionStatus = 'free' | 'trial' | 'active' | 'past_due' | 'cancelled';
```

### 2.2 Database Schema Changes

```sql
-- user_profiles table
-- plan_type column: add 'free' as valid value (check constraint or app-level)
-- subscription_status column: add 'free' as valid value
-- New columns:
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS client_count INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS pet_count INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS appointment_count_month INTEGER DEFAULT 0;
```

### 2.3 Pricing Data Changes

```typescript
// src/app/pricing/pricing-data.ts — Add free plan to PLANS array

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Starter',
    type: 'free',
    price: 0,
    interval: 'monthly',
    stripe_price_id: '', // No Stripe product for free tier
    features: [
      'Up to 10 clients — try it risk-free',
      'Basic pet profiles — name, breed, notes',
      'Day & week calendar — see your schedule at a glance',
      'Manual appointment booking — no more double bookings',
      'CSV data export — your data is always yours',
      'Mobile-responsive — works in your van',
    ],
    popular: false,
  },
  // ... existing Solo, Salon, Enterprise plans
];
```

### 2.4 Middleware / Feature Gating

**Implementation approach:** Create a `usePlanLimits` hook and a `requirePlan` middleware function.

```typescript
// src/hooks/use-plan-limits.ts (NEW)
interface PlanLimits {
  maxClients: number;       // free: 10, paid: Infinity
  maxPetsPerClient: number; // free: 3, paid: Infinity
  maxAppointmentsMonth: number; // free: 30, paid: Infinity
  features: {
    smsReminders: boolean;
    emailReminders: boolean;
    onlineBooking: boolean;
    paymentCollection: boolean;
    fullPetProfiles: boolean;
    revenueTracking: boolean;
    aiScheduling: boolean;
    groomingReports: boolean;
  };
}

const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    maxClients: 10,
    maxPetsPerClient: 3,
    maxAppointmentsMonth: 30,
    features: {
      smsReminders: false,
      emailReminders: false,
      onlineBooking: false,
      paymentCollection: false,
      fullPetProfiles: false,
      revenueTracking: false,
      aiScheduling: false,
      groomingReports: false,
    },
  },
  solo: {
    maxClients: Infinity,
    maxPetsPerClient: Infinity,
    maxAppointmentsMonth: Infinity,
    features: { /* all true except groomingReports */ },
  },
  // ... salon, enterprise
};
```

### 2.5 Upgrade Triggers (In-App)

When a free user hits a limit, show a **contextual upgrade prompt** — not a blocking wall.

| Trigger | Message | CTA |
|---------|---------|-----|
| Adding 8th+ client | "You're growing! Solo unlocks unlimited clients, auto reminders, and payments." | "See Solo Plan →" |
| Adding 4th pet to a client | "Need detailed pet profiles? Solo includes full allergy, vaccine, and behavior tracking." | "Upgrade for Full Profiles →" |
| Viewing SMS reminder setting | "Auto SMS reminders cut no-shows by 40%. Available on Solo and above." | "Unlock Reminders →" |
| Clicking "Online Booking" | "Let clients book themselves — available on Solo and above." | "See Solo Plan →" |
| Month appointment #28+ | "You're booking 30+ appointments/month. Solo gives you unlimited scheduling + AI assistant." | "Upgrade to Solo →" |

**Design principle:** Upgrade prompts should feel like helpful suggestions, not paywalls. The free tier must be genuinely useful, not a crippled demo.

### 2.6 Signup Flow Changes

**Current flow:** Email → Password → Business Name → Select Plan → Checkout → Trial

**New flow for free tier:**
1. Email → Password → Business Name → **"Choose how to start"** screen:
   - 🟢 **"Start Free"** → No credit card → Immediate access to Starter
   - 🔵 **"Try Solo Free for 14 Days"** → Credit card → Full features → Auto-bills after trial
   
**Key rule:** Free tier signup requires NO credit card. This is the #1 driver of free signups.

### 2.7 Plans Page Changes

Add the Starter plan as the leftmost card on `/plans`. Current layout becomes 4 cards:

| Starter | Solo ★ | Salon | Multi-Location |
|---------|--------|-------|----------------|
| $0/mo | $29/mo | $79/mo | $149/mo |
| 10 clients | Unlimited | Unlimited | Unlimited |
| Basic profiles | Full profiles | Full profiles | Full profiles |
| Manual booking | AI + auto reminders | Team scheduling | White-label |
| | Payments | Analytics | API access |

**Badge on Starter card:** "Free forever — no credit card required"

---

## 3. Stripe Configuration

### What Needs to Change

| Item | Current | Needed |
|------|---------|--------|
| Free tier Stripe product | N/A | **None needed** — free users don't interact with Stripe |
| Signup without payment | Not possible | **New flow** — skip Stripe checkout for free tier |
| Trial flow | 14-day trial on all plans | **Keep for paid plans only** |
| Coupon BETA50 | $14.50/mo founding price | **Keep** — applies to Solo/Salon paid plans |

### Stripe Customer Creation

- **Free tier:** Create Stripe customer record (for future upgrade) but NO payment method, NO subscription
- **Paid plans:** Same as current — checkout session → payment method → subscription

---

## 4. Founding Member Pricing Integration

The existing BETA50 coupon (50% off = $14.50/mo Solo) should coexist with the free tier:

| Tier | Standard Price | Founding Price (BETA50) | Positioning |
|------|---------------|------------------------|-------------|
| Starter | $0 | $0 | "Try free, upgrade when you're ready" |
| Solo | $29/mo | $14.50/mo | "Founding groomer deal — lock it in forever" |
| Salon | $79/mo | $39.50/mo | "Founding salon deal" |

**Launch messaging:** "Start free. Upgrade to Solo for just $14.50/mo as a founding groomer — that's 50% off, locked forever."

---

## 5. SEO & Marketing Page Updates

### Pages That Need Updates

| Page | Change | Priority |
|------|--------|----------|
| `/plans` | Add Starter card as leftmost | P1 |
| `/` (homepage) | Update CTA: "Start Free — No Credit Card" | P1 |
| `/signup` | Add free tier signup path (no CC) | P1 |
| `/features/mobile-groomer` | Add free tier feature comparison | P2 |
| `/blog/free-dog-grooming-software` | Update to announce real free tier | P1 |
| `/cat-grooming-software` | Mention free tier as entry point | P2 |
| Comparison pages (vs MoeGo, DaySmart, Pawfinity) | Add free tier to pricing tables | P2 |

### New Schema.org Markup

Update the SoftwareApplication structured data across all pages:
```json
{
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "0",
    "highPrice": "149",
    "priceCurrency": "USD",
    "offerCount": 4
  }
}
```

---

## 6. Acceptance Criteria

### Must-Have (Blocks Launch)

- [ ] User can sign up for Starter plan without credit card
- [ ] Starter plan shows in pricing-data.ts with correct features
- [ ] Free users can add up to 10 clients (blocked at 11 with upgrade prompt)
- [ ] Free users can add up to 3 pets per client (blocked at 4 with upgrade prompt)
- [ ] Free users can book up to 30 appointments/month
- [ ] SMS/email reminders UI is hidden or shows "upgrade to unlock" for free users
- [ ] Online booking, payment collection, revenue tracking are gated for free users
- [ ] Free users can export their data as CSV at any time
- [ ] Upgrade prompts are contextual and non-blocking (not paywalls)
- [ ] `/plans` page shows 4-tier layout with Starter as leftmost
- [ ] Homepage CTA updated to "Start Free — No Credit Card"
- [ ] `/blog/free-dog-grooming-software` page updated with real free tier info
- [ ] PlanType type updated to include `'free'`
- [ ] Existing BETA50 coupon still works on Solo/Salon plans
- [ ] Free user can upgrade to Solo/Salon from settings page

### Should-Have (Post-Launch)

- [ ] Usage counter in dashboard: "X/10 clients, Y/30 appointments this month"
- [ ] Email drip sequence for free users who haven't upgraded after 7 days
- [ ] A/B test: 10-client limit vs 15-client limit (after 50 free signups)
- [ ] Upgrade flow from in-app prompts is 1-click (pre-filled checkout)

### Nice-to-Have (Week 5+)

- [ ] "Powered by GroomGrid" badge for free users (backlinks)
- [ ] Referral program integration: free user refers → both get 1 month Solo
- [ ] Graduated limits: after 3 months active, free tier expands to 15 clients

---

## 7. Success Metrics (30-Day Review)

| Metric | Target | Stretch |
|--------|--------|---------|
| Free signups (first 30 days) | 100 | 200 |
| Free → Solo conversion rate | >3% | >5% |
| Free → Solo conversion time | <21 days | <14 days |
| % of free users adding 5+ clients | >40% | >60% |
| Bounce rate on `/plans` | <50% | <40% |
| "Free pet grooming software" ranking | Top 10 | Top 5 |

---

## 8. Risks & Mitigations

| Risk | Probability | Mitigation |
|------|------------|------------|
| Free tier too generous — no one upgrades | Medium | Monitor 10-client limit. If >80% of free users never hit limit, reduce to 7 clients or add 90-day time limit |
| Free tier too restrictive — feels useless | Medium | 10 clients is enough for most part-time groomers. If <20% add 3+ clients, improve onboarding |
| Support burden from free users | Low | Community support only (48h response). Paid support is an upgrade incentive |
| Database load from free accounts | Low | 10-client limit caps data. Monitor. Add CAPTCHA if spam signups appear |
| Existing BETA50 messaging conflicts with free tier | Low | Position clearly: "Start free, upgrade to founding price" |

---

## 9. Implementation Priority for Engineering

**Sprint 1 (3-5 days, blocks May 15 launch):**

| Day | Task | Dependencies |
|-----|------|-------------|
| 1 | Add `'free'` to PlanType, SubscriptionStatus; add PLAN_LIMITS constant | None |
| 1 | Create `usePlanLimits` hook | PlanType changes |
| 2 | Add Starter plan to pricing-data.ts + update Schema.org | PlanType changes |
| 3 | Build free signup flow (skip Stripe checkout) | PlanType, pricing-data |
| 3 | Build feature gating middleware (check limits before actions) | usePlanLimits |
| 4 | Build upgrade prompts (contextual, non-blocking) | Feature gating |
| 4 | Update `/plans` page with 4-tier layout | pricing-data |
| 5 | Update homepage CTA | Plans page done |
| 5 | Update `/blog/free-dog-grooming-software` | Free tier live |
| 5 | QA: signup → add 10 clients → see upgrade prompt → upgrade to Solo | All above |

**Sprint 2 (Week 5+, post-launch):**
- Usage counters in dashboard
- Email drip for free users
- A/B test on client limit (10 vs 15)

---

*This spec enables the #2 acquisition channel (Product-Led Growth) from the Revised Acquisition Plan. With 250 free signups at 20% conversion, we reach 50 paid subscribers — the Q2 target.*

**Next step:** Jesse reviews this spec → approves scope → enters dev pipeline as implementation task.
