#!/bin/bash
# GroomGrid Production Deploy Script
# Usage: ./scripts/deploy.sh [prod|staging]
# Stops the app before npm install to prevent OOM on 1GB droplet
set -e

ENV="${1:-prod}"
APP_DIR="/var/www/groomgrid/${ENV}"
PM2_NAME="groomgrid-${ENV}"

echo "=== GroomGrid Deploy: ${ENV} ==="
echo ""

# 1. Pull latest code
echo "[1/6] Pulling latest code..."
cd "$APP_DIR"
git pull origin main

# 2. Stop app BEFORE npm install to free memory
# On a 1GB droplet, npm install while the app is running causes OOM kills.
echo "[2/6] Stopping app to free memory for install..."
pm2 stop "$PM2_NAME" 2>/dev/null || true

# 3. Install deps (with app stopped, full RAM available for npm)
echo "[3/6] Installing dependencies..."
npm ci --production=false  # devDeps required: Tailwind/PostCSS/autoprefixer needed for next build

# 4. Run pending database migrations
# Source DATABASE_URL from .env.local so prisma can connect
echo "[4/6] Running database migrations..."
set -a; source .env.local; set +a
npx prisma migrate deploy

# 5. Build
echo "[5/6] Building..."
NODE_ENV=production node_modules/.bin/next build

# 6. Restart app
echo "[6/6] Starting app..."
pm2 restart "$PM2_NAME" || pm2 start "$PM2_NAME"
pm2 save

echo ""
echo "=== Deploy complete: ${ENV} ==="
pm2 status "$PM2_NAME"
