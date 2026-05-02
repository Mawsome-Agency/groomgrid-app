# UTM Tracking Fix for Beta Launch

**Author:** Sofia Mendoza, Strategy & Planning Lead
**Date:** May 2, 2026
**Priority:** HIGH — Fixes tracking gap before May 8 launch

---

## The Problem

The beta launch execution plan uses `?source=beta` for all beta links:
- https://getgroomgrid.com/signup?source=beta

BUT the signup page code (`src/app/signup/page.tsx`) only captures standard UTM parameters:
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

The `source` parameter is NOT captured. This means beta signups won't be attributed correctly.

## The Fix (Two Options)

### Option A: Change all beta links to use UTM format (SIMPLER — recommended)

All beta links should use:
```
https://getgroomgrid.com/signup?utm_source=beta&utm_medium=community&utm_campaign=founding_groomer_2026
```

| Channel | Link |
|---------|------|
| Reddit | `?utm_source=beta&utm_medium=reddit&utm_campaign=founding_groomer_2026` |
| Facebook Group | `?utm_source=beta&utm_medium=facebook&utm_campaign=founding_groomer_2026` |
| Facebook DM | `?utm_source=beta&utm_medium=fb_dm&utm_campaign=founding_groomer_2026` |
| LinkedIn | `?utm_source=beta&utm_medium=linkedin&utm_campaign=founding_groomer_2026` |
| Local/NM | `?utm_source=beta&utm_medium=local&utm_campaign=founding_groomer_2026` |

This works with EXISTING code — no engineering changes needed.

### Option B: Update signup page to also capture `source` parameter

Add `source` parameter parsing alongside UTM parameters. Requires code change + deploy.

**Recommendation:** Use Option A. It's zero-code, works with existing tracking, and gives us more granular channel data.

## Updated Beta Links

All copy in the beta launch execution plan should be updated from:
```
getgroomgrid.com/signup?source=beta
```
to:
```
getgroomgrid.com/signup?utm_source=beta&utm_medium=reddit&utm_campaign=founding_groomer_2026
```
(channel varies by platform)

## Action Items

1. **Sofia** — Update all beta launch copy to use UTM-format links
2. **Elena** — Review updated copy for brand voice
3. **Jesse** — Verify UTM parameters pass through the entire signup → checkout flow
4. **Ray** — Set up GA4 segments for each utm_medium value

