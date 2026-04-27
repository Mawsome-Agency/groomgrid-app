#!/bin/bash
# ==============================================================================
# GroomGrid Infrastructure Health Check
# ==============================================================================
# Pre-launch verification script for production droplet.
# Run on the server: bash scripts/infrastructure-health-check.sh
#
# Exit codes:
#   0 = All checks pass
#   1 = Warning(s) found — non-critical issues
#   2 = Critical issue(s) found — action required before launch
# ==============================================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

WARN_COUNT=0
CRIT_COUNT=0

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

pass() {
  echo -e "  ${GREEN}✓ PASS${NC} $1"
}

warn() {
  echo -e "  ${YELLOW}⚠ WARN${NC} $1"
  WARN_COUNT=$((WARN_COUNT + 1))
}

crit() {
  echo -e "  ${RED}✗ CRIT${NC} $1"
  CRIT_COUNT=$((CRIT_COUNT + 1))
}

section() {
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo -e "  $1"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# ---------------------------------------------------------------------------
# 1. DISK SPACE
# ---------------------------------------------------------------------------

section "1. DISK SPACE"

DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | tr -d '%')
DISK_AVAIL=$(df -h / | tail -1 | awk '{print $4}')
DISK_TOTAL=$(df -h / | tail -1 | awk '{print $2}')

echo "  Disk: ${DISK_TOTAL} total, ${DISK_AVAIL} available (${DISK_USAGE}% used)"

if [ "$DISK_USAGE" -ge 95 ]; then
  crit "Disk usage at ${DISK_USAGE}% — critically low space"
elif [ "$DISK_USAGE" -ge 80 ]; then
  warn "Disk usage at ${DISK_USAGE}% — approaching capacity"
else
  pass "Disk usage at ${DISK_USAGE}%"
fi

# Check /var (logs, backups)
if [ -d /var ]; then
  VAR_USAGE=$(df /var | tail -1 | awk '{print $5}' | tr -d '%')
  if [ "$VAR_USAGE" -ge 95 ]; then
    crit "/var usage at ${VAR_USAGE}%"
  elif [ "$VAR_USAGE" -ge 80 ]; then
    warn "/var usage at ${VAR_USAGE}%"
  else
    pass "/var usage at ${VAR_USAGE}%"
  fi
fi

# ---------------------------------------------------------------------------
# 2. PM2 PROCESSES
# ---------------------------------------------------------------------------

section "2. PM2 PROCESS STABILITY"

if ! command -v pm2 &>/dev/null; then
  crit "pm2 not found in PATH"
else
  # Check each expected process
  EXPECTED_PROCESSES=("groomgrid-prod" "groomgrid-staging" "groomgrid-landing")

  for PROC in "${EXPECTED_PROCESSES[@]}"; do
    STATUS=$(pm2 jlist 2>/dev/null | jq -r ".[] | select(.name == \"${PROC}\") | .pm2_env.status" 2>/dev/null || echo "unknown")
    RESTARTS=$(pm2 jlist 2>/dev/null | jq -r ".[] | select(.name == \"${PROC}\") | .pm2_env.restart_time" 2>/dev/null || echo "unknown")
    UPTIME=$(pm2 jlist 2>/dev/null | jq -r ".[] | select(.name == \"${PROC}\") | .pm2_env.pm_uptime" 2>/dev/null || echo "unknown")

    if [ "$STATUS" = "online" ]; then
      if [ "$RESTARTS" -gt 5 ] 2>/dev/null; then
        warn "${PROC}: online but ${RESTARTS} restarts (potential crash loop)"
      else
        pass "${PROC}: online, ${RESTARTS} restarts"
      fi
    elif [ "$STATUS" = "stopped" ] || [ "$STATUS" = "errored" ]; then
      crit "${PROC}: ${STATUS}"
    else
      warn "${PROC}: status unknown (${STATUS})"
    fi
  done

  # Check pm2-logrotate
  LOGROTATE=$(pm2 ls -m 2>/dev/null | grep -c "pm2-logrotate" || echo "0")
  if [ "$LOGROTATE" -ge 1 ]; then
    pass "pm2-logrotate module installed"
  else
    warn "pm2-logrotate not found — logs may grow unbounded"
  fi
fi

