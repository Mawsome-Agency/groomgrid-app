# Database Indexes for Subscription Scaling

This directory contains database indexes to optimize performance for subscription-related queries and appointment scheduling as GroomGrid scales.

## Indexes Included

1. **Appointment Queries**: Composite index on `appointments(user_id, start_time)` for schedule queries
2. **Reminder Processing**: Partial indexes on reminder-related fields for 24h and day-of reminders
3. **Stripe Webhooks**: Index on `profiles(stripe_customer_id)` for webhook lookups
4. **Subscription Status**: Index on `profiles(subscription_status)` for subscription status queries
5. **Payment Lockouts**: Index on `payment_lockouts(user_id, payment_id)` for payment status checks

## Application Instructions

Due to PostgreSQL limitations with `CREATE INDEX CONCURRENTLY`, these indexes must be applied manually outside of Prisma migrations:

```bash
# Run the script to apply indexes
./scripts/apply-indexes.sh
```

This script will:
1. Extract the DATABASE_URL from your .env file
2. Apply the indexes using psql directly
3. Use CONCURRENTLY to avoid table locks during index creation

## Rollback

If you need to remove the indexes, run the DROP INDEX commands listed in the migration file comments.
