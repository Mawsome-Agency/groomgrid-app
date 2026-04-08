# GroomGrid — Production Deployment Guide

> **Stack:** Next.js 14 · Supabase (Auth + DB) · Stripe · DigitalOcean droplet · PM2 · nginx  
> **Production:** https://getgroomgrid.com  
> **Staging:** https://staging.getgroomgrid.com  
> **Server:** 68.183.151.222 (DigitalOcean, nyc3, 1GB/1vCPU/25GB)  
> **Last updated:** April 2026

---

## Architecture Overview

```
Internet → nginx (443/80) → PM2 processes
                          ├── groomgrid-landing (port 3002) → getgroomgrid.com
                          ├── groomgrid-prod     (port 3000) → app.getgroomgrid.com
                          └── groomgrid-staging  (port 3001) → staging.getgroomgrid.com

Both apps share:
  - PostgreSQL (local, groomgrid_prod / groomgrid_staging)
  - SSL certs via Certbot (wildcard: *.getgroomgrid.com)
  - Node.js 22 / PM2

Redirects (from getgroomgrid.com → app.getgroomgrid.com):
  - /signup → /signup
  - /plans  → /plans
```

---

## Prerequisites

- SSH key: `~/.ssh/groomgrid_deploy` (access as root@68.183.151.222)
- GitHub access: `mawsome-agency/groomgrid-app`
- Supabase project credentials (in `.env.local` on server)
- Stripe live keys (in `.env.local` on server)

---

## Deploy Process (Standard)

### 1. Push code to GitHub

```bash
git push origin main
```

### 2. SSH to server

```bash
ssh -i ~/.ssh/groomgrid_deploy root@68.183.151.222
```

### 3. Pull latest code

```bash
cd /var/www/groomgrid/prod
git pull origin main
```

### 4. Install dependencies (if package.json changed)

```bash
npm ci --production=false
```

### 5. Run database migrations (if any)

```bash
npx prisma migrate deploy
# OR for Supabase migrations:
# Apply via Supabase dashboard SQL editor
```

### 6. Build the app

```bash
NODE_ENV=production npm run build
```

> ⚠️ Build takes 3–5 minutes on this server (1vCPU). Memory use peaks ~700MB.

### 7. Restart PM2

```bash
pm2 restart groomgrid-prod
pm2 save
```

### 8. Verify

```bash
pm2 status
curl -o /dev/null -sw "%{http_code}" https://getgroomgrid.com/
# Expected: 200

# Test redirects
curl -sI https://getgroomgrid.com/signup | grep -E "^Location:"
# Expected: Location: https://app.getgroomgrid.com/signup

curl -sI https://getgroomgrid.com/plans | grep -E "^Location:"
# Expected: Location: https://app.getgroomgrid.com/plans
```

---

## Deploy Process (Staging)

Same as above but:
```bash
cd /var/www/groomgrid/staging
git pull origin main   # or feature branch
npm ci --production=false
NODE_ENV=production npm run build
pm2 restart groomgrid-staging
```

---

## Environment Variables

Both prod and staging have their own `.env.local` at the app root.

### Production: `/var/www/groomgrid/prod/.env.local`

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server-only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe pk_live_ key |
| `STRIPE_SECRET_KEY` | Stripe sk_live_ key |
| `STRIPE_WEBHOOK_SECRET` | whsec_ from Stripe webhook config |
| `STRIPE_PRICE_SOLO` | price_ ID for Solo $29/mo plan |
| `STRIPE_PRICE_SALON` | price_ ID for Salon $79/mo plan |
| `STRIPE_PRICE_ENTERPRISE` | price_ ID for Enterprise $149/mo plan |
| `NEXT_PUBLIC_APP_URL` | https://app.getgroomgrid.com (for app) or https://getgroomgrid.com (for landing) |
| `RESEND_API_KEY` | re_ key for transactional email |
| `CRON_SECRET` | Secret token for cron job auth |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | G-XXXXXXXXXX |

### To update an env var:
```bash
ssh root@68.183.151.222
nano /var/www/groomgrid/prod/.env.local
# Make changes, save
cd /var/www/groomgrid/prod && pm2 restart groomgrid-prod
```

---

## nginx Configuration

Configs live at `/etc/nginx/sites-enabled/`:
- `groomgrid-landing` → routes `getgroomgrid.com` → `localhost:3002`
- `groomgrid-app` → routes `app.getgroomgrid.com` → `localhost:3000`
- `groomgrid-prod` → routes `getgroomgrid.com` → `localhost:3002` (marketing site)
- `groomgrid-staging` → routes `staging.getgroomgrid.com` → `localhost:3001`

**Important Redirects:**
The marketing site (`getgroomgrid.com`) redirects certain paths to the app subdomain:
- `getgroomgrid.com/signup` → `app.getgroomgrid.com/signup`
- `getgroomgrid.com/plans` → `app.getgroomgrid.com/plans`

