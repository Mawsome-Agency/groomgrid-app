# GroomGrid Scalability Roadmap

> **Document Version:** 1.0  
> **Author:** Priya Kapoor (Scale Architect, Mawsome Agency)  
> **Date:** 2026-04-09  
> **Purpose:** Define infrastructure scaling strategy from MVP to 5,000+ users  

---

## Executive Summary

**Current State Analysis:**

| Metric | Current Value | Threshold | Status |
|--------|---------------|------------|--------|
| **RAM Usage** | 663MB/961MB (69%) | >80% | ⚠️ Warning |
| **Swap Usage** | 252MB/1024MB (25%) | >20% | 🔴 Critical |
| **Active Users** | 7 | N/A | Baseline |
| **PM2 Restarts** | 3 in 32 hours | 0 expected | 🔴 Memory leaks/OOM |
| **Disk Usage** | 7.5GB/24GB (33%) | >80% | ✅ Healthy |

**Critical Finding:** We are **ALREADY SWAPPING** at only 7 users. This is unsustainable and will cause severe performance degradation and stability issues before reaching 100 subscribers.

---

## 1. Upgrade Trigger Thresholds

These are the **non-negotiable thresholds** that trigger immediate action:

| Metric | Warning Level | Critical Level | Action Required |
|--------|--------------|-----------------|----------------|
| **RAM Usage** | >75% | >85% | Add memory or optimize |
| **Swap Usage** | >10% | >25% | ⚠️ **ALREADY AT CRITICAL** |
| **PM2 Restarts** | >5/day | >10/day | Memory leak investigation |
| **Response Time (p95)** | >1000ms | >3000ms | Horizontal scaling |
| **Database Connections** | >60 | >80 | Connection pooling/upgrade |
| **Disk Usage** | >70% | >85% | Cleanup or upgrade |

**Current Status:** Swap usage (25%) is **ALREADY** at critical level. Immediate action required.

---

## 2. Scaling Milestones

### Milestone 1: 0 → 100 Users (Immediate Actions)

**Estimated Resource Requirements:**
- RAM: 2GB minimum (currently 1GB)
- CPU: 1-2 vCPUs
- Disk: 25GB (current)
- Database: ~50MB

**Required Infrastructure Changes:**

1. **Memory Upgrade (CRITICAL - Do Before 50 Users)**
   - Upgrade from 1GB → 2GB RAM
   - Cost impact: +$10/month ($6 → $16/month)
   - DigitalOcean droplet resize: `s-2vcpu-2gb`

2. **Staging Optimization (Zero Cost)**
   - Stop staging 24/7; enable on-demand via script
   - Estimated savings: ~74MB RAM
   - Script to start staging when needed:
     ```bash
     # Start staging for testing
     pm2 start groomgrid-staging
     # Stop after testing (manual or timed)
     pm2 stop groomgrid-staging
     ```

3. **Memory Leak Investigation**
   - PM2 restarts indicate potential leaks
   - Add memory profiling via Node.js heap snapshots
   - Set up automatic OOM notifications via Sentry

4. **Connection Pooling**
   - Configure Prisma connection pool
   - Target: 5-10 max connections per app
   - Reduces per-connection overhead

**Cost Projections:**
- Current: $6/month
- After upgrade: $16/month
- Monthly increase: +$10

**Migration Steps:**
1. Schedule maintenance window (low-traffic hours, 2-4 AM UTC)
2. Power down apps: `pm2 stop all`
3. Resize droplet via DO API (requires brief downtime)
4. Verify memory: `free -h`
5. Restart apps: `pm2 restart all`
6. Verify functionality: smoke test all endpoints

**Recommendation:** ⚠️ **UPGRADE NOW** - We're already swapping at 7 users. Do not wait for 50.

---

### Milestone 2: 100 → 500 Users

**Estimated Resource Requirements:**
- RAM: 4GB
- CPU: 2 vCPUs
- Disk: 50GB
- Database: ~250MB

**Required Infrastructure Changes:**

1. **Droplet Upgrade**
   - Upgrade to: `s-2vcpu-4gb` ($32/month)
   - Provides 4x current RAM at 2x CPU

2. **Horizontal Scaling Preparation**
   - Deploy load balancer (Nginx HA)
   - Set up second droplet for redundancy
   - Configure shared database access

3. **CDN Integration**
   - Configure CDN for static assets
   - Reduces origin server load
   - Faster global delivery

4. **Redis Caching**
   - Cache frequent database queries
   - Cache API responses (TTL 5-15 min)
   - Estimated load reduction: 30-40%

