module.exports = {
  apps: [{
    name: 'cobolbank-integrated',
    script: 'Rules/api/index.js',
    watch: ['Rules/api'],
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
  },
  {
    name: 'cobolbank-backend',
    script: 'Rules/api/index.js',
    watch: ['Rules/api'],
    ignore_watch: ['node_modules', 'client'],
    env_development: {
      NODE_ENV: 'development',
      PORT: 3001,
      BACKEND_ONLY: 'true'  // Nova variável para identificar modo backend-only
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001,
      BACKEND_ONLY: 'true'
    },
    error_file: '/var/log/cobolbank/backend-error.log',
    out_file: '/var/log/cobolbank/backend-out.log',
    time: true
  }]
};