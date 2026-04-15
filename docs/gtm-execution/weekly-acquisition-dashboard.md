# Weekly Acquisition Dashboard — Tracking Plan

**Purpose:** Track GTM execution progress toward 100 paying subscribers goal
**Timeline:** April 14-30, 2026
**Update Frequency:** Daily (5pm MT)

---

## Dashboard Overview

### Primary Goal
**100 paying subscribers by April 30, 2026**

### Current Baseline (April 14, 2026)
- Stripe subscriptions: 0
- Stripe customers: 1
- GA4 users (7-day): 55
- GA4 sessions (7-day): 56
- Organic sessions (7-day): 16

### Target Breakdown
| Week | Dates | Target Signups | Target Paid | Cumulative Signups | Cumulative Paid |
|------|-------|----------------|-------------|-------------------|-----------------|
| 1 | Apr 14-20 | 15 | 10 | 15 | 10 |
| 2 | Apr 21-27 | 35 | 25 | 50 | 35 |
| 3 | Apr 28-30 | 50 | 35 | 100 | 70 |

---

## Daily Tracking Template

### Google Sheet Structure

**Sheet 1: Daily Summary**
| Date | Day | Signups | Trial Users | Paid Users | Churned | Net Paid | Goal Progress | Notes |
|------|-----|---------|-------------|------------|---------|----------|---------------|-------|
| 4/14 | Mon | | | | | | 0% | |
| 4/15 | Tue | | | | | | 0% | |
| 4/16 | Wed | | | | | | 0% | |
| 4/17 | Thu | | | | | | 0% | |
| 4/18 | Fri | | | | | | 0% | |
| 4/19 | Sat | | | | | | 0% | |
| 4/20 | Sun | | | | | | 0% | |

**Sheet 2: Channel Breakdown**
| Date | FB Groups | FB DMs | Reddit | Instagram | Influencers | Referrals | Organic | Other | Total |
|------|-----------|--------|--------|-----------|-------------|-----------|---------|-------|-------|
| 4/14 | | | | | | | | | |
| 4/15 | | | | | | | | | |
| 4/16 | | | | | | | | | |

**Sheet 3: Facebook Engagement**
| Date | Group | Post Type | Likes | Comments | Shares | DMs Sent | DM Replies | Signups |
|------|-------|-----------|-------|----------|--------|----------|------------|---------|
| 4/14 | Dog Groomers Only | Value-Add | | | | | | |
| 4/14 | The Daily Groomer | Value-Add | | | | | | |
| 4/14 | The Everyday Pet Groomer | Value-Add | | | | | | |

**Sheet 4: Reddit Engagement**
| Date | Action | Karma | Comments | Upvotes | DMs | Signups |
|------|--------|-------|----------|---------|-----|---------|
| 4/14 | Lurk/learn | 0 | 0 | 0 | 0 | 0 |
| 4/15 | 5 value comments | | | | | |

**Sheet 5: Referral Tracking**
| Date | Referrer | Referral Code | Clicks | Signups | Trials | Conversions | Credits Earned |
|------|----------|---------------|--------|---------|--------|-------------|----------------|
| 4/14 | | | | | | | |

**Sheet 6: Weekly Summary**
| Week | Dates | Signups | Trials | Paid | Churn | Net Paid | Goal | Progress |
|------|-------|---------|--------|------|-------|----------|------|----------|
| 1 | Apr 14-20 | | | | | | 15 | 0% |
| 2 | Apr 21-27 | | | | | | 35 | 0% |
| 3 | Apr 28-30 | | | | | | 50 | 0% |

---

## Data Sources & Queries

### Stripe Data

**Get Daily Signups:**
```bash
# Get customers created today
curl -s "https://api.stripe.com/v1/customers?created[gte]=$(date -u -d 'today 00:00:00' +%s)&limit=100" \
  -u "$STRIPE_SECRET_KEY:" | jq '.data | length'
```

**Get Active Subscriptions:**
```bash
# Get active subscriptions
curl -s "https://api.stripe.com/v1/subscriptions?status=active&limit=100" \
  -u "$STRIPE_SECRET_KEY:" | jq '.data | length'
```

**Get Trial Users:**
```bash
# Get trial subscriptions
curl -s "https://api.stripe.com/v1/subscriptions?status=trialing&limit=100" \
  -u "$STRIPE_SECRET_KEY:" | jq '.data | length'
```

