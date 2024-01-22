export const API_ADMIN = {
  LOGIN: '/admin/auth/login',
};

export const API_GUEST = {
  LIST: '/admin/user/list',
  MAIN: '/admin/user',
};

export const API_EVENT = {
  LIST: '/admin/event/list',
  MAIN: '/admin/event',
  INVITE: '/admin/event/invite',
  INVITE_CSV: '/admin/event/invite-csv',
};

export const API_PUSH_NOTIFICATION = {
  EMAIL: '/admin/promotion/send',
};

export const API_MERCHANTS = {
  LIST: '/admin/merchant/list',
  CREATE: '/admin/merchant',
  DELETE_BOT: (id: string) => `/admin/merchant/commission/${id}`,
  LIST_BOT: (merchantId: string) =>
    `/admin/merchant/${merchantId}/list-commission`,
  UPDATE_BOTS: (merchantId: string) =>
    `/admin/merchant/${merchantId}/commission`,
  TRANSACTION_REPORT: (merchantId: string) =>
    `/admin/merchant/${merchantId}/transaction-report`,
  CREATE_INVOICE: (merchantId: string) =>
    `/admin/merchant/${merchantId}/invoice`,

  UPDATE_FAQ_MERCHANT: (merchantId: string) =>
    `/admin/merchant/${merchantId}/additional-data`,

  GET_ADDITIONAL_DATA_MERCHANT: (merchantId: string) =>
    `/admin/merchant/${merchantId}/additional-data/list`,
  UPDATE_STANDALONE_ADDITIONAL_DATA: (merchantId: string) =>
    `/admin/merchant/${merchantId}/standalone-additional-data`,
};

export const API_MERCHANT_USER = {
  LIST: '/admin/merchant-user/list',
};

export const API_PAYMENTS = {
  LIST: '/admin/merchant/list-invoice',
  SAVE_PAYMENT: '/admin/merchant',
};

export const API_BOT = {
  LIST: '/admin/bot-trading/list',
};

export const UPLOAD = {
  IMAGE: '/upload',
};

export const API_ADDITIONAL_DATA = {
  CREATE: '/admin/additional-data',
  LIST: '/admin/additional-data/list',
};

export const API_APP_SETTING = {
  CREATE: '/admin/app-setting',
  LIST: '/admin/app-setting/list',
};
