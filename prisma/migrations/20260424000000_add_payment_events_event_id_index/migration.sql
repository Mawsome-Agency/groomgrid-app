-- Add expression index on payment_events.payload->>'eventId' to speed up
-- the isEventProcessed() idempotency check in the Stripe webhook handler.
-- Without this index, every webhook triggers a full table scan on payment_events.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payment_events_payload_event_id
  ON payment_events ((payload->>'eventId'));
