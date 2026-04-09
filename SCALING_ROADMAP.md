# GroomGrid Scaling Roadmap: MVP to 1M Users

**Author:** Priya Kapoor, Scale Architect
**Date:** 2026-04-09
**Context:** SaaS for pet grooming business management
**Supports:** "Get first 100 paying subscribers" rock - ensures infrastructure scales as we succeed

---

## Executive Summary

GroomGrid's infrastructure is currently sized for MVP with single-user load. This document outlines the complete scaling path from the current state (single droplet) to a high-availability architecture supporting 1M users.

**Key Philosophy:** This won't scale because... horizontal scaling requires deliberate architecture decisions now, not later. Every infrastructure choice today becomes a constraint tomorrow.

---

## 1. Current Baseline Analysis

### 1.1 Infrastructure State (As of 2026-04-09)

```
Environment: DigitalOcean droplet in NYC3
┌─────────────────────────────────────────────────────────────┐
│ Resources: 1GB RAM / 1 vCPU / 25GB SSD              │
│ Services: production + staging + database on same droplet    │
│ Swap: 1GB (342MB used - concerning)                    │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Current Resource Utilization

| Metric | Value | Assessment |
|--------|--------|------------|
| **Memory** | 620MB/961MB used (65%) | Headroom limited, swap in use (warning sign) |
| **Disk** | 7.6GB/24GB used (33%) | Adequate for current scale |
| **CPU** | Load avg 0.18 (idle) | No current bottleneck |
| **Database** | 7983 kB, 7 users | Trivial data volume |
| **Services** | nginx + PM2 + PostgreSQL | Single point of failure |

### 1.3 Current Bottlenecks (Identified)

1. **Memory Pressure:** Swap usage indicates memory constraints. At 50 users, we'll hit OOM.
2. **Single Point of Failure:** Droplet = 100% downtime if it fails.
3. **CPU Bottleneck:** 1 vCPU can't handle concurrent user workloads efficiently.
4. **Database Co-location:** Database on same host as apps = resource contention.
5. **No Caching:** Every query hits the database (breed lookups are hot!).
6. **No Queue:** Email reminders run synchronously or via cron (blocks requests).

### 1.4 Database Schema Analysis

| Table | Current Rows | Growth Factor | Read Pattern | Write Pattern |
|-------|---------------|----------------|--------------|---------------|
| users | 7 | 1:1 with customers | High (auth) | Medium |
| clients | 1 | ~50 per user | Very High | Medium |
| pets | 0 | ~2 per client | High | Low |
| appointments | 1 | ~5/day/groomer | Very High | High |
| analytics_events | 0 | Unlimited | Medium | Very High |
| drip_email_queue | 0 | Campaign-driven | Medium | Very High |

**Read-Heavy Tables:** clients, pets, appointments (dashboard/calendar loads)
**Write-Heavy Tables:** analytics_events, drip_email_queue

---

## 2. Scaling Roadmap with Mileposts

### Scale Milepost: 100 Users → CURRENT STATE ✅

**Infrastructure:** 1GB droplet (1 vCPU) - everything co-located
**Cost:** $6/month

```
┌─────────────────────────────────────────┐
│   [Nginx]                          │
│     ↓                               │
│   [App: prod + staging]              │
│     ↓                               │
│   [PostgreSQL]                       │
└─────────────────────────────────────────┘
```

**Status:** ✅ Operational
**Trigger for next milestone:** 50% memory utilization sustained (>50 paying users)

---

### Scale Milepost: 1K Users → UPGRADE DROPLET ⚡

**Infrastructure:** Upgrade to 2GB droplet (1 vCPU, 60GB disk)
**Cost:** $18/month

```
┌─────────────────────────────────────────┐
│   [Nginx]                          │
│     ↓                               │
│   [App: prod + staging]              │
│     ↓                               │
│   [PostgreSQL + 1GB swap]            │
└─────────────────────────────────────────┘
```

**When to upgrade:** When memory > 80% for 24h OR swap > 50%

**Load Modeling (1K users, ~50 concurrent):**

| Metric | Estimate | Rationale |
|--------|-----------|-----------|
| Daily requests | ~50K | 50 requests/user/day |
| Peak concurrent | ~50 | 5% concurrency assumption |
| DB connections | ~100 | Connection pooling + 2 per process |
| Memory required | ~1.5GB | App + DB + OS overhead |
| CPU requirements | ~30-40% | Web workload is I/O bound |

**Action Items:**
- [ ] Monitor memory usage with Prometheus/Node Exporter
- [ ] Set up alerts at 75% memory utilization
- [ ] Prepare upgrade script for zero-downtime droplet resize

---

### Scale Milepost: 10K Users → SPLIT ARCHITECTURE 🔀

**Infrastructure:** 2 droplets (1 for app, 1 for database)
**Cost:** $24/month ($12 + $12)

```
┌──────────────────┐          ┌──────────────────┐
│   App Droplet   │          │  DB Droplet     │
│   [Nginx]       │ ───────→ │ [PostgreSQL]     │
│     ↓            │   port   │                 │
│   [App]         │   5432   │                 │
└──────────────────┘          └──────────────────┘
     ↑                              ↓
