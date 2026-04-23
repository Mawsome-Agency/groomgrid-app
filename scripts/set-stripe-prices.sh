#!/usr/bin/env bash
# set-stripe-prices.sh
# Patches the production .env.local with the correct Stripe price IDs.
# Run once on the droplet, then rebuild + restart the app.
#
# Usage:
#   ssh root@68.183.151.222 'bash -s' < scripts/set-stripe-prices.sh
#   — OR —
#   Run directly on the droplet as root or deployer.

set -euo pipefail

ENV_FILE="/home/deployer/cortex/groomgrid-app/.env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: $ENV_FILE not found. Run this from the production droplet after deploy." >&2
  exit 1
fi

# Stripe price IDs (live mode) — confirmed via Stripe API 2026-04-23
SOLO_PRICE="price_1TJDgnG4DfZ9Hko3qZUifmgo"      # $29/mo Solo
SALON_PRICE="price_1TJDguG4DfZ9Hko36faOkkXr"     # $79/mo Salon
ENTERPRISE_PRICE="price_1TJDgvG4DfZ9Hko3vLzhNLZ1" # $149/mo Enterprise

patch_env() {
  local key="$1"
  local value="$2"

  if grep -q "^${key}=" "$ENV_FILE"; then
    # Update existing line in-place
    sed -i "s|^${key}=.*|${key}=\"${value}\"|" "$ENV_FILE"
    echo "  Updated: ${key}"
  else
    # Append if not present
    echo "${key}=\"${value}\"" >> "$ENV_FILE"
    echo "  Added:   ${key}"
  fi
}

echo "=== Patching Stripe price IDs in $ENV_FILE ==="
patch_env "STRIPE_PRICE_SOLO"       "$SOLO_PRICE"
patch_env "STRIPE_PRICE_SALON"      "$SALON_PRICE"
patch_env "STRIPE_PRICE_ENTERPRISE" "$ENTERPRISE_PRICE"

echo ""
echo "=== Verifying ==="
grep "STRIPE_PRICE" "$ENV_FILE"

echo ""
echo "DONE. Now rebuild and restart the app:"
echo "  cd /home/deployer/cortex/groomgrid-app"
echo "  npm run build && pm2 restart groomgrid-app"
