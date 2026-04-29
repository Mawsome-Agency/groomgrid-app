-- Add emailUnsubscribed field to profiles table
ALTER TABLE "profiles" ADD COLUMN "email_unsubscribed" BOOLEAN NOT NULL DEFAULT false;

-- Create unsubscribe_tokens table
CREATE TABLE "unsubscribe_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unsubscribe_tokens_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint on token
ALTER TABLE "unsubscribe_tokens" ADD CONSTRAINT "unsubscribe_tokens_token_key" UNIQUE ("token");

-- Add foreign key to users
ALTER TABLE "unsubscribe_tokens" ADD CONSTRAINT "unsubscribe_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add index on userId for lookups
CREATE INDEX "unsubscribe_tokens_user_id_idx" ON "unsubscribe_tokens"("user_id");
