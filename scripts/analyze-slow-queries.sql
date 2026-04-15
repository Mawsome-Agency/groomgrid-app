-- Script to analyze slow queries using pg_stat_statements

-- Top 10 slowest queries by total execution time
SELECT
  calls,
  total_exec_time,
  mean_exec_time,
  stddev_exec_time,
  query
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- Top 10 slowest queries by mean execution time (with at least 5 calls)
SELECT
  calls,
  total_exec_time,
  mean_exec_time,
  stddev_exec_time,
  query
FROM pg_stat_statements
WHERE calls >= 5
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Queries with high standard deviation (inconsistent performance)
SELECT
  calls,
  total_exec_time,
  mean_exec_time,
  stddev_exec_time,
  query
FROM pg_stat_statements
WHERE calls >= 10
ORDER BY stddev_exec_time DESC
LIMIT 10;

-- Reset statistics (use with caution)
-- SELECT pg_stat_statements_reset();
