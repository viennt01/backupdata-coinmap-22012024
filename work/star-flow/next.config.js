const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants');
const envConfigs = require('./src/config/env');

const appEnv = process.env.APP_ENV || 'production';
const ENV_CONFIG = envConfigs[appEnv];

// This uses phases as outlined here: https://nextjs.org/docs/#custom-configuration
/**
 * Custom Next Config
 * @param {*} phase
 * @returns {import('next').NextConfig}
 */
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
    API_URL: 'http://localhost:3000',
    API_BINANCE: 'https://api.binance.com/api/v3',
    API_MAIN_GW: ENV_CONFIG.API_MAIN_GW,
    CEX_LINK: ENV_CONFIG.CEX_LINK,
    DEX_LINK: ENV_CONFIG.DEX_LINK,
    API_HEATMAP_GW: 'https://streamdataheatmapbinance.herokuapp.com',
    WS_HEATMAP: ENV_CONFIG.WS_HEATMAP,
    FEEDBACK_FORM: ENV_CONFIG.FEEDBACK_FORM,
    TRADINGVIEW_URL: ENV_CONFIG.TRADINGVIEW_URL,
    GG_ANALYTICS_KEY: 'G-71KFPMLQ9G',
    BOT_SIGNALS: ENV_CONFIG.BOT_SIGNALS,
    API_DEFAULT_GW: ENV_CONFIG.API_DEFAULT_GW,
    API_USER_ROLES_GW: ENV_CONFIG.API_USER_ROLES_GW,
    API_USER_ROLES_GW_V2: ENV_CONFIG.API_USER_ROLES_GW_V2,
    BOT_COINMAP_GW: ENV_CONFIG.BOT_COINMAP_GW,
    WS_WATCH_LIST: ENV_CONFIG.WS_WATCH_LIST,
    WS_STREAM_DATA: ENV_CONFIG.WS_STREAM_DATA,
    WS_LIMIT_DEVICE: ENV_CONFIG.WS_LIMIT_DEVICE,
    USER_GUIDE_LINK: ENV_CONFIG.USER_GUIDE_LINK,
  };

  // next.config.js object
  return {
    env,
    images: {
      domains: ENV_CONFIG.IMAGES_DOMAIN,
    },
    webpack(config, options) {
      // config.module.rules.push({
      //   test: /\.svg$/,
      //   use: ['@svgr/webpack', 'url-loader'],
      // });

      // console.log('config.module.rules', config.module.rules);
      config.module.rules.push({
        test: /\.svg$/i,
        // issuer section restricts svg as component only to
        // svgs imported from js / ts files.
        //
        // This allows configuring other behavior for
        // svgs imported from other file types (such as .css)
        issuer: { and: [/\.(js|ts|md)x?$/] },
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [{ name: 'removeViewBox', active: false }],
              },
            },
          },
        ],
      });
      return config;
    },
    async rewrites() {
      return [
        {
          source: '/signal-bot-dashboard/:path',
          destination: '/signal-bot-dashboard',
        },
      ];
    },
  };
};
