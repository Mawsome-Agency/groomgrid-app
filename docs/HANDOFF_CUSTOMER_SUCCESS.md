# GroomGrid — Customer Success Handoff

> Written by Engineering · April 2026  
> For: Customer Success, Support, and Early User Onboarding

---

## What GroomGrid Is

GroomGrid is an AI-powered business management platform for pet groomers. The MVP covers:

1. **Account signup & authentication** (email/password via Supabase)
2. **Subscription billing** (Stripe — 3 tiers, 14-day trials)
3. **Business onboarding** (3-step flow: business info, schedule setup, first pet/client)
4. **Dashboard** (overview of upcoming appointments, quick actions)
5. **Scheduling** (appointment creation, pet/client profiles, calendar view)

---

## User Journey (Happy Path)

```
Landing page → Sign Up → Email verification → Plan selection (14-day trial)
→ Stripe checkout → 3-step onboarding → Dashboard
```

### Step by step:
1. User visits `getgroomgrid.com`
2. Clicks "Get Started" → `/register`
3. Creates account (email + password)
4. Receives verification email from Resend
5. Clicks verification link → redirected to `/plans`
6. Selects plan (Solo $29, Salon $79, Enterprise $149) → Stripe checkout
7. Completes checkout (14-day trial, no charge yet)
8. Redirected back to `/onboarding`
9. Completes 3 onboarding steps (business name, schedule, first client)
10. Lands on `/dashboard`

---

## Plans & Pricing

| Plan | Price | Target Customer |
|---|---|---|
| **Solo** | $29/month | Independent groomer, 1 person |
| **Salon** | $79/month | Small salon, 2–5 groomers |
| **Enterprise** | $149/month | Multi-location or high volume |

- All plans include 14-day free trial (no credit card charge until day 15)
- Trials are managed in Stripe
- Cancellations: users can cancel in Stripe portal (link TBD — Customer Success to configure)

---

## Common Support Scenarios

### "I didn't receive my verification email"

1. Ask them to check spam/junk folder
2. Email comes from `no-reply@getgroomgrid.com` via Resend
3. If still not found: check Supabase Auth logs for the user's email
4. Can manually confirm in Supabase: Auth → Users → find user → "Confirm user"

### "I can't log in"

1. Direct to `/login`
2. "Forgot password" link is on the login page
3. If password reset email isn't arriving → same as above (Resend/spam)
4. If account is locked: check Supabase Auth logs for failed attempts

### "I was charged but the trial was supposed to be free"

1. Check Stripe Dashboard → Customers → find by email
2. Verify trial end date on their subscription
3. If erroneous charge: issue refund from Stripe → Payments → find charge → Refund

### "I want to cancel my subscription"

1. Go to Stripe Dashboard → Customers → find user → Subscriptions
2. Cancel immediately or at period end (ask user preference)
3. Note: access currently doesn't auto-revoke on cancellation (first version) — Engineering to add in v1.1

### "I want to upgrade/downgrade my plan"

1. Stripe Dashboard → Customer → Subscription → Update plan
2. Proration is handled automatically by Stripe

### "The app isn't loading / error on page"

1. First check: is prod up? `curl -o /dev/null -sw "%{http_code}" https://getgroomgrid.com/`
2. If 502/503: escalate to Engineering immediately
3. If 200 but user-specific error: get their email, check Supabase auth state

---

## Admin Access

### Supabase (Database + Auth)

- **Purpose:** View/manage users, auth logs, database records
- **Access:** supabase.com → sign in → GroomGrid project
- **Useful tables:** `users`, `profiles`, `appointments`, `pets`, `clients`

### Stripe

- **Purpose:** View subscriptions, process refunds, manage billing
- **Access:** stripe.com → sign in → live mode

### Production Server

- **For Engineering only** — don't SSH unless you know what you're doing
- Contact Jesse Korbin or Matt Tims for server-level issues

---

## Known Limitations (MVP v1.0)

These are documented gaps — not bugs:

| Feature | Status | Notes |
|---|---|---|
| In-app subscription management | Missing | Users must contact support to change/cancel |
| Email templates | Basic | Plain text — design upgrade in backlog |
| Mobile app | Not built | Web only (responsive design) |
| Payment method update | Missing | Route through Stripe customer portal |
| Multi-location support | Partial | Enterprise plan users may hit limits |
| Automated reminders | Not yet live | Cron infrastructure ready, content TBD |

---

## Escalation to Engineering

Escalate immediately for:

- Production site down (502, 503, or unreachable)
- Data loss or corruption reported by user
- Stripe webhook failures causing missed subscription events
- Security concern (suspicious auth patterns, possible breach)

Contact: Jesse Korbin (Engineering Lead) or Matt Tims (Owner)  
Slack: #engineering channel or direct message

---

## KPIs to Track (Customer Success)

- **Trial → Paid conversion rate** (target: 70%+)
- **Time to first booking** (from signup — target: <24 hours)
- **Churn rate** (monthly cancellations / total subscribers)
- **Support ticket volume** (trending up = product problem)
- **NPS / satisfaction scores** (post-30-day survey, TBD)

