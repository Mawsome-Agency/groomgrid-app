module.exports = {
  apps: [
    {
      name: 'groomgrid-app',
      script: 'node_modules/.bin/next',
      args: 'start -p 3003',
      cwd: '/home/deployer/cortex/groomgrid-app',
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