[Staging] on same droplet      [Backups to S3-compatible]
```

**When to split:** App droplet CPU > 70% sustained OR DB query latency > 100ms

**Load Modeling (10K users, ~500 concurrent):**

| Metric | Estimate | Rationale |
|--------|-----------|-----------|
| Daily requests | ~500K | 50 requests/user/day |
| Peak concurrent | ~500 | 5% concurrency assumption |
| DB queries/sec | ~200-300 | 2-3 queries per request average |
| Memory required (app) | ~1.5GB | Node.js + nginx |
| Memory required (db) | ~2GB | Buffer pool + query cache |
| CPU requirements | ~60% (app), ~40% (db) | Asymmetric load |

**Network Considerations:**
- Private DO network for app → DB (no public exposure)
- Database droplet: block port 5432 from public internet
- App droplet: only expose 80/443

**Action Items:**
- [ ] Add Redis for session storage (breed cache)
- [ ] Set up database connection pooling (PgBouncer)
- [ ] Configure database backups to Spaces
- [ ] Implement health checks between app and DB

---

### Scale Milepost: 100K Users → LOAD BALANCER + REPLICAS 🔄

**Infrastructure:** 4 droplets (2 app + 2 db replica + 1 load balancer)
**Cost:** $72/month

```
                 ┌─────────────────┐
                 │  Load Balancer │
                 │   (HAProxy)    │
                 └────────┬────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    ┌────────┐      ┌────────┐     ┌──────────┐
    │ App 1  │      │ App 2  │     │   DB    │
    │        │      │        │     └──────┬───┘
    └────────┘      └────────┘            │
       ↑                 ↑           ┌──────┴──────┐
   [Staging]      [Staging]     │   Replica   │
                                  │    (Read)   │
                                  └─────────────┘
