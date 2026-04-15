-- Migration: Add indexes for subscription scale performance
-- Adds indexes to optimize subscription-related queries and appointment scheduling
-- Uses CONCURRENTLY to avoid locking production tables during migration

-- Index for Stripe webhook lookups by stripe_customer_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS profiles_stripe_customer_id_idx ON profiles (stripe_customer_id);

-- Index for subscription status lookups (active subscriptions, trials, etc.)
CREATE INDEX CONCURRENTLY IF NOT EXISTS profiles_subscription_status_idx ON profiles (subscription_status);

-- Index for monthly schedule queries (user_id + date range)
CREATE INDEX CONCURRENTLY IF NOT EXISTS appointments_user_start_time_idx ON appointments (user_id, start_time);

-- Index for conflict detection queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS appointments_user_status_times_idx ON appointments (user_id, status, start_time, end_time);

-- Index for reminder processing queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS appointments_reminder_processing_idx ON appointments (status, reminder_sent, start_time);

-- Index for day-of reminder processing
CREATE INDEX CONCURRENTLY IF NOT EXISTS appointments_dayof_reminder_idx ON appointments (status, day_of_reminder_sent, start_time);