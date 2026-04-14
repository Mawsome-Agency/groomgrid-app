# GTM Execution Sprint — Immediate Actions

**Status:** 🚀 EXECUTION STARTING NOW
**Date:** April 14, 2026
**Deadline:** April 30, 2026 (16 days remaining)
**Goal:** 100 paying subscribers

---

## Current State

**Reality Check:**
- ✅ GTM Playbook: 100% complete (delivered April 7)
- ❌ Execution: 0% complete (ZERO activity since delivery)
- ❌ Stripe Subscriptions: 0
- ❌ Stripe Customers: 1 (Aysha, no subscription)
- 📊 GA4 Users: 55/week
- 📊 GA4 Sessions: 56/week
- 📊 Organic Sessions: 16/week

**The Problem:**
We have a comprehensive GTM playbook but NO ONE is executing it. The tracker shows all zeros. We're 16 days from deadline with 0% progress.

**The Solution:**
Execute immediately. No more planning. No more templates. Just action.

---

## What Was Just Created

All execution materials are now ready in `docs/gtm-execution/`:

1. **Facebook Engagement Posts** — 10 ready-to-post templates with DM follow-ups
2. **Reddit Engagement Plan** — 3-phase strategy with post templates
3. **Referral Program Outline** — Complete program structure with email sequences
4. **Weekly Acquisition Dashboard** — Tracking templates and automation scripts

---

## Immediate Actions (Next 24 Hours)

### TODAY (April 14) — Do These NOW:

**1. Join Facebook Groups (30 min)**
- [ ] Dog Groomers Only Forum
- [ ] The Daily Groomer
- [ ] The Everyday Pet Groomer
- [ ] Stagger joins by 2 hours

**2. Set Up Stripe Promo Code (15 min)**
```bash
# Create 50% off coupon
curl -X POST https://api.stripe.com/v1/coupons \
  -u $STRIPE_SECRET_KEY: \
  -d percent_off=50 \
  -d duration=once \
  -d name="First Month 50% Off" \
  -d max_redemptions=1000

# Create promo code
curl -X POST https://api.stripe.com/v1/promotion_codes \
  -u $STRIPE_SECRET_KEY: \
  -d coupon={COUPON_ID} \
  -d code=FIRSTHALF \
  -d max_redemptions=1000
```

**3. Create Tracking Sheet (15 min)**
- [ ] Copy template from `weekly-acquisition-dashboard.md`
- [ ] Set up Google Sheet
- [ ] Share with team

**4. Facebook Engagement (1 hour)**
- [ ] Like 10 posts in each group
- [ ] Comment on 5 posts with value (no pitches)
- [ ] Identify top contributors
- [ ] Note pain points mentioned

**5. Reddit Lurk (30 min)**
- [ ] Read top 50 posts in r/doggrooming
- [ ] Read sidebar rules
- [ ] Identify common questions
- [ ] Note top contributors

**6. Post First Facebook Value Post (15 min)**
- [ ] Use Post 1 template from `facebook-engagement-posts.md`
- [ ] Post to Dog Groomers Only Forum at 9am MT
- [ ] Post to The Daily Groomer at 11am MT
- [ ] Post to The Everyday Pet Groomer at 1pm MT

**7. DM Warm Leads (30 min)**
- [ ] DM 5 people who engaged with your post
- [ ] Use DM template from `facebook-engagement-posts.md`
- [ ] Track responses

**Total Time:** 3 hours

---

## This Week (April 14-20) — Week 1 Targets

**Daily Routine:**
- [ ] Morning: Like 10 posts, comment on 5 in each FB group
- [ ] Midday: DM 5-10 warm leads, follow up on previous DMs
- [ ] Evening: Like 5 more posts, plan tomorrow's post

**Posting Schedule:**
- [ ] Mon 4/14: Value-Add post (scheduling hack)
- [ ] Tue 4/15: Pain point question
- [ ] Wed 4/16: Poll post
- [ ] Thu 4/17: Behind-the-scenes post
- [ ] Fri 4/18: Beta tester call
- [ ] Sat 4/19: Weekend tip
- [ ] Sun 4/20: Week 1 review

**Reddit Schedule:**
- [ ] Mon-Wed 4/14-16: Lurk and learn
- [ ] Thu-Fri 4/17-18: Value comments (5-10/day)
- [ ] Sat-Sun 4/19-20: First value post

**Week 1 Targets:**
- Signups: 15
- Paid Users: 10
- FB Posts: 7
- FB DMs Sent: 30+
- Reddit Comments: 25+
- Reddit Karma: +50

---

## Next Week (April 21-27) — Week 2 Targets

**Focus:** Scale and partnerships

**Key Actions:**
- [ ] Post beta tester call in FB groups
- [ ] Share case study/social proof
- [ ] Host AMA in FB groups
- [ ] Post dedicated Reddit post about tool
- [ ] DM 20+ Instagram influencers
- [ ] Secure 2-3 influencer partnerships
- [ ] Launch referral program to early signups

**Week 2 Targets:**
- Signups: 35
- Paid Users: 25
- FB Posts: 4
- FB DMs Sent: 60+
- Influencers Secured: 2-3
- Referrals Generated: 5+

