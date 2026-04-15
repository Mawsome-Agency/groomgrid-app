# EXPLAIN ANALYZE Results for Key Queries

This document documents the EXPLAIN ANALYZE results for key subscription and appointment queries.

## How to Run EXPLAIN ANALYZE

To run EXPLAIN ANALYZE on production, SSH into the server and run:

```bash
ssh -i /Users/cortex/.ssh/groomgrid_deploy root@68.183.151.222
sudo -u postgres psql -d groomgrid_prod
```

Then run the EXPLAIN ANALYZE commands below.

## Subscription-Related Queries

### 1. Profile lookup by stripeCustomerId (Stripe webhook)

**Query Pattern:**
```sql
EXPLAIN ANALYZE
SELECT * FROM profiles 
WHERE stripe_customer_id = 'cus_xxxxx';
```

**Expected Plan (with index):**
```
Index Scan using profiles_stripe_customer_id_idx on profiles  (cost=0.28..8.29 rows=1 width=...)
  Index Cond: (stripe_customer_id = 'cus_xxxxx'::text)
```

**Expected Plan (without index):**
```
Seq Scan on profiles  (cost=0.00..1.07 rows=1 width=...)
  Filter: (stripe_customer_id = 'cus_xxxxx'::text)
```

**Code Location:** `src/app/api/stripe/webhook/route.ts` (lines 166, 192)

---

### 2. Profile lookup by userId (checkout, profile API)

**Query Pattern:**
```sql
EXPLAIN ANALYZE
SELECT * FROM profiles 
WHERE user_id = 'cljxxxxx';
```

**Expected Plan:**
```
Index Scan using profiles_user_id_key on profiles  (cost=0.28..8.29 rows=1 width=...)
  Index Cond: (user_id = 'cljxxxxx'::text)
```

**Note:** This uses the unique constraint index automatically created by Prisma.

**Code Locations:** 
- `src/app/api/checkout/route.ts` (line 37)
- `src/app/api/profile/route.ts` (line 12)

---

### 3. Profile update by userId (Stripe webhook)

**Query Pattern:**
```sql
EXPLAIN ANALYZE
UPDATE profiles 
SET subscription_status = 'active'
WHERE user_id = 'cljxxxxx';
```

**Expected Plan:**
```
Update on profiles  (cost=0.28..8.30 rows=1 width=...)
  ->  Index Scan using profiles_user_id_key on profiles  (cost=0.28..8.29 rows=1 width=...)
        Index Cond: (user_id = 'cljxxxxx'::text)
```

**Code Location:** `src/app/api/stripe/webhook/route.ts` (lines 128, 151, 172, 198)

---

## Appointment Scheduling Queries

### 4. Monthly schedule query (appointments API)

**Query Pattern:**
```sql
EXPLAIN ANALYZE
SELECT * FROM appointments 
WHERE user_id = 'cljxxxxx'
  AND start_time >= '2026-04-01'::date
  AND start_time <= '2026-04-30'::date
ORDER BY start_time ASC;
```

**Expected Plan (with index):**
```
Index Scan using appointments_user_start_time_idx on appointments  (cost=0.28..8.29 rows=1 width=...)
  Index Cond: ((user_id = 'cljxxxxx'::text) AND (start_time >= '2026-04-01'::date) AND (start_time <= '2026-04-30'::date))
```

**Expected Plan (without index):**
```
Sort  (cost=1.14..1.15 rows=1 width=...)
  Sort Key: start_time
  ->  Seq Scan on appointments  (cost=0.00..1.13 rows=1 width=...)
        Filter: ((user_id = 'cljxxxxx'::text) AND (start_time >= '2026-04-01'::date) AND (start_time <= '2026-04-30'::date))
```

**Code Location:** `src/app/api/appointments/route.ts` (line 32)

---

### 5. Conflict detection query (appointments API)

**Query Pattern:**
```sql
EXPLAIN ANALYZE
SELECT * FROM appointments 
WHERE user_id = 'cljxxxxx'
  AND status IN ('scheduled', 'confirmed')
  AND (
    (start_time <= '2026-04-15 10:00:00'::timestamp AND end_time > '2026-04-15 10:00:00'::timestamp)
    OR
    (start_time < '2026-04-15 11:00:00'::timestamp AND end_time >= '2026-04-15 11:00:00'::timestamp)
  );
```

