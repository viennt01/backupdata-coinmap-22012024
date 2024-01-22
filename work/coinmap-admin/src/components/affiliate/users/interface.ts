export enum USER_BOT_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  NOT_CONNECT = 'NOT_CONNECT',
  INACTIVE_BY_SYSTEM = 'INACTIVE_BY_SYSTEM',
  PROCESSING = 'PROCESSING',
  CONNECTING = 'CONNECTING',
  DISCONNECTED = 'DISCONNECTED',
  EXPIRED = 'EXPIRED',
  DELETED = 'DELETED',
  FAILED = 'FAILED',
  STOP_OUT = 'STOP_OUT',
}

export enum ORDER_CATEGORY {
  PKG = 'PKG',
  SBOT = 'SBOT',
  TBOT = 'TBOT',
}

export interface MerchantUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  email_confirmed: boolean;
  merchant_code: string;
  created_at: string;
}

export interface MerchantUserList {
  error_code: string;
  message: string;
  payload: {
    rows: MerchantUser[];
    page: number;
    size: number;
    count: number;
    total: number;
  };
}

export interface Package {
  id: string;
  name: string;
  clone_name?: string;
}

export interface PackageList {
  [key: string]: Package[];
}

export interface Merchant {
  name: string;
  code: string;
  email: string;
  description: string;
  domain: string;
}
