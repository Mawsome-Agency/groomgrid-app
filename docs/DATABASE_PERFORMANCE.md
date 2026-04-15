# Database Performance Analysis

## Current State (as of April 14, 2026)

- **Database Size**: 8023 kB (8 MB)
- **Row Counts**:
  - Users: 7
  - Profiles: 7
  - Appointments: 1
  - Clients: 1
  - Pets/Payments/Feedback/Analytics: 0

## Growth Projections

At 100 subscribers with:
- ~10 clients/subscriber
- ~8 appointments/subscriber/week
- ~1000 appointments/month
- ~40K rows/year

With ~1KB/row average, we expect:
- ~40MB/year of appointment data
- Total projected DB size at 100 subscribers: ~50-100MB

This is well within the 25GB DigitalOcean droplet capacity.

## Index Impact

Each index adds approximately 10-20% of table size. With 6 new indexes on small tables, the impact is negligible.

## Key Queries Analyzed

### Subscription-Related Queries

1. `prisma.profile.findFirst({ where: { stripeCustomerId } })` in src/app/api/stripe/webhook/route.ts (lines 121, 147)
2. `prisma.profile.findUnique({ where: { userId } })` in src/app/api/checkout/route.ts (line 32) and src/app/api/profile/route.ts (line 12)
3. `prisma.profile.update({ where: { userId } })` in src/app/api/stripe/webhook/route.ts (lines 83, 106)

### Appointment Scheduling Queries

1. `prisma.appointment.findMany({ where: { userId, startTime: { gte, lte } } })` in src/app/api/appointments/route.ts (line 32)
2. `prisma.appointment.findMany({ where: { userId, status: { in }, OR: [...] } })` for conflict detection in src/app/api/appointments/route.ts (line 110)
3. `prisma.appointment.findMany({ where: { status, reminderSent, startTime: { gte, lte } } })` in src/lib/reminders.ts (lines 29, 53)

## Performance Recommendations

1. Added `CONCURRENTLY` to all CREATE INDEX statements to avoid locking production tables during migration
2. Removed redundant indexes that duplicate existing constraints
3. Added index on `profiles.subscriptionStatus` for efficient active subscription lookups
4. Considered index on `(status, reminderSent, startTime)` for reminder cron queries (covered by existing indexes)

## Recent Optimizations

See [DATABASE_OPTIMIZATIONS.md](./DATABASE_OPTIMIZATIONS.md) for details on recent database optimizations implemented to support scaling to 100 subscribers.

## Monitoring

Database performance is now monitored using:
- Custom scripts for database size analysis
- Query performance monitoring capabilities (when pg_stat_statements is available)
- Regular analysis of slow queries and performance bottlenecks