```

**When to add replicas:** App droplets > 70% CPU OR read latency > 200ms

**Load Modeling (100K users, ~5K concurrent):**

| Metric | Estimate | Rationale |
|--------|-----------|-----------|
| Daily requests | ~5M | 50 requests/user/day |
| Peak concurrent | ~5K | 5% concurrency assumption |
| Read queries/sec | ~2K-3K | Dashboard loads are read-heavy |
| Write queries/sec | ~200-300 | Appointments, signups |
| Read/Write Ratio | 10:1 | Typical for SaaS dashboards |

**Replication Strategy:**
- **Primary DB:** Handles all writes
- **Read Replica:** Serves dashboard queries, appointment listings
- **Replication Lag:** < 1 second target
- **Failover:** Semi-automatic (manual switchover, TTL DNS)

**Load Balancer Configuration:**
- Algorithm: Round-robin (consistent hashing for sessions)
- Health checks: /health endpoint every 10s
- Session persistence: Sticky sessions for WebSocket connections
- SSL termination: At LB, not app servers

**Action Items:**
- [ ] Set up managed Redis cluster (for shared session store)
- [ ] Configure PostgreSQL streaming replication
- [ ] Implement read/write routing in Prisma config
- [ ] Add failover monitoring/alerting

---

### Scale Milepost: 1M Users → FULL HIGH AVAILABILITY 🚀

**Infrastructure:** Managed DB, Redis cluster, CDN, 6+ app servers
**Cost:** ~$300-500/month

```
                              ┌─────────────┐
                              │   CDN/WAF   │
                              │   (Cloudflare)│
                              └──────┬──────┘
                                     │
                        ┌────────────┴────────────┐
                        │                     │
                   ┌────────┐           ┌────────┐
                   │  DO LB │           │  DO LB │
                   └───┬────┘           └───┬────┘
                       │                     │
     ┌───────────────────┼────────────────────┼──────────────┐
     │                   │                    │              │
 ┌─────────┐       ┌─────────┐       ┌─────────┐    ┌──────────┐
 │  App 1  │       │  App 2  │       │  App 3  │    │  App 4   │
 └─────────┘       └─────────┘       └─────────┘    └──────────┘
      ↓                 ↓                 ↓                ↓
   [Redis Cluster]           [Redis Cluster]     [Redis Cluster]
      ↓                 ↓                 ↓                ↓
┌────────────────────────────────────────────────────────────┐
│              Managed PostgreSQL (HA)                    │
│  [Primary] ←────→ [Replica 1] ←────→ [Replica 2]  │
│         │                 │               │             │
└─────────┴─────────────────┴───────────────┴─────────┘
              ↓                 ↓               ↓
         [Backups]      [Point-in-Time]  [Analytics] 
```

**When to move to HA:** Revenue > $50K/month OR SLO > 99.9%

**Load Modeling (1M users, ~50K concurrent):**

| Metric | Estimate | Rationale |
|--------|-----------|-----------|
| Daily requests | ~50M | 50 requests/user/day |
| Peak concurrent | ~50K | 5% concurrency assumption |
| Read queries/sec | ~20K-30K | Massive dashboard load |
| Write queries/sec | ~2K-3K | Appointments, signups |
| Data throughput | ~10GB/day | Logs, analytics, backups |

**High Availability Components:**

1. **Managed Database:** DigitalOcean Managed PostgreSQL (3-node HA)
   - Auto-failover: < 30 seconds
   - Point-in-time recovery: 7-30 days
   - Read replicas: 2 for read-heavy queries
   - Cost: ~$150-200/month

2. **Redis Cluster:** Managed or self-hosted with Sentinel
   - Session storage: Distributed across 3 nodes
   - Cache: Breed data, user sessions, appointment lists
   - Replication: Master-slave with automatic failover
   - Cost: ~$50/month

3. **CDN/WAF:** Cloudflare Enterprise or DO Spaces CDN
   - Static assets: JS bundles, images, fonts
   - API edge caching: GET endpoints with 1-5 min TTL
   - DDoS protection: Layer 3-7 filtering
   - Cost: ~$100/month

4. **App Servers:** 4-6 droplets (2GB each, auto-scale)
   - Horizontal pod autoscaling (Kubernetes) or PM2 cluster mode
   - Graceful shutdown: Drain connections before termination
   - Health checks: /healthz with dependency checks
   - Cost: ~$72/month

**Action Items:**
- [ ] Migrate to managed PostgreSQL (zero downtime)
- [ ] Set up Redis Cluster with Sentinel
- [ ] Configure Cloudflare CDN with WAF
- [ ] Implement database sharding (see Section 4)
- [ ] Set up multi-region deployment (optional for global scale)

---

## 3. Caching Strategy

### 3.1 Cacheable Data Identification

| Data Type | Cache Key | TTL | Hit Ratio Target |
|-----------|------------|-----|-----------------|
| **Breed Intelligence** | `breed:{breedName}` | 1 hour | 90% |
| **User Session** | `session:{userId}` | 30 min | 95% |
| **Business Hours** | `hours:{userId}` | 1 hour | 85% |
| **Appointment List** | `appts:{userId}:{date}` | 5 min | 60% |
| **Client List** | `clients:{userId}` | 10 min | 70% |
| **Pricing Plans** | `plans` | 1 hour | 99% |

### 3.2 Cache Implementation Roadmap

**Phase 1 (1K users):** Single Redis instance
```typescript
// Basic caching wrapper
async function getCached<T>(key: string, fn: () => Promise<T>, ttl: number): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  const data = await fn();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}
```

**Phase 2 (10K users):** Cache warming + invalidation
```typescript
// Background warming for hot data
async function warmCache() {
  const popularBreeds = await getPopularBreeds();
  for (const breed of popularBreeds) {
    await getBreedInfo(breed); // Triggers cache
  }
}

