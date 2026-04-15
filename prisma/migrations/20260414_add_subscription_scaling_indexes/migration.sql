-- Add indexes for subscription scaling and performance optimization
-- NOTE: This migration must be run manually with psql due to CONCURRENTLY limitations:
-- psql $DATABASE_URL -f prisma/migrations/20260414_add_subscription_scaling_indexes/migration.sql

-- Index for appointment queries by groomer and date range (corrected column names)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_appointments_user_id_start_time" ON "public"."appointments" ("user_id", "start_time");

-- Index for 24h reminder queries (partial index for better performance)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_appointments_reminder_24h"
  ON "public"."appointments" ("status", "reminder_sent", "start_time")
  WHERE "status" = 'scheduled' AND "reminder_sent" = false;

-- Index for day-of reminder queries (partial index for better performance)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_appointments_reminder_dayof"
  ON "public"."appointments" ("status", "day_of_reminder_sent", "start_time")
  WHERE "status" = 'scheduled' AND "day_of_reminder_sent" = false;

-- Index for Stripe customer ID lookups (webhook handlers) - corrected column name
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_profiles_stripe_customer_id" ON "public"."profiles" ("stripe_customer_id");

-- Index for subscription status lookups (corrected column name)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_profiles_subscription_status" ON "public"."profiles" ("subscription_status");

-- Index for payment lockout queries (needed for webhook handlers and payment status checks)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_payment_lockouts_user_id_payment_id" ON "public"."payment_lockouts" ("user_id", "payment_id");

-- ROLLBACK COMMANDS (run manually if needed):
-- DROP INDEX CONCURRENTLY IF EXISTS "idx_appointments_user_id_start_time";
-- DROP INDEX CONCURRENTLY IF EXISTS "idx_appointments_reminder_24h";
-- DROP INDEX CONCURRENTLY IF EXISTS "idx_appointments_reminder_dayof";
-- DROP INDEX CONCURRENTLY IF EXISTS "idx_profiles_stripe_customer_id";
-- DROP INDEX CONCURRENTLY IF EXISTS "idx_profiles_subscription_status";
-- DROP INDEX CONCURRENTLY IF EXISTS "idx_payment_lockouts_user_id_payment_id";
