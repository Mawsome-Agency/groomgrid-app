#!/bin/bash
# ==============================================================================
# GroomGrid Performance Benchmark Script
# ==============================================================================
# Measures TTFB, total load time, response size, HTTP status, and cache headers
# for all key pages. Runs each measurement 3x and outputs min/avg/max.
#
# Usage:
#   bash scripts/perf-benchmark.sh                    # Run benchmark
#   bash scripts/perf-benchmark.sh --compare baseline.json  # Compare to baseline
#   bash scripts/perf-benchmark.sh --save baseline.json     # Save as baseline
#   bash scripts/perf-benchmark.sh --url https://staging.getgroomgrid.com
#   npm run perf                                      # Via package.json
#
# Acceptance criteria:
#   - Script runs without errors against production
#   - Outputs clear markdown table with metrics
#   - Comparison mode shows +/- delta for each metric
# ==============================================================================

set -euo pipefail

BASE_URL="https://getgroomgrid.com"
RUNS=3
OUTPUT_FORMAT="markdown"
TMP_DIR=$(mktemp -d)
RESULTS_FILE="${TMP_DIR}/results.json"
RENDERER="${TMP_DIR}/render.py"

PAGES=(
  "/"
  "/signup"
  "/plans"
  "/login"
  "/cat-grooming-software"
  "/mobile-groomer"
)

usage() {
  echo "Usage: $0 [--compare <baseline.json>] [--save <baseline.json>] [--url <url>] [--runs <n>]"
  echo ""
  echo "Options:"
  echo "  --compare <file>  Compare results against a saved baseline JSON file"
  echo "  --save <file>     Save results as a baseline JSON file"
  echo "  --url <url>       Override base URL (default: $BASE_URL)"
  echo "  --runs <n>        Number of runs per page (default: $RUNS)"
  echo "  --json            Output as JSON instead of markdown"
  echo "  --help            Show this help"
  exit 0
}

cleanup() { rm -rf "${TMP_DIR}"; }
trap cleanup EXIT

COMPARE_FILE=""
SAVE_FILE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --compare) COMPARE_FILE="$2"; shift 2 ;;
    --save) SAVE_FILE="$2"; shift 2 ;;
    --url) BASE_URL="$2"; shift 2 ;;
    --runs) RUNS="$2"; shift 2 ;;
    --json) OUTPUT_FORMAT="json"; shift ;;
    --help|-h) usage ;;
    *) echo "Unknown option: $1"; usage ;;
  esac
done

if [ -n "$COMPARE_FILE" ] && [ ! -f "$COMPARE_FILE" ]; then
  echo "Error: Baseline file '$COMPARE_FILE' not found"
  exit 1
fi

# ---------------------------------------------------------------------------
# Benchmark a single page
# ---------------------------------------------------------------------------

