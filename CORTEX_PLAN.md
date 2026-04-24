# GroomGrid Engineering Plan — Updated April 24, 2026

## Current Status

### Production Health
- ✅ All endpoints returning 200 (landing, app, plans, signup)
- ✅ PM2 stable (restart counter reset to 0)
- ✅ Memory limit increased to 700MB (was 450MB)
- ✅ Coupon validation fix deployed (PR #174)

### Critical Metrics
- **Paying subscribers: 0** — All 6 DB users are test accounts
- **Completed checkouts: 0** — No real transactions processed
- **Stale checkout sessions: 2** — From test webhooks, need cleanup
- **Failed payment intents: 2** — $27 each, stuck in "requires_payment_method"

### Known Issues
1. ~~Invalid coupon codes crash checkout~~ → **FIXED** (PR #174)
2. PM2 ecosystem.config.js outdated (wrong path, wrong port) — needs cleanup
3. `/plans` route occasionally throws `InvariantError: client reference manifest` — intermittent, likely memory-related
4. No 500.html error page — Next.js falls back to default error

## Immediate Priority: First Paying Subscriber

### Step 1: Verify Checkout Flow (IN PROGRESS)
- [ ] Test end-to-end signup → Stripe checkout → webhook → subscription activation
- [ ] Test with valid coupon BETA50 (50% off)
- [ ] Test with invalid coupon (should gracefully fall back)
- [ ] Test with no coupon
- [ ] Verify webhook processes checkout.session.completed

### Step 2: Clean Up Stripe
- [ ] Expire stale checkout sessions
- [ ] Investigate and resolve $27 payment intents

### Step 3: Infrastructure Cleanup
- [ ] Fix PM2 ecosystem.config.js (update paths, ports)
- [ ] Add 500.html error page
- [ ] Set up basic uptime monitoring

## Stalled Missions — Restructured

### Mission: Complete MVP → "Verify Checkout & First Subscriber"
- 36/40 done, but the 4 remaining are critical for revenue
- Focus: End-to-end checkout verification, Stripe data cleanup, PM2 config

### Mission: Post-MVP → Descoped
- Remove nice-to-haves, keep only: transactional email, basic monitoring
- Email: Mailgun is configured, need welcome/password-reset/subscription-confirmation templates
- Monitoring: Basic health checks (uptime + error rate)

### Mission: PR Triage → Close Out
- Review remaining 3 PRs
- Admin pipeline status page PR awaiting review

### Mission: Unblock MVP → Replaced
- Original blockers resolved
- New focus: Get first paying subscriber through the door

## Architecture Notes
- Single Next.js app on port 3002 serving both getgroomgrid.com and app.getgroomgrid.com
- PostgreSQL on the same droplet (1GB RAM, 25GB disk)
- PM2 process management with nginx reverse proxy
- SSL via Certbot (wildcard *.getgroomgrid.com)
- Stripe live mode with webhook at /api/stripe/webhook
