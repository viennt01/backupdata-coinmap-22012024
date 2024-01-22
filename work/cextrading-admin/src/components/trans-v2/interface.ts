export enum PAYMENT_METHOD {
  COIN_PAYMENT = 'COIN_PAYMENT',
}
export enum TRANSACTION_STATUS {
  STATUS = 'STATUS',
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  FAILED = 'FAILED',
  COMPLETE = 'COMPLETE',
}
export enum TRANSACTION_CATEGORY {
  ORDER_TYPE = 'TYPE',
  PKG = 'PKG',
  SBOT = 'SBOT',
  TBOT = 'TBOT',
}

export enum TRANSACTION_EVENT {
  PAYMENT_CREATED = 'PAYMENT_CREATED',

  PAYMENT_PROCESSING = 'PAYMENT_PROCESSING',
  PAYMENT_TRANSFER = 'PAYMENT_TRANSFER',
  PAYMENT_COMPLETE = 'PAYMENT_COMPLETE',
  PAYMENT_FAILED = 'PAYMENT_FAILED',

  DELIVERED = 'DELIVERED',
}
export interface FILTER {
  page: number;
  size: number;
  keyword?: string;
  status?: string;
  category?: string;
  merchant_code?: string;
  name: string;
  from: number;
  to: number;
}

export interface Transaction {
  id: string;
  userId: string;
  paymentId: string;
  paymentMethod: PAYMENT_METHOD;
  currency: string;
  merchantCode: string;
  name: any;
  status: TRANSACTION_STATUS;
  amount: number;
  email: string;
  fullname: string;
  integrateService: string;
  ipnUrl: string;
  orderId: string;
  category: TRANSACTION_CATEGORY;
  createdAt: string;
  updatedAt: string;
}

export interface Merchant {
  code: string;
}

export interface Pkg {
  role_name: string;
}

export interface RawSBot {
  name: string;
}

export interface RawTBot {
  name: string;
}

export interface ResponseTransactionList {
  rows: Transaction[];
  page: number;
  size: number;
  count: number;
  total: number;
}

export interface TransactionExport {
  id: string;
  paymentId: string;
  fullname: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface Metadata {
  attribute: string;
  value: string;
  createdAt: string;
}

export interface Log {
  id: string;
  transactionId: string;
  transactionEvent: string;
  transactionStatus: TRANSACTION_STATUS;
  metadata: object;
  createdAt: string;
}
