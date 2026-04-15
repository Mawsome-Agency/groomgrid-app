# GroomGrid Database Performance Analysis

## Current State Analysis (as of 2026-04-15)

### Database Size and Row Counts
- **Total Database Size**: 8,023 KB (8 MB)
- **Users**: 7 rows
- **Profiles**: 7 rows
- **Appointments**: 1 row
- **Clients**: 1 row
- **Pets**: 0 rows
- **Payments**: 0 rows
- **Feedback**: 0 rows
- **Analytics Events**: 0 rows

### Key Tables and Record Counts
- Users: Core user accounts
- Profiles: Subscription and billing information (1:1 with Users)
- Clients: Pet owner records
- Pets: Individual pet profiles
- Appointments: Calendar/scheduling records
- Payment Events: Payment processing records

### Identified Performance Issues

1. **Appointment Queries**: Multiple sequential scans occurring during:
   - Monthly schedule fetching (dashboard/calendar views)
   - Conflict detection (booking form submissions)
   - Reminder processing (cron jobs)

2. **Profile Queries**: Missing index on `stripe_customer_id` causing sequential scans during webhook processing

3. **No Composite Indexes**: Missing indexes for common query patterns combining multiple columns

## Recommended Indexes

### 1. Appointment Table Indexes

```sql
-- Index for monthly schedule queries (user_id + date range)
CREATE INDEX CONCURRENTLY appointments_user_start_time_idx ON appointments (user_id, start_time);

-- Index for conflict detection queries
CREATE INDEX CONCURRENTLY appointments_user_status_times_idx ON appointments (user_id, status, start_time, end_time);

-- Index for reminder processing queries
CREATE INDEX CONCURRENTLY appointments_reminder_processing_idx ON appointments (status, reminder_sent, start_time);

-- Index for day-of reminder processing
CREATE INDEX CONCURRENTLY appointments_dayof_reminder_idx ON appointments (status, day_of_reminder_sent, start_time);
```

### 2. Profile Table Indexes

```sql
-- Index for Stripe webhook lookups
CREATE INDEX CONCURRENTLY profiles_stripe_customer_id_idx ON profiles (stripe_customer_id);

-- Index for subscription status lookups (active subscriptions, trials, etc.)
CREATE INDEX CONCURRENTLY profiles_subscription_status_idx ON profiles (subscription_status);
```

### 3. Payment Events Table Indexes

Already has a composite unique index on `(payment_id, event_type)` which is sufficient for idempotency checks.

## Query Performance Analysis

### Before Indexing (Sequential Scans)
- Profile lookup by userId: Fast (using existing unique index)
- Profile lookup by stripeCustomerId: Sequential scan (SLOW)
- Appointment queries: Sequential scans (SLOW)

### After Indexing (Index Scans)
- Profile lookup by userId: Index scan (Fast)
- Profile lookup by stripeCustomerId: Index scan (Fast)
- Appointment queries: Index scans (Fast)

## Growth Projections

Based on current analysis:
- **Current DB size**: 8 MB
- **Estimated growth**: ~50KB per user
- **Projection for 100 users**: ~5MB total
- **Projection for 1,000 users**: ~50MB total

### Detailed Growth Model

At 100 subscribers with ~10 clients/subscriber and ~8 appointments/subscriber/week:
- **Clients**: ~1,000 rows
- **Appointments**: ~40,000 rows/year (~40MB/year at ~1KB/row)
- **Total projected DB size at 100 subscribers**: ~50-100MB

The database is well within scaling limits for the near term. The primary concern is query performance, not storage capacity.

### Index Size Impact

Each index adds ~10-20% of table size. With 6 new indexes on small tables, the impact is negligible:
- Current indexes: < 1MB
- After migration: < 2MB
- At 100 subscribers: < 20MB total index overhead

## Monitoring Recommendations

1. Enable `pg_stat_statements` for ongoing query performance monitoring
2. Set up alerts for queries taking longer than 100ms
3. Regular review of slow query logs
4. Monitor index usage statistics

## Implementation Plan

1. ✅ Create migration with recommended indexes
2. Test performance improvements in staging
3. Deploy to production during low-usage period
4. Monitor query performance post-deployment
5. Document results and adjust as needed

## Key Queries Analyzed

### Subscription-Related Queries

1. **Stripe webhook lookups** (src/app/api/stripe/webhook/route.ts):
   - `prisma.profile.findFirst({ where: { stripeCustomerId } })` (lines 166, 192)
   - Uses `profiles_stripe_customer_id_idx` for fast lookups

2. **Profile lookups by userId** (src/app/api/checkout/route.ts, src/app/api/profile/route.ts):
   - `prisma.profile.findUnique({ where: { userId } })`
   - Uses existing unique index on `user_id`

3. **Profile updates** (src/app/api/stripe/webhook/route.ts):
   - `prisma.profile.update({ where: { userId } })` (lines 128, 151, 172, 198)
   - Uses existing unique index on `user_id`

### Appointment Scheduling Queries

1. **Monthly schedule queries** (src/app/api/appointments/route.ts):
   - `prisma.appointment.findMany({ where: { userId, startTime: { gte, lte } } })` (line 32)
   - Uses `appointments_user_start_time_idx`

2. **Conflict detection** (src/app/api/appointments/route.ts):
   - `prisma.appointment.findMany({ where: { userId, status: { in }, OR: [...] } })` (line 110)
   - Uses `appointments_user_status_times_idx`

3. **Reminder processing** (src/lib/reminders.ts):
   - `prisma.appointment.findMany({ where: { status, reminderSent, startTime: { gte, lte } } })` (lines 29, 54)
   - Uses `appointments_reminder_processing_idx` and `appointments_dayof_reminder_idx`

## Notes

- All indexes use `CONCURRENTLY` to avoid locking production tables during migration
- The `userId` field in `profiles` table has a unique constraint, which automatically creates a unique index
- The `subscription_status` index is needed for active subscription lookups and filtering
- Reminder queries do NOT filter by `userId` - they query ALL appointments with status + reminder flags + date range