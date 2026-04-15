-- Migration: add keyword_research table for SEO keyword research persistence
-- Safe: creates a new table with no impact on existing tables.

CREATE TABLE IF NOT EXISTS keyword_research (
  id                VARCHAR(30)  NOT NULL PRIMARY KEY,
  user_id           VARCHAR(30)  NOT NULL,
  competitor_domain VARCHAR(255) NOT NULL,
  research_type     VARCHAR(50)  NOT NULL,
  keywords_found    INTEGER      NOT NULL DEFAULT 0,
  gaps_found        INTEGER,
  results_json      JSONB,
  min_volume        INTEGER,
  max_position      INTEGER,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_keyword_research_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_keyword_research_user_created
  ON keyword_research (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_keyword_research_competitor_domain
  ON keyword_research (competitor_domain);
