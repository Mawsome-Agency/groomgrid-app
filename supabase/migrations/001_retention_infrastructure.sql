-- Drip email queue: tracks which emails to send to each user
CREATE TABLE IF NOT EXISTS drip_email_queue (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  email text NOT NULL,
  sequence_step integer NOT NULL, -- 0=welcome, 1=first client, 3=no-shows, 7=check-in, 14=upgrade
  scheduled_at timestamptz NOT NULL,
  sent_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS drip_email_queue_pending ON drip_email_queue(status, scheduled_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS drip_email_queue_user ON drip_email_queue(user_id);

-- Feedback: NPS, thumbs, bug reports, feature requests
CREATE TABLE IF NOT EXISTS feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  type text NOT NULL CHECK (type IN ('nps', 'thumbs', 'bug', 'feature')),
  score integer, -- NPS: 0-10, thumbs: 1=up -1=down
  page text,     -- URL/page where feedback was given
  message text,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS feedback_user ON feedback(user_id);
CREATE INDEX IF NOT EXISTS feedback_type ON feedback(type);

-- Analytics events: fine-grained user behavior tracking
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  event_name text NOT NULL,
  properties jsonb NOT NULL DEFAULT '{}',
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analytics_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS analytics_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS analytics_events_created ON analytics_events(created_at);

-- User profiles table (extended from auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY,  -- matches auth.users.id
  email text NOT NULL,
  full_name text,
  business_name text,
  trial_started_at timestamptz,
  trial_ends_at timestamptz,
  plan text NOT NULL DEFAULT 'trial' CHECK (plan IN ('trial', 'solo', 'salon', 'enterprise')),
  nps_shown_at timestamptz,
  onboarding_completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Engagement scores view
CREATE OR REPLACE VIEW user_engagement_scores AS
SELECT
  p.id AS user_id,
  p.email,
  p.full_name,
  p.business_name,
  p.plan,
  p.trial_ends_at,
  p.created_at AS signed_up_at,
  COUNT(DISTINCT DATE(e.created_at)) FILTER (WHERE e.event_name = 'session_start') AS active_days,
  COUNT(e.id) FILTER (WHERE e.event_name = 'appointment_created') AS appointments_created,
  COUNT(e.id) FILTER (WHERE e.event_name = 'client_added') AS clients_added,
  COUNT(e.id) FILTER (WHERE e.event_name = 'feature_used') AS feature_interactions,
  MAX(e.created_at) AS last_active_at,
  -- Engagement score: weighted sum
  (
    COUNT(DISTINCT DATE(e.created_at)) FILTER (WHERE e.event_name = 'session_start') * 10 +
    COUNT(e.id) FILTER (WHERE e.event_name = 'appointment_created') * 5 +
    COUNT(e.id) FILTER (WHERE e.event_name = 'client_added') * 3 +
    COUNT(e.id) FILTER (WHERE e.event_name = 'feature_used') * 1
  ) AS engagement_score
FROM user_profiles p
LEFT JOIN analytics_events e ON e.user_id = p.id
GROUP BY p.id, p.email, p.full_name, p.business_name, p.plan, p.trial_ends_at, p.created_at;