These redirects are configured in the `groomgrid-prod` nginx config (location blocks for `/signup` and `/plans`).

To reload nginx after config changes:
```bash
nginx -t && systemctl reload nginx
```

---

## SSL Certificates

Managed by Certbot. Wildcard cert covers `*.getgroomgrid.com`.

```bash
# Check expiry
certbot certificates

# Auto-renew (runs via cron, but manual test):
certbot renew --dry-run
```

---

## PM2 Reference

```bash
pm2 list                      # Show all processes
pm2 status                    # Alias for list
pm2 logs groomgrid-prod       # Tail logs
pm2 logs groomgrid-prod --lines 100 --nostream  # Last 100 lines
pm2 restart groomgrid-prod    # Restart app
pm2 stop groomgrid-prod       # Stop app
pm2 start groomgrid-prod      # Start stopped app
pm2 delete groomgrid-prod     # Remove from PM2 (careful!)
pm2 save                      # Save process list (persists across reboots)
pm2 startup                   # Re-configure boot startup
```

---

## Database

PostgreSQL runs locally on the droplet.

```bash
# Connect to production DB
sudo -u postgres psql groomgrid_prod

# Connect to staging DB
sudo -u postgres psql groomgrid_staging

# Quick health check
sudo -u postgres psql -c "SELECT count(*) FROM users;" groomgrid_prod
```

Prisma migrations:
```bash
cd /var/www/groomgrid/prod
npx prisma migrate deploy   # Apply pending migrations
npx prisma db push          # Push schema (no migration files, dev only)
npx prisma studio           # GUI — requires port forwarding to use locally
```

---

## Stripe Webhooks

Webhook endpoint: `https://getgroomgrid.com/api/stripe/webhook`

Events configured:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

To verify webhooks are working:
```bash
# Check recent webhook attempts in Stripe Dashboard
# Developers → Webhooks → [endpoint] → Recent deliveries
```

---

## Rollback

```bash
ssh root@68.183.151.222
cd /var/www/groomgrid/prod

# Option 1: Roll back to previous git commit
git log --oneline -10   # Find target commit
git checkout <commit-hash>
NODE_ENV=production npm run build
pm2 restart groomgrid-prod

# Option 2: If build is broken, restore previous .next
# (Only works if you backed up — see health check script below)
```

---

## Health Check Script

Save as `/root/check-groomgrid.sh`:

```bash
#!/bin/bash
echo "=== Server Health ==="
free -m | grep Mem
df -h / | tail -1

echo ""
echo "=== PM2 Status ==="
pm2 list

echo ""
echo "=== HTTP Check ==="
LANDING_CODE=$(curl -o /dev/null -sw "%{http_code}" https://getgroomgrid.com/)
APP_CODE=$(curl -o /dev/null -sw "%{http_code}" https://app.getgroomgrid.com/)
STAGING_CODE=$(curl -o /dev/null -sw "%{http_code}" https://staging.getgroomgrid.com/)
echo "Landing (getgroomgrid.com): $LANDING_CODE"
echo "App (app.getgroomgrid.com): $APP_CODE"
echo "Staging: $STAGING_CODE"

echo ""
echo "=== Redirect Check ==="
SIGNUP_REDIRECT=$(curl -sI https://getgroomgrid.com/signup | grep -o "https://app.getgroomgrid.com/signup")
PLANS_REDIRECT=$(curl -sI https://getgroomgrid.com/plans | grep -o "https://app.getgroomgrid.com/plans")
echo "Signup redirect: ${SIGNUP_REDIRECT:-FAILED}"
echo "Plans redirect: ${PLANS_REDIRECT:-FAILED}"

echo ""
echo "=== DB Check ==="
sudo -u postgres psql -c "SELECT 'prod_ok' FROM pg_database WHERE datname='groomgrid_prod';" 2>/dev/null
```

```bash
chmod +x /root/check-groomgrid.sh
/root/check-groomgrid.sh
```

---

## First-Time Server Setup (for reference)

If ever re-provisioning from scratch:

```bash
# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Install nginx
apt-get install -y nginx

# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Clone repo
git clone git@github.com:mawsome-agency/groomgrid-app.git /var/www/groomgrid/prod
cd /var/www/groomgrid/prod
npm ci --production=false

# Set up env
cp .env.example .env.local
nano .env.local  # Fill in all values

# Build
NODE_ENV=production npm run build

# Start with PM2
pm2 start npm --name "groomgrid-prod" -- start
pm2 save
pm2 startup

# Configure nginx (copy from /etc/nginx/sites-enabled/ in existing setup)
# Configure SSL
certbot --nginx -d getgroomgrid.com -d www.getgroomgrid.com -d staging.getgroomgrid.com
```

