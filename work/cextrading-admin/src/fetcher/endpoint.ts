export const API_USER = {
  LOGIN: '/user/login',
  REGISTER: '/user/register',
  RESEND_EMAIL_VERIFY: '/user/resend-email-verify',
  FORGOT_PASSWORD: '/user/forgot-password',
  RESET_PASSWORD: '/user/reset-password',
};

export const API_ADMIN = {
  FEATURE_CREATE: '/admin/setting/feature',
  FEATURE_DELETE: '/admin/setting/feature',
  FEATURE_LIST: '/admin/setting/feature/list',
  FEATURE_DETAIL: '/admin/setting/feature',
  FEATURE_EDIT: '/admin/setting/feature',

  GENERAL_CREATE: '/admin/setting/general-setting',
  GENERAL_DELETE: '/admin/setting/general-setting',
  GENERAL_LIST: '/admin/setting/general-setting/list',
  GENERAL_DETAIL: '/admin/setting/general-setting',
  GENERAL_EDIT: '/admin/setting/general-setting',

  SYMBOL_LIST: '/admin/setting/symbol/list',
  SYMBOL_CREATE: '/admin/setting/symbol',
  SYMBOL_DETAIL: '/admin/setting/symbol',
  SYMBOL_DELETE: '/admin/setting/symbol',
  SYMBOL_EDIT: '/admin/setting/symbol',

  APP_SETTING_LIST: '/admin/setting/app-setting/list',
  APP_SETTING_EDIT: '/admin/setting/app-setting',
  APP_SETTING_CREATE: '/admin/setting/app-setting',

  RESOLUTION_LIST: '/admin/setting/resolution/list',
  RESOLUTION_CREATE: '/admin/setting/resolution',
  RESOLUTION_DETAIL: '/admin/setting/resolution',
  RESOLUTION_DELETE: '/admin/setting/resolution',
  RESOLUTION_EDIT: '/admin/setting/resolution',

  EXCHANGE_LIST: '/admin/setting/exchange/list',
  EXCHANGE_DETAIL: '/admin/setting/exchange',
  EXCHANGE_CREATE: '/admin/setting/exchange',
  EXCHANGE_DELETE: '/admin/setting/exchange',
  EXCHANGE_EDIT: '/admin/setting/exchange',

  ROLE_FEATURE_CREATE: '/admin/role/feature',
  ROLE_GENERAL_CREATE: '/admin/role/general-setting',
  ROLE_SYMBOL_CREATE: '/admin/role/symbol-setting',
  ROLE_CREATE: '/admin/role',
  ROLE_DELETE: '/admin/role',
  ROLE_DETAIL: '/admin/role',
  ROLE_EDITING: '/admin/role',
  ROLE_LIST: '/admin/setting/role/list',

  ADMIN_PERMISSION_LIST: '/admin/permission/list',

  ADMIN_LOGIN: '/admin/login',
  ADMIN_CREATE: '/admin/admin',
  ADMIN_DETAIL: '/admin/admin',
  ADMIN_EDITING: '/admin/admin',
  ADMIN_ROLE_LIST: '/admin/auth-role/list',
  ADMIN_ROLE_DETAIL: '/admin/auth-role',
  ADMIN_ROLE_CREATE: '/admin/auth-role',
  ADMIN_ROLE_EDIT: '/admin/auth-role',
  ADMIN_ROLE_DELETE: '/admin/auth-role',
  ADMIN_LIST: '/admin/admin/list',
  ADMIN_ROLE: '/admin/auth-user-role',
  ADMIN_ROLE_BY_ADMINID: '/admin/auth-role/list',

  USER_LISTING: '/admin/user/list',
  USER_LISTING_ALL: '/admin/user/all',
  USER_CREATE: '/admin/user',
  USER_DETAIL: '/admin/user',
  USER_EDITING: '/admin/user',
  USER_ROLE: '/admin/user-role',
  USER_ROLE_LISTING: '/admin/role/list',
  USER_ROLE_BY_USERID: '/admin/role/list',
  USER_ROLE_ADD_MULTIPLE: '/admin/add-multiple-user-role',
  USER_ROLE_REMOVE_MULTIPLE: '/admin/remove-multiple-user-role',

  ADMIN_PROFILE: '/admin/admin/profile',
  ADMIN_UPDATE: '/admin/admin/profile',

  TRANSACTION: '/admin/transaction',
  TRANSACTION_LIST: '/admin/transaction/list',
  TRANSACTION_REFUND_LIST: '/admin/transaction/refund/list',

  TRANSACTION_V2: '/admin/transaction',
  TRANSACTION_V2_LIST: '/admin/transaction/list',
  TRANSACTION_V2_REFUND_LIST: '/admin/transaction/refund/list',

  SETTING_BOT_LIST: '/admin/setting/bot/list',
  SETTING_BOT_DETAIL: '/admin/setting/bot',
  SETTING_BOT_CREATE: '/admin/setting/bot',
  SETTING_BOT_DELETE: '/admin/setting/bot',
  SETTING_BOT_EDIT: '/admin/setting/bot',

  PACKAGE_LIST: '/admin/setting/package/list',
  PACKAGE_DETAIL: '/admin/setting/package',
  PACKAGE_CREATE: '/admin/setting/package',
  PACKAGE_DELETE: '/admin/setting/package',
  PACKAGE_EDIT: '/admin/setting/package',

  CURRENCY_LIST: '/admin/setting/currency/list',
  CURRENCY_DETAIL: '/admin/setting/currency',
  CURRENCY_CREATE: '/admin/setting/currency',
  CURRENCY_DELETE: '/admin/setting/currency',
  CURRENCY_EDIT: '/admin/setting/currency',

  UPLOAD_FILE: '/admin/setting/upload',

  BOT_LIST: '/admin/bot/list',
  BOT_DETAIL: '/admin/bot',
  BOT_CREATE: '/admin/bot',
  BOT_DELETE: '/admin/bot',
  BOT_EDIT: '/admin/bot',

  BOT_TRADING_LIST: '/admin/bot-trading/list',
  BOT_TRADING_DETAIL: '/admin/bot-trading',
  BOT_TRADING_CREATE: '/admin/bot-trading',
  BOT_TRADING_EDIT: '/admin/bot-trading',
  BOT_TRADING_DELETE: '/admin/bot-trading',

  LIST_HISTORY_BOT_PKG: '/admin/user',
  LIST_HISTORY_SBOT: '/admin/user',
  LIST_HISTORY_TBOT: '/admin/user',

  GET_MERCHANT: '/admin/merchant/list',

  GET_BOT_SIGNAL: '/admin/bot/list',
  GET_BOT_TRADING: '/admin/bot-trading/list',

  BOT_ASSET_CREATE: '/admin/add-user-asset',
  BOT_ASSET_DELETE: '/admin/remove-user-asset',

  BOT_TRADING_HISTORY_LIST: '/admin/bot-trading-history/list',
  BOT_TRADING_HISTORY_IMPORT_CSV: '/admin/bot-trading-history/import-csv',

  TBOT_SYSTEM_TRADE_HISTORIES:
    '/admin/bot-trading-history/system-trade-history',
};