5. **Database Optimization**
   - Add indexes to high-traffic tables
   - Implement query result caching
   - Archive old appointments to reduce active data

**Cost Projections:**
- Droplet: $32/month
- Redis (if separate): $10/month
- CDN (Cloudflare): Free tier
- Monthly total: ~$42/month

**Migration Steps:**
1. Schedule 30-minute maintenance window
2. Deploy new droplet with larger specs
3. Migrate database (zero downtime via streaming replication)
4. Update DNS to point to new IP
5. Run old server in parallel for 24h for rollback safety
6. Decommission old droplet

**Early Warning Signals:**
- RAM >70% sustained for 1 hour
- Database query time >500ms (p95)
- API error rate >2%

---

### Milestone 3: 500 → 1,000 Users

**Estimated Resource Requirements:**
- RAM: 8GB
- CPU: 4 vCPUs
- Disk: 100GB
- Database: ~500MB

**Required Infrastructure Changes:**

1. **Horizontal Scaling**
   - Deploy 2 application servers behind load balancer
   - Active-active configuration
   - Session management via Redis

2. **Database Separation**
   - Move database to dedicated managed instance
   - Consider DO Managed PostgreSQL ($15-60/month)
   - Benefits: Automated backups, point-in-time recovery

3. **Read Replicas**
   - Add 1-2 read replicas for dashboard/analytics queries
   - Offload read-heavy operations
   - Estimated read performance improvement: 2-3x

4. **Message Queue**
   - Implement BullMQ for background jobs
   - Queue: Email sending, notifications, appointment processing
   - Prevents request spikes from overwhelming API

5. **Advanced Caching**
   - Application-level cache (L1)
   - Redis cache (L2)
   - CDN cache (L3)
   - Cache hit ratio target: >80%

**Cost Projections:**
- 2x App servers: $64/month ($32 each)
- Managed PostgreSQL: $60/month (4GB)
- 1x Read replica: $40/month (2GB)
- Redis: $10/month
- Load balancer: Included with DO
- Monthly total: ~$174/month

**Migration Steps:**
1. Deploy managed PostgreSQL with replica
2. Set up BullMQ worker processes
3. Configure load balancer with health checks
4. Deploy second app server
5. Update Sentry for distributed tracing
6. Gradually shift traffic (canary deployment)
7. Decommission old single-server setup

**Early Warning Signals:**
- CPU >70% sustained for 30 minutes
- Database connection pool exhaustion
- Cache hit ratio <70%
- P95 response time >2s

---

### Milestone 4: 1,000 → 5,000 Users

**Estimated Resource Requirements:**
- RAM: 32GB+ (distributed)
- CPU: 12-16 vCPUs (distributed)
- Disk: 500GB
- Database: ~2GB

**Required Infrastructure Changes:**

1. **Multi-Region Deployment**
   - Deploy to 2-3 DO regions (nyc3, sfo3, ams3)
   - Geographic load balancing via DNS
   - Latency reduction: 50-70% for distant users

2. **Microservices Architecture**
   - Split monolith into services:
     - Auth service
     - Appointment service
     - Notification service
     - Payment/subscription service
   - Independent scaling per service

3. **Database Sharding**
   - Shard by tenant/customer ID
   - Consider TimescaleDB for time-series data
   - Query performance maintained at scale

4. **Kubernetes Orchestration**
   - Migrate from PM2 to DO Kubernetes
   - Benefits: Auto-scaling, self-healing, rolling updates
   - Estimated effort: 4-6 weeks migration

5. **Advanced Observability**
   - Distributed tracing (Jaeger/Honeycomb)
   - Real-time alerts via PagerDuty/Slack
   - Automated incident response
   - SLO/SLA monitoring (99.9% uptime)

**Cost Projections:**
- 6x App servers: $240/month ($40 each)
- 3x Database primaries: $180/month ($60 each)
- 3x Read replicas: $120/month ($40 each)
- Kubernetes control plane: $60/month
- Redis cluster: $30/month
- Monitoring stack: $50/month
- Monthly total: ~$680/month

**Migration Steps:**
1. Design microservices boundaries (domain-driven design)
2. Extract auth service first (lowest risk)
3. Set up Kubernetes cluster
4. Migrate services one at a time
5. Implement service mesh for inter-service comms
6. Gradual traffic shift with feature flags
7. Full cutover after validation

**Early Warning Signals:**
- SLO violations (uptime <99.9%)
- Error rate >1%
- P95 latency >3s
- Manual scaling events >2/month

---

