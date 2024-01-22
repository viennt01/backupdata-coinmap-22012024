export const API_AUTHENTICATE = {
  LOGIN: '/merchant/auth/login',
};

export const API_MERCHANT = {
  INFO: '/merchant/profile',
  UPDATE_SENDER: '/merchant/profile/update-sender',
  VERIFY_SENDER: '/merchant/profile/verify-sender',
  CHANGE_PASSWORD: '/merchant/profile/change-password',
  VERIFY_PASSWORD: '/merchant/profile/verify-password',
  SEND_OTP_WALLET: '/merchant/profile/send-otp-wallet',
  CREATE_WALLET: '/merchant/profile/create-wallet',

  USER_LIST: '/merchant/user/list',
  USER_REPORT: '/merchant/user/report',
  USER_CHART: '/merchant/user/chart',
  LIST_HISTORY: '/merchant/user',

  TRANSACTION_LIST: '/merchant/transaction/list',
  TRANSACTION_REPORT: '/merchant/transaction/report',
  TRANSACTION_CHART: '/merchant/transaction/chart',

  BOT_LIST: '/merchant/bot/list',
  ROLE_LIST: '/merchant/role/list',
  BOT_TRADING_LIST: '/merchant/bot-trading/list',
  COMMISSION_LIST: '/merchant/commission/list',
  COMMISSION_UPDATE: '/merchant/commission/update',

  INVOICE_LIST: '/merchant/invoices/list-invoice',
  INVOICE: '/merchant/invoices',

  USER_INFORMATION: '/merchant/user',
  CREATE_USER: '/merchant/user/create-user',
  REMOVE_BOT_OF_USER: '/merchant/user/remove-user-asset',
  UPDATE_USER: (id: string) => `/merchant/user/${id}/update-user`,
  ADD_USER_ASSET: (id: string) => `/merchant/user/add-user-asset/${id}`,
  ADD_NUMBER_OF_BOT: (id: string) =>
    `/merchant/user/add-number-bot-for-user/${id}`,
  GET_NUMBER_OF_BOT: (id: string) =>
    `/merchant/user/get-number-bot-for-user/${id}`,
  UPDATE_STATUS_BOT: (id: string) => `/merchant/user/setting-active-tbot/${id}`,

  FAQ_LIST: '/merchant/additional-data/list',
  FAQ_UPDATE_STATUS: '/merchant/additional-data',
};

export const UPLOAD = {
  IMAGE: '/upload',
};
