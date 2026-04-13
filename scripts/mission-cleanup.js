#!/usr/bin/env node
/**
 * Mission Cleanup Script
 *
 * This script identifies and removes duplicate/non-critical engineering missions.
 *
 * Usage:
 *   DRY RUN:  node scripts/mission-cleanup.js --dry-run
 *   EXECUTE:  node scripts/mission-cleanup.js --execute
 *
 * Required env:
 *   CORTEX_TOKEN (for API access)
 *
 * Optional env:
 *   CORTEX_API_URL (default: http://localhost:3001/api)
 *   CORTEX_COMPANY_ID (default: cmm79fsxz00ephmk3xjtx9scd)
 *   CORTEX_DEPARTMENT (default: Engineering)
 */

const https = require('https');
const http = require('http');

const API_BASE = process.env.CORTEX_API_URL || 'http://localhost:3001/api';
const COMPANY_ID = process.env.CORTEX_COMPANY_ID || 'cmm79fsxz00ephmk3xjtx9scd';
const DEPARTMENT = process.env.CORTEX_DEPARTMENT || 'Engineering';

// Active rocks that missions should map to
const ACTIVE_ROCKS = [
  'Deploy stable GroomGrid MVP to production',
  'Get first 100 paying subscribers',
  'Establish GroomGrid organic search presence — 500 visits/month'
];