## 3. Early Warning Signals & Monitoring

### Metrics to Monitor (24/7)

| Metric | Tool | Alert Threshold | Escalation |
|--------|-------|----------------|-------------|
| **RAM Usage** | PM2 monit | >75% for 5 min | Dev team Slack |
| **Swap Usage** | System monitor | >10% any time | Dev team Slack |
| **PM2 Restarts** | Sentry Uptime | >5 in 1 hour | On-call engineer |
| **Response Time** | Sentry Performance | p95 >2s | Dev team Slack |
| **Error Rate** | Sentry Errors | >1% for 10 min | On-call engineer |
| **DB Connection Pool** | Prisma metrics | >80% usage | Dev team Slack |
| **Disk Usage** | System monitor | >70% | Dev team Slack |

### Dashboard Setup

**Immediate Implementation:**
1. Add PM2 memory monitoring to Sentry
2. Set up Slack alerting for critical metrics
3. Create Grafana dashboard for system health
4. Configure PagerDuty escalation path

**Recommended Tools:**
- **Application Monitoring:** Sentry (already configured)
- **Infrastructure Monitoring:** UptimeRobot or Pingdom (free tier)
- **Log Aggregation:** Loki + Grafana (open source)
- **Performance Monitoring:** Sentry Performance + Google Lighthouse

---

## 4. Immediate Optimizations (Do This Week)

### Priority 1: Stop Staging 24/7 (5 min work)

**Action:** Configure staging to run only when needed

**Implementation:**
```bash
# Create staging control script at /root/scripts/staging-control.sh
#!/bin/bash
case "$1" in
  start)
    pm2 start groomgrid-staging
    echo "Staging started at: $(date)"
    ;;
  stop)
    pm2 stop groomgrid-staging
    echo "Staging stopped at: $(date)"
    ;;
  *)
    echo "Usage: $0 {start|stop}"
    exit 1
    ;;
esac

chmod +x /root/scripts/staging-control.sh
```

**Impact:** Frees ~74MB RAM immediately. Allows headroom for growth.

---

### Priority 2: Configure Prisma Connection Pool (10 min work)

**Action:** Add connection pool configuration to Prisma schema

**Implementation:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  pool_timeout = 10
  connection_limit = 10  // Reduce from default unlimited
}
```

**Impact:** Reduces memory usage per database connection. Prevents connection leaks.

---

### Priority 3: Set Up Swap Warning (5 min work)

**Action:** Add cron job to monitor swap usage

**Implementation:**
```bash
# Add to crontab: crontab -e
# Check swap every 5 minutes
*/5 * * * * /root/scripts/monitor-swap.sh

# Create /root/scripts/monitor-swap.sh
#!/bin/bash
SWAP_USAGE=$(free | awk '/Swap/ {printf("%.0f", $3/$2*100)}')
if [ "$SWAP_USAGE" -gt 20 ]; then
  echo "⚠️ Swap usage: ${SWAP_USAGE}% - Check immediately!" | \
    curl -X POST -H 'Content-Type: application/json' \
    -d '{"text":"'"$(hostname)"': Swap at '"${SWAP_USAGE}"%"}' \
    $SLACK_WEBHOOK_URL
fi
chmod +x /root/scripts/monitor-swap.sh
```

**Impact:** Early warning before system becomes unresponsive.

---

### Priority 4: Add Node.js Memory Profiling (15 min work)

**Action:** Configure automatic heap snapshots on OOM

**Implementation:**
```javascript
// Add to app startup or ecosystem.config.js
const v8 = require('v8');
const fs = require('fs');

process.on('warning', (warning) => {
  if (warning.name === 'MaxListenersExceededWarning') {
    const heapStats = v8.getHeapStatistics();
    fs.writeFileSync(
      `/tmp/heap-stats-${Date.now()}.json`,
      JSON.stringify(heapStats)
    );
  }
});

