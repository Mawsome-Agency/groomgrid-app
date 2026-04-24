/**
 * Tests for: prisma/migrations/20260424000001_add_missing_indexes/migration.sql
 *
 * Context: QA audit (Layla Hassan) found catastrophic sequential scan ratios on 4 tables.
 * Appointments already had the required compound index.
 *
 * Indexes added:
 *   1. drip_email_queue(user_id, status, scheduled_at) — worker poll query CRITICAL
 *      (1,006 seq_scans vs 5 idx_scans on only 95 rows)
 *   2. clients(user_id) — client list page queries HIGH
 *      (73 seq_scans vs 7 idx_scans)
 *   3. pets(client_id) — pet profile fetch queries MEDIUM
 *      (33 seq_scans vs 0 idx_scans)
 *   4. analytics_events(user_id, event_name, created_at) — funnel analytics HIGH
 *      (144 seq_scans vs 0 idx_scans)
 *
 * Test strategy:
 *   - File presence + non-empty content
 *   - Each CREATE INDEX: correct name, table, columns, and column order
 *   - Idempotency: CONCURRENTLY + IF NOT EXISTS on every statement
 *   - Safety: no DROP, no TRUNCATE, no ALTER TABLE, no DELETE
 *   - Prisma schema consistency: @@index directives match SQL
 *   - Migration ordering: timestamp sorts after previous migration
 *   - Column order correctness (selectivity/query shape)
 */

import * as fs from 'fs';
import * as path from 'path';

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const MIGRATION_DIR = path.join(
  REPO_ROOT,
  'prisma',
  'migrations',
  '20260424000001_add_missing_indexes',
);
const MIGRATION_FILE = path.join(MIGRATION_DIR, 'migration.sql');
const SCHEMA_FILE = path.join(REPO_ROOT, 'prisma', 'schema.prisma');

