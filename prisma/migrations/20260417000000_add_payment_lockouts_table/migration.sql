-- CreateTable: payment_lockouts
-- Idempotency guard for Stripe checkout sessions.
-- Prevents duplicate subscriptions when webhooks are delayed or retried.

CREATE TABLE IF NOT EXISTS "payment_lockouts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "payment_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "session_id" TEXT NOT NULL,
    "error_message" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "last_retry_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_lockouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: unique guard on (user_id, payment_id)
CREATE UNIQUE INDEX IF NOT EXISTS "payment_lockouts_user_id_payment_id_key"
    ON "payment_lockouts"("user_id", "payment_id");

-- CreateIndex: lookup index for webhook handlers
CREATE INDEX IF NOT EXISTS "payment_lockouts_user_id_payment_id_idx"
    ON "payment_lockouts"("user_id", "payment_id");

-- AddForeignKey: cascade delete when user is removed
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'payment_lockouts_user_id_fkey'
    ) THEN
        ALTER TABLE "payment_lockouts"
            ADD CONSTRAINT "payment_lockouts_user_id_fkey"
            FOREIGN KEY ("user_id")
            REFERENCES "users"("id")
            ON DELETE CASCADE
            ON UPDATE CASCADE;
    END IF;
END $$;
