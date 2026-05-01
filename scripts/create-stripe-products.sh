#!/usr/bin/env bash
# create-stripe-products.sh
# Creates GroomGrid products and prices in Stripe (live mode).
# Run on the production droplet where STRIPE_SECRET_KEY is set.
#
# Usage:
#   STRIPE_SECRET_KEY=sk_live_... bash scripts/create-stripe-products.sh
#   — OR — run on the droplet where .env.local has STRIPE_SECRET_KEY
#
# This script is idempotent — if products/prices already exist, it will
# detect them and update .env.local with the correct price IDs.

set -euo pipefail

echo "=== GroomGrid Stripe Product & Price Setup ==="
echo ""

# Source env from .env.local if available
if [ -f ".env.local" ]; then
  echo "Loading .env.local..."
  set -a
  source .env.local
  set +a
fi

if [ -z "${STRIPE_SECRET_KEY:-}" ]; then
  echo "ERROR: STRIPE_SECRET_KEY not set. Set it in .env.local or pass as env var."
  exit 1
fi

STRIPE_API="https://api.stripe.com/v1"

# Helper: Stripe API call
stripe_get() {
  curl -s -H "Authorization: Bearer $STRIPE_SECRET_KEY" "$STRIPE_API/$1" 2>/dev/null
}
stripe_post() {
  curl -s -X POST -H "Authorization: Bearer $STRIPE_SECRET_KEY" "$STRIPE_API/$1" -d "$2" 2>/dev/null
}

# Check for existing products
echo "Checking for existing GroomGrid products..."
EXISTING=$(stripe_get "products?limit=100")

