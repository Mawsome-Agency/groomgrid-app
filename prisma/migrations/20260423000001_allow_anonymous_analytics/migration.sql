-- Allow anonymous analytics event tracking
-- The Prisma schema defines AnalyticsEvent.userId as String? (nullable),
-- but the production database column still has NOT NULL from the initial
-- table creation. This migration aligns the database to match the schema,
-- enabling pre-signup funnel tracking (signup_viewed, signup_started) where
-- no authenticated user exists yet.
ALTER TABLE analytics_events ALTER COLUMN user_id DROP NOT NULL;