---

## Final Week (April 28-30) — Week 3 Targets

**Focus:** Urgency and final push

**Key Actions:**
- [ ] Post beta pricing ending
- [ ] Share referral stats
- [ ] Final trial expiry reminders
- [ ] DM all warm leads
- [ ] Instagram story with countdown
- [ ] Final urgency posts

**Week 3 Targets:**
- Signups: 50
- Paid Users: 35
- FB Posts: 3 (urgency-focused)
- FB DMs Sent: 80+
- Referrals Generated: 15+

---

## Channel Priority

### Primary Channels (95% of effort):

**1. Facebook Groups (40%)**
- Why: Where groomers actually hang out
- Target: 50K+ combined members
- Strategy: Value-first, then DM warm leads
- Daily time: 2 hours

**2. Influencer Partnerships (35%)**
- Why: Trusted voices in the community
- Target: 5-50K followers
- Strategy: Free access + shoutout
- Daily time: 1.5 hours

**3. Referral Program (20%)**
- Why: Leverage early adopters
- Target: Existing users
- Strategy: $50 credit per signup
- Daily time: 1 hour

### Secondary Channels (5% of effort):

**4. Reddit (3%)**
- Why: SEO value, community building
- Target: r/doggrooming (~15K)
- Strategy: Value-first, subtle mentions
- Daily time: 30 min

**5. Instagram Organic (2%)**
- Why: Visual content, brand awareness
- Target: Groomer community
- Strategy: Repurpose content
- Daily time: 15 min

---

## Daily Time Allocation

**Total Daily Time: 5 hours**

| Activity | Time | Priority |
|----------|------|----------|
| Facebook engagement | 2 hours | P1 |
| Influencer outreach | 1.5 hours | P1 |
| Referral program | 1 hour | P1 |
| Reddit engagement | 30 min | P2 |
| Instagram posting | 15 min | P2 |
| Tracking/updates | 15 min | P1 |

---

## Success Metrics

**Daily Targets:**
- Signups: 2-5/day (Week 1), 4-7/day (Week 2), 6-10/day (Week 3)
- FB DMs Sent: 5-10/day
- FB Engagement: 20+ likes/comments per post
- Reddit Karma: +5-10/day

**Weekly Targets:**
- Week 1: 15 signups, 10 paid
- Week 2: 35 signups, 25 paid
- Week 3: 50 signups, 35 paid

**Total Goal:**
- 100 signups by April 30
- 70+ paid by May 15

---

## Red Flags

**Stop and reassess if:**
- Zero signups for 3 consecutive days
- Trial-to-paid conversion < 20% after day 7
- FB DM response rate < 10%
- Reddit post gets < 5 upvotes after 24 hours
- Zero influencer responses after 20 DMs

**Pivot options:**
- Double down on winning channel
- Test different messaging
- Offer additional incentives
- Lower price point temporarily (last resort)

---

## Team Roles

**Sofia Mendoza (Strategy & Planning):**
- Execute Facebook group strategy
- DM warm leads
- Track daily metrics
- Post daily updates

**Elena Yazzie (Content & Editorial):**
- Create additional post templates as needed
- Write influencer outreach scripts
- Draft email sequences

**Atlas Reeves (SEO):**
- Monitor Reddit engagement
- Identify SEO opportunities
- Track organic traffic

**Ray Nakamura (Analytics & Data):**
- Set up tracking dashboard
- Monitor conversion metrics
- Identify red flags

**Jesse Korbin (Engineering):**
- Ensure platform stability
- Quick bug fixes
- Feature request capture

---

## Quick Reference

**Documents Created:**
- `facebook-engagement-posts.md` — 10 post templates + DM scripts
- `reddit-engagement-plan.md` — 3-phase Reddit strategy
- `referral-program-outline.md` — Complete referral program
- `weekly-acquisition-dashboard.md` — Tracking templates

**Key Links:**
- GTM Playbook: `docs/gtm-sprint-execution-guide.md`
- GTM Tracker: `docs/gtm-tracker.csv`
- Team Briefing: `docs/gtm_team_briefing.md`

**Daily Update Slack Channel:** #groomgrid-gtm

---

## Next Steps

**RIGHT NOW:**
1. Join the 3 Facebook groups
2. Set up Stripe promo code
3. Create tracking sheet
4. Start Facebook engagement
5. Post first value post

**BY END OF DAY:**
1. DM 5 warm leads
2. Update tracking sheet
3. Post daily update to Slack

**BY END OF WEEK:**
1. 7 Facebook posts
2. 30+ FB DMs sent
3. 25+ Reddit comments
4. 15 signups
5. 10 paid users

---

## Motivation

**We have 16 days.**

**We need 100 subscribers.**

**That's 6.25 subscribers per day.**

**We have a plan. We have templates. We have targets.**

**The only thing missing is execution.**

**Let's go.** 🚀

---

*Created: April 14, 2026*
*Owner: Sofia Mendoza, Strategy & Planning Lead*
*Status: EXECUTION STARTING NOW*
