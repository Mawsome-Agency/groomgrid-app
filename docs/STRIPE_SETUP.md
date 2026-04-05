# Stripe Setup Guide

## Creating Products

Create the following subscription products in your Stripe dashboard:

### 1. Solo Plan
- **Name**: GroomGrid Solo
- **Description**: For independent mobile groomers
- **Price**: $29/month
- **Billing Interval**: Monthly
- **Trial**: 14 days
- **Features**:
  - 1 groomer account
  - Unlimited clients & appointments
  - Automated reminders
  - Revenue tracking
  - Mobile app access

### 2. Salon Plan
- **Name**: GroomGrid Salon
- **Description**: For salons with 2-5 groomers
- **Price**: $79/month
- **Billing Interval**: Monthly
- **Trial**: 14 days
- **Features**:
  - Everything in Solo
  - Up to 5 groomer accounts
  - Team scheduling
  - Staff performance metrics
  - Priority support

### 3. Enterprise Plan
- **Name**: GroomGrid Enterprise
- **Description**: For large grooming businesses
- **Price**: $149/month
- **Billing Interval**: Monthly
- **Trial**: 14 days
- **Features**:
  - Everything in Salon
  - Unlimited groomers
  - Custom branding
  - API access
  - Dedicated account manager

## Webhook Setup

1. Go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL: `https://app.getgroomgrid.com/api/stripe/webhook`
4. Select events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret to `.env.local` as `STRIPE_WEBHOOK_SECRET`

## Environment Variables

Add to your `.env.local`:

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_SOLO=price_...  # Price ID from product creation
STRIPE_PRICE_SALON=price_...
STRIPE_PRICE_ENTERPRISE=price_...
```

## Testing in Sandbox

Use Stripe test mode for development:
- Use test card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- Postal code: Any 5 digits
