#!/bin/bash
# GroomGrid Self-Hosted Deploy Script
# Run once: .env.local is populated and DNS is pointing to this server
set -e

APP_DIR="/home/deployer/cortex/groomgrid-app"
cd "$APP_DIR"

echo "=== GroomGrid Self-Hosted Deploy ==="
echo ""

# 1. Install deps + build
echo "[1/4] Building production app..."
npm install --omit=dev
NODE_ENV=production node_modules/.bin/next build

# 2. Enable nginx site
echo "[2/4] Enabling nginx site..."
sudo ln -sf /etc/nginx/sites-available/groomgrid-app /etc/nginx/sites-enabled/groomgrid-app

# 3. Provision SSL
echo "[3/4] Provisioning SSL cert..."
sudo certbot --nginx -d app.getgroomgrid.com --non-interactive --agree-tos -m matt@mawsome.agency

# 4. Start with PM2
echo "[4/4] Starting app with PM2..."
npx pm2 start ecosystem.config.js
npx pm2 save
npx pm2 startup

sudo systemctl reload nginx
echo ""
echo "=== GroomGrid is live at https://app.getgroomgrid.com ==="
