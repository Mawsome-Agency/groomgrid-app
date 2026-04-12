# GroomGrid Production Setup — Sentry & Email Reminders

## Status: Partially Complete

### ✅ Completed
- [x] Cron job for appointment reminder checks configured (runs hourly + 7 AM daily)
- [x] Reminder email templates implemented (24h and day-of reminders)
- [x] Reminder processing logic implemented
- [x] Sentry configuration files created (client and server)

### ⏳ Pending (Requires Matt's Input)
- [ ] Sentry DSN configuration
- [ ] Resend API key configuration
- [ ] Production app rebuild and deployment

---

## Environment Variables Required

Add these to `/var/www/groomgrid/prod/.env.local`:

```bash
# Sentry Error Tracking
SENTRY_DSN=https://<your-sentry-dsn>@sentry.io/<project-id>
NEXT_PUBLIC_SENTRY_DSN=https://<your-sentry-dsn>@sentry.io/<project-id>
SENTRY_ORG=<your-sentry-org>
SENTRY_PROJECT=groomgrid

# Resend Email Service
RESEND_API_KEY=re_<your-resend-api-key>
```

### How to Get Sentry DSN
1. Create a Sentry account at https://sentry.io
2. Create a new project for "Next.js"
3. Copy the DSN from project settings
4. Update the environment variables above

### How to Get Resend API Key
1. Create a Resend account at https://resend.com
2. Create an API key in the dashboard
3. Verify the sender domain (hello@getgroomgrid.com)
4. Update the environment variables above

---

## Cron Jobs Configured

The following cron jobs are now active:

```bash
# Appointment reminder check — runs every hour for 24h reminders
0 * * * * curl -s -X POST http://127.0.0.1:3000/api/cron/reminder-check -H "CRON_SECRET: 8e01189a7a46261cc8587e210f6bf03048057a77093f2ecc934793a593359d2c" >> /var/log/groomgrid-reminder.log 2>&1

# Appointment reminder check — runs at 7 AM for day-of reminders
0 7 * * * curl -s -X POST http://127.0.0.1:3000/api/cron/reminder-check -H "CRON_SECRET: 8e01189a7a46261cc8587e210f6bf03048057a77093f2ecc934793a593359d2c" >> /var/log/groomgrid-reminder.log 2>&1
```

### Reminder Logic
- **24h Reminders**: Sent for appointments starting in 23-25 hours
- **Day-of Reminders**: Sent for appointments starting within the next 12 hours (run at 7 AM)

### Log Files
- `/var/log/groomgrid-reminder.log` — Reminder processing logs
- `/var/log/groomgrid-drip.log` — Drip email logs
- `/var/log/groomgrid-noshow.log` — No-show check logs

---

## Production Issues Identified

### Critical: Production App Not Running
**Status**: `groomgrid-prod` PM2 process is STOPPED

**Error**: Missing `prerender-manifest.json` file in `.next` directory

**Root Cause**: Build process failed due to memory constraints on the 1GB droplet

**Impact**: 
- Production app is not accessible at https://app.getgroomgrid.com
- Email reminders cannot be sent
- Sentry error tracking is not active

**Recommended Actions**:
1. Upgrade droplet to 2GB RAM for reliable builds
2. OR use a CI/CD pipeline to build on a more powerful machine
3. OR use Next.js standalone output to reduce build memory requirements

### Build Issues
**Local Build Errors**:
- TailwindCSS module resolution issues
- ESLint configuration errors
- TypeScript type checking failures

**Server Build Errors**:
- SIGBUS signal (memory exhaustion)
- Build worker crashes during compilation

---

## Testing Sentry Integration

Once Sentry is configured, test the integration:

```bash
# Test endpoint exists at:
curl https://app.getgroomgrid.com/api/test-sentry-error
```

This will send a test error to Sentry for verification.

---

## Testing Email Reminders

Once Resend is configured and the app is running:

```bash
# Test reminder endpoint (requires CRON_SECRET):
curl -X POST http://127.0.0.1:3000/api/cron/reminder-check \
  -H "CRON_SECRET: 8e01189a7a46261cc8587e210f6bf03048057a77093f2ecc934793a593359d2c"
```

---

## Deployment Steps (After Environment Variables are Set)

1. **Update Environment Variables**:
   ```bash
   ssh root@68.183.151.222
   nano /var/www/groomgrid/prod/.env.local
   # Add SENTRY_DSN, NEXT_PUBLIC_SENTRY_DSN, RESEND_API_KEY
   ```

2. **Pull Latest Code**:
   ```bash
   cd /var/www/groomgrid/prod
   git pull origin main
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Build the App**:
   ```bash
   NODE_ENV=production npm run build
   ```
   *Note: This may fail on 1GB droplet. Consider building locally or using CI/CD.*

5. **Restart PM2**:
   ```bash
   pm2 restart groomgrid-prod
   pm2 save
   ```

6. **Verify**:
   ```bash
   pm2 status
   curl -o /dev/null -sw "%{http_code}" https://app.getgroomgrid.com/
   # Expected: 200
   ```

---

## Monitoring

### Check PM2 Status
```bash
pm2 list
pm2 logs groomgrid-prod --lines 50
```

### Check Cron Logs
```bash
tail -f /var/log/groomgrid-reminder.log
tail -f /var/log/groomgrid-drip.log
```

### Check Server Health
```bash
free -h
df -h
pm2 status
```

---

## Next Steps

1. **Immediate**: Get Sentry DSN and Resend API key from Matt
2. **High Priority**: Fix production app build and deployment
3. **Medium Priority**: Set up CI/CD pipeline for reliable builds
4. **Low Priority**: Consider upgrading droplet to 2GB for better performance

---

## Contact

For questions or issues with this setup:
- Jesse Korbin (Engineering Lead)
- Matt (CEO)
