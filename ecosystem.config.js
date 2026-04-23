module.exports = {
  apps: [
    {
      name: 'groomgrid-app',
      script: 'node_modules/.bin/next',
      args: 'start -p 3003',
      cwd: '/home/deployer/cortex/groomgrid-app',
      // Secrets are loaded from .env.local on the droplet (never committed to git).
      // Required entries in /home/deployer/cortex/groomgrid-app/.env.local:
      //   DATABASE_URL, NEXTAUTH_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
      //   MAILGUN_API_KEY, MAILGUN_DOMAIN, SENTRY_DSN, NEXT_PUBLIC_SENTRY_DSN
      //   NEXT_PUBLIC_GA4_MEASUREMENT_ID  — from GA4 Admin → Data Streams → Measurement ID
      //   GA4_API_SECRET                  — from GA4 Admin → Data Streams → Measurement Protocol API Secrets
      env_file: '/home/deployer/cortex/groomgrid-app/.env.local',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
      },
    },
  ],
};
