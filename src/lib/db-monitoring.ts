/**
 * Database Monitoring Utilities
 * 
 * This module provides utilities for monitoring database performance
 * using pg_stat_statements and other PostgreSQL monitoring features.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SlowQuery {
  calls: number;
  totalTime: number;
  meanTime: number;
  stddevTime: number;
  query: string;
}

interface PgStatStatementsStatus {
  installed: boolean;
  trackingEnabled: boolean;
  hasPermissions: boolean;
}

/**
 * Check if pg_stat_statements is installed and accessible
 */
async function checkPgStatStatementsStatus(): Promise<PgStatStatementsStatus> {
  try {
    // Check if current user has superuser privileges
    const superuserCheck = await prisma.$queryRaw`
      SELECT usesuper FROM pg_user WHERE usename = CURRENT_USER;
    ` as [{ usesuper: boolean }];
    
    const isSuperuser = superuserCheck[0]?.usesuper || false;
    
    // Check if pg_stat_statements extension exists
    const extensionCheck = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM pg_extension WHERE extname = 'pg_stat_statements';
    ` as [{ count: bigint }];
    
    const isInstalled = Number(extensionCheck[0].count) > 0;
    
    // Check if we can query pg_stat_statements
    try {
      await prisma.$queryRaw`SELECT 1 FROM pg_stat_statements LIMIT 1;`;
      return {
        installed: isInstalled,
        trackingEnabled: true,
        hasPermissions: true
      };
    } catch (error) {
      return {
        installed: isInstalled,
        trackingEnabled: isInstalled,
        hasPermissions: false
      };
    }
  } catch (error) {
    return {
      installed: false,
      trackingEnabled: false,
      hasPermissions: false
    };
  }
}

/**
 * Setup pg_stat_statements if possible
 * 
 * Note: This requires superuser privileges and PostgreSQL configuration changes
 */
async function setupPgStatStatements(): Promise<boolean> {
  try {
    const status = await checkPgStatStatementsStatus();
    
    if (status.installed && status.hasPermissions) {
      console.log('pg_stat_statements is already installed and accessible');
      return true;
    }
    
    if (!status.installed) {
      console.log('pg_stat_statements extension is not installed');
      console.log('To install, a superuser must run:');
      console.log("CREATE EXTENSION IF NOT EXISTS pg_stat_statements;");
      return false;
    }
    
    if (!status.hasPermissions) {
      console.log('No permissions to access pg_stat_statements');
      console.log('Grant permissions with:');
      console.log("GRANT SELECT ON pg_stat_statements TO current_user;");
      return false;
    }
    
    return false;
  } catch (error) {
    console.error('Error setting up pg_stat_statements:', error);
    return false;
  }
}

/**
 * Get the slowest queries by total execution time
 */
async function getSlowQueries(limit: number = 10): Promise<SlowQuery[]> {
  try {
    const status = await checkPgStatStatementsStatus();
    
    if (!status.trackingEnabled || !status.hasPermissions) {
      throw new Error('pg_stat_statements is not available or accessible');
    }
    
    const results = await prisma.$queryRaw`
      SELECT
        calls,
        total_exec_time as totalTime,
        mean_exec_time as meanTime,
        stddev_exec_time as stddevTime,
        query
      FROM pg_stat_statements
      ORDER BY total_exec_time DESC
      LIMIT ${limit};
    ` as SlowQuery[];
    
    return results;
  } catch (error) {
    console.error('Error getting slow queries:', error);
    return [];
  }
}

/**
 * Get queries with highest mean execution time (with minimum call threshold)
 */
async function getSlowestMeanTimeQueries(minCalls: number = 5, limit: number = 10): Promise<SlowQuery[]> {
  try {
    const status = await checkPgStatStatementsStatus();
    
    if (!status.trackingEnabled || !status.hasPermissions) {
      throw new Error('pg_stat_statements is not available or accessible');
    }
    
    const results = await prisma.$queryRaw`
      SELECT
        calls,
        total_exec_time as totalTime,
        mean_exec_time as meanTime,
        stddev_exec_time as stddevTime,
        query
      FROM pg_stat_statements
      WHERE calls >= ${minCalls}
      ORDER BY mean_exec_time DESC
      LIMIT ${limit};
    ` as SlowQuery[];
    
    return results;
  } catch (error) {
    console.error('Error getting slowest mean time queries:', error);
    return [];
  }
}

/**
 * Get queries with inconsistent performance (high standard deviation)
 */
async function getInconsistentQueries(minCalls: number = 10, limit: number = 10): Promise<SlowQuery[]> {
  try {
    const status = await checkPgStatStatementsStatus();
    
    if (!status.trackingEnabled || !status.hasPermissions) {
      throw new Error('pg_stat_statements is not available or accessible');
    }
    
    const results = await prisma.$queryRaw`
      SELECT
        calls,
        total_exec_time as totalTime,
        mean_exec_time as meanTime,
        stddev_exec_time as stddevTime,
        query
      FROM pg_stat_statements
      WHERE calls >= ${minCalls}
      ORDER BY stddev_exec_time DESC
      LIMIT ${limit};
    ` as SlowQuery[];
    
    return results;
  } catch (error) {
    console.error('Error getting inconsistent queries:', error);
    return [];
  }
}

/**
 * Reset pg_stat_statements statistics
 * 
 * WARNING: This will reset all collected statistics
 */
async function resetQueryStats(): Promise<boolean> {
  try {
    const status = await checkPgStatStatementsStatus();
    
    if (!status.hasPermissions) {
      throw new Error('No permissions to reset pg_stat_statements');
    }
    
    await prisma.$queryRaw`SELECT pg_stat_statements_reset();`;
    return true;
  } catch (error) {
    console.error('Error resetting query stats:', error);
    return false;
  }
}

/**
 * Get existing indexes for a table
 */
async function getTableIndexes(tableName: string): Promise<any[]> {
  try {
    const results = await prisma.$queryRaw`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes 
      WHERE tablename = ${tableName}
      ORDER BY indexname;
    `;
    
    return results;
  } catch (error) {
    console.error(`Error getting indexes for table ${tableName}:`, error);
    return [];
  }
}

export {
  setupPgStatStatements,
  getSlowQueries,
  getSlowestMeanTimeQueries,
  getInconsistentQueries,
  resetQueryStats,
  getTableIndexes,
  type SlowQuery,
  type PgStatStatementsStatus
};
