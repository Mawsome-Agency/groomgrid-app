/**
 * Tests for: prisma/migrations/20260417000002_add_timezone_to_users/migration.sql
 *
 * Context: Production was patched with a bare ALTER TABLE on 2026-04-17 after a
 * live incident where the missing `timezone` column was blocking all signups.
 * The migration file was subsequently created and committed to git.
 *
 * Test strategy:
 * - Happy path: migration file exists, has correct SQL, targets correct table/column
 * - Idempotency: IF NOT EXISTS guard is present (critical for prod safety)
 * - Schema consistency: Prisma schema declares the timezone field
 * - Default value: 'America/New_York' matches between migration and schema
 * - Edge cases: file is not empty, is valid SQL structure, no destructive ops
 */

import * as fs from 'fs';
import * as path from 'path';

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const MIGRATION_DIR = path.join(
  REPO_ROOT,
  'prisma',
  'migrations',
  '20260417000002_add_timezone_to_users',
);
const MIGRATION_FILE = path.join(MIGRATION_DIR, 'migration.sql');
const SCHEMA_FILE = path.join(REPO_ROOT, 'prisma', 'schema.prisma');

describe('timezone migration — 20260417000002_add_timezone_to_users', () => {
  let migrationSql: string;
  let prismaSchema: string;

  beforeAll(() => {
    migrationSql = fs.readFileSync(MIGRATION_FILE, 'utf-8');
    prismaSchema = fs.readFileSync(SCHEMA_FILE, 'utf-8');
  });

  // ──────────────────────────────────────────────
  // File presence
  // ──────────────────────────────────────────────
  describe('migration file existence', () => {
    it('migration directory exists', () => {
      expect(fs.existsSync(MIGRATION_DIR)).toBe(true);
    });

    it('migration.sql file exists', () => {
      expect(fs.existsSync(MIGRATION_FILE)).toBe(true);
    });

    it('migration file is not empty', () => {
      expect(migrationSql.trim().length).toBeGreaterThan(0);
    });
  });

  // ──────────────────────────────────────────────
  // SQL content — correctness
  // ──────────────────────────────────────────────
  describe('migration SQL — correctness', () => {
    it('targets the users table', () => {
      expect(migrationSql).toMatch(/"users"/);
    });

    it('adds a timezone column', () => {
      expect(migrationSql).toMatch(/ADD COLUMN/i);
      expect(migrationSql).toMatch(/"timezone"/i);
    });

    it('declares timezone as TEXT type', () => {
      expect(migrationSql).toMatch(/TEXT/i);
    });

    it('enforces NOT NULL constraint', () => {
      expect(migrationSql).toMatch(/NOT NULL/i);
    });

    it("sets default value to 'America/New_York'", () => {
      expect(migrationSql).toMatch(/DEFAULT\s+'America\/New_York'/i);
    });
  });

  // ──────────────────────────────────────────────
  // Idempotency guard (critical — prod was manually patched)
  // ──────────────────────────────────────────────
  describe('migration SQL — idempotency', () => {
    it('uses IF NOT EXISTS guard so it is safe to re-run on patched envs', () => {
      expect(migrationSql).toMatch(/IF NOT EXISTS/i);
    });

    it('does not contain DROP or TRUNCATE (no destructive operations)', () => {
      const upperSql = migrationSql.toUpperCase();
      expect(upperSql).not.toMatch(/\bDROP\b/);
      expect(upperSql).not.toMatch(/\bTRUNCATE\b/);
    });

    it('does not alter or remove existing columns', () => {
      const upperSql = migrationSql.toUpperCase();
      expect(upperSql).not.toMatch(/ALTER COLUMN/);
      expect(upperSql).not.toMatch(/DROP COLUMN/);
    });

    it('contains exactly one ALTER TABLE statement', () => {
      const matches = migrationSql.match(/ALTER TABLE/gi);
      expect(matches).toHaveLength(1);
    });
  });

  // ──────────────────────────────────────────────
  // Prisma schema consistency
  // ──────────────────────────────────────────────
  describe('Prisma schema — timezone field', () => {
    it('User model declares a timezone field', () => {
      expect(prismaSchema).toMatch(/timezone\s+String/);
    });

    it("User.timezone has default value 'America/New_York'", () => {
      expect(prismaSchema).toMatch(/timezone\s+String\s+@default\("America\/New_York"\)/);
    });

    it('User.timezone is NOT optional (not nullable)', () => {
      // A nullable String in Prisma would be `String?` — confirm this field is NOT
      const timezoneFieldLine = prismaSchema
        .split('\n')
        .find((line) => /^\s+timezone\s+String/.test(line));

      expect(timezoneFieldLine).toBeDefined();
      expect(timezoneFieldLine).not.toMatch(/String\?/);
    });

    it('default in schema matches default in migration SQL', () => {
      const sqlDefault = migrationSql.match(/DEFAULT\s+'([^']+)'/i)?.[1];
      const schemaDefault = prismaSchema.match(/@default\("([^"]+)"\)/)?.[1];

      expect(sqlDefault).toBe('America/New_York');
      expect(schemaDefault).toBe('America/New_York');
      expect(sqlDefault).toBe(schemaDefault);
    });
  });

  // ──────────────────────────────────────────────
  // Migration ordering (sequential safety)
  // ──────────────────────────────────────────────
  describe('migration ordering', () => {
    it('migration timestamp 20260417000002 sorts after payment_lockouts (000000) and ab_tests (000001)', () => {
      const PAYMENT_LOCKOUTS = '20260417000000';
      const AB_TESTS = '20260417000001';
      const TIMEZONE = '20260417000002';

      expect(TIMEZONE > PAYMENT_LOCKOUTS).toBe(true);
      expect(TIMEZONE > AB_TESTS).toBe(true);
    });

    it('migration directory name follows Prisma naming convention (timestamp_description)', () => {
      const dirName = path.basename(MIGRATION_DIR);
      expect(dirName).toMatch(/^\d{14}_[a-z0-9_]+$/);
    });
  });
});
