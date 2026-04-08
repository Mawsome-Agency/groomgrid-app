# GroomGrid Infrastructure Runbook

> **Single source of truth for GroomGrid production infrastructure**  
> **Production:** https://getgroomgrid.com | **Staging:** https://staging.getgroomgrid.com  
> **Server:** 68.183.151.222 (DigitalOcean, nyc3)  
> **Last updated:** April 8, 2026

---

## 1. Server Overview

| Attribute | Value |
|-----------|-------|
| **IP Address** | 68.183.151.222 |
| **Hostname** | groomgrid-production |
| **OS** | Ubuntu 24.04.4 LTS (Noble Numbat) |
| **Kernel** | 6.8.0-71-generic |
| **CPU** | 1 vCPU |
| **RAM** | 961 MB total (333 MB available average) |
| **Swap** | 1 GB (enabled) |
| **Disk** | 24 GB total (16 GB available) |
| **SSH Access** | `ssh -i ~/.ssh/groomgrid_deploy root@68.183.151.222` |

### System Services Status

```bash
# Check all critical services
systemctl status nginx      # Should be active (running)
systemctl status postgresql # Should be active (exited - managed by systemd)
pm2 status                   # Should show 3 processes online
```

---

## 2. App Layout

```
/var/www/groomgrid/
├── prod/          # Production app (groomgrid-prod)
│   ├── .next/           # Next.js build output
│   ├── node_modules/    # Dependencies
│   ├── package.json
│   ├── .env.local       # Production env vars
│   └── src/             # Source code
│
├── staging/       # Staging app (groomgrid-staging)
│   ├── .next/
│   ├── node_modules/
│   ├── package.json
│   ├── .env.local       # Staging env vars
│   └── src/
│
└── (not in this dir) landing page at /root/groomgrid-landing/
```

### App Locations

| App | Directory | Purpose |
|-----|-----------|---------|
| **Production** | `/var/www/groomgrid/prod` | Main production app |
| **Staging** | `/var/www/groomgrid/staging` | Staging/testing environment |
| **Landing Page** | `/root/groomgrid-landing` | Marketing website (getgroomgrid.com) |

### Port Mapping

| App | Internal Port | Public URL | Purpose |
|-----|--------------|-------------|---------|
| Production | 3000 | app.getgroomgrid.com | Main application |
| Staging | 3001 | staging.getgroomgrid.com | Staging environment |
| Landing Page | 3002 | getgroomgrid.com, www.getgroomgrid.com | Marketing site |

---

## 3. PM2 Processes

All PM2 processes run as `root` and are managed via systemd for auto-restart on boot.

### Current Processes

| PM2 Name | PID | Port | Uptime | Restarts | Status | Working Directory |
|----------|-----|------|--------|----------|--------|-------------------|
| `groomgrid-landing` | 106067 | 3002 | ~20h | 2 | online | `/root/groomgrid-landing` |
| `groomgrid-prod` | 142037 | 3000 | ~22m | 1 | online | `/var/www/groomgrid/prod` |
| `groomgrid-staging` | 74797 | 3001 | ~31h | 0 | online | `/var/www/groomgrid/staging` |

### PM2 Module

| Module | Version | Purpose |
|--------|---------|---------|
| `pm2-logrotate` | 3.0.0 | Log rotation (auto-cleanup) |

### Log Locations

| Process | Output Log | Error Log |
|---------|-----------|-----------|
| groomgrid-prod | `/root/.pm2/logs/groomgrid-prod-out.log` | `/root/.pm2/logs/groomgrid-prod-error.log` |
| groomgrid-staging | `/root/.pm2/logs/groomgrid-staging-out.log` | `/root/.pm2/logs/groomgrid-staging-error.log` |
| groomgrid-landing | `/root/.pm2/logs/groomgrid-landing-out.log` | `/root/.pm2/logs/groomgrid-landing-error.log` |

### PM2 Commands

```bash
# List all processes
pm2 list

# Show process details
pm2 show groomgrid-prod

# Restart a process
pm2 restart groomgrid-prod

# Stop/Start a process
pm2 stop groomgrid-prod
pm2 start groomgrid-prod

# View logs (tail)
pm2 logs groomgrid-prod

# View last N lines without streaming
pm2 logs groomgrid-prod --lines 100 --nostream

# Monitor real-time metrics
pm2 monit

# Save current process list (persists across reboots)
pm2 save

# Flush all logs
pm2 flush
```