// Event-driven invalidation
prisma.$use(async (params, next) => {
  const result = await next(params);
  if (params.model === 'Appointment' && params.action === 'create') {
    await redis.del(`appts:${result.userId}:${formatDate(result.startTime)}`);
  }
  return result;
});
```

**Phase 3 (100K+ users):** Redis Cluster + write-through
```typescript
// Write-through cache for breed data
async function updateBreedInfo(breed: string, info: BreedInfo) {
  await redis.hset(`breed:${breed}`, info);
  await redis.expire(`breed:${breed}`, 3600);
  await prisma.breed.upsert({ where: { name: breed }, data: info });
}
```

### 3.3 Cache Hit Ratio Targets by Scale

| Scale | Target | Strategy |
|-------|--------|----------|
| 1K users | 60% | Breed data, sessions, pricing |
| 10K users | 80% | Add appointment lists, client lists |
| 100K users | 90% | Add query result caching, edge caching |
| 1M users | 95% | Full-page caching, pre-warming, multi-layer |

### 3.4 Cache Invalidation Rules

1. **Time-based (TTL):** Simple data (pricing, business hours)
2. **Event-based:** Write-through for high-accuracy (appointments)
3. **Manual:** Admin-triggered for emergency invalidation
4. **Lazy:** Rebuild on cache miss with background refresh

---

## 4. Database Sharding Plan

### 4.1 When to Shard

**Trigger Point:** 100K active users (NOT total accounts)

**Sharding Indicators:**
- Table size > 10GB per tenant group
- Query latency > 500ms (95th percentile)
- Database CPU > 70% sustained
- Backup time > 1 hour

**DO NOT SHARD IF:**
- Can add read replicas
- Can optimize queries/indexes
- Can archive old data

### 4.2 Shard Key Options

| Shard Key | Pros | Cons | Recommendation |
|-----------|-------|-------|----------------|
| **userId** | Simple, clear ownership | Hot users cause imbalance | ✅ **Primary choice** |
| **businessId** | Aligns with pricing tiers | Multi-tenant complexity | ⚠️ Secondary |
| **region** | Data locality compliance | Not relevant for groomers | ❌ Don't use |

**Recommended Sharding Strategy:**
```sql
-- Shard 1: userId[0] (users with even CUID ending)
-- Shard 2: userId[1] (users with odd CUID ending)
-- Fallback: Shard 1 for small accounts (< 50 pets)
```

### 4.3 Read Replica Strategy

**Pre-sharding (10K-100K users):**
- 1 primary + 1-2 read replicas
- Route all dashboard queries to replicas
- Route all writes to primary

**Post-sharding (100K+ users):**
- Each shard has 1 primary + 1 replica
- Global replica for cross-shard analytics
- Analytics queries run on replica with delayed consistency

**Prisma Configuration:**
```typescript
// Read/write routing in production
datasources = {
  db: {
    url: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL, // For writes
    replicaUrl: process.env.REPLICA_URL, // For reads
  }
}

