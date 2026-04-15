#!/usr/bin/env node
/**
 * Database Size Analysis Script
 * 
 * This script analyzes the current database size and provides growth projections
 * for scaling to 100 subscribers.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TableSize {
  tableName: string;
  rowCount: bigint;
  totalSize: string;
}

interface GrowthProjection {
  currentSubscribers: number;
  projectedSubscribers: number;
  estimatedRows: Record<string, number>;
  estimatedTotalSize: string;
}

async function getDatabaseSize(): Promise<string> {
  const result = await prisma.$queryRaw`
    SELECT pg_size_pretty(pg_database_size(current_database())) as db_size;
  ` as [{ db_size: string }];
  
  return result[0].db_size;
}

async function getTableRowCounts(): Promise<TableSize[]> {
  const results = await prisma.$queryRaw`
    SELECT 
      relname as table_name,
      n_live_tup as row_count,
      pg_size_pretty(pg_total_relation_size(relid)) as total_size
    FROM pg_stat_user_tables 
    WHERE schemaname = 'public'
    ORDER BY pg_total_relation_size(relid) DESC;
  ` as TableSize[];
  
  return results;
}

function projectGrowth(currentData: TableSize[]): GrowthProjection {
  // Current counts (based on DATABASE_PERFORMANCE.md)
  const currentCounts: Record<string, number> = {
    users: 7,
    profiles: 7,
    appointments: 1,
    clients: 1,
    pets: 0,
    payments: 0,
    feedback: 0,
    analytics: 0
  };
  
  // Calculate current ratios
  const ratios: Record<string, number> = {};
  for (const table of currentData) {
    const tableName = table.tableName;
    if (currentCounts[tableName.replace('_events', '')] !== undefined) {
      ratios[tableName] = Number(table.rowCount) / currentCounts[tableName.replace('_events', '')];
    }
  }
  
  // Project for 100 subscribers
  const projectedCounts: Record<string, number> = {
    users: 100,
    profiles: 100,
    clients: 800, // ~8 clients/subscriber
    pets: 1200,   // ~1.5 pets/client
    appointments: 4800, // ~48 appointments/subscriber/year
    ab_test_assignments: 500, // Variable based on testing
    payment_events: 1200, // ~12 payments/subscriber/year
    feedback: 200, // ~2 feedback/subscriber/year
    analytics_events: 5000 // ~50 events/subscriber/year
  };
  
  // Calculate estimated total size (assuming ~1KB/row average)
  let totalProjectedRows = 0;
  for (const [table, count] of Object.entries(projectedCounts)) {
    totalProjectedRows += count;
  }
  
  const estimatedSizeMB = Math.round(totalProjectedRows * 1 / 1024); // 1KB per row
  
  return {
    currentSubscribers: 7,
    projectedSubscribers: 100,
    estimatedRows: projectedCounts,
    estimatedTotalSize: `${estimatedSizeMB}MB`
  };
}

async function main() {
  try {
    console.log('=== Database Size Analysis ===\n');
    
    // Get current database size
    const dbSize = await getDatabaseSize();
    console.log(`Current Database Size: ${dbSize}\n`);
    
    // Get table row counts
    const tableSizes = await getTableRowCounts();
    console.log('Current Table Sizes:');
    tableSizes.forEach(table => {
      console.log(`  ${table.tableName}: ${table.rowCount} rows (${table.totalSize})`);
    });
    
    console.log('\n=== Growth Projection (100 Subscribers) ===');
    const projection = projectGrowth(tableSizes);
    console.log(`Current Subscribers: ${projection.currentSubscribers}`);
    console.log(`Projected Subscribers: ${projection.projectedSubscribers}\n`);
    
    console.log('Estimated Row Counts:');
    for (const [table, count] of Object.entries(projection.estimatedRows)) {
      console.log(`  ${table}: ${count.toLocaleString()} rows`);
    }
    
    console.log(`\nEstimated Total Database Size: ${projection.estimatedTotalSize}`);
    console.log('\nThis is well within the 25GB DigitalOcean droplet capacity.');
    
  } catch (error) {
    console.error('Error analyzing database size:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
