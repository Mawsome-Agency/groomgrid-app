module.exports = {
  apps: [
    {
      name: 'groomgrid-prod',
      script: 'node_modules/.bin/next',
      args: 'start -p 3002',
      cwd: '/var/www/groomgrid/prod',
      // Secrets loaded from .env.local on the droplet (never committed to git).
      // Required: DATABASE_URL, NEXTAUTH_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
      //   MAILGUN_API_KEY, MAILGUN_DOMAIN, SENTRY_DSN, NEXT_PUBLIC_SENTRY_DSN,
      //   NEXT_PUBLIC_GA4_MEASUREMENT_ID, GA4_API_SECRET,
      //   STRIPE_PRICE_SOLO, STRIPE_PRICE_SALON, STRIPE_PRICE_ENTERPRISE,
      //   NEXT_PUBLIC_APP_URL, NEXTAUTH_URL
      //   Run scripts/set-stripe-prices.sh on the droplet to set these automatically.
      env_file: '/var/www/groomgrid/prod/.env.local',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
    },
    {
      name: 'groomgrid-staging',
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      cwd: '/var/www/groomgrid/staging',
      env_file: '/var/www/groomgrid/staging/.env.local',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '384M',
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
};