# ---------------------------------------------------------------------------
# 3. POSTGRESQL CONNECTIONS
# ---------------------------------------------------------------------------

section "3. POSTGRESQL CONNECTIONS"

if command -v psql &>/dev/null || [ -f /usr/bin/psql ]; then
  PG_MAX=$(sudo -u postgres psql -t -c "SHOW max_connections;" 2>/dev/null | tr -d ' ' || echo "unknown")
  PG_TOTAL=$(sudo -u postgres psql -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | tr -d ' ' || echo "unknown")
  PG_ACTIVE=$(sudo -u postgres psql -t -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';" 2>/dev/null | tr -d ' ' || echo "unknown")
  PG_IDLE=$(sudo -u postgres psql -t -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'idle';" 2>/dev/null | tr -d ' ' || echo "unknown")

  if [ "$PG_MAX" != "unknown" ] && [ "$PG_TOTAL" != "unknown" ]; then
    echo "  Connections: ${PG_TOTAL}/${PG_MAX} total (${PG_ACTIVE} active, ${PG_IDLE} idle)"

    PG_USAGE=$((PG_TOTAL * 100 / PG_MAX))
    if [ "$PG_USAGE" -ge 95 ]; then
      crit "Connection pool at ${PG_USAGE}% capacity"
    elif [ "$PG_USAGE" -ge 80 ]; then
      warn "Connection pool at ${PG_USAGE}% capacity"
    else
      pass "Connection pool at ${PG_USAGE}% capacity"
    fi

    # Check for long-running queries (>60s)
    LONG_QUERIES=$(sudo -u postgres psql -t -c "
      SELECT count(*) FROM pg_stat_activity
      WHERE state = 'active'
        AND query_start < now() - interval '60 seconds'
        AND query NOT LIKE '%pg_stat_activity%';" 2>/dev/null | tr -d ' ' || echo "0")

    if [ "$LONG_QUERIES" -gt 0 ]; then
      warn "${LONG_QUERIES} long-running queries (>60s) detected"
    else
      pass "No long-running queries detected"
    fi

    # Check for idle-in-transaction connections (potential leak)
    IDLE_TX=$(sudo -u postgres psql -t -c "
      SELECT count(*) FROM pg_stat_activity
      WHERE state = 'idle in transaction'
        AND query_start < now() - interval '5 minutes';" 2>/dev/null | tr -d ' ' || echo "0")

    if [ "$IDLE_TX" -gt 0 ]; then
      warn "${IDLE_TX} idle-in-transaction connections >5min (possible connection leak)"
    else
      pass "No stuck idle-in-transaction connections"
    fi
  else
    warn "Cannot query PostgreSQL stats (psql or permissions issue)"
  fi

  # Database sizes
  echo ""
  echo "  Database sizes:"
  for DB in groomgrid_prod groomgrid_staging; do
    DB_SIZE=$(sudo -u postgres psql -t -c "SELECT pg_size_pretty(pg_database_size('${DB}'));" 2>/dev/null | tr -d ' ' || echo "unknown")
    echo "    ${DB}: ${DB_SIZE}"
  done
else
  warn "psql not available — skipping database connection checks"
fi

# ---------------------------------------------------------------------------
# 4. NGINX ERROR LOGS (5xx patterns)
# ---------------------------------------------------------------------------

section "4. NGINX ERROR LOGS (5xx ANALYSIS)"

NGINX_ACCESS="/var/log/nginx/access.log"
NGINX_ERROR="/var/log/nginx/error.log"

if [ -f "$NGINX_ACCESS" ]; then
  # Count 5xx errors in last 24 hours
  ERRORS_24H=$(grep -c 'HTTP/1.\|HTTP/2' "$NGINX_ACCESS" 2>/dev/null | head -1 || echo "0")
  ERRORS_5XX_24H=$(awk -v date="$(date -d '24 hours ago' '+%d/%b/%Y:%H:%M')" '$0 > date' "$NGINX_ACCESS" 2>/dev/null | \
    awk '{print $9}' | grep -cE '^5[0-9]{2}$' 2>/dev/null || echo "0")

  echo "  5xx errors in last 24h: ${ERRORS_5XX_24H}"

  if [ "$ERRORS_5XX_24H" -ge 50 ]; then
    crit "High 5xx error rate: ${ERRORS_5XX_24H} in last 24h"
  elif [ "$ERRORS_5XX_24H" -ge 10 ]; then
    warn "Elevated 5xx errors: ${ERRORS_5XX_24H} in last 24h"
  else
    pass "5xx error rate normal: ${ERRORS_5XX_24H} in last 24h"
  fi

  # Show top 5 error paths
  echo ""
  echo "  Top 5xx error paths (last 24h):"
  awk -v date="$(date -d '24 hours ago' '+%d/%b/%Y:%H:%M')" '$0 > date' "$NGINX_ACCESS" 2>/dev/null | \
    awk '$9 ~ /^5[0-9]{2}$/ {print $7}' 2>/dev/null | \
    sort | uniq -c | sort -rn | head -5 2>/dev/null || echo "    (no 5xx errors found)"
else
  warn "Nginx access log not found at ${NGINX_ACCESS}"
fi

if [ -f "$NGINX_ERROR" ]; then
  # Check for critical nginx errors
  NGINX_CRITS=$(tail -1000 "$NGINX_ERROR" 2>/dev/null | grep -cE '(emerg|alert|crit)' 2>/dev/null || echo "0")
  if [ "$NGINX_CRITS" -gt 0 ]; then
    warn "nginx error.log has ${NGINX_CRITS} critical/emergency entries (last 1000 lines)"
  else
    pass "No critical nginx errors in recent logs"
  fi
fi

# ---------------------------------------------------------------------------
# 5. LOG ROTATION
# ---------------------------------------------------------------------------

section "5. LOG ROTATION"

# Check pm2-logrotate settings
if command -v pm2 &>/dev/null; then
  PM2_LOGROTATE_MAX_SIZE=$(pm2 conf logrotate:max_size 2>/dev/null || echo "not set")
  PM2_LOGROTATE_RETAIN=$(pm2 conf logrotate:retain 2>/dev/null || echo "not set")

  if [ "$PM2_LOGROTATE_MAX_SIZE" != "not set" ]; then
    pass "pm2-logrotate max_size: ${PM2_LOGROTATE_MAX_SIZE}"
  else
    warn "pm2-logrotate max_size not configured"
  fi

  if [ "$PM2_LOGROTATE_RETAIN" != "not set" ]; then
    pass "pm2-logrotate retain: ${PM2_LOGROTATE_RETAIN} files"
  else
    warn "pm2-logrotate retain not configured"
  fi
fi

# Check system logrotate
if [ -d /etc/logrotate.d ]; then
  if [ -f /etc/logrotate.d/nginx ]; then
    pass "nginx logrotate config exists"
  else
    warn "No /etc/logrotate.d/nginx config found"
  fi

  if [ -f /etc/logrotate.d/postgresql-common ] || [ -f /etc/logrotate.d/postgresql ]; then
    pass "PostgreSQL logrotate config exists"
  else
    warn "No PostgreSQL logrotate config found"
  fi
else
  warn "No /etc/logrotate.d directory found"
fi

# Check PM2 log file sizes
echo ""
echo "  PM2 log file sizes:"
for LOG in /root/.pm2/logs/*-error.log /root/.pm2/logs/*-out.log; do
  if [ -f "$LOG" ]; then
    LOG_SIZE=$(du -h "$LOG" | cut -f1)
    LOG_NAME=$(basename "$LOG")
    echo "    ${LOG_NAME}: ${LOG_SIZE}"
  fi
done 2>/dev/null

# ---------------------------------------------------------------------------
# 6. SSL CERTIFICATES
# ---------------------------------------------------------------------------

section "6. SSL CERTIFICATES"

if command -v certbot &>/dev/null; then
  CERT_DOMAINS=$(certbot certificates 2>/dev/null | grep -E 'Domains|Expiry' || echo "no certs found")

  # Check for expiry within 14 days
  CERT_EXPIRY=$(echo "$CERT_DOMAINS" | grep -oP 'Expiry Date: \K[0-9-]+' | head -1 || echo "")
  if [ -n "$CERT_EXPIRY" ]; then
    EXPIRY_EPOCH=$(date -d "$CERT_EXPIRY" +%s 2>/dev/null || echo "0")
    NOW_EPOCH=$(date +%s)
    DAYS_UNTIL=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

    if [ "$DAYS_UNTIL" -le 0 ]; then
      crit "SSL certificate EXPIRED"
    elif [ "$DAYS_UNTIL" -le 7 ]; then
      crit "SSL certificate expires in ${DAYS_UNTIL} days"
    elif [ "$DAYS_UNTIL" -le 14 ]; then
      warn "SSL certificate expires in ${DAYS_UNTIL} days"
    else
      pass "SSL certificate valid for ${DAYS_UNTIL} more days"
    fi
  else
    warn "Could not parse certificate expiry date"
  fi
else
  warn "certbot not found — skipping SSL check"
fi

# ---------------------------------------------------------------------------
# 7. SYSTEM RESOURCES
# ---------------------------------------------------------------------------

section "7. SYSTEM RESOURCES"

# Memory
MEM_TOTAL=$(free -h | awk '/^Mem:/ {print $2}')
MEM_USED=$(free -h | awk '/^Mem:/ {print $3}')
MEM_AVAIL=$(free -h | awk '/^Mem:/ {print $7}')
SWAP_TOTAL=$(free -h | awk '/^Swap:/ {print $2}')
SWAP_USED=$(free -h | awk '/^Swap:/ {print $3}')

echo "  Memory: ${MEM_USED} / ${MEM_TOTAL} used, ${MEM_AVAIL} available"
echo "  Swap:   ${SWAP_USED} / ${SWAP_TOTAL} used"

MEM_PERCENT=$(free | awk '/^Mem:/ {printf "%.0f", $3/$2 * 100}')
if [ "$MEM_PERCENT" -ge 95 ]; then
  crit "Memory usage at ${MEM_PERCENT}%"
elif [ "$MEM_PERCENT" -ge 85 ]; then
  warn "Memory usage at ${MEM_PERCENT}%"
else
  pass "Memory usage at ${MEM_PERCENT}%"
fi

# CPU load
LOAD=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | tr -d ',')
CPU_COUNT=$(nproc 2>/dev/null || echo 1)
echo "  CPU: ${CPU_COUNT} cores, 1m load avg: ${LOAD}"

# Check OOM kills in kernel log
OOM_KILLS=$(dmesg 2>/dev/null | grep -c "Out of memory" || echo "0")
if [ "$OOM_KILLS" -gt 0 ]; then
  warn "${OOM_KILLS} OOM kill events in kernel log"
else
  pass "No OOM kill events detected"
fi

# ---------------------------------------------------------------------------
# 8. API HEALTH ENDPOINT
# ---------------------------------------------------------------------------

section "8. API HEALTH CHECK"

# Hit the app's own health endpoint
for URL in "http://localhost:3000/api/health" "http://localhost:3001/api/health" "http://localhost:3002/api/health/ping"; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$URL" 2>/dev/null || echo "000")
  if [ "$HTTP_CODE" = "200" ]; then
    pass "$(echo $URL | sed 's|http://localhost||' | cut -c1-30): HTTP ${HTTP_CODE}"
  elif [ "$HTTP_CODE" = "503" ]; then
    crit "$(echo $URL | sed 's|http://localhost||' | cut -c1-30): HTTP ${HTTP_CODE} (service unhealthy)"
  else
    warn "$(echo $URL | sed 's|http://localhost||' | cut -c1-30): HTTP ${HTTP_CODE}"
  fi
done

# ---------------------------------------------------------------------------
# SUMMARY
# ---------------------------------------------------------------------------

section "SUMMARY"

echo ""
if [ "$CRIT_COUNT" -gt 0 ]; then
  echo -e "  ${RED}CRITICAL: ${CRIT_COUNT} issue(s) require immediate attention${NC}"
  EXIT_CODE=2
elif [ "$WARN_COUNT" -gt 0 ]; then
  echo -e "  ${YELLOW}WARNING: ${WARN_COUNT} issue(s) should be reviewed before launch${NC}"
  EXIT_CODE=1
else
  echo -e "  ${GREEN}ALL CHECKS PASSED — infrastructure is launch-ready${NC}"
  EXIT_CODE=0
fi

echo ""
echo "  Critical: ${CRIT_COUNT} | Warning: ${WARN_COUNT}"
echo ""

exit $EXIT_CODE