async function fetchMissions() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_BASE}/missions`);
    url.searchParams.append('companyId', COMPANY_ID);
    url.searchParams.append('department', DEPARTMENT);

    const protocol = url.protocol === 'https:' ? https : http;
    const req = protocol.get(url.toString(), {
      headers: {
        'Authorization': `Bearer ${process.env.CORTEX_TOKEN || ''}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (parseErr) {
            reject(new Error(`Failed to parse response: ${parseErr.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function findDuplicates(missions) {
  const byTitle = {};
  missions.forEach(m => {
    const title = m.title || m.name || 'Untitled';
    if (!byTitle[title]) byTitle[title] = [];
    byTitle[title].push(m);
  });
  
  return Object.entries(byTitle)
    .filter(([_, items]) => items.length > 1)
    .map(([title, items]) => ({
      title,
      missions: items.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    }));
}

function findNonCritical(missions) {
  return missions.filter(m => {
    const status = (m.status || '').toUpperCase();
    const priority = (m.priority || '').toUpperCase();
    const rockTitle = m.rock?.title || m.rockTitle || '';
    
    const isPending = status === 'PENDING' || status === 'TODO';
    const isNotHigh = priority !== 'HIGH';
    const notLinkedToActiveRock = !ACTIVE_ROCKS.some(r => rockTitle.includes(r));
    
    return isPending && isNotHigh && notLinkedToActiveRock;
  });
}

function findCompletedTweaks(missions) {
  return missions.filter(m => {
    const status = (m.status || '').toUpperCase();
    const type = (m.type || '').toUpperCase();
    return status === 'COMPLETED' && (type === 'TWEAK' || type === 'BUGFIX');
  });
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  const shouldExecute = process.argv.includes('--execute');
  
  console.log('='.repeat(70));
  console.log('ENGINEERING MISSION CLEANUP');
  console.log('='.repeat(70));
  console.log(`Mode: ${isDryRun ? 'DRY RUN' : shouldExecute ? 'EXECUTE' : 'AUDIT ONLY'}`);
  console.log(`Company: ${COMPANY_ID}`);
  console.log(`Department: ${DEPARTMENT}`);
  console.log();
  
  let missions;
  try {
    missions = await fetchMissions();
    console.log(`✓ Fetched ${missions.length} missions`);
  } catch (err) {
    console.error(`✗ Failed to fetch missions: ${err.message}`);
    console.log();
    console.log('Possible issues:');
    console.log('  - CORTEX_TOKEN not set or invalid');
    console.log('  - Cortex API not running at', API_BASE);
    console.log('  - Network connectivity issue');
    console.log();
    console.log('To run this script:');
    console.log('  export CORTEX_TOKEN=your_token_here');
    console.log('  node scripts/mission-cleanup.js --dry-run');
    process.exit(1);
  }
  
  // Find duplicates
  const duplicates = findDuplicates(missions);
  console.log(`\n${'='.repeat(70)}`);
  console.log('DUPLICATE MISSIONS:');
  console.log('='.repeat(70));
  
  let duplicateIdsToDelete = [];
  if (duplicates.length === 0) {
    console.log('  No duplicates found. ✓');
  } else {
    duplicates.forEach(({ title, missions: dupMissions }) => {
      console.log(`\n  Title: "${title}"`);
      console.log(`  Count: ${dupMissions.length}`);
      
      // Keep the first (newest), mark rest for deletion
      const [keep, ...toDelete] = dupMissions;
      console.log(`  → KEEP: ${keep.id} (${keep.status || 'unknown status'})`);
      
      toDelete.forEach(m => {
        console.log(`  → DELETE: ${m.id}`);
        duplicateIdsToDelete.push({ id: m.id, title, reason: 'duplicate' });
      });
    });
  }
  
  // Find non-critical missions
  const nonCritical = findNonCritical(missions);
  console.log(`\n${'='.repeat(70)}`);
  console.log('NON-CRITICAL MISSIONS:');
  console.log('='.repeat(70));
  
  let nonCriticalIds = [];
  if (nonCritical.length === 0) {
    console.log('  No non-critical missions found. ✓');
  } else {
    nonCritical.forEach(m => {
      console.log(`\n  ID: ${m.id}`);
      console.log(`  Title: "${m.title || 'Untitled'}"`);
      console.log(`  Status: ${m.status || 'N/A'}, Priority: ${m.priority || 'N/A'}`);
      console.log(`  → CANCEL or DELETE`);
      nonCriticalIds.push({ id: m.id, title: m.title, reason: 'non-critical' });
    });
  }
  
  // Find completed tweaks (optional cleanup)
  const completedTweaks = findCompletedTweaks(missions);
  console.log(`\n${'='.repeat(70)}`);
  console.log('COMPLETED TWEAK/BUGFIX MISSIONS (informational):');
  console.log('='.repeat(70));
  if (completedTweaks.length === 0) {
    console.log('  None found.');
  } else {
    console.log(`  Found ${completedTweaks.length} completed tweak/bugfix missions.`);
    console.log('  These can be archived if not needed for history.');
  }
  
  // Summary
  const totalToRemove = duplicateIdsToDelete.length + nonCriticalIds.length;
  console.log(`\n${'='.repeat(70)}`);
  console.log('SUMMARY:');
  console.log('='.repeat(70));
  console.log(`  Duplicates to remove: ${duplicateIdsToDelete.length}`);
  console.log(`  Non-critical to close: ${nonCriticalIds.length}`);
  console.log(`  Total missions affected: ${totalToRemove}`);
  console.log(`  Current count: ${missions.length}`);
  console.log(`  After cleanup: ${missions.length - totalToRemove}`);
  
  if (isDryRun || !shouldExecute) {
    console.log(`\n${'='.repeat(70)}`);
    console.log('DRY RUN - No changes made.');
    console.log('='.repeat(70));
    console.log();
    console.log('To execute deletions:');
    console.log('  node scripts/mission-cleanup.js --execute');
    return;
  }
  
  // Execute deletions
  console.log(`\n${'='.repeat(70)}`);
  console.log('EXECUTING CLEANUP...');
  console.log('='.repeat(70));

  const allToDelete = [...duplicateIdsToDelete, ...nonCriticalIds];
  let successCount = 0;
  let failCount = 0;

  for (const item of allToDelete) {
    try {
      await deleteMission(item.id);
      console.log(`  ✓ Deleted: ${item.id} (${item.reason})`);
      successCount++;
    } catch (err) {
      console.error(`  ✗ Failed to delete ${item.id}: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('EXECUTION COMPLETE:');
  console.log('='.repeat(70));
  console.log(`  Successfully deleted: ${successCount}`);
  console.log(`  Failed: ${failCount}`);
}

async function deleteMission(missionId) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_BASE}/missions/${missionId}`);
    const protocol = url.protocol === 'https:' ? https : http;

    const req = protocol.request(url.toString(), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.CORTEX_TOKEN || ''}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 204) {
          resolve();
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
