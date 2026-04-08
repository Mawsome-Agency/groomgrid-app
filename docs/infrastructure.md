# GroomGrid Production Infrastructure

## Overview

GroomGrid runs on a single DigitalOcean droplet hosting both production and staging environments.

**Server Details:**
- **Host:** 68.183.151.222
- **OS:** Ubuntu 24.04.4 LTS
- **RAM:** 961MB (1GB with 1GB swap)
- **CPU:** 1 vCPU
- **Disk:** 24GB (7.4GB used, 32% utilization)
- **Uptime:** ~2 days (current as of 2026-04-08)

---

## Application Layout

```
/var/www/groomgrid/
├── prod/          # Production app (Next.js)
│   ├── .next/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── .env.local
└── staging/       # Staging app (Next.js)
    ├── .next/
    ├── node_modules/
    ├── public/
    ├── src/
    ├── package.json
    └── .env.local

/root/groomgrid-landing/  # Landing page (static)
```

---

## PM2 Processes

| Name | Status | Port | Restarts | Memory | Uptime |
|------|--------|------|----------|--------|--------|
| groomgrid-landing | online | 3002 | 3 | 64.5MB | 32m |
| groomgrid-prod | online | 3000 | 1 | 26.9MB | 55m |
| groomgrid-staging | online | 3001 | 0 | 30.3MB | 32h |

### PM2 Commands
```bash
# View all processes
pm2 list

# View logs for a specific app
pm2 logs groomgrid-prod

# Restart an app
pm2 restart groomgrid-prod

# View detailed process info
pm2 show groomgrid-prod
```

---

## Nginx Configuration

Nginx reverse proxies requests to the appropriate PM2 processes.

### Virtual Hosts

| Domain | Backend Port | SSL | Purpose |
|--------|--------------|-----|---------|
| getgroomgrid.com, www.getgroomgrid.com | 3002 | ✅ | Landing page |
| app.getgroomgrid.com | 3000 | ✅ | Production app |
| staging.getgroomgrid.com | 3001 | ✅ | Staging app |

### SSL Certificates
- Managed by Certbot
- Auto-renewal configured via cron
- Certificate path: `/etc/letsencrypt/live/{domain}/`

### Nginx Commands
```bash
# Test configuration
nginx -t

# Reload nginx (graceful)
nginx -s reload

# Restart nginx
systemctl restart nginx

# View error logs
tail -f /var/log/nginx/error.log

# View access logs
tail -f /var/log/nginx/access.log
```

---

## Database Setup

PostgreSQL runs on the droplet (127.0.0.1:5432).

### Databases

| Database | User | Purpose |
|----------|------|---------|
| groomgrid_prod | groomgrid_prod_user | Production data |
| groomgrid_staging | groomgrid_staging_user | Staging data |

### Backup Script
- **Location:** `/root/scripts/pg-backup.sh`
- **Schedule:** Daily at 2:00 AM
- **Retention:** 7 days

### Database Commands
```bash
# Connect to production DB
sudo -u postgres psql -d groomgrid_prod

# Connect to staging DB
sudo -u postgres psql -d groomgrid_staging

# Run backup manually
/root/scripts/pg-backup.sh
```

---

## Environment Variables

Each app has its own `.env.local` file:

### Production (`/var/www/groomgrid/prod/.env.local`)
```
DATABASE_URL=postgresql://groomgrid_prod_user:[PASSWORD]@127.0.0.1:5432/groomgrid_prod
NEXTAUTH_URL=https://app.getgroomgrid.com
NEXTAUTH_SECRET=[NEXTAUTH_SECRET]
STRIPE_SECRET_KEY=[STRIPE_SK]
STRIPE_PUBLISHABLE_KEY=[STRIPE_PK]
STRIPE_WEBHOOK_SECRET=[WEBHOOK_SECRET]
STRIPE_PRICE_ID_SOLO=[PRICE_ID]
STRIPE_PRICE_ID_SALON=[PRICE_ID]
STRIPE_PRICE_ID_ENTERPRISE=[PRICE_ID]
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=[GA4_SECRET]
CRON_SECRET=[CRON_SECRET]
```

