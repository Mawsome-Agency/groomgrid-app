# GroomGrid Referral Program — Early Adopter Edition

**Target:** First 100 subscribers
**Timeline:** April 14-30, 2026
**Budget:** $500 in referral credits (backend cost)

---

## Program Structure

### The Offer

**For Referrers (Current Users):**
- $50 account credit per successful signup
- Credit applied after referred user completes 14-day trial and converts to paid
- Unlimited referrals — no cap on earnings
- Credits never expire
- Can be used for any GroomGrid subscription tier

**For New Signups (Referred Users):**
- 50% off first month ($14.50 instead of $29 for Solo tier)
- Applied automatically via promo code: FIRSTHALF
- Can be combined with beta pricing
- 14-day free trial still applies

### Example Scenarios

**Scenario A: Solo Groomer Referring 3 Friends**
- Referrer earns: 3 × $50 = $150 in credits
- Each friend gets: 50% off first month ($14.50 savings)
- Referrer's next 5 months are free ($29 × 5 = $145, covered by $150 credit)

**Scenario B: Salon Owner Referring 10 Peers**
- Referrer earns: 10 × $50 = $500 in credits
- Each peer gets: 50% off first month
- Referrer's next 6 months are free ($79 × 6 = $474, covered by $500 credit)

---

## Technical Implementation

### Stripe Configuration

**Step 1: Create the Coupon**
```bash
curl -X POST https://api.stripe.com/v1/coupons \
  -u $STRIPE_SECRET_KEY: \
  -d percent_off=50 \
  -d duration=once \
  -d name="First Month 50% Off" \
  -d max_redemptions=1000
```

**Step 2: Create the Promo Code**
```bash
curl -X POST https://api.stripe.com/v1/promotion_codes \
  -u $STRIPE_SECRET_KEY: \
  -d coupon={COUPON_ID_FROM_STEP_1} \
  -d code=FIRSTHALF \
  -d max_redemptions=1000
```

**Step 3: Referral URL Structure**
```
https://getgroomgrid.com/signup?ref={referral_code}&promo=FIRSTHALF
```

**Step 4: Customer Metadata Tracking**
```json
{
  "referral_code": "JANE123",
  "referred_by": "jane@example.com",
  "referred_by_customer_id": "cus_abc123",
  "promo_used": "FIRSTHALF",
  "referral_date": "2026-04-14"
}
```

### Database Schema (if needed)

```sql
-- Referrals table
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_customer_id VARCHAR(255) NOT NULL,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  referred_customer_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- pending, trial, converted, expired
  created_at TIMESTAMP DEFAULT NOW(),
  converted_at TIMESTAMP,
  credits_earned DECIMAL(10,2) DEFAULT 0,
  credits_applied BOOLEAN DEFAULT FALSE
);

-- Index for lookups
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_customer_id);
```

---

## Referral Code Generation

### Format Options

**Option A: Simple (Recommended)**
- Format: First 3 letters of name + 3 random digits
- Example: SOF123, JAN456, MAR789
- Pros: Easy to remember, looks professional
- Cons: Could collide (need uniqueness check)

**Option B: UUID-based**
- Format: Short UUID (first 8 characters)
- Example: a1b2c3d4, e5f6g7h8
- Pros: Guaranteed unique, no collisions
- Cons: Harder to remember, looks technical

**Option C: Custom**
- Format: User chooses their code
- Example: GROOMJANE, SARAHSGROOM
- Pros: Personal, memorable
- Cons: Need validation, could be inappropriate

### Generation Code (Option A)

```javascript
function generateReferralCode(name) {
  // Take first 3 letters, uppercase
  const prefix = name.substring(0, 3).toUpperCase();
  
  // Generate 3 random digits
  const suffix = Math.floor(Math.random() * 900) + 100;
  
  return prefix + suffix;
}

// Example usage
const code = generateReferralCode("Sofia"); // "SOF123"
```

---

## Email Sequence for Referrers

### Email 1: Welcome + Referral Link (Day 1)
**Subject:** Want $50 credit? Refer a fellow groomer!

```
Hey [Name],

Thanks for trying GroomGrid! 🐕

I hope you're finding it helpful for your grooming business.

Do you know other groomers who'd benefit from easier scheduling and automatic payment reminders?

**Here's the deal:**
For every friend you refer who signs up, you'll get $50 in account credit — and they'll get 50% off their first month.

**Your unique referral link:**
https://getgroomgrid.com/signup?ref={REFERRAL_CODE}&promo=FIRSTHALF

**How to share it:**
- Post it in Facebook groomer groups
- DM it to friends
- Share it on Instagram
- Text it to fellow groomers

**What you earn:**
- $50 credit per signup
- Unlimited referrals
- Credits never expire
- Use for any subscription tier

**What they get:**
- 50% off first month
- 14-day free trial
- All the same great features

Thanks for being an early supporter and helping other groomers save time!

Best,
Sofia
Founder, GroomGrid
```

