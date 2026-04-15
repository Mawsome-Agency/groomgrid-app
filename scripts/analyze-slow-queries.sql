-- Analyze slow queries using pg_stat_statements
-- This script provides insights into query performance

-- Top 20 slowest queries by total execution time
SELECT 
  query,
  calls,
  total_exec_time AS total_time_ms,
  mean_exec_time AS avg_time_ms,
  max_exec_time AS max_time_ms,
  stddev_exec_time AS stddev_time_ms,
  rows,
  100.0 * shared_blks_hit / NULLIF(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;

-- Top 20 queries by average execution time (with at least 10 calls)
SELECT 
  LEFT(query, 100) AS query_preview,
  calls,
  mean_exec_time AS avg_time_ms,
  max_exec_time AS max_time_ms,
  total_exec_time AS total_time_ms
FROM pg_stat_statements
WHERE calls >= 10
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Top 20 most frequently called queries
SELECT 
  LEFT(query, 100) AS query_preview,
  calls,
  total_exec_time AS total_time_ms,
  mean_exec_time AS avg_time_ms
FROM pg_stat_statements
ORDER BY calls DESC
LIMIT 20;

-- Queries with poor cache hit ratio (< 90%)
SELECT 
  LEFT(query, 100) AS query_preview,
  calls,
  100.0 * shared_blks_hit / NULLIF(shared_blks_hit + shared_blks_read, 0) AS hit_percent,
  shared_blks_hit,
  shared_blks_read
FROM pg_stat_statements
WHERE shared_blks_hit + shared_blks_read > 0
  AND 100.0 * shared_blks_hit / NULLIF(shared_blks_hit + shared_blks_read, 0) < 90
ORDER BY hit_percent ASC
LIMIT 20;

-- Summary statistics
SELECT 
  COUNT(*) AS total_queries_tracked,
  SUM(calls) AS total_calls,
  SUM(total_exec_time) AS total_execution_time_ms,
  AVG(mean_exec_time) AS avg_execution_time_ms,
  MAX(max_exec_time) AS max_execution_time_ms
FROM pg_stat_statements;

-- Reset pg_stat_statements (use with caution - clears all statistics)
-- SELECT pg_stat_statements_reset();
