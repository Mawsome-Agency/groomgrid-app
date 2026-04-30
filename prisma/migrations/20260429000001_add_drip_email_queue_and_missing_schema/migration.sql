-- Hotfix: Create drip_email_queue table and ensure unsubscribe infrastructure exists.
-- All statements are idempotent (IF NOT EXISTS) so this is safe to re-run.

-- 1. Create drip_email_queue table (MISSING — no migration ever created this table)
CREATE TABLE IF NOT EXISTS "drip_email_queue" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sequence_step" INTEGER NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "sent_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drip_email_queue_pkey" PRIMARY KEY ("id")
);

-- Foreign key: drip_email_queue.user_id -> users.id
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'drip_email_queue_user_id_fkey'
    ) THEN
        ALTER TABLE "drip_email_queue"
            ADD CONSTRAINT "drip_email_queue_user_id_fkey"
            FOREIGN KEY ("user_id")
            REFERENCES "users"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Index for drip worker poll query (user_id, status, scheduled_at)
CREATE INDEX IF NOT EXISTS "drip_email_queue_user_id_status_scheduled_at_idx"
    ON "drip_email_queue"("user_id", "status", "scheduled_at");

-- 2. Add email_unsubscribed column to profiles (idempotent)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'profiles' AND column_name = 'email_unsubscribed'
    ) THEN
        ALTER TABLE "profiles" ADD COLUMN "email_unsubscribed" BOOLEAN NOT NULL DEFAULT false;
    END IF;
END $$;

-- 3. Create unsubscribe_tokens table (idempotent — in case 20260429000000 wasn't applied)
CREATE TABLE IF NOT EXISTS "unsubscribe_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unsubscribe_tokens_pkey" PRIMARY KEY ("id")
);

-- Unique constraint on token
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unsubscribe_tokens_token_key'
    ) THEN
        ALTER TABLE "unsubscribe_tokens" ADD CONSTRAINT "unsubscribe_tokens_token_key" UNIQUE ("token");
    END IF;
END $$;

-- Foreign key: unsubscribe_tokens.user_id -> users.id
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unsubscribe_tokens_user_id_fkey'
    ) THEN
        ALTER TABLE "unsubscribe_tokens"
            ADD CONSTRAINT "unsubscribe_tokens_user_id_fkey"
            FOREIGN KEY ("user_id")
            REFERENCES "users"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Index on user_id for token lookups
CREATE INDEX IF NOT EXISTS "unsubscribe_tokens_user_id_idx"
    ON "unsubscribe_tokens"("user_id");
