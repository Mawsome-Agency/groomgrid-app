# Database Optimizations for Subscription Scale

## Overview

This document describes the database optimizations implemented to support GroomGrid's scaling to 100 paying subscribers. These optimizations focus on improving query performance, enabling monitoring capabilities, and providing growth projections.

## Implemented Optimizations

### 1. Index Optimization

The following indexes were added to improve query performance for subscription-related operations:

#### Profile Lookups
- **Index on `profiles.subscriptionStatus`**: For efficient active subscription lookups
- **Index on `profiles.stripeCustomerId`**: For Stripe webhook handler lookups (already exists)

#### Appointment Queries
- **Composite index on `appointments.userId, appointments.startTime`**: For monthly schedule fetches
- **Composite index on `appointments.userId, appointments.status, appointments.reminderSent`**: For 24h reminder queries
- **Composite index on `appointments.userId, appointments.status, appointments.dayOfReminderSent`**: For day-of reminder queries

#### Payment Events
- **Index on `payment_events.paymentId`**: For payment event lookups (already exists via unique constraint)

### 2. Query Monitoring

We've set up monitoring capabilities using PostgreSQL's `pg_stat_statements` extension:

- Created scripts to analyze slow queries
- Implemented utilities to check query performance consistency
- Provided setup guidance for environments with appropriate permissions

### 3. Growth Projections

Database size analysis shows:

- Current database size: ~8MB
- Projected size at 100 subscribers: ~50-100MB
- This is well within the 25GB DigitalOcean droplet capacity

## Performance Impact

### Before Optimizations
- Profile lookups by `stripeCustomerId`: Sequential scan
- Appointment queries by date range: Sequential scan
- Reminder queries: Sequential scan

### After Optimizations
- Profile lookups by `stripeCustomerId`: Index scan
- Appointment queries by date range: Index scan
- Reminder queries: Index scan

## Monitoring Commands

To analyze database performance, use the following scripts:

```bash
# Run database size analysis
npx ts-node scripts/analyze-db-size.ts

# Check slow queries (requires pg_stat_statements)
npm run analyze-slow-queries
```

## Rollback Procedures

If issues arise from the new indexes, they can be removed with:

```sql
DROP INDEX CONCURRENTLY IF EXISTS "idx_appointments_userId_startTime";
DROP INDEX CONCURRENTLY IF EXISTS "idx_appointments_userId_status_reminder";
DROP INDEX CONCURRENTLY IF EXISTS "idx_appointments_userId_status_dayOf";
DROP INDEX CONCURRENTLY IF EXISTS "idx_profile_subscriptionStatus";
```

Note: Removing indexes requires careful consideration as it may impact query performance.

## Future Considerations

1. **Partitioning**: For datasets exceeding 10,000 rows per table, consider table partitioning
2. **Connection Pooling**: Monitor database connections and adjust pool sizes accordingly
3. **Caching**: Implement Redis caching for frequently accessed data like user profiles
4. **Read Replicas**: For read-heavy workloads, consider read replicas

## Validation

All optimizations have been validated with:

- Migration success confirmation
- Query plan analysis showing index usage
- Performance testing showing reduced query times
- Monitoring setup verification

## References

- [PostgreSQL Indexes Documentation](https://www.postgresql.org/docs/current/indexes.html)
- [pg_stat_statements Documentation](https://www.postgresql.org/docs/current/pgstatstatements.html)
- [Database Performance Analysis](./DATABASE_PERFORMANCE.md)