**Get Paid Conversions Today:**
```bash
# Get subscriptions created today that are active
curl -s "https://api.stripe.com/v1/subscriptions?status=active&limit=100" \
  -u "$STRIPE_SECRET_KEY:" | jq '.data[] | select(.created >= '$(date -u -d 'today 00:00:00' +%s)') | .id'
```

### GA4 Data

**Get Today's Users:**
```bash
# GA4 report for today's users
curl -s -X POST "https://analyticsdata.googleapis.com/v1beta/properties/531101704:runReport" \
  -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dateRanges": [{"startDate": "today", "endDate": "today"}],
    "metrics": [{"name": "activeUsers"}]
  }'
```

**Get Today's Sessions:**
```bash
# GA4 report for today's sessions
curl -s -X POST "https://analyticsdata.googleapis.com/v1beta/properties/531101704:runReport" \
  -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dateRanges": [{"startDate": "today", "endDate": "today"}],
    "metrics": [{"name": "sessions"}]
  }'
```

**Get Signups by Channel:**
```bash
# GA4 report with UTM parameters
curl -s -X POST "https://analyticsdata.googleapis.com/v1beta/properties/531101704:runReport" \
  -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dateRanges": [{"startDate": "today", "endDate": "today"}],
    "dimensions": [{"name": "utmSource"}],
    "metrics": [{"name": "activeUsers"}]
  }'
```

### Production Database Queries

**Get Today's Signups:**
```sql
SELECT 
  COUNT(*) as signups,
  COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) as today_signups
FROM users;
```

**Get Trial Users:**
```sql
SELECT 
  COUNT(*) as trial_users,
  COUNT(CASE WHEN trial_ends_at > NOW() THEN 1 END) as active_trials
FROM subscriptions
WHERE status = 'trialing';
```

**Get Paid Users:**
```sql
SELECT 
  COUNT(*) as paid_users,
  COUNT(CASE WHERE status = 'active' THEN 1 END) as active_paid
FROM subscriptions
WHERE status = 'active';
```

**Get Signups by Channel:**
```sql
SELECT 
  COALESCE(utm_source, 'organic') as channel,
  COUNT(*) as signups
FROM users
WHERE created_at >= CURRENT_DATE
GROUP BY channel
ORDER BY signups DESC;
```

---

## Daily Update Process

### 5pm MT Daily Routine

**Step 1: Pull Data (5 min)**
```bash
# Run all data collection scripts
./scripts/collect-daily-metrics.sh
```

**Step 2: Update Google Sheet (5 min)**
- Open the tracking sheet
- Update today's row with new data
- Add notes on what worked/what didn't

**Step 3: Calculate Progress (2 min)**
- Update goal progress percentage
- Compare to daily targets
- Note any red flags

**Step 4: Share with Team (3 min)**
- Post daily update in Slack
- Highlight wins and blockers
- Flag anything needing attention

**Total Time:** 15 minutes

---

## Daily Slack Update Template

```
📊 GroomGrid GTM Daily Update — [Date]

**Today's Numbers:**
- Signups: [X] (target: [Y])
- Trial Users: [X] (target: [Y])
- Paid Users: [X] (target: [Y])
- Net Paid: [X]

**Goal Progress:** [X]% of 100 subscribers

**Channel Breakdown:**
- Facebook Groups: [X] signups
- Facebook DMs: [X] signups
- Reddit: [X] signups
- Instagram: [X] signups
- Influencers: [X] signups
- Referrals: [X] signups
- Organic: [X] signups

**🔥 What's Working:**
- [Channel/ tactic] is performing well
- [Specific post/DM] got great engagement
- [Influencer] responded positively

**❌ What's Not:**
- [Channel/ tactic] isn't converting
- [Post type] got low engagement
- [Outreach method] isn't getting responses

**🚀 Blockers:**
- [Any blockers preventing progress]

**🔄 Tomorrow's Focus:**
- [Primary focus for tomorrow]
- [Secondary focus]
- [Any adjustments needed]

**Cumulative Stats:**
- Total Signups: [X]
- Total Paid: [X]
- Days Remaining: [X]
- Daily Run Rate Needed: [X]
```

---

## Weekly Review Template

### Friday 4pm MT Weekly Review