### Staging (`/var/www/groomgrid/staging/.env.local`)
```
DATABASE_URL=postgresql://groomgrid_staging_user:[PASSWORD]@127.0.0.1:5432/groomgrid_staging
NEXTAUTH_URL=https://staging.getgroomgrid.com
NEXTAUTH_SECRET=[NEXTAUTH_SECRET]
STRIPE_SECRET_KEY=[STRIPE_SK_TEST]
STRIPE_PUBLISHABLE_KEY=[STRIPE_PK_TEST]
STRIPE_WEBHOOK_SECRET=[WEBHOOK_SECRET_TEST]
STRIPE_PRICE_ID_SOLO=[PRICE_ID_TEST]
STRIPE_PRICE_ID_SALON=[PRICE_ID_TEST]
STRIPE_PRICE_ID_ENTERPRISE=[PRICE_ID_TEST]
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=[GA4_SECRET]
CRON_SECRET=[CRON_SECRET]
```

---

## Monitoring & Health Checks

### Health Check Script
- **Location:** `/root/scripts/health-check.sh` and `/root/groomgrid-health-check.sh`
- **Schedule:** Every 5 minutes
- **Function:** Checks app health and restarts if needed

### Log Rotation
- **Module:** `pm2-logrotate`
- **Status:** Online (5 restarts)
- **Function:** Rotates PM2 logs to prevent disk bloat

### Log Locations
```
PM2 Logs: ~/.pm2/logs/
Nginx Logs: /var/log/nginx/
Custom Logs:
  /var/log/groomgrid-noshow.log
  /var/log/groomgrid-drip.log
```

---

## Cron Jobs

| Schedule | Command | Purpose |
|----------|---------|---------|
| */15 * * * * | `curl -s -X POST https://app.getgroomgrid.com/api/cron/no-show-check` | Check for no-shows |
| 0 2 * * * | `/root/scripts/pg-backup.sh` | Daily database backup |
| */5 * * * * | `/root/scripts/health-check.sh` | Health monitoring |
| */5 * * * * | `/root/groomgrid-health-check.sh` | Health monitoring (backup) |
| */15 * * * * | `curl -s -X POST http://127.0.0.1:3000/api/email/drip/process` | Process email drips |

---

## Deployment

### Production Deployment
```bash
# SSH into server
ssh -i ~/.ssh/groomgrid_deploy root@68.183.151.222

# Navigate to app directory
cd /var/www/groomgrid/prod

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build application
npm run build

# Restart PM2
pm2 restart groomgrid-prod
```

### Staging Deployment
```bash
# SSH into server
ssh -i ~/.ssh/groomgrid_deploy root@68.183.151.222

# Navigate to app directory
cd /var/www/groomgrid/staging

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build application
npm run build

# Restart PM2
pm2 restart groomgrid-staging
```

---

## Known Issues & Considerations

### Memory Constraints
- **Issue:** 1GB RAM is tight for 3 Node.js apps + PostgreSQL
- **Impact:** Build times may be slow; occasional OOM possible
- **Mitigation:** 1GB swap configured; consider upgrade if issues persist

### Build Time
- **Issue:** Building Next.js apps takes ~3-5 minutes on 1 vCPU
- **Mitigation:** Use staging environment for testing before prod builds

### Email Configuration
- **Status:** NOT YET CONFIGURED
- **Action Item:** Configure Resend API key for transactional emails
- **Tracking:** See task "Configure appointment reminder emails via Resend"

### Error Tracking
- **Status:** NOT YET CONFIGURED
- **Action Item:** Set up Sentry for error monitoring
- **Tracking:** See task "Set up Sentry error tracking on production"

---

## Emergency Procedures

### App Not Responding
```bash
# Check PM2 status
pm2 list

# Restart specific app
pm2 restart groomgrid-prod

# If that fails, check logs
pm2 logs groomgrid-prod --lines 100
```

### Database Issues
```bash
# Check if PostgreSQL is running
systemctl status postgresql

# Restart PostgreSQL if needed
systemctl restart postgresql

# Check disk space
df -h
```

### Nginx Issues
```bash
# Check nginx status
systemctl status nginx

# Test configuration
nginx -t

# Reload nginx
nginx -s reload

# If that fails, restart
systemctl restart nginx
```

### Full Server Restart
```bash
# Graceful restart (apps will auto-start via PM2)
reboot

# Force restart if needed
shutdown -r now
```

---

## Contact & Support

- **GitHub Repo:** https://github.com/Mawsome-Agency/groomgrid-app
- **Landing Page:** https://getgroomgrid.com
- **Production App:** https://app.getgroomgrid.com
- **Staging App:** https://staging.getgroomgrid.com

---

*Last updated: 2026-04-08*
