#!/bin/bash
# GroomGrid Production Deploy Script
# Usage: ./scripts/deploy.sh [prod|staging] [--local-build]
#
# Modes:
#   Default (server build):     SSH to droplet, git pull, npm ci, build there
#   --local-build:              Build locally, rsync .next + node_modules to droplet
#                               (required on 1GB droplet — Turbopack OOMs with <2GB RAM)
set -e

ENV="${1:-prod}"
LOCAL_BUILD=false
if [[ "$2" == "--local-build" ]]; then
  LOCAL_BUILD=true
fi

APP_DIR="/var/www/groomgrid/${ENV}"
PM2_NAME="groomgrid-${ENV}"
DEPLOY_KEY="$HOME/.ssh/groomgrid_deploy"
DEPLOY_HOST="68.183.151.222"

echo "=== GroomGrid Deploy: ${ENV} (local-build: ${LOCAL_BUILD}) ==="
echo ""

if [ "$LOCAL_BUILD" = true ]; then
  # === LOCAL BUILD MODE ===
  # Build on this machine (which has enough RAM), then rsync to droplet

  # 1. Build locally
  echo "[1/5] Building locally..."
  npm ci --production=false --ignore-scripts 2>/dev/null || true
  npx prisma generate
  rm -rf .next
  NODE_ENV=production npx next build

  # 2. Rsync .next to server
  echo "[2/5] Syncing .next to server..."
  rsync -avz --delete -e "ssh -i $DEPLOY_KEY" .next/ root@${DEPLOY_HOST}:${APP_DIR}/.next/

  # 3. Rsync node_modules (only if package.json changed)
  echo "[3/5] Syncing node_modules to server..."
  ssh -i "$DEPLOY_KEY" root@${DEPLOY_HOST} "cd ${APP_DIR} && git stash 2>/dev/null; git pull origin main"
  ssh -i "$DEPLOY_KEY" root@${DEPLOY_HOST} "cd ${APP_DIR} && npm ci --production=false --ignore-scripts 2>/dev/null || true"
  ssh -i "$DEPLOY_KEY" root@${DEPLOY_HOST} "cd ${APP_DIR} && npx prisma generate"

  # 4. Run migrations on server
  echo "[4/5] Running database migrations..."
  ssh -i "$DEPLOY_KEY" root@${DEPLOY_HOST} "cd ${APP_DIR} && set -a; source .env.local; set +a; npx prisma migrate deploy"

  # 5. Restart
  echo "[5/5] Restarting app..."
  ssh -i "$DEPLOY_KEY" root@${DEPLOY_HOST} "pm2 restart ${PM2_NAME} || pm2 start ecosystem.config.js --only ${PM2_NAME}; pm2 save"

else
  # === SERVER BUILD MODE (legacy — use --local-build for 1GB droplets) ===
  echo "[1/6] Pulling latest code..."
  cd "$APP_DIR"
  git pull origin main

  echo "[2/6] Stopping app to free memory for install..."
  pm2 stop "$PM2_NAME" 2>/dev/null || true

  echo "[3/6] Installing dependencies..."
  npm ci --production=false

  echo "[4/6] Running database migrations..."
  set -a; source .env.local; set +a
  npx prisma migrate deploy

  echo "[5/6] Building..."
  NODE_ENV=production npx next build

  echo "[6/6] Starting app..."
  pm2 restart "$PM2_NAME" || pm2 start ecosystem.config.js --only "$PM2_NAME"
  pm2 save
fi

echo ""
echo "=== Deploy complete: ${ENV} ==="
