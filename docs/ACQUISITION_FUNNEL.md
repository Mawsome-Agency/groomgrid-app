# User Acquisition Funnel Documentation

## Overview

The GroomGrid acquisition funnel is designed to convert anonymous visitors into paying customers with minimal friction.

## Funnel Metrics Tracking

We track drop-off at each step using GA4 events:

| Step | GA4 Event | Expected Conversion Rate |
|------|-----------|------------------------|
| Signup Start | `signup_started` | 100% (baseline) |
| Email Verified | `email_verified` | 70-80% |
| Plan Selected | `plan_selected` | 90% of verified |
| Checkout Complete | `checkout_completed` | 60-70% of plan selected |
| Onboarding Step 1 | `onboarding_step_completed` (step=1) | 85% |
| Onboarding Step 2 | `onboarding_step_completed` (step=2) | 80% |
| Onboarding Step 3 | `onboarding_step_completed` (step=3) | 75% |
| Dashboard Visit | First `page_view` of `/dashboard` | 95% |

## Conversion Optimization Features

### 1. Progress Indicator
- Visual progress bar during onboarding
- Clear step labels
- Encourages completion

### 2. Skip Options
- Users can skip any onboarding step
- Skip events tracked with optional reason
- Allows users who prefer self-directed onboarding

### 3. Social Proof
- Testimonials on plan selection page
- Real business names and quotes
- Builds trust

### 4. Clear Value Props
- Value proposition section on plan page
- Feature comparison per plan
- Benefits highlighted

### 5. 14-Day Free Trial
- No credit card required initially
- Clear trial countdown in dashboard
- Reduces barrier to entry