// PM2 config update
module.exports = {
  apps: [{
    name: 'groomgrid-app',
    script: 'node_modules/.bin/next',
    args: 'start -p 3003',
    cwd: '/var/www/groomgrid/prod',
    env_file: '/var/www/groomgrid/prod/.env.local',
    instances: 1,
    autorestart: true,
    max_memory_restart: '768M',  // Increase from 512M
    watch: false,
    node_args: '--max-old-space-size=768',
    env: {
      NODE_ENV: 'production',
      PORT: 3003,
    },
  }],
};
```

**Impact:** Identifies memory leaks early. Provides diagnostics for restarts.

---

## 5. Cost Summary

| Milestone | Monthly Cost | Key Infrastructure |
|-----------|--------------|-------------------|
| **Current** | $6 | 1GB droplet |
| **100 Users** | $16 | 2GB droplet |
| **500 Users** | $42 | 4GB droplet + Redis |
| **1,000 Users** | $174 | 2x servers + managed DB |
| **5,000 Users** | $680 | 6x servers + K8s cluster |

**Revenue Projections (at $29/month solo tier):**
- 100 users: $2,900/month → $16 infra = **99.5% margin** ✅
- 500 users: $14,500/month → $42 infra = **99.7% margin** ✅
- 1,000 users: $29,000/month → $174 infra = **99.4% margin** ✅
- 5,000 users: $145,000/month → $680 infra = **99.5% margin** ✅

**Conclusion:** Infrastructure costs remain <1% of revenue even at scale. Excellent margin.

---

## 6. Recommendations

### Immediate (This Week)

1. ⚠️ **UPGRADE DROPLET TO 2GB** — Critical blocking issue
   - We are already swapping at 7 users
   - Swap usage (25%) exceeds critical threshold (20%)
   - System will become unstable before 50 users
   - Cost: +$10/month, downtime: 5 minutes

2. **Stop staging 24/7** — Quick win, zero cost
   - Frees ~74MB RAM
   - Run staging on-demand via script

3. **Implement monitoring alerts** — Do today
   - Slack alerts for swap >20%
   - PM2 restart monitoring via Sentry
   - Uptime monitoring (UptimeRobot free tier)

### Short-term (Before 100 Users)

4. **Memory leak investigation** — PM2 restarts indicate leaks
   - Enable heap snapshots
   - Identify root cause
   - Fix before scale increases

5. **Redis caching** — Prep for 500-user milestone
   - Implement query caching
   - Cache API responses
   - Reduces load by 30-40%

### Medium-term (Before 500 Users)

6. **Load balancer setup** — Redundancy
   - Deploy second droplet
   - Active-passive configuration
   - Zero downtime deployments

7. **Database optimization** — Prepare for growth
   - Add indexes
   - Implement connection pooling
   - Archive old data

---

## 7. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|-------|-------------|---------|------------|
| **OOM crash before upgrade** | High | Critical | Upgrade to 2GB immediately |
| **Memory leak scales with users** | Medium | High | Profile + fix now |
| **Database query degradation** | Medium | Medium | Add indexes, implement caching |
| **Single point of failure** | Low | Critical | Add redundancy at 500 users |
| **Deployment downtime** | Low | Medium | Implement blue-green deployment |

---

## 8. Success Metrics

Track these to validate scaling decisions:

| Metric | Current | Target (100 users) | Target (1,000 users) |
|--------|----------|--------------------|------------------------|
| **P95 Response Time** | ?ms | <500ms | <1s |
| **Uptime** | ?% | 99.9% | 99.95% |
| **RAM Usage** | 69% | <60% | <50% |
| **Swap Usage** | 25% | 0% | 0% |
| **DB Query Time (p95)** | ?ms | <100ms | <200ms |

---

## Conclusion

**Critical Action Required:** Upgrade to 2GB droplet **BEFORE** reaching 50 users. The current infrastructure is already swapping at 7 users, which will cause severe performance issues and instability as we approach the 100-user milestone.

The scaling roadmap is well-defined and cost-effective. Infrastructure costs remain <1% of revenue even at 5,000 users. The bottleneck is clear: **memory**. Upgrade first, then optimize, then scale horizontally.

---

## Appendix: DigitalOcean Droplet Options

| Droplet Size | RAM | CPU | Disk | Monthly Cost | Max Users* |
|--------------|------|-----|-------|--------------|------------|
| Basic - $6 | 1GB | 1 vCPU | 25GB SSD | $6 | 7-10 users |
| Basic - $16 | 2GB | 1 vCPU | 60GB SSD | $16 | 50-100 users |
| Basic - $32 | 4GB | 2 vCPU | 80GB SSD | $32 | 200-500 users |
| Basic - $64 | 8GB | 4 vCPU | 160GB SSD | $64 | 500-1,000 users |
| Premium - $80 | 16GB | 4 vCPU | 320GB NVMe | $80 | 1,000-2,500 users |

\*User estimates based on typical SaaS patterns. Actual capacity depends on feature usage, query patterns, and optimization level.

---

**Document Owner:** Priya Kapoor (Scale Architect)  
**Review Cycle:** Quarterly or when hitting milestone triggers  
**Next Review:** After reaching 50 users or 2026-06-01
