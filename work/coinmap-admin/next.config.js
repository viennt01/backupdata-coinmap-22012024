/* eslint-disable @typescript-eslint/no-var-requires */
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');
const ENV_CONFIGS = require('./src/config/env');

const appEnv = process.env.APP_ENV || 'production';
const ENV_CONFIG = ENV_CONFIGS[appEnv];

// This uses phases as outlined here: https://nextjs.org/docs/#custom-configuration
module.exports = (phase) => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  // when `next build` or `npm run build` is used
  const isProd =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1';
  // when `next build` or `npm run build` is used
  const isStaging =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1';

  const version = process.env.VERSION || 'dev';

  console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}`);

  const env = {
    VERSION: version,
    APP_ENV: process.env.APP_ENV,
    API_MAIN_GW: ENV_CONFIG.API_MAIN_GW,
    CALLBACK_ATTEND_URL: ENV_CONFIG.CALLBACK_ATTEND_URL,
    CALLBACK_CONFIRM_URL: ENV_CONFIG.CALLBACK_CONFIRM_URL,
  };

  // next.config.js object
  return {
    env,
  };
};
