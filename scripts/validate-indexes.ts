#!/usr/bin/env node
/**
 * Index Validation Script
 * 
 * This script validates that all required indexes exist and reports any missing ones.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TableIndex {
  tableName: string;
  indexName: string;
  columns: string;
}

async function getExistingIndexes(): Promise<TableIndex[]> {
  const results = await prisma.$queryRaw`
    SELECT 
      tablename as "tableName",
      indexname as "indexName",
      indexdef as "columns"
    FROM pg_indexes 
    WHERE schemaname = 'public'
    ORDER BY tablename, indexname;
  ` as TableIndex[];
  
  return results;
}

async function main() {
  try {
    console.log('=== Database Index Validation ===\n');
    
    const indexes = await getExistingIndexes();
    
    // Required indexes for subscription scaling
    const requiredIndexes = [
      { tableName: 'appointments', indexName: 'idx_appointments_userId_startTime' },
      { tableName: 'appointments', indexName: 'idx_appointments_userId_status_reminder' },
      { tableName: 'appointments', indexName: 'idx_appointments_userId_status_dayOf' },
      { tableName: 'profiles', indexName: 'idx_profile_stripeCustomerId' },
      { tableName: 'profiles', indexName: 'idx_profile_subscriptionStatus' }
    ];
    
    console.log('Checking for required indexes...\n');
    
    let allFound = true;
    for (const required of requiredIndexes) {
      const found = indexes.some(
        index => index.tableName === required.tableName && index.indexName === required.indexName
      );
      
      if (found) {
        console.log(`✓ ${required.indexName} on ${required.tableName}`);
      } else {
        console.log(`✗ ${required.indexName} on ${required.tableName} - MISSING`);
        allFound = false;
      }
    }
    
    console.log('\n=== Validation Result ===');
    if (allFound) {
      console.log('All required indexes are present.');
    } else {
      console.log('Some required indexes are missing. Please run the migration.');
    }
    
  } catch (error) {
    console.error('Error validating indexes:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