### Restart Policies

All processes run in `fork_mode` with watch disabled. PM2 is configured to auto-restart on crashes, and systemd ensures processes start on boot.

---

## 4. Nginx Configuration

### Virtual Hosts

Nginx config files are in `/etc/nginx/sites-enabled/`:

| Domain | Config File | Backend | SSL |
|--------|-------------|---------|-----|
| `app.getgroomgrid.com` | `groomgrid-app.conf` | localhost:3000 | ✓ |
| `staging.getgroomgrid.com` | `groomgrid-staging.conf` | localhost:3001 | ✓ |
| `getgroomgrid.com` | `groomgrid-landing.conf` | localhost:3002 | ✓ |
| `www.getgroomgrid.com` | `groomgrid-landing.conf` | localhost:3002 | ✓ |

### Special Redirects

- `/signup` → `https://app.getgroomgrid.com/signup`
- `/plans` → `https://app.getgroomgrid.com/plans`

### SSL Certificates

Managed by Certbot with wildcard certificate for `*.getgroomgrid.com`.

```bash
# Check certificate status
certbot certificates

# Manual renewal (auto-renews via cron)
certbot renew

# Test renewal dry-run
certbot renew --dry-run
```

**Certificate Location:** `/etc/letsencrypt/live/getgroomgrid.com/`

### Nginx Commands

```bash
# Test configuration syntax
nginx -t

# Reload configuration (no downtime)
nginx -s reload

# Full restart (brief downtime)
systemctl restart nginx

# Check status
systemctl status nginx

# View access logs
tail -f /var/log/nginx/access.log

# View error logs
tail -f /var/log/nginx/error.log
```

### Security Headers

All sites include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 5. Database

### PostgreSQL Setup

| Attribute | Production | Staging |
|-----------|-----------|---------|
| **Host** | 127.0.0.1 | 127.0.0.1 |
| **Port** | 5432 | 5432 |
| **Database** | `groomgrid_prod` | `groomgrid_staging` |
| **User** | `groomgrid_prod_user` | `groomgrid_staging_user` |
| **Password** | (see `.env.local`) | (see `.env.local`) |

### Connection Strings

```
Production: postgresql://groomgrid_prod_user:GGprod2026xK7mQ9@127.0.0.1:5432/groomgrid_prod
Staging:   postgresql://groomgrid_staging_user:GGstg2026yR3nP4@127.0.0.1:5432/groomgrid_staging
```

### Database Commands

```bash
# Connect to production database
sudo -u postgres psql groomgrid_prod

# Connect to staging database
sudo -u postgres psql groomgrid_staging

# List all databases
sudo -u postgres psql -c '\l'

# List all users
sudo -u postgres psql -c '\du'

# Check database size
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('groomgrid_prod'));"

# Check table sizes
sudo -u postgres psql groomgrid_prod -c "
  SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
  FROM pg_tables 
  WHERE schemaname = 'public'
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

### Backups

**Backup Script:** `/root/scripts/pg-backup.sh`

**Schedule:** Daily at 2:00 AM UTC via cron

**Retention:** 30 days

**Backup Location:** `/var/backups/postgresql/`

**Manual Backup:**
```bash
# Run backup manually
sudo /root/scripts/pg-backup.sh

# View recent backups
ls -lh /var/backups/postgresql/

# Restore from backup (example)
gunzip -c /var/backups/postgresql/groomgrid_20260408_020001.sql.gz | \
  sudo -u postgres psql groomgrid_prod
```

### Prisma Migrations

```bash
cd /var/www/groomgrid/prod

# Apply pending migrations
npx prisma migrate deploy

# View migration status
npx prisma migrate status