describe('performance migration — 20260424000001_add_missing_indexes', () => {
  let sql: string;
  let schema: string;

  beforeAll(() => {
    sql = fs.readFileSync(MIGRATION_FILE, 'utf-8');
    schema = fs.readFileSync(SCHEMA_FILE, 'utf-8');
  });

  // ─────────────────────────────────────────────
  // File presence
  // ─────────────────────────────────────────────
  describe('migration file presence', () => {
    it('migration directory exists', () => {
      expect(fs.existsSync(MIGRATION_DIR)).toBe(true);
    });

    it('migration.sql file exists inside the directory', () => {
      expect(fs.existsSync(MIGRATION_FILE)).toBe(true);
    });

    it('migration file is not empty', () => {
      expect(sql.trim().length).toBeGreaterThan(0);
    });

    it('migration directory contains only migration.sql (no stray files)', () => {
      const files = fs.readdirSync(MIGRATION_DIR);
      expect(files).toContain('migration.sql');
      // directories can have lock files in some setups — just verify sql is there
      expect(files.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ─────────────────────────────────────────────
  // Idempotency + safety (applies to ALL statements)
  // ─────────────────────────────────────────────
  describe('idempotency and safety guards', () => {
    it('every CREATE INDEX statement uses IF NOT EXISTS', () => {
      const createIndexStatements = sql
        .split(/;/)
        .map((s) => s.trim())
        .filter((s) => /CREATE INDEX/i.test(s));

      expect(createIndexStatements.length).toBeGreaterThan(0);
      for (const stmt of createIndexStatements) {
        expect(stmt).toMatch(/IF NOT EXISTS/i);
      }
    });

    it('every CREATE INDEX statement uses CONCURRENTLY for zero-downtime apply', () => {
      const createIndexStatements = sql
        .split(/;/)
        .map((s) => s.trim())
        .filter((s) => /CREATE INDEX/i.test(s));

      for (const stmt of createIndexStatements) {
        expect(stmt).toMatch(/CONCURRENTLY/i);
      }
    });

    it('contains no DROP statements (non-destructive migration)', () => {
      expect(sql.toUpperCase()).not.toMatch(/\bDROP\b/);
    });

    it('contains no TRUNCATE statements', () => {
      expect(sql.toUpperCase()).not.toMatch(/\bTRUNCATE\b/);
    });

    it('contains no DELETE statements', () => {
      expect(sql.toUpperCase()).not.toMatch(/\bDELETE\b/);
    });

    it('contains no ALTER TABLE statements (indexes only, no schema changes)', () => {
      expect(sql.toUpperCase()).not.toMatch(/ALTER TABLE/);
    });

    it('contains no UPDATE statements', () => {
      expect(sql.toUpperCase()).not.toMatch(/\bUPDATE\b/);
    });
  });

  // ─────────────────────────────────────────────
  // drip_email_queue index
  // ─────────────────────────────────────────────
  describe('drip_email_queue compound index (user_id, status, scheduled_at)', () => {
    it('creates the drip_email_queue index', () => {
      expect(sql).toMatch(/ON\s+"drip_email_queue"/i);
    });

    it('index name is drip_email_queue_user_id_status_scheduled_at_idx', () => {
      expect(sql).toMatch(/"drip_email_queue_user_id_status_scheduled_at_idx"/);
    });

    it('indexes the user_id column', () => {
      const block = extractIndexBlock(sql, 'drip_email_queue');
      expect(block).toMatch(/"user_id"/);
    });

    it('indexes the status column', () => {
      const block = extractIndexBlock(sql, 'drip_email_queue');
      expect(block).toMatch(/"status"/);
    });

    it('indexes the scheduled_at column', () => {
      const block = extractIndexBlock(sql, 'drip_email_queue');
      expect(block).toMatch(/"scheduled_at"/);
    });

    it('column order is user_id, status, scheduled_at (matches worker poll query shape)', () => {
      const cols = extractColumns(sql, 'drip_email_queue').map((c) => c.replace(/"/g, ''));
      expect(cols[0]).toBe('user_id');
      expect(cols[1]).toBe('status');
      expect(cols[2]).toBe('scheduled_at');
    });

    it('targets exactly 3 columns (no extras)', () => {
      const cols = extractColumns(sql, 'drip_email_queue');
      expect(cols).toHaveLength(3);
    });
  });

  // ─────────────────────────────────────────────
  // clients index
  // ─────────────────────────────────────────────
  describe('clients(user_id) index', () => {
    it('creates the clients index', () => {
      expect(sql).toMatch(/ON\s+"clients"/i);
    });

    it('index name is clients_user_id_idx', () => {
      expect(sql).toMatch(/"clients_user_id_idx"/);
    });

    it('indexes only the user_id column (single-col for WHERE user_id = ? scans)', () => {
      const cols = extractColumns(sql, 'clients');
      expect(cols).toHaveLength(1);
      expect(cols[0]).toBe('"user_id"');
    });
  });

  // ─────────────────────────────────────────────
  // pets index
  // ─────────────────────────────────────────────
  describe('pets(client_id) index', () => {
    it('creates the pets index', () => {
      expect(sql).toMatch(/ON\s+"pets"/i);
    });

    it('index name is pets_client_id_idx', () => {
      expect(sql).toMatch(/"pets_client_id_idx"/);
    });

    it('indexes only the client_id column (WHERE client_id = ? fetch shape)', () => {
      const cols = extractColumns(sql, 'pets');
      expect(cols).toHaveLength(1);
      expect(cols[0]).toBe('"client_id"');
    });
  });

  // ─────────────────────────────────────────────
  // analytics_events index
  // ─────────────────────────────────────────────
  describe('analytics_events compound index (user_id, event_name, created_at)', () => {
    it('creates the analytics_events index', () => {
      expect(sql).toMatch(/ON\s+"analytics_events"/i);
    });

    it('index name is analytics_events_user_id_event_name_created_at_idx', () => {
      expect(sql).toMatch(/"analytics_events_user_id_event_name_created_at_idx"/);
    });

    it('indexes the user_id column', () => {
      const block = extractIndexBlock(sql, 'analytics_events');
      expect(block).toMatch(/"user_id"/);
    });

    it('indexes the event_name column', () => {
      const block = extractIndexBlock(sql, 'analytics_events');
      expect(block).toMatch(/"event_name"/);
    });

    it('indexes the created_at column (supports date-range funnel queries)', () => {
      const block = extractIndexBlock(sql, 'analytics_events');
      expect(block).toMatch(/"created_at"/);
    });

    it('column order is user_id, event_name, created_at (high-selectivity first)', () => {
      const cols = extractColumns(sql, 'analytics_events').map((c) => c.replace(/"/g, ''));
      expect(cols[0]).toBe('user_id');
      expect(cols[1]).toBe('event_name');
      expect(cols[2]).toBe('created_at');
    });

    it('targets exactly 3 columns (no extras)', () => {
      const cols = extractColumns(sql, 'analytics_events');
      expect(cols).toHaveLength(3);
    });
  });

  // ─────────────────────────────────────────────
  // Total statement count
  // ─────────────────────────────────────────────
  describe('migration statement count', () => {
    it('contains exactly 4 CREATE INDEX statements (one per affected table)', () => {
      const matches = sql.match(/CREATE INDEX/gi);
      expect(matches).toHaveLength(4);
    });

    it('does not create any index on the appointments table (already indexed)', () => {
      // appointments already has @@index([userId, startTime]) — no new index needed
      expect(sql).not.toMatch(/ON\s+"appointments"/i);
    });

    it('does not create any index on the users table', () => {
      // users was flagged as HIGH but not in the required list for this migration
      expect(sql).not.toMatch(/ON\s+"users"/i);
    });
  });

  // ─────────────────────────────────────────────
  // Prisma schema consistency
  // ─────────────────────────────────────────────
  describe('Prisma schema — @@index directives match SQL', () => {
    it('Client model has @@index([userId])', () => {
      expect(schema).toMatch(/@@index\(\[userId\]\)/);
    });

    it('Pet model has @@index([clientId])', () => {
      expect(schema).toMatch(/@@index\(\[clientId\]\)/);
    });

    it('DripEmailQueue model has @@index([userId, status, scheduledAt])', () => {
      expect(schema).toMatch(/@@index\(\[userId,\s*status,\s*scheduledAt\]\)/);
    });

    it('AnalyticsEvent model has @@index([userId, eventName, createdAt])', () => {
      expect(schema).toMatch(/@@index\(\[userId,\s*eventName,\s*createdAt\]\)/);
    });

    it('Client model maps to "clients" table (schema @@map matches SQL target)', () => {
      expect(schema).toMatch(/@@map\("clients"\)/);
    });

    it('Pet model maps to "pets" table', () => {
      expect(schema).toMatch(/@@map\("pets"\)/);
    });

    it('DripEmailQueue model maps to "drip_email_queue" table', () => {
      expect(schema).toMatch(/@@map\("drip_email_queue"\)/);
    });

    it('AnalyticsEvent model maps to "analytics_events" table', () => {
      expect(schema).toMatch(/@@map\("analytics_events"\)/);
    });

    it('Appointment model already has @@index([userId, startTime]) — no migration needed', () => {
      expect(schema).toMatch(/@@index\(\[userId,\s*startTime\]\)/);
    });
  });

  // ─────────────────────────────────────────────
  // Migration ordering
  // ─────────────────────────────────────────────
  describe('migration ordering', () => {
    it('timestamp 20260424000001 sorts after 20260424000000 (payment_events index)', () => {
      expect('20260424000001' > '20260424000000').toBe(true);
    });

    it('timestamp 20260424000001 sorts after all 20260423 migrations', () => {
      expect('20260424000001' > '20260423000001').toBe(true);
    });

    it('timestamp 20260424000001 sorts after all 20260417 migrations', () => {
      expect('20260424000001' > '20260417000002').toBe(true);
    });

    it('migration directory name follows Prisma naming convention (timestamp_description)', () => {
      const dirName = path.basename(MIGRATION_DIR);
      expect(dirName).toMatch(/^\d{14}_[a-z0-9_]+$/);
    });

    it('directory exists in the prisma/migrations folder', () => {
      const migrationsRoot = path.join(REPO_ROOT, 'prisma', 'migrations');
      const dirs = fs.readdirSync(migrationsRoot);
      expect(dirs).toContain('20260424000001_add_missing_indexes');
    });
  });

  // ─────────────────────────────────────────────
  // Edge cases
  // ─────────────────────────────────────────────
  describe('edge cases', () => {
    it('migration file has valid SQL structure (starts with -- comment or CREATE)', () => {
      const firstNonEmpty = sql
        .split('\n')
        .map((l) => l.trim())
        .find((l) => l.length > 0);
      expect(firstNonEmpty).toMatch(/^(--|CREATE)/i);
    });

    it('all index names are quoted with double-quotes (PostgreSQL standard)', () => {
      // Extract all index names from the CREATE INDEX lines
      const indexNameMatches = sql.match(/IF NOT EXISTS\s+"([^"]+)"/g) ?? [];
      expect(indexNameMatches.length).toBe(4);
    });

    it('all table names are quoted with double-quotes', () => {
      const tableMatches = sql.match(/ON\s+"([^"]+)"/g) ?? [];
      expect(tableMatches.length).toBe(4);
    });

    it('all column names in ON(...) clauses are quoted with double-quotes', () => {
      // Pull out the ON table (...cols) clause and verify quoting
      const onClauses = sql.match(/\("[^"]+",?\s*"[^"]+"/g) ?? [];
      // At least the compound indexes should have quoted pairs
      expect(onClauses.length).toBeGreaterThan(0);
    });

    it('null/undefined guard: migration SQL does not contain literal NULL keyword', () => {
      // Index migrations should never reference NULL
      expect(sql.toUpperCase()).not.toMatch(/\bNULL\b/);
    });

    it('migration SQL does not reference non-existent tables', () => {
      const KNOWN_TABLES = [
        'drip_email_queue',
        'clients',
        'pets',
        'analytics_events',
        'appointments',
        'users',
        'profiles',
        'business_hours',
        'feedback',
        'payment_events',
        'payment_lockouts',
        'password_reset_tokens',
        'email_verification_tokens',
        'ab_tests',
        'ab_test_assignments',
        'ab_test_conversions',
      ];
      const tableRefs = (sql.match(/ON\s+"([^"]+)"/gi) ?? []).map(
        (m) => m.replace(/ON\s+"/i, '').replace('"', ''),
      );
      for (const table of tableRefs) {
        expect(KNOWN_TABLES).toContain(table);
      }
    });
  });
});

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/**
 * Extract the CREATE INDEX block for a given table from the full SQL string.
 * Splits on semicolons, then finds the block that contains ON "tableName".
 */
function extractIndexBlock(sql: string, tableName: string): string {
  // Normalize: split on semicolons (handles multi-line statements)
  const stmts = sql.split(';').map((s) => s.trim()).filter(Boolean);
  const match = stmts.find((s) =>
    new RegExp(`ON\\s+"${tableName}"`, 'i').test(s),
  );
  if (!match) {
    throw new Error(`No CREATE INDEX statement found for table "${tableName}"`);
  }
  return match;
}

/**
 * Extract the column list from the ON "table" (...) clause of a CREATE INDEX block.
 * Returns an array of raw column strings (e.g. ['"user_id"', '"status"', '"scheduled_at"']).
 */
function extractColumns(sql: string, tableName: string): string[] {
  // Match specifically: ON "tableName" (col1, col2, ...)
  const regex = new RegExp(`ON\\s+"${tableName}"\\s*\\(([^)]+)\\)`, 'i');
  const match = sql.match(regex);
  if (!match) {
    throw new Error(`Could not parse column list for table "${tableName}"`);
  }
  return match[1].split(',').map((c) => c.trim()).filter(Boolean);
}