// Middleware for read routing
prisma.$use(async (params, next) => {
  if (isReadOnlyOperation(params)) {
    prisma.$connect({ url: process.env.REPLICA_URL });
  }
  return next(params);
});
```

### 4.4 Sharding Implementation Plan

**Phase 1: Identify Shardable Tables**
```sql
-- Shardable: tables with userId foreign key
users, profiles, clients, pets, appointments, business_hours, drip_email_queue

-- Global: tables without clear tenant ownership
analytics_events (analyze separately), feedback, payment_events
```

**Phase 2: Create Shard Mapping Table**
```sql
CREATE TABLE shard_mapping (
  user_id VARCHAR(255) PRIMARY KEY,
  shard_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Determine shard on signup
INSERT INTO shard_mapping (user_id, shard_id)
VALUES (cuid(), (SELECT COUNT(*) % 2 FROM shard_mapping) + 1);
```

**Phase 3: Implement Shard-Aware Queries**
```typescript
// Helper to route to correct shard
function getShardDatabase(userId: string): string {
  const shardId = getShardId(userId);
  return process.env[`SHARD_${shardId}_DB_URL`];
}

// Use in queries
const dbUrl = getShardDatabase(userId);
const prisma = new PrismaClient({ datasources: { db: { url: dbUrl }}});
```

---

## 5. Queue Strategy for Async Work

### 5.1 Identified Async Tasks

| Task | Frequency | Criticality | Current Implementation |
|------|-----------|--------------|----------------------|
| **Email reminders** | 2-5K/day | High | ✅ Drip queue (needs worker) |
| **Analytics events** | 50K-500K/day | Medium | ❌ Synchronous (blocks!) |
| **AI breed suggestions** | 1K-10K/day | Low | ❌ Not implemented yet |
| **Payment webhooks** | 100-1K/day | Critical | ✅ Handled (blocking) |
| **Invoice generation** | 100-1K/day | High | ❌ Not implemented |

### 5.2 Queue Implementation: BullMQ + Redis

**Architecture:**
```
┌─────────┐                    ┌─────────────┐
│   App   │ → push event →   │   Redis     │
└─────────┘                    └──────┬──────┘
                                      │
                            ┌─────────┴─────────┐
                            │                   │
                         ┌───┴───┐          ┌───┴───┐
                         │Worker 1│          │Worker 2│
                         └───────┘          └───────┘
```

**Implementation:**
```typescript
// Producer: App pushes to queue
const emailQueue = new Queue('email', { connection: redis });
await emailQueue.add('reminder', { userId, appointmentId }, {
  delay: 24 * 60 * 60 * 1000, // 24 hours before
  attempts: 3,
  backoff: { type: 'exponential', delay: 5000 }
});

// Consumer: Worker processes
const worker = new Worker('email', async job => {
  const { userId, appointmentId } = job.data;
  await sendReminderEmail(userId, appointmentId);
}, { connection: redis });
```

### 5.3 Worker Scaling Strategy

**Scale Milepost: 1K users**
- 1 worker process, 4 concurrent jobs
- Dedicated 512MB droplet (can share with Redis)
- Cost: +$12/month

**Scale Milepost: 10K users**
- 2 worker processes, 8 concurrent jobs each
- Separate 1GB droplet for workers
- Cost: +$18/month

**Scale Milepost: 100K users**
- 4 worker processes, 16 concurrent jobs each
- Auto-scaling worker pool (spin up on queue depth > 100)
- Cost: +$36/month

**Scale Milepost: 1M users**
- Worker cluster with priority queues
- Separate high-priority workers for payment webhooks
- Low-priority workers for analytics (batch processing)
- Cost: +$100/month

### 5.4 Queue Prioritization

| Queue | Priority | Max Retries | Backoff Strategy |
|-------|-----------|--------------|-----------------|
| payment-webhook | 1 (highest) | 5 | Immediate, no delay |
| critical-email | 2 | 5 | Immediate |
| appointment-reminder | 3 | 3 | Exponential, 5s base |
| analytics-events | 4 | 1 | Exponential, 10s base |
| breed-suggestions | 5 (lowest) | 1 | Fixed, 30s delay |

---

## 6. Cost Projections

### 6.1 Monthly Cost by Scale Milepost

| Scale | Infrastructure | Additional Services | **Total** | Revenue Assumption | ROI |
|-------|----------------|---------------------|------------|-------------------|-----|
| **100 users** | $6 (1GB droplet) | $0 | **$6** | $2,900/month | 483x |
| **1K users** | $18 (2GB droplet) | $0 | **$18** | $29,000/month | 1,611x |
| **10K users** | $24 (2 droplets) | $12 (Redis) | **$36** | $290,000/month | 8,055x |
| **100K users** | $72 (4 droplets + LB) | $50 (Redis) | **$122** | $2,900,000/month | 23,770x |
| **1M users** | ~$272 (6 droplets + LB) | ~$200 (Managed DB + CDN) | **~$472** | $29,000,000/month | 61,440x |

### 6.2 Revenue-per-User Assumptions

| Tier | Price | User Distribution | Avg Revenue/User |
|------|-------|------------------|------------------|
| Solo | $29/mo | 60% | $17.40 |
| Salon | $79/mo | 30% | $23.70 |
| Enterprise | $149/mo | 10% | $14.90 |
| **Average** | - | - | **~$29/user** |

### 6.3 Cost Breakdown at 1M Users

| Component | Monthly Cost | % of Total |
|-----------|--------------|------------|
| App Servers (6x 2GB) | $72 | 15% |
| Load Balancer (2x LB) | $24 | 5% |
| Managed PostgreSQL (3-node) | $180 | 38% |
| Redis Cluster (3-node) | $90 | 19% |
| CDN/WAF (Cloudflare) | $80 | 17% |
| Storage/Backups (DO Spaces) | $26 | 6% |
| **Total** | **$472** | **100%** |

**Key Insight:** At 1M users ($29M revenue), infrastructure cost is 0.0016% of revenue. Even if we over-provision 10x, it's still trivial.

---

## 7. Architecture Diagrams

### 7.1 Current Architecture (MVP)

```
┌─────────────────────────────────────────────────────────┐
│              DigitalOcean Droplet (NYC3)              │
│                                                     │
│  ┌──────────────────────────────────────────────┐    │
│  │  Nginx (port 80/443)                   │    │
│  │  - Routes to / (landing)                  │    │
│  │  - Routes to /app (production)             │    │
│  │  - Routes to /staging (staging)           │    │
│  └──────────────────────────────────────────────┘    │
│                    ↓                                 │
│  ┌──────────────────────────────────────────────┐    │
│  │  PM2 (Process Manager)                    │    │
│  │  - groomgrid-landing (port 3000)          │    │
│  │  - groomgrid-prod (port 3001)            │    │
│  │  - groomgrid-staging (port 3002)          │    │
│  └──────────────────────────────────────────────┘    │
│                    ↓                                 │
│  ┌──────────────────────────────────────────────┐    │
│  │  PostgreSQL 16 (port 5432)                │    │
│  │  - groomgrid_prod                        │    │
│  │  - groomgrid_staging                    │    │
│  └──────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
         ↓
  DO Spaces (backups, static assets)
```

### 7.2 Target Architecture (1M Users)

```
                              ┌────────────────┐
                              │  Cloudflare   │
                              │     CDN/WAF   │
                              └──────┬───────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                  │
            ┌───────┴───────┐                  ┌───────┴───────┐
            │  DO LB #1     │                  │  DO LB #2     │
            │  (Primary)    │                  │  (Failover)   │
            └───────┬───────┘                  └───────┬───────┘
                    │                                  │
        ┌───────────┼──────────────────┬───────────────┤
        │           │                  │               │
   ┌────┐     ┌────┐            ┌────┐        ┌────┐
   │App1│     │App2│            │App3│        │App4│
   └─┬──┘     └─┬──┘            └─┬──┘        └─┬──┘
     │           │                  │               │
     └───────────┴──────────────────┴───────────────┘
                     │
            ┌────────┴────────┐
            │                 │
      ┌─────┴─────┐   ┌─────┴─────┐
      │  Redis    │   │  Redis    │
      │  Cluster  │   │  Cluster  │
      │  (Sess)   │   │  (Cache)  │
      └─────┬─────┘   └─────┬─────┘
            │                │
     ┌──────┴──────────────┴───────┐
     │                             │
┌──────────────────┐       ┌──────────────────┐
│  Managed DB     │       │  Read Replica   │
│  (Primary)      │◄──────┤  #1             │
│                 │       └──────────────────┘
└───────┬────────┘
        │
  ┌─────┴─────┐
  │           │
┌───┴───┐   ┌───┴─────┐
│ Rep 1 │   │ Rep 2   │
│ (Analytics)││(Failover)│
└────────┘   └─────────┘
     │           │
     └─────┬─────┘
           ↓
┌──────────────────┐
│  DO Spaces     │
│  (Backups)     │
└──────────────────┘
```

### 7.3 Database Sharding Schema (100K+ Users)

```
┌────────────────────────────────────────────────────────────┐
│              Shard 1 (Users 0-50K)                  │
│                                                      │
│  ┌────────────────────────────────────────┐            │
│  │  PostgreSQL Primary (shard_1_db)   │            │
│  │  - users, profiles, clients, pets    │            │
│  │  - appointments, business_hours      │            │
│  │  - drip_email_queue               │            │
│  └────────────────────────────────────────┘            │
│                      ↓                                 │
│  ┌────────────────────────────────────────┐            │
│  │  Read Replica (shard_1_replica)    │            │
│  └────────────────────────────────────────┘            │
└────────────────────────────────────────────────────────────┘
                            │
┌────────────────────────────────────────────────────────────┐
│              Shard 2 (Users 50K-100K)                │
│                                                      │
│  ┌────────────────────────────────────────┐            │
│  │  PostgreSQL Primary (shard_2_db)   │            │
│  │  - users, profiles, clients, pets    │            │
│  │  - appointments, business_hours      │            │
│  │  - drip_email_queue               │            │
│  └────────────────────────────────────────┘            │
│                      ↓                                 │
│  ┌────────────────────────────────────────┐            │
│  │  Read Replica (shard_2_replica)    │            │
│  └────────────────────────────────────────┘            │
└────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌────────────────────────────────────────────────────────────┐
│              Global DB (Cross-Shard Data)              │
│                                                      │
│  ┌────────────────────────────────────────┐            │
│  │  PostgreSQL (global_db)            │            │
│  │  - analytics_events (aggregated)     │            │
│  │  - feedback                        │            │
│  │  - payment_events                 │            │
│  │  - shard_mapping                  │            │
│  └────────────────────────────────────────┘            │
└────────────────────────────────────────────────────────────┘
```

---

## 8. Trigger Points & Action Checklist

### 8.1 Monitoring & Alerting Thresholds

| Metric | Warning | Critical | Action |
|--------|----------|-----------|--------|
| Memory > 80% | 75% | 90% | Scale up droplet |
| CPU > 70% | 60% | 85% | Add app instance |
| DB latency > 100ms (p95) | 80ms | 200ms | Add read replica |
| Cache hit ratio < 60% | 70% | 50% | Warm cache or add Redis |
| Queue depth > 100 | 50 | 500 | Scale workers |

### 8.2 Pre-Sharding Optimization Checklist

Before sharding at 100K users, ensure:

- [ ] Database indexes optimized (`EXPLAIN ANALYZE` on slow queries)
- [ ] Read queries routed to replicas
- [ ] Hot data cached in Redis (90% hit ratio)
- [ ] Async queues for all non-critical writes
- [ ] Connection pooling (PgBouncer, 50-100 connections)
- [ ] Query timeout limits (5s for reads, 30s for writes)
- [ ] Slow query logging enabled
- [ ] Automated backups verified (restore tested)
- [ ] Monitoring/alerting configured

### 8.3 Scale Milepost Actions Summary

| Milepost | When | Action | Cost |
|----------|------|--------|------|
| **100 → 1K** | Memory > 80% OR swap > 50% | Resize to 2GB droplet | +$12/mo |
| **1K → 10K** | CPU > 70% OR DB latency > 100ms | Split to 2 droplets (app + db) | +$12/mo |
| **10K → 100K** | Users > 50K OR load > 500 | Add LB + replicas (4 droplets) | +$36/mo |
| **100K → 1M** | Revenue > $50K/mo OR SLO > 99.9% | Migrate to managed DB + CDN + HA | +$350/mo |

---

## 9. Risk Mitigation

### 9.1 Single Points of Failure (Current)

| Component | Risk | Mitigation | Priority |
|----------|-------|------------|----------|
| **Single Droplet** | 100% downtime if fails | Add second droplet + failover | HIGH |
| **PostgreSQL co-located** | App outages corrupt DB | Separate DB droplet | HIGH |
| **No Redis** | Breed queries hit DB | Add Redis for cache | MEDIUM |
| **No Queue** | Email sends block requests | Implement BullMQ | MEDIUM |

### 9.2 Data Loss Prevention

1. **Backups:** Automated daily backups to DO Spaces, 30-day retention
2. **Point-in-Time Recovery:** Enable WAL archiving for PostgreSQL
3. **Multi-Region:** Consider DR region at 100K users (optional)
4. **Verification:** Monthly restore drill to test backup integrity

### 9.3 Security Considerations

1. **Database Access:** Block port 5432 from public internet
2. **Internal Network:** Use DO private networking for app → DB
3. **API Rate Limiting:** Implement per-user rate limits (auth/booking)
4. **SSL/TLS:** Enforce HTTPS, rotate certificates annually
5. **Secrets Management:** Use DO Secrets or Vault (not .env files!)

---

## 10. Implementation Timeline

### Phase 1: Immediate (Now → 1K Users)
- [x] Baseline infrastructure audit
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Configure alerts (memory, CPU, disk)
- [ ] Prepare droplet resize script

### Phase 2: Short-Term (1K → 10K Users)
- [ ] Separate app and database droplets
- [ ] Add Redis instance
- [ ] Implement email queue with BullMQ
- [ ] Set up PgBouncer connection pooling
- [ ] Configure automated backups

### Phase 3: Medium-Term (10K → 100K Users)
- [ ] Add load balancer (HAProxy)
- [ ] Set up database read replicas
- [ ] Implement read/write routing
- [ ] Cache hot data (breeds, sessions, appointments)
- [ ] Scale workers to handle queue depth

### Phase 4: Long-Term (100K → 1M Users)
- [ ] Migrate to managed PostgreSQL
- [ ] Set up Redis Cluster
- [ ] Configure Cloudflare CDN
- [ ] Implement database sharding
- [ ] Add multi-region deployment (optional)

---

## 11. Conclusion

**Key Takeaway:** This won't scale because... horizontal scaling requires deliberate architecture decisions now, not later. Every infrastructure choice today becomes a constraint tomorrow.

**The Path Forward:**
1. **Start monitoring now** - know when to scale, don't guess
2. **Plan for 10x growth** - every decision should work at 10x scale
3. **Cache aggressively** - 90% cache hit ratio is achievable
4. **Queue everything non-critical** - don't block user requests
5. **Shard only when necessary** - optimize first, shard last

**Revenue Impact:** At 1M users ($29M revenue), infrastructure cost is $472/month. Even if we over-provision 10x, it's still trivial. The bottleneck is **not cost** — it's **architecture decisions** made too late.

**Next Steps:**
1. Implement monitoring immediately (this week)
2. Set up Redis for session cache (this week)
3. Plan droplet split at 1K users (next month)
4. Document runbooks for each scale milestone (ongoing)

---

**Document Version:** 1.0
**Last Updated:** 2026-04-09
**Next Review:** 2026-05-09 or at 500 paying users
