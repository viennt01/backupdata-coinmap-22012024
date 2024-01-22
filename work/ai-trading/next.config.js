/* eslint-disable @typescript-eslint/no-var-requires */
const { NextFederationPlugin } = require('@module-federation/nextjs-mf');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config');

const appEnv = process.env.APP_ENV || 'dev';
const version = process.env.VERSION || '1.0.0';

const API_MAIN_GW = {
  dev: 'https://gw-dev.cextrading.io/cm-user-roles/api/v1',
  staging: 'https://gw-staging.cextrading.io/cm-user-roles/api/v1',
  production: 'https://gw.cextrading.io/cm-user-roles/api/v1',
};

const API_USER_GW = {
  dev: 'https://gw-dev.cextrading.io/cm-user-roles',
  staging: 'https://gw-staging.cextrading.io/cm-user-roles',
  production: 'https://gw.cextrading.io/cm-user-roles',
};

const WSS_URL = {
  dev: 'wss://gw-dev.cextrading.io/cm-user-roles',
  staging: 'wss://gw-staging.cextrading.io/cm-user-roles',
  production: 'wss://gw.cextrading.io/cm-user-roles',
};

const DOMAIN = {
  dev: 'https://dev.cextrading.io',
  staging: 'https://staging.cextrading.io',
  production: 'https://cextrading.io',
};

const env = {
  VERSION: version,
  APP_ENV: appEnv,
  API_MAIN_GW: API_MAIN_GW[appEnv],
  WSS_URL: WSS_URL[appEnv],
  DOMAIN: DOMAIN[appEnv],
  API_USER_GW: API_USER_GW[appEnv],
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  i18n,
  env,
  images: {
    domains: ['static-dev.cextrading.io'],
  },
  webpack(config) {
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
    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.plugins.push(
      new NextFederationPlugin({
        name: 'mainServices',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './payment-form': './src/components/micro-services/payment-form',
          './payment-checkout':
            './src/components/micro-services/payment-checkout',
        },
        shared: [],
      })
    );

    return config;
  },
  async rewrites() {
    return [
      // ALGO TRADING MARKET DOMAINs
      {
        source: '/',
        has: [
          {
            type: 'host',
            value:
              '(algotradingmarket.com|staging.algotradingmarket.com|dev.algotradingmarket.com)',
          },
        ],
        destination: '/home-algo-market',
      },

      // DEFAULT
      {
        source: '/',
        destination: '/home-default',
      },
    ];
  },
};

module.exports = nextConfig;