# Parse existing products to see if we need to create new ones
SOLO_PROD_ID=$(echo "$EXISTING" | python3 -c "
import sys, json
d = json.load(sys.stdin)
for p in d.get('data', []):
  if p.get('metadata', {}).get('type') == 'solo' or 'Solo' in p.get('name', ''):
    print(p['id'])
    break
else:
  print('')
" 2>/dev/null)

SALON_PROD_ID=$(echo "$EXISTING" | python3 -c "
import sys, json
d = json.load(sys.stdin)
for p in d.get('data', []):
  if p.get('metadata', {}).get('type') == 'salon' or 'Salon' in p.get('name', ''):
    print(p['id'])
    break
else:
  print('')
" 2>/dev/null)

ENTERPRISE_PROD_ID=$(echo "$EXISTING" | python3 -c "
import sys, json
d = json.load(sys.stdin)
for p in d.get('data', []):
  if p.get('metadata', {}).get('type') == 'enterprise' or 'Multi-Location' in p.get('name', '') or 'Enterprise' in p.get('name', ''):
    print(p['id'])
    break
else:
  print('')
" 2>/dev/null)

echo "  Solo product: ${SOLO_PROD_ID:-NOT FOUND}"
echo "  Salon product: ${SALON_PROD_ID:-NOT FOUND}"
echo "  Enterprise product: ${ENTERPRISE_PROD_ID:-NOT FOUND}"
echo ""

# Create products if they don't exist
if [ -z "$SOLO_PROD_ID" ]; then
  echo "Creating Solo Groomer product..."
  RESP=$(stripe_post "products" "name=Solo Groomer&description=For independent mobile groomers - unlimited bookings, pet profiles, auto reminders&metadata[type]=solo")
  SOLO_PROD_ID=$(echo "$RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)
  echo "  Created: $SOLO_PROD_ID"
else
  echo "  Solo Groomer product already exists: $SOLO_PROD_ID"
fi

if [ -z "$SALON_PROD_ID" ]; then
  echo "Creating Salon Team product..."
  RESP=$(stripe_post "products" "name=Salon Team&description=For grooming salons with 2-5 groomers - team scheduling, performance metrics&metadata[type]=salon")
  SALON_PROD_ID=$(echo "$RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)
  echo "  Created: $SALON_PROD_ID"
else
  echo "  Salon Team product already exists: $SALON_PROD_ID"
fi

if [ -z "$ENTERPRISE_PROD_ID" ]; then
  echo "Creating Multi-Location Enterprise product..."
  RESP=$(stripe_post "products" "name=Multi-Location+Enterprise&description=For multi-location grooming businesses - unlimited groomers, custom branding, API access&metadata[type]=enterprise")
  ENTERPRISE_PROD_ID=$(echo "$RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)
  echo "  Created: $ENTERPRISE_PROD_ID"
else
  echo "  Multi-Location Enterprise product already exists: $ENTERPRISE_PROD_ID"
fi

echo ""
echo "Creating prices..."

# Create recurring monthly prices for each product
# Solo: $29/month
echo "Creating Solo price ($29/mo)..."
SOLO_PRICE_RESP=$(stripe_post "prices" "product=$SOLO_PROD_ID&unit_amount=2900&currency=usd&recurring[interval]=month&metadata[type]=solo")
SOLO_PRICE_ID=$(echo "$SOLO_PRICE_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)
echo "  Solo price: $SOLO_PRICE_ID"

# Salon: $79/month
echo "Creating Salon price ($79/mo)..."
SALON_PRICE_RESP=$(stripe_post "prices" "product=$SALON_PROD_ID&unit_amount=7900&currency=usd&recurring[interval]=month&metadata[type]=salon")
SALON_PRICE_ID=$(echo "$SALON_PRICE_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)
echo "  Salon price: $SALON_PRICE_ID"

# Enterprise: $149/month
echo "Creating Enterprise price ($149/mo)..."
ENTERPRISE_PRICE_RESP=$(stripe_post "prices" "product=$ENTERPRISE_PROD_ID&unit_amount=14900&currency=usd&recurring[interval]=month&metadata[type]=enterprise")
ENTERPRISE_PRICE_ID=$(echo "$ENTERPRISE_PRICE_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null)
echo "  Enterprise price: $ENTERPRISE_PRICE_ID"

echo ""
echo "=== Stripe Setup Complete ==="
echo "Product IDs:"
echo "  Solo: $SOLO_PROD_ID"
echo "  Salon: $SALON_PROD_ID"
echo "  Enterprise: $ENTERPRISE_PROD_ID"
echo ""
echo "Price IDs (add these to .env.local):"
echo "  STRIPE_PRICE_SOLO=$SOLO_PRICE_ID"
echo "  STRIPE_PRICE_SALON=$SALON_PRICE_ID"
echo "  STRIPE_PRICE_ENTERPRISE=$ENTERPRISE_PRICE_ID"

# Update .env.local with the new price IDs
ENV_FILE=".env.local"
if [ -f "$ENV_FILE" ]; then
  echo ""
  echo "Patching $ENV_FILE with new price IDs..."
  
  patch_env() {
    local key="$1"
    local value="$2"
    if grep -q "^${key}=" "$ENV_FILE"; then
      sed -i "s|^${key}=.*|${key}=\"${value}\"|" "$ENV_FILE"
      echo "  Updated: ${key}"
    else
      echo "${key}=\"${value}\"" >> "$ENV_FILE"
      echo "  Added:   ${key}"
    fi
  }
  
  patch_env "STRIPE_PRICE_SOLO" "$SOLO_PRICE_ID"
  patch_env "STRIPE_PRICE_SALON" "$SALON_PRICE_ID"
  patch_env "STRIPE_PRICE_ENTERPRISE" "$ENTERPRISE_PRICE_ID"
  
  echo ""
  echo "Verifying..."
  grep "STRIPE_PRICE" "$ENV_FILE"
else
  echo ""
  echo "WARNING: $ENV_FILE not found. Manually add the price IDs above."
fi

# Also create the BETA50 coupon if it doesn't exist
echo ""
echo "Checking for BETA50 coupon..."
COUPON_RESP=$(stripe_get "coupons/BETA50" 2>/dev/null)
COUPON_EXISTS=$(echo "$COUPON_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print('yes' if d.get('id') == 'BETA50' else 'no')" 2>/dev/null || echo "no")

if [ "$COUPON_EXISTS" = "no" ]; then
  echo "Creating BETA50 coupon (50% off first month)..."
  stripe_post "coupons" "id=BETA50&percent_off=50&duration=once&name=Founding Member - 50%25 off first month" > /dev/null 2>&1
  echo "  Created BETA50 coupon"
else
  echo "  BETA50 coupon already exists"
fi

echo ""
echo "=== ALL DONE ==="
echo "Now rebuild and restart the app:"
echo "  cd /var/www/groomgrid/prod  (or wherever the app is)"
echo "  npm run build && pm2 restart groomgrid-prod"
