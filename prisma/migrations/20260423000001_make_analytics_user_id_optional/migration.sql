-- Make analytics_events.user_id nullable to allow anonymous pre-signup event tracking
-- Pre-signup funnel events (signup_viewed, signup_started) can now be stored without
-- a user session, enabling full funnel visibility in the local analytics_events table.

-- Drop NOT NULL constraint
ALTER TABLE "analytics_events" ALTER COLUMN "user_id" DROP NOT NULL;

-- Recreate FK constraint with SET NULL on delete (was CASCADE)
-- NULL user_id values are exempt from referential integrity checks in PostgreSQL,
-- so this correctly handles both anonymous events and user deletion.
ALTER TABLE "analytics_events" DROP CONSTRAINT IF EXISTS "analytics_events_user_id_fkey";
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
