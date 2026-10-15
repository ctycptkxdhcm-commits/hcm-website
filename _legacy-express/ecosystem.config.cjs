// PM2 config — dùng khi deploy lên Hostinger VPS: pm2 start ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'hcm-website',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: { NODE_ENV: 'production', PORT: 3000 },
      max_memory_restart: '300M'
    }
  ]
};