### Email 2: Reminder + Social Proof (Day 7)
**Subject:** Quick reminder: Your referral link + early results

```
Hey [Name],

Just wanted to remind you about your referral link — it's an easy way to earn credits while helping fellow groomers save time!

**Your link:**
https://getgroomgrid.com/signup?ref={REFERRAL_CODE}&promo=FIRSTHALF

**Early results:**
So far, [X] people have clicked your link and [Y] have signed up!

**What other referrers are saying:**
"Shared my link in my local groomer Facebook group and got 3 signups in 2 days. That's $150 in credits!" — Jane M.

"DMed it to 5 friends I groom with. 2 signed up already. Easy $100." — Sarah T.

**Tips for more referrals:**
- Share in Facebook groups (with permission)
- Post on Instagram with your grooming work
- Text fellow groomers directly
- Mention it when chatting about business struggles

Keep sharing and earning!

Best,
Sofia
```

### Email 3: Success Story Request (Day 14)
**Subject:** Can I ask a favor? (plus your referral stats)

```
Hey [Name],

Quick update on your referrals:

**Your stats:**
- Clicks: [X]
- Signups: [Y]
- Credits earned: $[Z]

**The favor:**
I'm working hard to make GroomGrid the best tool for groomers, and I'd love to get more people trying it out.

Would you be willing to share your referral link with one fellow groomer you think would benefit?

Even just one share would help a ton — and you'd earn $50 credit if they sign up!

**Your link:**
https://getgroomgrid.com/signup?ref={REFERRAL_CODE}&promo=FIRSTHALF

**Also:**
If you've been using GroomGrid and have a success story to share, I'd love to hear it! 

How has it helped your business? What's your favorite feature?

Your story could inspire other groomers to try it out (and earn you more credits 😉).

Thanks for your support!

Best,
Sofia
```

### Email 4: Credit Applied Notification (When referral converts)
**Subject:** You just earned $50 in credits! 🎉

```
Hey [Name],

Great news! 

Someone you referred just completed their trial and converted to a paid subscription.

**You earned:** $50 in account credit

**Your current balance:** $[TOTAL] in credits

**How to use your credits:**
Your next [X] month(s) are on us! Credits will be automatically applied to your next invoice.

**Keep sharing:**
Your referral link still works:
https://getgroomgrid.com/signup?ref={REFERRAL_CODE}&promo=FIRSTHALF

Every signup earns you another $50. No cap!

Thanks for helping grow the GroomGrid community!

Best,
Sofia
```

---

## Landing Page Copy

### Referral Program Landing Page
**URL:** https://getgroomgrid.com/referral

```
# Refer a Groomer, Earn $50

Help fellow groomers save time — and get rewarded.

## How It Works

### 1. Share Your Link
Get your unique referral link and share it with fellow groomers.

### 2. They Sign Up
Your friends get 50% off their first month of GroomGrid.

### 3. You Earn $50
For every signup that converts, you get $50 in account credit.

## The Rewards

**For You:**
- $50 credit per successful signup
- Unlimited referrals
- Credits never expire
- Use for any subscription tier

**For Them:**
- 50% off first month
- 14-day free trial
- All features included

## Your Referral Link

[REFERRAL LINK INPUT FIELD]

[GENERATE LINK BUTTON]

## Share the Love

[SHARE TO FACEBOOK BUTTON]
[SHARE TO TWITTER BUTTON]
[COPY LINK BUTTON]

## Frequently Asked Questions

**Q: How do I get my referral link?**
A: Sign up for GroomGrid and you'll get a unique referral link in your dashboard and welcome email.

**Q: When do I get my credits?**
A: Credits are applied after the person you referred completes their 14-day trial and converts to a paid subscription.

**Q: Is there a limit on referrals?**
A: No! Refer as many people as you want and earn $50 for each one.

**Q: Do credits expire?**
A: No, your credits never expire and can be used for any subscription tier.

**Q: Can I combine referral credits with other discounts?**
A: Yes! Referral credits stack with any other promotions.

**Q: What if someone signs up but doesn't convert?**
A: Unfortunately, credits are only awarded for paid conversions. But you can always encourage them to give it a try!

## Start Referring Today

[GET YOUR LINK BUTTON]
```

---

## Social Media Share Templates

### Facebook Post Template
```
Hey fellow groomers! 🐕

I've been using GroomGrid for my grooming business and it's been a game changer for scheduling and payments.

If you want to try it, use my link for 50% off your first month:
https://getgroomgrid.com/signup?ref={REFERRAL_CODE}&promo=FIRSTHALF

It's helped me save hours every week on admin work. Highly recommend!

#doggrooming #groomingbusiness #groomersoftware
```