# Generate client (after schema changes)
npx prisma generate
```

---

## 6. Environment Variables

### Production: `/var/www/groomgrid/prod/.env.local`

```bash
CRON_SECRET=<secret_token_for_cron_auth>
DATABASE_URL=postgresql://groomgrid_prod_user:GGprod2026xK7mQ9@127.0.0.1:5432/groomgrid_prod
NEXTAUTH_SECRET=<nextauth_secret>
NEXTAUTH_URL=https://app.getgroomgrid.com
NEXT_PUBLIC_APP_URL=https://app.getgroomgrid.com
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NODE_ENV=production
# RESEND_API_KEY=<resend_api_key>  # Not yet configured
```

### Staging: `/var/www/groomgrid/staging/.env.local`

```bash
DATABASE_URL=postgresql://groomgrid_staging_user:GGstg2026yR3nP4@127.0.0.1:5432/groomgrid_staging
NEXTAUTH_SECRET=<nextauth_secret>
NEXTAUTH_URL=https://staging.getgroomgrid.com
NEXT_PUBLIC_APP_URL=https://staging.getgroomgrid.com
NODE_ENV=production
```

### Landing Page: `/root/groomgrid-landing/.env`

```bash
NODE_ENV=production
PORT=3002
```

### Updating Environment Variables

```bash
# Edit the file
ssh -i ~/.ssh/groomgrid_deploy root@68.183.151.222
nano /var/www/groomgrid/prod/.env.local

# Restart the app to pick up changes
pm2 restart groomgrid-prod
```

---

## 7. Deployment Process

### Deploying to Production

```bash
# 1. Push code to GitHub
git push origin main

# 2. SSH to server
ssh -i ~/.ssh/groomgrid_deploy root@68.183.151.222

# 3. Navigate to app directory
cd /var/www/groomgrid/prod

# 4. Pull latest code
git pull origin main

# 5. Install dependencies (if package.json changed)
npm ci --production=false

# 6. Run database migrations (if schema changed)
npx prisma migrate deploy

# 7. Stop the app to free memory for build
pm2 stop groomgrid-prod

# 8. Build the app (takes 3-5 minutes on this server)
NODE_ENV=production npm run build

# 9. Start the app
pm2 start groomgrid-prod

# 10. Save PM2 state
pm2 save

# 11. Verify deployment
curl -o /dev/null -sw "%{http_code}" https://app.getgroomgrid.com/
# Expected: 200
```

### Deploying to Staging

```bash
ssh -i ~/.ssh/groomgrid_deploy root@68.183.151.222
cd /var/www/groomgrid/staging
git pull origin main  # or feature branch
npm ci --production=false
npx prisma migrate deploy
pm2 stop groomgrid-staging
NODE_ENV=production npm run build
pm2 start groomgrid-staging
pm2 save
curl -o /dev/null -sw "%{http_code}" https://staging.getgroomgrid.com/
```

### Deploying Landing Page

```bash
ssh -i ~/.ssh/groomgrid_deploy root@68.183.151.222
cd /root/groomgrid-landing
git pull origin main
npm ci --production=false
pm2 stop groomgrid-landing
npm run build
pm2 start groomgrid-landing
pm2 save
curl -o /dev/null -sw "%{http_code}" https://getgroomgrid.com/
```

### Rollback Procedure

```bash
ssh -i ~/.ssh/groomgrid_deploy root@68.183.151.222
cd /var/www/groomgrid/prod

# View recent commits
git log --oneline -10

# Checkout previous commit
git checkout <commit-hash>

# Rebuild
pm2 stop groomgrid-prod
NODE_ENV=production npm run build
pm2 start groomgrid-prod
pm2 save

# Or, if you just need to revert the last pull:
git reset --hard HEAD~1
```

---

## 8. Common Debug Commands

### Quick Health Check

```bash
# One-liner health check
ssh -i ~/.ssh/groomgrid_deploy root@68.183.151.222 << 'EOF'
echo "=== PM2 Status ==="
pm2 list
echo ""
echo "=== HTTP Status Codes ==="
curl -o /dev/null -sw "Main site: %{http_code}\n" https://getgroomgrid.com
curl -o /dev/null -sw "App: %{http_code}\n" https://app.getgroomgrid.com
curl -o /dev/null -sw "Staging: %{http_code}\n" https://staging.getgroomgrid.com
echo ""
echo "=== Memory ==="
free -h | grep Mem
echo ""
echo "=== Disk ==="
df -h / | tail -1
echo ""
echo "=== PostgreSQL ==="
sudo -u postgres psql -c "SELECT 'prod OK' FROM pg_database WHERE datname='groomgrid_prod';"
