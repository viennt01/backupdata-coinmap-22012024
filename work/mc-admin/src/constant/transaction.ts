/* eslint-disable no-unused-vars */
export enum ORDER_CATEGORY {
  PKG = 'PKG',
  SBOT = 'SBOT',
  TBOT = 'TBOT',
}

export enum STATUS {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
  COMPLETE = 'COMPLETE',
}

export enum STATUS_TAG_COLOR {
  CREATED = 'processing',
  PROCESSING = 'processing',
  FAILED = 'error',
  TIMEOUT = 'error',
  COMPLETE = 'success',
}

export enum TIME_TYPE {
  DAY = 'DAY',
  MONTH = 'MONTH',
}
