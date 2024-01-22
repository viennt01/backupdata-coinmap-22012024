const appEnv = process.env.APP_ENV || 'dev';
const version = process.env.VERSION || '1.0.0';

const API_MAIN_GW = {
  dev: 'https://gw-dev.cextrading.io/xtrading-user-service/api/v1',
  staging: 'https://gw-staging.cextrading.io/xtrading-user-service/api/v1',
  production: 'https://gw.cextrading.io/xtrading-user-service/api/v1',
};

const env = {
  VERSION: version,
  APP_ENV: appEnv,
  API_MAIN_GW: API_MAIN_GW[appEnv],
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env,
};

module.exports = nextConfig;
