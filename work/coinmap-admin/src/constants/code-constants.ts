export const ERROR_CODE = {
  SUCCESS: 'SUCCESS',
  OK: 'ok',
};

export const LOCAL_CACHE_KEYS = {
  CM_TOKEN: 'e01565b3-5aa6-45bc-8d27-aaed77a4d085',
};

export const EVENT_STATUS = {
  CLOSE: 'CLOSE',
  HAPPENING: 'HAPPENING',
  CLOSE_REGISTRATION: 'CLOSE_REGISTRATION',
  OPEN_REGISTRATION: 'OPEN_REGISTRATION',
  COMINGSOON: 'COMINGSOON',
};

export const INVITE_CODE_TYPE = {
  VIP: 'VIP',
  GUEST: 'GUEST',
};

export const ATTEND_STATUS = {
  true: 'YES',
  false: 'NO',
};

export const ATTEND_STATUS_COLOR = {
  YES: 'success',
  NO: 'error',
};

export const EVENT_CONFIRM_STATUS = {
  WAITING: 'WAITING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const EVENT_CONFIRM_STATUS_COLOR = {
  WAITING: 'default',
  APPROVED: 'success',
  REJECTED: 'error',
};

export const DEFAULT_PAGINATION = {
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: [
    '10',
    '20',
    '50',
    '100',
    '200',
    '500',
    '1000',
    '2000',
    '5000',
    '10000',
  ],
};

export const PAYMENT_STATUS = {
  WAITING: 'WAITING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
};

export const PAYMENT_STATUS_COLOR = {
  WAITING: 'default',
  PROCESSING: 'processing',
  COMPLETED: 'success',
};

export enum FIELD_TYPE {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
}

export enum LOCALE {
  EN = 'en',
  VI = 'vi',
}
