# GroomGrid Beta Program — Master Coordination Checklist

**Owner:** Sofia Mendoza, Strategy & Planning Lead
**Timeline:** May 2-14, 2026
**Supports Rock:** Get first 100 paying subscribers

---

## Gate 1: Funnel Verified (Deadline: May 3)

**Owner:** Jesse Korbin (Engineering Lead)
**Status:** ⬜ PENDING — Funnel verification mission is BLOCKED

- [ ] Fresh test signup → email verification → plan selection → checkout completes
- [ ] BETA50 promo code applies correctly in Stripe checkout (50% off)
- [ ] ?source=beta UTM parameter passes through signup and appears in GA4
- [ ] Session persists for 7+ days (not 30-min timeout)
- [ ] Verification email links to getgroomgrid.com (not app subdomain)
- [ ] Checkout success page fires GA4 `purchase` event
- [ ] Failed checkout shows error (not blank page)

**Action needed:** Create focused dev pipeline task for Jesse to verify and fix funnel by May 3.

---

## Gate 2: Community Trust Built (Deadline: May 7)

**Owner:** Carlos (Social & Community Agent)
**Status:** 🔄 IN PROGRESS — Week 1 engagement mission active

- [ ] Joined 3+ Facebook groomer groups
- [ ] Posted 15+ genuine comments across groups (zero product mentions)
- [ ] Received replies/likes on comments (recognized as helpful)
- [ ] Identified 10+ warm leads with scheduling/payment/no-show pain points
- [ ] Reddit r/doggrooming engagement: 3-5 comments, 1 value-post

**My role:** Monitor progress, ensure no premature product mentions before May 8.

---

## Gate 3: Beta Infrastructure Ready (Deadline: May 7)

**Owner:** Sofia Mendoza (Strategy & Planning Lead)
**Status:** 🔄 IN PROGRESS

- [ ] Beta signup URL working: https://getgroomgrid.com/signup?source=beta ✅ (returns 200)
- [ ] BETA50 coupon active in Stripe ✅ (50% off, 200 max redemptions)
- [ ] FOUNDING_MEMBER_FREE coupon active ✅ (100% off, 25 max, for special invites)
- [ ] Welcome email template written ✅ (`01-welcome-email.md`)
- [ ] Setup guide written ✅ (`02-setup-guide.md`)
- [ ] Feedback form spec written ✅ (`03-feedback-form.md`)
- [ ] Beta tracker spreadsheet template ✅ (`04-beta-tracker.md`)
- [ ] Onboarding call script ✅ (`05-onboarding-call-script.md`)
- [ ] Iteration report template ✅ (`06-iteration-report-template.md`)
- [ ] Onboarding call scheduling link created ⬜ (Calendly or Google Calendar)
- [ ] Google Forms weekly pulse survey created ⬜
- [ ] Google Sheets tracker created ⬜
- [ ] Email templates loaded in Resend/SendGrid ⬜ (need Jesse's help)

---

## Day-by-Day Execution: May 8-14

### Thursday, May 8 — LAUNCH DAY

**Morning (7:00-9:00 AM MT):**
- [ ] Post Reddit thread in r/doggrooming (use approved copy from beta-launch doc)
- [ ] Set "Professional Groomer" flair if not already set
- [ ] Monitor Reddit thread for 2 hours, reply within 30 min

**Afternoon (1:00 PM MT):**
- [ ] Post beta announcement in best-performing Facebook Group
- [ ] Check group rules allow "looking for testers" posts

**Evening:**
- [ ] Log all signups in beta tracker spreadsheet
- [ ] Send welcome emails to Day 1 signups within 1 hour

### Friday, May 9 — DM OUTREACH

**Morning:**
- [ ] Send personal DMs to 10 warm leads from Facebook (reference specific posts)
- [ ] Use DM template from beta-launch doc — personalize first line every time

**Afternoon:**
- [ ] Send personal DMs to 10 more warm leads
- [ ] Post beta announcement in Facebook Group #2

**Evening:**
- [ ] Reply to all Reddit thread comments
- [ ] Follow up on DM responses
- [ ] Log all signups, send welcome emails

### Saturday, May 10 — EXPAND

**Morning:**
- [ ] Post beta announcement in Facebook Group #3
- [ ] Cross-post to r/PetGrooming if r/doggrooming went well

**Afternoon:**
- [ ] Follow up with interested-but-not-signed leads
- [ ] Respond to all new comments on posts

### Monday, May 12 — LOCAL + LINKEDIN

- [ ] Share beta in local Albuquerque/NM groomer networks
- [ ] Post on LinkedIn (personal profile) about building GroomGrid
- [ ] DM LinkedIn connections who are groomers or know groomers
- [ ] Send Week 1 pulse survey to all onboarded testers

### Tuesday, May 13 — FOLLOW UP

- [ ] Second DM to interested-but-not-signed leads
- [ ] Answer all questions on Reddit/Facebook threads
- [ ] Offer 5-minute calls to anyone with questions
- [ ] Begin scheduling onboarding calls for May 12-14

### Wednesday, May 14 — CLOSE APPLICATIONS

- [ ] Post "Last day to join the beta!" in Facebook groups
- [ ] Review all applications
- [ ] Select 12-16 testers (prioritize: mobile > salon > cat specialist)
- [ ] Send welcome emails to selected testers
- [ ] Schedule onboarding calls for May 15-16
- [ ] Begin filling in iteration report with Week 0 data

---

## Cross-Department Coordination

### Engineering (Jesse Korbin)
- **By May 3:** Verify funnel works end-to-end (Gate 1)
- **By May 7:** Ensure email system can send beta welcome emails
- **Ongoing:** Fix any bugs reported by beta testers (P0 priority)
- **May 12-14:** Available for urgent fixes if beta testers hit blockers

### Content & Editorial (Elena Yazzie)
- **By May 7:** Review beta copy for brand voice consistency
- **May 8:** Standby to create rapid response content if beta post goes viral
- **Ongoing:** Help draft survey follow-up emails if needed

### SEO (Atlas Reeves)
- **By May 7:** Ensure /signup page is indexed and optimized for "grooming software" queries
- **Ongoing:** Monitor search traffic from beta-related content

### Analytics (Ray Nakamura)
- **By May 3:** Verify GA4 events track correctly for beta funnel
- **May 8-14:** Daily dashboard of beta signup metrics
- **May 15:** Full Week 0 analytics report for iteration report

---

## Key Metrics Dashboard (Update Daily May 8-14)

| Metric | May 8 | May 9 | May 10 | May 11 | May 12 | May 13 | May 14 |
|--------|-------|-------|--------|-------|--------|--------|--------|
| Total signups | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Email verified | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Onboarded (call done) | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Day 1 active | — | 0 | 0 | 0 | 0 | 0 | 0 |
| NPS (running avg) | — | — | — | — | — | — | — |
| Bugs reported | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Feature requests | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Reddit upvotes | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| FB group responses | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

