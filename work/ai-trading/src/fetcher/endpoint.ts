export enum ADDITIONAL_DATA_TYPE {
  HOME_PAGE = 'HOME_PAGE',
  POLICY = 'POLICY',
}

export const API_AUTHENTICATE = {
  LOGIN: '/merchant/auth/login',
};
export const API_USER = {
  LOGIN: '/user/login',
  REGISTER: '/user/register',
  RESEND_EMAIL_VERIFY: '/user/resend-email-verify',
  PROFILE: '/user/profile',
  PAYMENT_LIST: '/user/asset/list',
  APP_SETTING: '/user/app-setting',
  FORGOT_PASSWORD: '/user/forgot-password',
  RESET_PASSWORD: '/user/reset-password',
};
export const API_MERCHANT = {
  MERCHANT_INFO: '/merchant',
};

export const API_BOT = {
  LIST_BOT: '/user/bot-trading/list',
  LIST_BOT_PLANS: '/user/bot-trading/plans',
  CONNECT_BROKER: '/user/bot-trading/connect',
  SELECT_AND_CONNECT_BROKER: '/user/bot-trading/select-and-connect',
  LIST_BROKER: '/user/bot-trading/brokers',
  LIST_BROKER_SERVER: '/user/bot-trading/broker-servers',
  UPDATE_BOT_STATUS: '/user/bot-trading/update-status',
  LOG_OUT_BROKER: '/user/bot-trading/logout',
  TRADE_HISTORY: '/user/bot-trading/trade-history',
  CURRENCY_LIST: '/user/currency/list',
  BOT_TRADING: '/user/bot-trading',
  BALANCE_AND_FEE: '/user/bot-trading/balance-and-fee',

  PACKAGE: '/user/package',
  ROLE: '/user/role',
  TRANSACTION: '/user/transaction',
};

export const API_MERCHANT_ADDITIONAL_DATA = {
  LIST: '/merchant/additional-data/list',
};
