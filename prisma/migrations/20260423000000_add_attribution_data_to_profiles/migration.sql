-- Add attribution_data column to profiles table
-- Stores UTM and referral attribution captured at signup time for funnel analysis

ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "attribution_data" JSONB;
