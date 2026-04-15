-- Add unique index to prevent duplicate payment events
ALTER TABLE "public"."payment_events" 
ADD CONSTRAINT "payment_events_paymentId_eventType_key" UNIQUE ("paymentId", "eventType");
