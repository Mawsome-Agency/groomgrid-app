CREATE TABLE "payment_events" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "payment_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "payload" JSONB,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX "payment_events_payment_id_event_type_key" ON "payment_events" ("payment_id", "event_type");