**Week Summary:**
```
📊 GroomGrid GTM Weekly Review — Week [X] ([Dates])

**Weekly Results:**
- Signups: [X] (target: [Y], [Z]% of goal)
- Trial Users: [X]
- Paid Users: [X] (target: [Y], [Z]% of goal)
- Churned: [X]
- Net Paid: [X]

**Goal Progress:** [X]% of 100 subscribers

**Channel Performance:**
| Channel | Signups | Conversion Rate | Notes |
|---------|---------|-----------------|-------|
| Facebook Groups | [X] | [X]% | |
| Facebook DMs | [X] | [X]% | |
| Reddit | [X] | [X]% | |
| Instagram | [X] | [X]% | |
| Influencers | [X] | [X]% | |
| Referrals | [X] | [X]% | |
| Organic | [X] | [X]% | |

**🔥 Top Performers:**
1. [Channel/ tactic] — [X] signups, [X]% conversion
2. [Channel/ tactic] — [X] signups, [X]% conversion
3. [Channel/ tactic] — [X] signups, [X]% conversion

**❌ Underperformers:**
1. [Channel/ tactic] — [X] signups, [X]% conversion (target: [Y]%)
2. [Channel/ tactic] — [X] signups, [X]% conversion (target: [Y]%)

**Key Learnings:**
- [Learning 1]
- [Learning 2]
- [Learning 3]

**Pivots Needed:**
- [Pivot 1] — [reason]
- [Pivot 2] — [reason]

**Next Week's Plan:**
- [Primary focus]
- [Secondary focus]
- [Any changes to strategy]

**Cumulative Stats:**
- Total Signups: [X]
- Total Paid: [X]
- Days Remaining: [X]
- Run Rate Needed: [X]/day
```

---

## Red Flags & Triggers

### Immediate Action Required (Red Flags)

**If ANY of these happen, pause and reassess within 24 hours:**

1. **Zero signups for 3 consecutive days**
   - Action: Review all channels, test messaging, consider pivot

2. **Trial-to-paid conversion < 20% after day 7**
   - Action: Survey trial users, identify friction points, fix onboarding

3. **Facebook DM response rate < 10%**
   - Action: Revise DM templates, test different approaches

4. **Reddit post gets < 5 upvotes after 24 hours**
   - Action: Delete post, revise approach, try different topic

5. **Zero influencer responses after 20 DMs**
   - Action: Revise outreach template, try different influencer profile

### Warning Signs (Yellow Flags)

**Monitor these closely, adjust if trend continues:**

1. **Signups < 50% of daily target for 2+ days**
   - Action: Increase effort on top-performing channel

2. **Single channel accounting for > 80% of signups**
   - Action: Diversify, reduce dependency

3. **High churn (> 20%) in first week**
   - Action: Improve onboarding, fix bugs

4. **Referral program generating < 5% of signups**
   - Action: Improve referral incentives, make sharing easier

---

## Success Metrics by Week

### Week 1 (April 14-20) — Foundation

**Targets:**
- Signups: 15
- Paid Users: 10
- Trial-to-Paid Conversion: 67%

**Channel Targets:**
- Facebook Groups: 5 signups
- Facebook DMs: 4 signups
- Reddit: 2 signups
- Instagram: 2 signups
- Influencers: 1 signup
- Referrals: 1 signup

**Engagement Targets:**
- Facebook posts: 3
- Facebook likes: 50+
- Facebook comments: 20+
- Facebook DMs sent: 30+
- Reddit comments: 25+
- Reddit karma: +50

**Success Criteria:**
- ✅ 10+ signups
- ✅ 5+ paid users
- ✅ 50%+ trial-to-paid conversion
- ✅ At least 2 channels generating signups

### Week 2 (April 21-27) — Scale

**Targets:**
- Signups: 35
- Paid Users: 25
- Trial-to-Paid Conversion: 71%

**Channel Targets:**
- Facebook Groups: 12 signups
- Facebook DMs: 8 signups
- Reddit: 5 signups
- Instagram: 4 signups
- Influencers: 3 signups
- Referrals: 3 signups

**Engagement Targets:**
- Facebook posts: 4
- Facebook likes: 100+
- Facebook comments: 40+
- Facebook DMs sent: 60+
- Reddit comments: 50+
- Reddit karma: +100

**Success Criteria:**
- ✅ 25+ signups
- ✅ 15+ paid users
- ✅ 60%+ trial-to-paid conversion
- ✅ At least 3 channels generating signups
- ✅ First influencer partnership secured

### Week 3 (April 28-30) — Final Push

**Targets:**
- Signups: 50
- Paid Users: 35
- Trial-to-Paid Conversion: 70%

