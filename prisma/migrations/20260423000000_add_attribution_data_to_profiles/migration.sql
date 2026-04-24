-- Add attribution_data JSONB column to profiles table for UTM tracking
-- This enables attribution of signups to marketing channels (utm_source, etc.)
-- Supports the "Get first 100 paying subscribers" rock by providing visibility into acquisition channels
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS attribution_data JSONB;
