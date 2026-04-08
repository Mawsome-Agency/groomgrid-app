# Sentry Setup - Remaining Tasks

## ✅ Completed (Code Changes)
- [x] Install @sentry/nextjs package
- [x] Create sentry.client.config.ts
- [x] Create sentry.server.config.ts  
- [x] Update next.config.mjs with Sentry wrapper
- [x] Create test endpoint (/api/test-sentry-error)
- [x] Update .env.example with Sentry variables
- [x] Create comprehensive documentation (docs/SENTRY_SETUP.md)
- [x] Create PR: https://github.com/Mawsome-Agency/groomgrid-app/pull/13

## 📋 Remaining Tasks (Require Matt's Action)

### 1. Create Sentry Project
**Action Required:** Matt needs to create a Sentry project at https://sentry.io/signup/

Steps:
1. Create free account at sentry.io
2. Create new project: "GroomGrid"
3. Platform: "Next.js"
4. Copy the DSN (Data Source Name)

### 2. Add DSN to Production Environment
**Action Required:** Add these to `/var/www/groomgrid/prod/.env.local`

```bash
# Get DSN from Sentry project settings (Project Settings → Client Keys → DSN)
SENTRY_DSN="<paste-your-sentry-dsn-here>"
NEXT_PUBLIC_SENTRY_DSN="<paste-your-sentry-dsn-here>"
SENTRY_ORG="your-org-name"
SENTRY_PROJECT="groomgrid"
```

### 3. Save DSN as Cortex Integration Secret
**Action Required:** Create SENTRY integration in Cortex for GroomGrid

```bash
curl -X POST http://localhost:3001/api/companies/cmm79fsxz00ephmk3xjtx9scd/integrations \
  -H "Content-Type: application/json" \
  -d '{
    "type": "SENTRY",
    "name": "Sentry Error Monitoring",
    "credentials": {
      "dsn": "<paste-your-sentry-dsn-here>",
      "org": "your-org-name",
      "project": "groomgrid"
    },
    "config": {
      "environment": "production",
      "alertEmail": "matt@mawsome.agency"
    }
  }'
```

### 4. Test Error Capture
**Action Required:** After deployment, test Sentry integration

```bash
# Visit test endpoint
curl https://getgroomgrid.com/api/test-sentry-error

# Should return:
# {"message":"Test error captured and sent to Sentry","errorId":"Test error from Sentry verification"}
```

Then verify the error appears in the Sentry dashboard.

### 5. Configure Email Alerts
**Action Required:** Set up email notifications in Sentry

Steps:
1. Go to Sentry project → Settings → Alerts
2. Add Matt's email: matt@mawsome.agency
3. Configure alert rules:
   - New errors (immediate)
   - High error rate (>10/min for 5 min)
   - Critical issues (immediate)

## 🔧 Known Issues (Not Blocking)

### Worktree Build Issue
**Issue:** Tailwindcss is not installing in the git worktree, causing build failures.

**Status:** NOT BLOCKING deployment
- The main repo (`/home/deployer/cortex/groomgrid-app`) builds successfully
- This is a git worktree tooling issue, not a code issue
- Production deployment uses the main repo, not the worktree

**Recommendation:** Re-create worktree or investigate worktree node_modules setup after this PR merges.

### Sentry Configuration Warnings
**Issue:** Sentry shows deprecation warnings about configuration file naming:
- `sentry.server.config.ts` should use instrumentation.ts instead
- `sentry.client.config.ts` should use instrumentation-client.ts instead

**Status:** CURRENT CONFIG WORKS
- These are deprecation warnings for Turbopack support
- Current files work fine with standard Next.js build
- Can be migrated later if Turbopack is adopted

## 📊 Acceptance Criteria Checklist

- [ ] Sentry project exists and DSN is configured in prod
- [ ] A test error throw reaches the Sentry dashboard
- [ ] Error alerts are enabled
- [ ] DSN saved as Cortex integration secret

## 📚 Documentation

See `docs/SENTRY_SETUP.md` for:
- Full setup instructions
- Configuration details
- Testing procedures
- Troubleshooting guide
- Security notes
