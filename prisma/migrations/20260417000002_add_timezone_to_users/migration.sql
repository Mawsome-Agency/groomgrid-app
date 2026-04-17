-- AlterTable: add timezone column to users
-- Context: column was manually added to production on 2026-04-17 after a live incident
-- where missing column was blocking all signups. Migration file was never committed.
-- IF NOT EXISTS guard makes this idempotent — safe to deploy on envs already patched manually.

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "timezone" TEXT NOT NULL DEFAULT 'America/New_York';
