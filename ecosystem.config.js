module.exports = {
  apps: [{
    name: 'cobolbank-api',
    script: 'api/index.js',
    watch: ['api'],
    ignore_watch: ['node_modules', 'client'],
    env_development: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/cobolbank/api-error.log',
    out_file: '/var/log/cobolbank/api-out.log',
    time: true
  }]
};