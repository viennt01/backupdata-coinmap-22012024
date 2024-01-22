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
  UPDATE_BOT_STATUS: '/user/bot-trading/update-status',
  LOG_OUT_BROKER: '/user/bot-trading/logout',
  TRADE_HISTORY: '/user/bot-trading/trade-history',
  CURRENCY_LIST: '/user/currency/list',
  BOT_TRADING: '/user/bot-trading',

  PACKAGE: '/user/package',
  ROLE: '/user/role',
  BOT: '/user/bot',
  TRANSACTION: '/user/transaction',
};