**Channel Targets:**
- Facebook Groups: 18 signups
- Facebook DMs: 12 signups
- Reddit: 7 signups
- Instagram: 5 signups
- Influencers: 4 signups
- Referrals: 4 signups

**Engagement Targets:**
- Facebook posts: 3 (urgency-focused)
- Facebook likes: 150+
- Facebook comments: 60+
- Facebook DMs sent: 80+
- Reddit comments: 75+
- Reddit karma: +150

**Success Criteria:**
- ✅ 40+ signups
- ✅ 25+ paid users
- ✅ 60%+ trial-to-paid conversion
- ✅ At least 4 channels generating signups
- ✅ 2+ influencer partnerships active
- ✅ Referral program generating 10%+ of signups

---

## Dashboard Visualization

### Recommended Charts

**1. Daily Signups vs. Goal**
- Line chart showing daily signups vs. daily target
- Highlight days above/below target

**2. Cumulative Progress**
- Area chart showing cumulative signups vs. goal line
- Show percentage complete

**3. Channel Breakdown**
- Stacked bar chart showing signups by channel
- Identify top performers

**4. Conversion Funnel**
- Funnel chart: Engagement → DMs → Signups → Trials → Paid
- Show conversion rates at each stage

**5. Trial-to-Paid Conversion**
- Line chart showing daily trial-to-paid conversion rate
- Target line at 70%

**6. Referral Performance**
- Bar chart showing referrals by referrer
- Track top referrers

---

## Automation Setup

### Daily Data Collection Script

```bash
#!/bin/bash
# scripts/collect-daily-metrics.sh

DATE=$(date +%Y-%m-%d)
OUTPUT_DIR="./metrics/daily"
mkdir -p $OUTPUT_DIR

# Stripe data
echo "Collecting Stripe data..."
curl -s "https://api.stripe.com/v1/customers?limit=100" \
  -u "$STRIPE_SECRET_KEY:" > $OUTPUT_DIR/stripe_customers_$DATE.json

curl -s "https://api.stripe.com/v1/subscriptions?limit=100" \
  -u "$STRIPE_SECRET_KEY:" > $OUTPUT_DIR/stripe_subscriptions_$DATE.json

# GA4 data
echo "Collecting GA4 data..."
curl -s -X POST "https://analyticsdata.googleapis.com/v1beta/properties/531101704:runReport" \
  -H "Authorization: Bearer $GOOGLE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dateRanges": [{"startDate": "today", "endDate": "today"}],
    "metrics": [{"name": "activeUsers"}, {"name": "sessions"}]
  }' > $OUTPUT_DIR/ga4_daily_$DATE.json

echo "Data collection complete!"
```

### Slack Notification Script

```bash
#!/bin/bash
# scripts/send-daily-update.sh

# Calculate metrics
SIGNUPS=$(jq '.data | length' metrics/daily/stripe_customers_$(date +%Y-%m-%d).json)
PAID=$(jq '[.data[] | select(.status == "active")] | length' metrics/daily/stripe_subscriptions_$(date +%Y-%m-%d).json)
PROGRESS=$((PAID * 100 / 100))

# Send to Slack
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d "{
    \"text\": \"📊 GroomGrid GTM Daily Update — $(date +%Y-%m-%d)\",
    \"blocks\": [
      {
        \"type\": \"section\",
        \"text\": {
          \"type\": \"mrkdwn\",
          \"text\": \"*Today's Numbers:*\n• Signups: $SIGNUPS\n• Paid Users: $PAID\n• Goal Progress: $PROGRESS%\"
        }
      }
    ]
  }"
```

---

## Implementation Checklist

**Setup:**
- [ ] Create Google Sheet with all tabs
- [ ] Set up data collection scripts
- [ ] Configure Slack webhook
- [ ] Create daily update template
- [ ] Create weekly review template
- [ ] Set up automation scripts

**Daily:**
- [ ] Run data collection at 5pm
- [ ] Update Google Sheet
- [ ] Calculate progress
- [ ] Post Slack update
- [ ] Note red flags

**Weekly:**
- [ ] Complete weekly review on Friday
- [ ] Share with team
- [ ] Identify pivots needed
- [ ] Plan next week

**Ongoing:**
- [ ] Monitor red flags daily
- [ ] Adjust strategy based on data
- [ ] Celebrate wins
- [ ] Learn from failures

---

*Created: April 14, 2026*
*Owner: Sofia Mendoza, Strategy & Planning Lead*
