#!/usr/bin/env bash
# Submit all 32 GroomGrid URLs to IndexNow (Bing/Yandex/Seznam).
#
# Prerequisites:
#   - public/f47ac10b58cc4372a5670e02b2c3d479.txt must be deployed and returning 200
#   - Run from repo root or any directory; no env vars required
#
# Usage: bash scripts/submit-indexnow.sh
# Treat HTTP 200 and 202 as success.

set -euo pipefail

HOST="getgroomgrid.com"
KEY="f47ac10b58cc4372a5670e02b2c3d479"
KEY_LOCATION="https://${HOST}/${KEY}.txt"
API_ENDPOINT="https://api.indexnow.org/indexnow"

# All 32 URLs derived from src/app/sitemap.ts + src/lib/blog-posts.ts
URLS=$(cat <<'EOF'
[
  "https://getgroomgrid.com",
  "https://getgroomgrid.com/signup",
  "https://getgroomgrid.com/plans",
  "https://getgroomgrid.com/blog",
  "https://getgroomgrid.com/best-dog-grooming-software",
  "https://getgroomgrid.com/grooming-business-operations",
  "https://getgroomgrid.com/mobile-grooming-business",
  "https://getgroomgrid.com/mobile-grooming-software",
  "https://getgroomgrid.com/moego-alternatives",
  "https://getgroomgrid.com/daysmart-alternatives",
  "https://getgroomgrid.com/pawfinity-alternatives",
  "https://getgroomgrid.com/blog/dog-grooming-waiver-template",
  "https://getgroomgrid.com/blog/dog-grooming-software",
  "https://getgroomgrid.com/blog/dog-grooming-business-management",
  "https://getgroomgrid.com/blog/dog-grooming-contract-template",
  "https://getgroomgrid.com/blog/how-to-start-mobile-grooming-business",
  "https://getgroomgrid.com/blog/is-dog-grooming-a-profitable-business",
  "https://getgroomgrid.com/blog/mobile-dog-grooming-business-plan",
  "https://getgroomgrid.com/blog/reduce-no-shows-dog-grooming",
  "https://getgroomgrid.com/blog/groomgrid-vs-moego",
  "https://getgroomgrid.com/blog/dog-grooming-tools-equipment-list",
  "https://getgroomgrid.com/blog/pet-grooming-software",
  "https://getgroomgrid.com/blog/best-pet-grooming-software",
  "https://getgroomgrid.com/blog/how-to-increase-sales-dog-grooming-business",
  "https://getgroomgrid.com/blog/mobile-dog-grooming-business-tips",
  "https://getgroomgrid.com/blog/dog-grooming-client-intake-form",
  "https://getgroomgrid.com/blog/how-much-to-start-dog-grooming-business",
  "https://getgroomgrid.com/blog/how-to-start-a-mobile-dog-grooming-business",
  "https://getgroomgrid.com/blog/how-to-start-dog-grooming-business-at-home",
  "https://getgroomgrid.com/blog/how-to-open-a-pet-grooming-business",
  "https://getgroomgrid.com/blog/how-to-build-mobile-grooming-trailer",
  "https://getgroomgrid.com/blog/free-dog-grooming-software"
]
EOF
)

URL_COUNT=$(echo "$URLS" | grep -c '"https://')
echo "Submitting ${URL_COUNT} URLs to IndexNow..."
echo "Key location: ${KEY_LOCATION}"
echo ""

PAYLOAD=$(cat <<EOF
{
  "host": "${HOST}",
  "key": "${KEY}",
  "keyLocation": "${KEY_LOCATION}",
  "urlList": ${URLS}
}
EOF
)

RESPONSE=$(curl -s -w "\n__HTTP_STATUS__%{http_code}" \
  -X POST "${API_ENDPOINT}" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "${PAYLOAD}")

HTTP_STATUS=$(echo "$RESPONSE" | tail -n1 | sed 's/__HTTP_STATUS__//')
BODY=$(echo "$RESPONSE" | sed '$d' | sed 's/__HTTP_STATUS__.*//')

echo "HTTP Status: ${HTTP_STATUS}"
echo "Response body: ${BODY:-<empty>}"
echo ""

if [[ "$HTTP_STATUS" == "200" || "$HTTP_STATUS" == "202" ]]; then
  echo "SUCCESS: IndexNow accepted the submission (${HTTP_STATUS})."
  echo "Bing/Yandex/Seznam will verify the key file and queue pages for crawl."
elif [[ "$HTTP_STATUS" == "422" ]]; then
  echo "ERROR 422: URL(s) don't belong to host or key is wrong. Check host/key match."
  exit 1
elif [[ "$HTTP_STATUS" == "429" ]]; then
  echo "ERROR 429: Rate limited. Wait before resubmitting."
  exit 1
else
  echo "ERROR ${HTTP_STATUS}: Unexpected response. Key file may not be deployed yet."
  echo "Verify: curl -I https://${HOST}/${KEY}.txt"
  exit 1
fi
