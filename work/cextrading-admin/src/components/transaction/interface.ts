export enum PAYMENT_METHOD {
  COIN_PAYMENT = 'COIN_PAYMENT',
}
export enum TRANSACTION_STATUS {
  ALL = 'ALL',
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  FAILED = 'FAILED',
  COMPLETE = 'COMPLETE',
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
  from: number;
  to: number;
}

export interface Transaction {
  id: string;
  userId: string;
  paymentId: string;
  paymentMethod: PAYMENT_METHOD;
  description: string;
  status: TRANSACTION_STATUS;
  sellAmount: number;
  sellCurrency: string;
  buyCurrency: string;
  email: string;
  username: string;
  phone: string;
  firstName: string;
  lastName: string;
  buyAmount: string;
  parentId: string;
  walletAddress: string;
  createdAt: string;
  updatedAt: string;
  details?: TransactionDetail[];
}

export interface TransactionDetail {
  id: string;
  userId: string;
  transactionId: string;
  roleId: string;
  roleName: string;
  price: number;
  currency: string;
  packageId: string;
  packageName: string;
  discountRate: number;
  discountAmount: number;
  quantity: number;
  expiresAt: string;
  createdAt: string;
}

export interface CheckTransaction {
  transactionStatus: string;
  transactionEvent: string;
  metadata: any;
  createdAt: string;
}
export interface ResponseTransactionList {
  rows: Transaction[];
  page: number;
  size: number;
  count: number;
  total: number;
}
export interface TransactionLog {
  id: string;
  transactionId: string;
  transactionEvent: string;
  transactionStatus: TRANSACTION_STATUS;
  metadata: object;
  createdAt: string;
}
export interface TransferHistory {
  id: string;
  transactionId: string;
  transferId: string;
  sellAmount: number;
  sellCurrency: string;
  buyAmount: string;
  buyCurrency: string;
  createdAt: string;
}
export interface CreateRepayment {
  amount: number;
  description: string;
}

export interface TransactionExport {
  id: string;
  paymentId: string;
  walletAddress: string;
  fullname: string;
  email: string;
  sellAmount: number;
  sellCurrency: string;
  packages: string;
  status: string;
  createdAt: string;
}
