-- CreateTable: ab_tests
-- A/B testing framework: experiment definitions.

CREATE TABLE IF NOT EXISTS "ab_tests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "variantA" JSONB NOT NULL DEFAULT '{}',
    "variantB" JSONB NOT NULL DEFAULT '{}',
    "splitRatio" INTEGER NOT NULL DEFAULT 50,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ab_tests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ab_tests_name_key" ON "ab_tests"("name");

-- CreateTable: ab_test_assignments
-- Tracks which variant each user/session was assigned.

CREATE TABLE IF NOT EXISTS "ab_test_assignments" (
    "id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "user_id" TEXT,
    "session_id" TEXT,
    "variant" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ab_test_assignments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ab_test_assignments_test_id_user_id_key"
    ON "ab_test_assignments"("test_id", "user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "ab_test_assignments_test_id_session_id_key"
    ON "ab_test_assignments"("test_id", "session_id");
CREATE INDEX IF NOT EXISTS "ab_test_assignments_test_id_variant_idx"
    ON "ab_test_assignments"("test_id", "variant");

-- CreateTable: ab_test_conversions
-- Tracks conversion events for each assignment.

CREATE TABLE IF NOT EXISTS "ab_test_conversions" (
    "id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "assignment_id" TEXT NOT NULL,
    "user_id" TEXT,
    "session_id" TEXT,
    "event" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ab_test_conversions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ab_test_conversions_test_id_event_idx"
    ON "ab_test_conversions"("test_id", "event");

-- AddForeignKey: ab_test_assignments → ab_tests
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ab_test_assignments_test_id_fkey'
    ) THEN
        ALTER TABLE "ab_test_assignments"
            ADD CONSTRAINT "ab_test_assignments_test_id_fkey"
            FOREIGN KEY ("test_id") REFERENCES "ab_tests"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey: ab_test_conversions → ab_tests
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ab_test_conversions_test_id_fkey'
    ) THEN
        ALTER TABLE "ab_test_conversions"
            ADD CONSTRAINT "ab_test_conversions_test_id_fkey"
            FOREIGN KEY ("test_id") REFERENCES "ab_tests"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey: ab_test_conversions → ab_test_assignments
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ab_test_conversions_assignment_id_fkey'
    ) THEN
        ALTER TABLE "ab_test_conversions"
            ADD CONSTRAINT "ab_test_conversions_assignment_id_fkey"
            FOREIGN KEY ("assignment_id") REFERENCES "ab_test_assignments"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
