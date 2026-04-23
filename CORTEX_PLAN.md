# CORTEX_PLAN.md — Configure Stripe Products/Prices + Production Env Vars

## Scope: HOTFIX | Branch: cortex/jesse-korbin/dev-pipeline-build-configure-stripe-prod

## Problem
`/api/checkout` returns 500 on every request. Root cause: `ensureEnv('stripe')` in
`src/app/api/checkout/route.ts` throws because `STRIPE_PRICE_SOLO`, `STRIPE_PRICE_SALON`,
and `STRIPE_PRICE_ENTERPRISE` are missing from the production `.env.local` on the droplet.

The `validation.ts` module requires all 3 vars to be present and throws a descriptive error
if any are missing. This hits the catch block in the checkout route → 500 to the client.

## Investigation Results

### Stripe (live mode) — all 3 products + prices ALREADY EXIST
| Plan       | Product ID              | Price ID                             | Amount |
|------------|-------------------------|--------------------------------------|--------|
| Solo       | prod_UHnHV2mf0xQLwS     | price_1TJDgnG4DfZ9Hko3qZUifmgo      | $29/mo |
| Salon      | prod_UHnHEMJYz7sJgW     | price_1TJDguG4DfZ9Hko36faOkkXr      | $79/mo |
| Enterprise | prod_UHnHo1tGfmZ8Aq     | price_1TJDgvG4DfZ9Hko3vLzhNLZ1      | $149/mo|

### Local .env.local — correct price IDs already present
### Code (pricing-data.ts, stripe.ts, validation.ts) — correct, no changes needed
### Gap — ecosystem.config.js comment did not list STRIPE_PRICE_* as required vars
### Gap — no deploy script existed to patch production .env.local

## Code Changes Made

### 1. `ecosystem.config.js`
Added STRIPE_PRICE_* to the required .env.local documentation comment. Prevents future
deploys from missing these vars. Points to the new helper script.

### 2. `scripts/set-stripe-prices.sh` (NEW)
Runnable shell script that patches `/home/deployer/cortex/groomgrid-app/.env.local` with
the correct production price IDs. Handles both update and append cases safely.

### 3. `docs/STRIPE_SETUP.md`
Added actual production price IDs and deploy instructions for the deploy agent.

## No Code Logic Changes Needed
The application code correctly reads price IDs from env vars. No TypeScript changes required.
The 500 errors are 100% caused by missing env vars in production.

## Deploy Checklist (CRITICAL — for deploy agent)

These steps MUST be executed on the production droplet for checkout to work:

```bash
# 1. SSH to droplet
ssh -i $PROD_KEY_PATH -p $PROD_PORT $PROD_USER@$PROD_HOST

# 2. Run the price ID patch script
cd /home/deployer/cortex/groomgrid-app
bash scripts/set-stripe-prices.sh

# 3. Verify env vars are set
grep STRIPE_PRICE .env.local

# 4. Rebuild the app (env vars are baked in at build time for server components)
npm run build

# 5. Restart PM2
pm2 restart groomgrid-app

# 6. Verify checkout works
curl -s https://getgroomgrid.com/api/health | python3 -m json.tool
```

## Acceptance Criteria
- [ ] STRIPE_PRICE_SOLO, STRIPE_PRICE_SALON, STRIPE_PRICE_ENTERPRISE set in production .env.local
- [ ] App rebuilt and restarted
- [ ] /plans page loads without errors
- [ ] Subscribe CTA initiates a real Stripe checkout session (no 500)
- [ ] No 500 errors on /api/checkout