**Expected Plan (with index):**
```
Bitmap Heap Scan on appointments  (cost=4.28..12.29 rows=1 width=...)
  Recheck Cond: ((user_id = 'cljxxxxx'::text) AND (status = ANY (ARRAY['scheduled'::text, 'confirmed'::text])))
  Filter: (((start_time <= '2026-04-15 10:00:00'::timestamp) AND (end_time > '2026-04-15 10:00:00'::timestamp)) OR ((start_time < '2026-04-15 11:00:00'::timestamp) AND (end_time >= '2026-04-15 11:00:00'::timestamp)))
  ->  Bitmap Index Scan on appointments_user_status_times_idx  (cost=0.00..4.28 rows=1 width=...)
        Index Cond: ((user_id = 'cljxxxxx'::text) AND (status = ANY (ARRAY['scheduled'::text, 'confirmed'::text])))
```

**Code Location:** `src/app/api/appointments/route.ts` (line 110)

---

### 6. 24h reminder query (reminders cron)

**Query Pattern:**
```sql
EXPLAIN ANALYZE
SELECT * FROM appointments 
WHERE status = 'scheduled'
  AND reminder_sent = false
  AND start_time >= NOW() + INTERVAL '23 hours'
  AND start_time <= NOW() + INTERVAL '25 hours';
```

**Expected Plan (with index):**
```
Index Scan using appointments_reminder_processing_idx on appointments  (cost=0.28..8.29 rows=1 width=...)
  Index Cond: ((status = 'scheduled'::text) AND (reminder_sent = false) AND (start_time >= (now() + '23:00:00'::interval)) AND (start_time <= (now() + '25:00:00'::interval)))
```

**Code Location:** `src/lib/reminders.ts` (line 29)

---

### 7. Day-of reminder query (reminders cron)

**Query Pattern:**
```sql
EXPLAIN ANALYZE
SELECT * FROM appointments 
WHERE status = 'scheduled'
  AND day_of_reminder_sent = false
  AND start_time >= NOW()
  AND start_time <= NOW() + INTERVAL '12 hours';
```

**Expected Plan (with index):**
```
Index Scan using appointments_dayof_reminder_idx on appointments  (cost=0.28..8.29 rows=1 width=...)
  Index Cond: ((status = 'scheduled'::text) AND (day_of_reminder_sent = false) AND (start_time >= now()) AND (start_time <= (now() + '12:00:00'::interval)))
```

**Code Location:** `src/lib/reminders.ts` (line 54)

---

## Index Usage Verification

To verify which indexes are being used, run:

```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan AS index_scans,
  idx_tup_read AS tuples_read,
  idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

Expected results after migration:
- `profiles_stripe_customer_id_idx`: High scan count (webhook events)
- `profiles_subscription_status_idx`: Moderate scan count (subscription lookups)
- `appointments_user_start_time_idx`: High scan count (calendar views)
- `appointments_user_status_times_idx`: Moderate scan count (conflict detection)
- `appointments_reminder_processing_idx`: Moderate scan count (reminder cron)
- `appointments_dayof_reminder_idx`: Moderate scan count (reminder cron)

## Performance Benchmarks

### Before Indexing (Estimated)
- Profile lookup by stripeCustomerId: ~5-10ms (sequential scan)
- Monthly schedule query: ~10-20ms (sequential scan + sort)
- Conflict detection: ~15-30ms (sequential scan)
- Reminder queries: ~10-20ms (sequential scan)

### After Indexing (Expected)
- Profile lookup by stripeCustomerId: ~0.5-1ms (index scan)
- Monthly schedule query: ~1-2ms (index scan)
- Conflict detection: ~2-5ms (index scan)
- Reminder queries: ~1-3ms (index scan)

## Notes

- All indexes use `CONCURRENTLY` to avoid locking production tables during migration
- The `userId` field in `profiles` table has a unique constraint, which automatically creates a unique index
- Reminder queries do NOT filter by `userId` - they query ALL appointments with status + reminder flags + date range
- The `subscription_status` index is needed for active subscription lookups and filtering