benchmark_page() {
  local page="$1"
  local url="${BASE_URL}${page}"

  local ttfb_min="" ttfb_max="" ttfb_avg=""
  local total_min="" total_max="" total_avg=""
  local size_min="" size_max="" size_avg=""
  local status_mode=""
  local cache_control="N/A"
  local content_type="N/A"

  local -a ttfb_vals=()
  local -a total_vals=()
  local -a size_vals=()
  local -a status_vals=()

  for run in $(seq 1 "$RUNS"); do
    local result
    result=$(curl -s -o /dev/null \
      -w "%{time_starttransfer} %{time_total} %{size_download} %{http_code}" \
      --max-time 30 --connect-timeout 10 \
      "$url" 2>/dev/null) || true

    if [ -z "$result" ]; then
      echo "ERROR: Failed to fetch $url on run $run" >&2
      continue
    fi

    ttfb_vals+=("$(echo "$result" | awk '{print $1}')")
    total_vals+=("$(echo "$result" | awk '{print $2}')")
    size_vals+=("$(echo "$result" | awk '{print $3}')")
    status_vals+=("$(echo "$result" | awk '{print $4}')")

    if [ "$run" -eq 1 ]; then
      local headers
      headers=$(curl -s -I --max-time 10 "$url" 2>/dev/null || echo "")
      cache_control=$(echo "$headers" | grep -i "^cache-control:" | tr -d '\r' | sed 's/^cache-control: //i' | head -1)
      content_type=$(echo "$headers" | grep -i "^content-type:" | tr -d '\r' | sed 's/^content-type: //i' | head -1)
      [ -z "$cache_control" ] && cache_control="N/A"
      [ -z "$content_type" ] && content_type="N/A"
    fi

    [ "$run" -lt "$RUNS" ] && sleep 0.5
  done

  [ ${#ttfb_vals[@]} -eq 0 ] && echo "{}" && return

  ttfb_min=$(printf '%s\n' "${ttfb_vals[@]}" | sort -n | head -1)
  ttfb_max=$(printf '%s\n' "${ttfb_vals[@]}" | sort -n | tail -1)
  ttfb_avg=$(echo "${ttfb_vals[*]}" | awk '{sum=0; for(i=1;i<=NF;i++) sum+=$i; print sum/NF}')

  total_min=$(printf '%s\n' "${total_vals[@]}" | sort -n | head -1)
  total_max=$(printf '%s\n' "${total_vals[@]}" | sort -n | tail -1)
  total_avg=$(echo "${total_vals[*]}" | awk '{sum=0; for(i=1;i<=NF;i++) sum+=$i; print sum/NF}')

  size_min=$(printf '%s\n' "${size_vals[@]}" | sort -n | head -1)
  size_max=$(printf '%s\n' "${size_vals[@]}" | sort -n | tail -1)
  size_avg=$(echo "${size_vals[*]}" | awk '{sum=0; for(i=1;i<=NF;i++) sum+=$i; print sum/NF}')

  status_mode=$(printf '%s\n' "${status_vals[@]}" | sort | uniq -c | sort -rn | head -1 | awk '{print $2}')

  # Use python3 to produce proper JSON with escaping
  python3 - "$page" "$url" "$RUNS" \
    "$ttfb_min" "$ttfb_avg" "$ttfb_max" \
    "$total_min" "$total_avg" "$total_max" \
    "$size_min" "$size_avg" "$size_max" \
    "$status_mode" "$cache_control" "$content_type" << 'PYEOF'
import json, sys

(page, url, runs,
 ttfb_min, ttfb_avg, ttfb_max,
 total_min, total_avg, total_max,
 size_min, size_avg, size_max,
 status_mode, cache_control, content_type) = sys.argv[1:]

data = {
    "page": page,
    "url": url,
    "runs": int(runs),
    "ttfb": {
        "min": round(float(ttfb_min) * 1000, 1),
        "avg": round(float(ttfb_avg) * 1000, 1),
        "max": round(float(ttfb_max) * 1000, 1),
        "unit": "ms"
    },
    "total": {
        "min": round(float(total_min) * 1000, 1),
        "avg": round(float(total_avg) * 1000, 1),
        "max": round(float(total_max) * 1000, 1),
        "unit": "ms"
    },
    "size": {
        "min": int(float(size_min)),
        "avg": round(float(size_avg)),
        "max": int(float(size_max)),
        "unit": "bytes"
    },
    "status": int(status_mode),
    "cache_control": cache_control,
    "content_type": content_type
}
print(json.dumps(data))
PYEOF
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

echo "GroomGrid Performance Benchmark" >&2
echo "URL: ${BASE_URL}" >&2
echo "Pages: ${#PAGES[@]}" >&2
echo "Runs per page: ${RUNS}" >&2
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >&2
echo "" >&2

ALL_RESULTS="["
FIRST=true

for page in "${PAGES[@]}"; do
  echo "Benchmarking: ${page}..." >&2
  RESULT=$(benchmark_page "$page")

  [ "$FIRST" = false ] && ALL_RESULTS+=","
  FIRST=false
  ALL_RESULTS+="${RESULT}"
done

ALL_RESULTS+="]"

# Write full results JSON
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
python3 -c "
import json, sys
results = json.loads(sys.stdin.read())
output = {
    'timestamp': '$TIMESTAMP',
    'base_url': '$BASE_URL',
    'runs_per_page': $RUNS,
    'results': results
}
json.dump(output, open('$RESULTS_FILE', 'w'), indent=2)
" <<< "$ALL_RESULTS"

if [ -n "$SAVE_FILE" ]; then
  cp "$RESULTS_FILE" "$SAVE_FILE"
  echo "Baseline saved to: $SAVE_FILE" >&2
fi

# ---------------------------------------------------------------------------
# Render markdown output
# ---------------------------------------------------------------------------

cat > "$RENDERER" << 'PYEOF'
import json, sys, os

results_file = os.environ['RESULTS_FILE']
compare_file = os.environ.get('COMPARE_FILE', '')

with open(results_file) as f:
    data = json.load(f)

compare_map = {}
if compare_file and os.path.exists(compare_file):
    with open(compare_file) as f:
        baseline = json.load(f)
    compare_map = {r['page']: r for r in baseline['results']}
    print(f"\n## GroomGrid Performance Benchmark Results")
    print(f"\n**Date:** {data['timestamp']}")
    print(f"**URL:** {data['base_url']}")
    print(f"**Runs per page:** {data['runs_per_page']}")
    print(f"**Compared against:** {baseline['timestamp']}\n")
    print("| Page | Status | TTFB(ms) | TTFB Δ | TTFB % | Size | Size Δ | Total(ms) | Total Δ | Cache-Control |")
    print("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |")
else:
    print(f"\n## GroomGrid Performance Benchmark Results")
    print(f"\n**Date:** {data['timestamp']}")
    print(f"**URL:** {data['base_url']}")
    print(f"**Runs per page:** {data['runs_per_page']}\n")
    print("| Page | Status | TTFB(ms) | Total(ms) | Size(avg) | Size Range | TTFB Range | Cache-Control |")
    print("| --- | --- | --- | --- | --- | --- | --- | --- | --- |")

for r in data['results']:
    page = r['page']
    status = r['status']
    ttfb = r['ttfb']['avg']
    total = r['total']['avg']
    size = r['size']['avg']
    cache = r.get('cache_control', 'N/A')
    if len(cache) > 50:
        cache = cache[:47] + "..."

    if size >= 1048576:
        size_str = f"{size/1048576:.1f}MB"
    elif size >= 1024:
        size_str = f"{size/1024:.1f}KB"
    else:
        size_str = f"{size}B"

    if compare_map and page in compare_map:
        b = compare_map[page]
        b_ttfb = b['ttfb']['avg']
        b_total = b['total']['avg']
        b_size = b['size']['avg']

        ttfb_delta = ttfb - b_ttfb
        total_delta = total - b_total
        size_delta = int(size - b_size)
        ttfb_pct = ((ttfb - b_ttfb) / b_ttfb * 100) if b_ttfb != 0 else 0

        ttfb_sign = '+' if ttfb_delta >= 0 else ''
        total_sign = '+' if total_delta >= 0 else ''
        size_sign = '+' if size_delta >= 0 else ''

        print(f"| {page} | {status} | {ttfb:.1f} | {ttfb_sign}{ttfb_delta:.1f} | {ttfb_sign}{ttfb_pct:.1f}% | {size_str} | {size_sign}{size_delta} | {total:.1f} | {total_sign}{total_delta:.1f} | {cache} |")
    else:
        size_range = f"{r['size']['min']:,}-{r['size']['max']:,}B"
        ttfb_range = f"{r['ttfb']['min']:.0f}-{r['ttfb']['max']:.0f}ms"
        print(f"| {page} | {status} | {ttfb:.1f} | {total:.1f} | {size_str} | {size_range} | {ttfb_range} | {cache} |")

# Summary
print("\n### Summary\n")

results = data['results']
ttfbs = [r['ttfb']['avg'] for r in results]
totals = [r['total']['avg'] for r in results]
sizes = [r['size']['avg'] for r in results]

avg_ttfb = sum(ttfbs) / len(ttfbs)
avg_total = sum(totals) / len(totals)
total_size = sum(sizes)

print(f"- Average TTFB across all pages: {avg_ttfb:.1f}ms")
print(f"- Average total load time: {avg_total:.1f}ms")
print(f"- Total page weight (sum of avg): {total_size/1024:.1f}KB")
print(f"- Slowest page: {results[ttfbs.index(max(ttfbs))]['page']} ({max(ttfbs):.1f}ms TTFB)")
print(f"- Fastest page: {results[ttfbs.index(min(ttfbs))]['page']} ({min(ttfbs):.1f}ms TTFB)")

slow = [r for r in results if r['ttfb']['avg'] > 500]
if slow:
    print(f"\n⚠️  **Slow pages (>500ms TTFB):**")
    for r in slow:
        print(f"  - {r['page']}: {r['ttfb']['avg']:.1f}ms")

large = [r for r in results if r['size']['avg'] > 102400]
if large:
    print(f"\n⚠️  **Large pages (>100KB):**")
    for r in large:
        print(f"  - {r['page']}: {r['size']['avg']/1024:.1f}KB")

no_cache = [r for r in results if 'no-cache' in r.get('cache_control', '') or 'no-store' in r.get('cache_control', '')]
if no_cache:
    print(f"\n📋 **Pages with no-cache/no-store headers (verify intentional):**")
    for r in no_cache:
        print(f"  - {r['page']}: {r.get('cache_control', 'N/A')}")

contradictory = [r for r in results if 's-maxage' in r.get('cache_control', '') and ('no-cache' in r.get('cache_control', '') or 'no-store' in r.get('cache_control', ''))]
if contradictory:
    print(f"\n🚨 **CONTRADICTORY Cache-Control headers (s-maxage + no-cache/no-store):**")
    for r in contradictory:
        print(f"  - {r['page']}: {r.get('cache_control', 'N/A')}")
PYEOF

if [ "$OUTPUT_FORMAT" = "json" ]; then
  cat "$RESULTS_FILE"
else
  RESULTS_FILE="$RESULTS_FILE" COMPARE_FILE="${COMPARE_FILE:-}" python3 "$RENDERER"
fi
