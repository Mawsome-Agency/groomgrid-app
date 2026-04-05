# GroomGrid App

AI-powered pet grooming business management platform.

## User Acquisition Funnel

This repository contains the complete user acquisition funnel that converts visitors to paying customers.

### Funnel Steps

1. **Landing Page** → `/signup`
   - Hero with CTA
   - Value proposition

2. **Signup Form** (`/signup`)
   - Email + password + business name
   - Email verification via Supabase

3. **Plan Selection** (`/plans`)
   - Solo ($29/mo), Salon ($79/mo), Enterprise ($149/mo)
   - 14-day free trial
   - Feature comparison
   - Social proof (testimonials)

4. **Stripe Checkout**
   - Pre-built Stripe Checkout UI
   - Subscription mode with trial
   - Post-payment redirect to onboarding

5. **Onboarding** (`/onboarding`)
   - Step 1: Add first client
   - Step 2: Create first appointment
   - Step 3: Set business hours
   - Skip option (tracked)
   - Completion screen

6. **Dashboard** (`/dashboard`)
   - Main app interface
   - Trial banner
   - Quick stats

### GA4 Events Tracked

- `signup_started` - When user starts signup form
- `email_verified` - After email confirmation
- `plan_selected` - When user selects a plan
- `checkout_completed` - After Stripe checkout
- `onboarding_step_completed` - After each onboarding step
- `onboarding_skipped` - When user skips onboarding
- `page_view` - On each page

### Technical Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Authentication and database
- **Stripe** - Payments and subscriptions
- **Lucide React** - Icons

### Setup

1. Clone and install dependencies:
```bash
git clone https://github.com/Mawsome-Agency/groomgrid-app.git
cd groomgrid-app
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Fill in environment variables (see `.env.example`)

4. Run development server:
```bash
npm run dev
```

### Database Schema

The app requires the following Supabase tables:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  phone TEXT,
  plan_type TEXT DEFAULT 'solo',
  subscription_status TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_subscription_status ON profiles(subscription_status);
```

### Stripe Products

Create the following products in Stripe:

| Plan | Price | Interval | Trial |
|------|-------|----------|-------|
| Solo | $29 | monthly | 14 days |
| Salon | $79 | monthly | 14 days |
| Enterprise | $149 | monthly | 14 days |

### Webhook Configuration

Configure Stripe webhooks to send events to:
```
https://your-domain.com/api/stripe/webhook
```

Events to listen for:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### Deployment

The app is deployed to Vercel. Connect the GitHub repository and configure environment variables.

### License

Copyright © 2026 GroomGrid. All rights reserved.
