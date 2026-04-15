-- Setup script for pg_stat_statements monitoring

-- Check if current user has superuser privileges
SELECT usesuper FROM pg_user WHERE usename = CURRENT_USER;

-- If the above returns true, run the following:
-- CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Configuration for pg_stat_statements (add to postgresql.conf):
-- shared_preload_libraries = 'pg_stat_statements'
-- pg_stat_statements.track = all
-- pg_stat_statements.save = on

-- After restarting PostgreSQL with these settings, enable the extension:
-- CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
