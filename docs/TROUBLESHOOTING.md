# GroomGrid — Troubleshooting Guide

> Production: https://getgroomgrid.com | Server: 68.183.151.222

---

## Quick Diagnostics

```bash
ssh -i ~/.ssh/groomgrid_deploy root@68.183.151.222
pm2 list                           # Are processes running?
curl -o /dev/null -sw "%{http_code}" https://getgroomgrid.com/  # Is it responding?
pm2 logs groomgrid-prod --lines 50 --nostream  # What's crashing?
```

---

## Common Issues

### ❌ 502 Bad Gateway

**Cause:** nginx can't reach the app (app is down or wrong port).

**Fix:**
```bash
ssh root@68.183.151.222
pm2 list                    # Check if groomgrid-prod is "online"
pm2 restart groomgrid-prod  # Restart it
pm2 logs groomgrid-prod --lines 30 --nostream  # Check for errors
```

If it keeps crashing → check for build issue (see below).

---

### ❌ App crashes on startup: "Could not find a production build in the '.next' directory"

**Cause:** Missing or incomplete `next build` — no `BUILD_ID` file in `.next/`.

**Fix:**
```bash
ssh root@68.183.151.222
pm2 stop groomgrid-prod
cd /var/www/groomgrid/prod
NODE_ENV=production npm run build  # Takes 3-5 min
pm2 start groomgrid-prod
```

---

### ❌ App crashes on startup: "Cannot find module" or "Module not found"

**Cause:** `node_modules` out of date after a pull.

**Fix:**
```bash
cd /var/www/groomgrid/prod
npm ci --production=false
NODE_ENV=production npm run build
pm2 restart groomgrid-prod
```

---

### ❌ App crashes: "ECONNREFUSED" or "Database connection failed"

**Cause:** PostgreSQL is down or env vars are wrong.

**Fix:**
```bash
# Check PostgreSQL
systemctl status postgresql
systemctl restart postgresql  # If down

# Verify env var connection string
grep DATABASE_URL /var/www/groomgrid/prod/.env.local
# Test connection
sudo -u postgres psql groomgrid_prod -c "SELECT 1;"
```

---

### ❌ Stripe webhooks failing (403/400 errors)

**Cause:** `STRIPE_WEBHOOK_SECRET` mismatch or endpoint not registered.

**Fix:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Find `https://getgroomgrid.com/api/stripe/webhook`
3. Copy the Signing Secret (starts with `whsec_`)
4. Update on server:
```bash
nano /var/www/groomgrid/prod/.env.local
# Update STRIPE_WEBHOOK_SECRET=whsec_...
pm2 restart groomgrid-prod
```

---

### ❌ SSL certificate expired or HTTPS errors

**Cause:** Certbot renewal failed (auto-renews every 60 days, should be fine).

**Fix:**
```bash
certbot renew --nginx
systemctl reload nginx
# Check expiry
certbot certificates
```

---

### ❌ Server running out of memory (OOM / app killed)

**Signs:** PM2 shows "errored" or "stopped" with no log errors; `free -m` shows 0 available.

**Cause:** 1GB RAM is tight — build + running app + DB can spike.

**Fix:**
```bash
free -m           # Check memory
swapon --show     # Verify 1GB swap is active

# If swap is missing:
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile swap swap defaults 0 0' >> /etc/fstab

# Never build while the app is under load
pm2 stop groomgrid-prod  # Stop app first
NODE_ENV=production npm run build
pm2 start groomgrid-prod
```

---

### ❌ PM2 processes not starting on reboot

**Cause:** PM2 startup not configured or `pm2 save` not run.

**Fix:**
```bash
pm2 save
pm2 startup  # Follow instructions it outputs
# Then run the suggested command (looks like: sudo env PATH=... pm2 startup...)
```

---

### ❌ Auth not working / users can't log in

**Diagnosis:**
1. Check Supabase project is active (supabase.com dashboard)
2. Verify env vars:
```bash
grep SUPABASE /var/www/groomgrid/prod/.env.local
```
3. Check Supabase auth logs: supabase.com → project → Auth → Logs

**Common causes:**
- Supabase project paused (inactive projects pause after 1 week on free tier)
- Wrong `NEXT_PUBLIC_SUPABASE_URL` or key
- Email provider rate limited

---

### ❌ Stripe checkout not loading

**Diagnosis:**
```bash
grep STRIPE /var/www/groomgrid/prod/.env.local | grep -v SECRET
# Verify NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is pk_live_...
```

**Common causes:**
- Using test key (`pk_test_`) in production — swap for `pk_live_`
- Price IDs don't exist in Stripe (check STRIPE_PRICE_SOLO etc.)

---

### ❌ nginx config error after changes

```bash
nginx -t  # Test config syntax
# If errors, fix the config file
nginx -t && systemctl reload nginx  # Reload when fixed
```

---

### ❌ Disk space full

```bash
df -h /
# Common culprits:
du -sh /var/www/groomgrid/prod/.next/cache  # Next.js build cache
du -sh /root/.pm2/logs                       # PM2 logs

# Clean up:
rm -rf /var/www/groomgrid/prod/.next/cache
pm2 flush  # Clear PM2 logs
```

---

## Log Locations

| What | Where |
|---|---|
| PM2 prod logs | `/root/.pm2/logs/groomgrid-prod-out.log` |
| PM2 prod errors | `/root/.pm2/logs/groomgrid-prod-error.log` |
| nginx access log | `/var/log/nginx/access.log` |
| nginx error log | `/var/log/nginx/error.log` |
| System journal | `journalctl -u nginx -n 50` |
| PostgreSQL | `journalctl -u postgresql -n 50` |

---

## Escalation Path

1. **Restart app** → `pm2 restart groomgrid-prod`
2. **Rebuild** → `npm run build && pm2 restart groomgrid-prod`
3. **Roll back** → `git checkout <prev-commit> && npm run build && pm2 restart`
4. **Escalate to Matt** → maw@mawsome.agency — include: what you tried, error logs, URL status codes

