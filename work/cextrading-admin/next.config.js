const BASE_URL = {
  local: 'https://gw-dev.cextrading.io/cm-user-roles/api',
  dev: 'https://gw-dev.cextrading.io/cm-user-roles/api',
  staging: 'https://gw-staging.cextrading.io/cm-user-roles/api',
  production: 'https://gw.cextrading.io/cm-user-roles/api',
};
const WS_URL = {
  local: 'wss://gw-dev.cextrading.io/cm-user-roles',
  dev: 'wss://gw-dev.cextrading.io/cm-user-roles',
  staging: 'wss://gw-staging.cextrading.io/cm-user-roles',
  production: 'wss://gw.cextrading.io/cm-user-roles',
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  env: {
    BASE_URL: BASE_URL[process.env.APP_ENV], // Pass through env variables
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    APP_ENV: process.env.APP_ENV,
    VERSION: process.env.VERSION,
    WS_URL: WS_URL[process.env.APP_ENV],
  },
};

module.exports = nextConfig;
