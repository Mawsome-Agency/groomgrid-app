# GroomGrid App — Production Deployment Guide

> Deploy target: **https://app.getgroomgrid.com**

## Prerequisites Checklist

Before deploying, you need accounts and credentials from:

- [ ] **Vercel** — for hosting (vercel.com)
- [ ] **Supabase** — for database/auth (supabase.com)
- [ ] **Stripe** — for billing (stripe.com)
- [ ] **Resend** — for transactional email (resend.com)

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name: `groomgrid-app`, Region: `us-east-1`
3. Note down:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/Public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service role key** → `SUPABASE_SERVICE_ROLE_KEY`

4. Run migrations in Supabase SQL Editor:
   ```sql
   -- First run supabase/schema.sql
   -- Then run supabase/migrations/001_retention_infrastructure.sql
   ```

5. Enable Email Auth under Authentication → Providers → Email

---

## Step 2: Create Stripe Products

1. Go to [stripe.com](https://stripe.com) → Products → Add Product

### Solo Plan
- Name: `GroomGrid Solo`
- Price: `$29.00/month` recurring
- Trial: `14 days`
- Copy **Price ID** → `STRIPE_PRICE_SOLO`

### Salon Plan
- Name: `GroomGrid Salon`
- Price: `$79.00/month` recurring
- Trial: `14 days`
- Copy **Price ID** → `STRIPE_PRICE_SALON`

### Enterprise Plan
- Name: `GroomGrid Enterprise`
- Price: `$149.00/month` recurring
- Trial: `14 days`
- Copy **Price ID** → `STRIPE_PRICE_ENTERPRISE`

2. Get API keys from Developers → API Keys:
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`

---

## Step 3: Create Vercel Project

1. Install Vercel CLI: `npm i -g vercel`
2. Log in: `vercel login`
3. In this repo directory: `vercel --yes`
4. Link to project and get:
   - **VERCEL_TOKEN** — from Account Settings → Tokens
   - **VERCEL_ORG_ID** — from project settings
   - **VERCEL_PROJECT_ID** — from project settings

---

## Step 4: Configure Vercel Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL          = https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY     = eyJ...
SUPABASE_SERVICE_ROLE_KEY         = eyJ...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_SECRET_KEY                  = sk_live_...
STRIPE_WEBHOOK_SECRET              = whsec_...  (set after step 5)
STRIPE_PRICE_SOLO                  = price_...
STRIPE_PRICE_SALON                 = price_...
STRIPE_PRICE_ENTERPRISE            = price_...

RESEND_API_KEY                     = re_...
CRON_SECRET                        = <generate with: openssl rand -base64 32>

NEXT_PUBLIC_APP_URL                = https://app.getgroomgrid.com
NEXTAUTH_SECRET                    = <generate with: openssl rand -base64 32>
NEXTAUTH_URL                       = https://app.getgroomgrid.com

NEXT_PUBLIC_GA4_MEASUREMENT_ID     = G-XXXXXXXXXX
```

---

## Step 5: Configure Stripe Webhook

1. Stripe Dashboard → Developers → Webhooks → Add Endpoint
2. URL: `https://app.getgroomgrid.com/api/stripe/webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy **Signing Secret** → `STRIPE_WEBHOOK_SECRET` in Vercel env vars

---

## Step 6: Configure GitHub Secrets (for CI/CD)

In GitHub → mawsome-agency/groomgrid-app → Settings → Secrets → Actions:

```
VERCEL_TOKEN      = <from Vercel account settings>
VERCEL_ORG_ID     = <from Vercel project settings>
VERCEL_PROJECT_ID = <from Vercel project settings>
```

---

## Step 7: Configure DNS

In GoDaddy (already accessible via API), add:

```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
TTL: 600
```

The DNS record for `app.getgroomgrid.com` → `cname.vercel-dns.com` has been added automatically.

Then in Vercel Dashboard → Project → Settings → Domains:
- Add `app.getgroomgrid.com`
- Vercel will verify and provision SSL automatically

---

## Step 8: Deploy

```bash
git push origin main
```

The GitHub Actions workflow will automatically:
1. Install dependencies
2. Build the Next.js app
3. Deploy to Vercel production

---

## Step 9: Smoke Test

After deployment, test the full funnel:

1. **Signup**: https://app.getgroomgrid.com/signup
2. **Plan selection**: https://app.getgroomgrid.com/plans
3. **Stripe checkout**: Click a plan → complete Stripe checkout with test card `4242 4242 4242 4242`
4. **Onboarding**: Complete the 3-step onboarding flow
5. **Dashboard**: Verify user lands on dashboard

---

## Step 10: Verify Cron Job

Vercel Crons (defined in `vercel.json`) runs `/api/email/drip/process` daily at 9am UTC.
Verify in Vercel Dashboard → Project → Cron Jobs.

---

## Monitoring

- **Vercel Analytics**: Enable in Vercel Dashboard → Analytics tab
- **Uptime**: Vercel provides built-in status page
- **Logs**: `vercel logs` or Vercel Dashboard → Deployments → Runtime Logs
- **Errors**: Consider adding [Sentry](https://sentry.io) for error tracking

---

## Rollback

```bash
vercel rollback  # Roll back to previous deployment
```

