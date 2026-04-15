-- Setup script for pg_stat_statements query monitoring
-- This script enables pg_stat_statements extension and configures it for production use

-- Check if current user has superuser privileges
SELECT 
  usename AS username,
  usesuper AS is_superuser
FROM pg_user 
WHERE usename = CURRENT_USER;

-- Enable pg_stat_statements extension (requires superuser)
-- Run this as postgres superuser: sudo -u postgres psql -d groomgrid_prod
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Configure pg_stat_statements for production use
-- Track all queries (not just normalized)
ALTER SYSTEM SET pg_stat_statements.track = all;

-- Track utility commands (SET, RESET, etc.)
ALTER SYSTEM SET pg_stat_statements.track_utility = on;

-- Keep top 1000 queries by total execution time
ALTER SYSTEM SET pg_stat_statements.max = 1000;

-- Reload PostgreSQL configuration to apply changes
SELECT pg_reload_conf();

-- Verify pg_stat_statements is enabled
SELECT 
  extname AS extension_name,
  extversion AS version
FROM pg_extension 
WHERE extname = 'pg_stat_statements';

-- Show current pg_stat_statements configuration
SHOW pg_stat_statements.track;
SHOW pg_stat_statements.track_utility;
SHOW pg_stat_statements.max;

-- Grant access to pg_stat_statements for monitoring
-- (Optional: grant to specific monitoring user)
-- GRANT pg_read_all_stats TO monitoring_user;
