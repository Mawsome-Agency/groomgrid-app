-- Performance: Add missing indexes identified by QA audit (catastrophic seq_scan ratios)
-- Uses CONCURRENTLY to avoid locking tables during production apply
-- Uses IF NOT EXISTS to make idempotent

-- drip_email_queue: worker polls WHERE status='pending' AND scheduled_at <= now(), grouped by user_id
-- 1,006 seq_scans vs 5 idx_scans — CRITICAL
CREATE INDEX CONCURRENTLY IF NOT EXISTS "drip_email_queue_user_id_status_scheduled_at_idx"
  ON "drip_email_queue" ("user_id", "status", "scheduled_at");

-- clients: every client list page queries WHERE user_id = ?
-- 73 seq_scans vs 7 idx_scans — HIGH
-- Note: @@unique([userId, email]) exists but PostgreSQL may not use it for single-col user_id scans
CREATE INDEX CONCURRENTLY IF NOT EXISTS "clients_user_id_idx"
  ON "clients" ("user_id");

-- pets: every pet profile fetch queries WHERE client_id = ?
-- 33 seq_scans vs 0 idx_scans — MEDIUM
CREATE INDEX CONCURRENTLY IF NOT EXISTS "pets_client_id_idx"
  ON "pets" ("client_id");

-- analytics_events: funnel queries filter by user_id + event_name (+ date range on created_at)
-- 144 seq_scans vs 0 idx_scans — HIGH
CREATE INDEX CONCURRENTLY IF NOT EXISTS "analytics_events_user_id_event_name_created_at_idx"
  ON "analytics_events" ("user_id", "event_name", "created_at");
