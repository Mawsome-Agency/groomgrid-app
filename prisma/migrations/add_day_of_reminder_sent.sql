-- Migration: add day_of_reminder_sent to appointments
-- Run this on production before or after deploying the reminder-check feature.
-- Safe: adds a nullable boolean column with a default value of false.

ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS day_of_reminder_sent BOOLEAN NOT NULL DEFAULT FALSE;
