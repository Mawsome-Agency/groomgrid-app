#!/bin/bash
# Deploy reminder system to production
# Run this on the production server

set -e

APP_DIR="/root/groomgrid-app"

echo "🚀 Deploying appointment reminder system..."

cd "$APP_DIR" || exit 1

# Pull latest changes
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Restart the application
echo "🔄 Restarting application..."
pm2 restart groomgrid-app || pm2 start npm --name "groomgrid-app" -- start

# Setup cron job for reminders
echo "⏰ Setting up cron job..."
CRON_SECRET=$(grep CRON_SECRET .env | cut -d'=' -f2-)
CRON_URL="https://getgroomgrid.com/api/cron/send-reminders?secret=$CRON_SECRET"

# Check if cron job exists
if ! crontab -l 2>/dev/null | grep -q "send-reminders"; then
  (crontab -l 2>/dev/null; echo "0 * * * * curl -s '$CRON_URL' >> /var/log/groomgrid-reminders.log 2>&1") | crontab -
  echo "✅ Cron job added"
else
  echo "ℹ️  Cron job already exists"
fi

echo "✨ Deployment complete!"
echo ""
echo "Test the reminder system:"
echo "  curl '$CRON_URL'"
