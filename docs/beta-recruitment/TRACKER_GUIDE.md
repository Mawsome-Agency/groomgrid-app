# Beta Tester Tracker — Field Guide
**File:** beta-tester-tracker.csv  
**Owner:** Sofia Mendoza (update manually as testers join)

---

## Field Definitions

| Field | Values | Notes |
|-------|--------|-------|
| `id` | 1-10 | Sequential. Stop at 10 for this cohort. |
| `name` | First name + last initial | e.g., "Sarah T." |
| `groomer_type` | `mobile_groomer` or `salon_owner` | Aim for 6 mobile, 4 salon |
| `channel` | `facebook_dog_groomers_only`, `facebook_the_daily_groomer`, `facebook_everyday_groomer`, `reddit_doggrooming`, `petgroomer_com`, `referral`, `other` | Track where they came from |
| `signup_date` | YYYY-MM-DD | Date they created their account |
| `email` | their email | Get via DM when they confirm signup |
| `city_state` | e.g., "Phoenix, AZ" | Helps with geo analysis later |
| `prior_software` | `moego`, `pawfinity`, `google_cal`, `paper`, `none`, `other` | Key for competitive intel |
| `signup_confirmed` | `yes` / `no` | Did you verify they actually completed signup? |
| `trial_expires` | YYYY-MM-DD | signup_date + 60 days |
| `status` | `recruited`, `signed_up`, `active`, `churned`, `converted` | Update as they progress |
| `day1_checkin_sent` | `yes` / `no` | Did you DM them on day 1? |
| `day7_feedback_sent` | `yes` / `no` | Did you send the feedback form link at day 7? |
| `day7_feedback_received` | `yes` / `no` | Did they fill it out? |
| `willing_to_pay` | `yes` / `no` / `maybe` | From feedback form Q8 |
| `pay_at_price` | e.g., "$29" or "$19" | What price they said yes to |
| `top_pain_point` | Free text | Their #1 complaint or feature request |
| `notes` | Free text | Anything notable — good quotes, escalations, etc. |

---

## Status Flow

```
recruited → signed_up → active → [converted | churned]
```

- **recruited**: They expressed interest in a comment/DM but haven't signed up yet
- **signed_up**: Account created at getgroomgrid.com (you confirmed with them)
- **active**: Using it for real appointments (you verified via day 1 check-in)
- **converted**: Subscribed to a paid plan after trial
- **churned**: Stopped using it / didn't convert

---

## Weekly Review Checklist

Every Friday, review the tracker:
- [ ] Any new signups to add?
- [ ] Any day 7 feedback forms due this week?
- [ ] Anyone churned (stopped responding)?
- [ ] What's the current willing_to_pay rate? (Target: 70%+)
- [ ] Any feature requests appearing more than twice? (Flag for engineering)

---

## ICP Validation Metrics to Report

When the mission closes, pull these numbers:

1. **Signup source breakdown** — which channel drove the most testers?
2. **Willingness to pay rate** — what % said yes or maybe?
3. **Price sensitivity** — what price point got the most yes votes?
4. **Top pain points** — what's missing that groomers actually need?
5. **Prior software** — are we converting MoeGo users or net-new?
6. **Groomer type split** — did mobile or salon engage more?

These answer the ICP validation rock: "Validate ICP, pricing, and value proposition with real groomers."