### Instagram Post Template
```
[IMAGE: You grooming a dog, or your grooming setup]

Saved 5 hours this week thanks to better scheduling! 🙌

If you're a groomer tired of chasing payments and double-bookings, check out GroomGrid.

Use my link for 50% off your first month:
https://getgroomgrid.com/signup?ref={REFERRAL_CODE}&promo=FIRSTHALF

#doggroomer #groominglife #smallbiztools
```

### Twitter/X Post Template
```
Fellow groomers: Stop chasing payments. Let automation handle it.

I've been using GroomGrid and it's saved me hours every week.

Get 50% off your first month with my link:
https://getgroomgrid.com/signup?ref={REFERRAL_CODE}&promo=FIRSTHALF

#doggrooming #smallbiz
```

### LinkedIn Post Template
```
As a small business owner in the pet grooming industry, I know how valuable time is.

I recently started using GroomGrid for scheduling and payment management, and it's been transformative.

If you're in the grooming business or know someone who is, here's a referral link for 50% off the first month:

https://getgroomgrid.com/signup?ref={REFERRAL_CODE}&promo=FIRSTHALF

Happy to share more about how it's helped my business!

#smallbusiness #petgrooming #businessautomation
```

---

## Tracking & Analytics

### Metrics to Track

**Referral Funnel:**
1. Referral link clicks
2. Signups from referral links
3. Trial starts from referrals
4. Trial conversions to paid
5. Credits earned and applied

**Key KPIs:**
- Referral click-to-signup rate (target: 15%)
- Trial-to-paid conversion for referrals (target: 70%)
- Average referrals per user (target: 2-3)
- Total credits issued (budget tracking)

### Dashboard Queries

**Referral Signups by Date:**
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as signups,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as conversions,
  SUM(credits_earned) as total_credits
FROM referrals
WHERE created_at >= '2026-04-14'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

**Top Referrers:**
```sql
SELECT 
  referrer_customer_id,
  COUNT(*) as referrals_sent,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as conversions,
  SUM(credits_earned) as total_credits
FROM referrals
GROUP BY referrer_customer_id
ORDER BY total_credits DESC
LIMIT 10;
```

---

## Budget & Cost Analysis

### Program Costs

**Per Referral:**
- Credit value: $50
- Stripe processing fee: ~$1.45 (2.9% of $50)
- **Total cost per conversion: ~$51.45**

**Budget Scenarios:**

| Conversions | Cost | Revenue (Solo $29) | Net |
|-------------|------|-------------------|-----|
| 10 | $515 | $290 | -$225 |
| 20 | $1,029 | $580 | -$449 |
| 50 | $2,573 | $1,450 | -$1,123 |
| 100 | $5,145 | $2,900 | -$2,245 |

**Note:** This is a customer acquisition cost. The real value is in LTV (lifetime value). If average customer stays 6 months, LTV is $174. CAC of $51.45 gives a 3.4x LTV:CAC ratio — healthy for SaaS.

---

## Success Metrics

**Week 1 Targets (April 14-20):**
- Referral link shares: 20+
- Referral clicks: 50+
- Referral signups: 5+
- Referral conversions: 2+

**Week 2 Targets (April 21-27):**
- Referral link shares: 40+
- Referral clicks: 100+
- Referral signups: 15+
- Referral conversions: 8+

**Week 3 Targets (April 28-30):**
- Referral link shares: 60+
- Referral clicks: 150+
- Referral signups: 25+
- Referral conversions: 15+

**Total Program Targets:**
- Total signups from referrals: 45
- Total conversions from referrals: 25
- Total credits issued: $1,250
- Percentage of 100 goal: 45%

---

## Implementation Checklist

**Technical Setup:**
- [ ] Create Stripe coupon (50% off first month)
- [ ] Create Stripe promo code (FIRSTHALF)
- [ ] Set up referral code generation system
- [ ] Create referral URL routing
- [ ] Set up customer metadata tracking
- [ ] Create referral tracking database table
- [ ] Set up credit application logic

**Communication Setup:**
- [ ] Create referral email sequence (4 emails)
- [ ] Create referral landing page
- [ ] Create social media share templates
- [ ] Add referral link to user dashboard
- [ ] Add referral stats to user dashboard

**Analytics Setup:**
- [ ] Track referral link clicks
- [ ] Track referral signups
- [ ] Track referral conversions
- [ ] Create referral dashboard
- [ ] Set up referral conversion alerts

**Launch:**
- [ ] Test referral flow end-to-end
- [ ] Send first referral email to existing users
- [ ] Monitor referral metrics daily
- [ ] Adjust based on early results

---

*Created: April 14, 2026*
*Owner: Sofia Mendoza, Strategy & Planning Lead*
