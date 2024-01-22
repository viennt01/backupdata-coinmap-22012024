import { get } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response } from 'fetcher/interface';
import { format } from 'date-fns';
import {
  PAYMENT_METHOD,
  TRANSACTION_STATUS,
  Transaction,
  ResponseTransactionList,
  TransactionDetail,
  TransactionLog,
  CheckTransaction,
  TransactionExport,
} from './interface';
import { convertToParamsString } from 'fetcher/utils';

export interface RawTransactionLog {
  id: string;
  transaction_id: string;
  transaction_event: string;
  transaction_status: TRANSACTION_STATUS;
  metadata: object;
  created_at: number;
}

export interface RawTransactionDetail {
  id: string;
  user_id: string;
  transaction_id: string;
  role_id: string;
  role_name: string;
  price: number;
  currency: string;
  package_id: string;
  package_name: string;
  discount_rate: number;
  discount_amount: number;
  quantity: number;
  expires_at: number;
  created_at: number;
}

export interface RawTransaction {
  id: string;
  user_id: string;
  payment_id: string;
  payment_method: PAYMENT_METHOD;
  description: string;
  status: TRANSACTION_STATUS;
  sell_amount: number;
  sell_currency: string;
  buy_currency: string;
  email: string;
  username: string;
  phone: string;
  first_name: string;
  last_name: string;
  buy_amount: string;
  parent_id: string;
  wallet_address: string;
  created_at: number;
  updated_at: number;
  details?: RawTransactionDetail[];
}

interface RawResponseTransactionList {
  rows: RawTransaction[];
  page: number;
  size: number;
  count: number;
  total: number;
}

export interface RawCheckTransaction {
  transaction_status: string;
  transaction_event: string;
  metadata: any;
}
function formatSellAmount(amount: any) {
  if (amount) {
    const converToNumber = Number(amount) || 0;
    return Number(converToNumber.toFixed(2));
  }
  return 0;
}
export const normalizeTransactionList = (
  responseTransactionList: RawResponseTransactionList,
): ResponseTransactionList => {
  const rows: ResponseTransactionList['rows'] =
    responseTransactionList.rows.map((r) => normalizeTransaction(r));

  return {
    rows: rows,
    page: responseTransactionList.page,
    size: responseTransactionList.size,
    count: responseTransactionList.count,
    total: responseTransactionList.total,
  };
};
export const normalizeTransaction = (
  rawTransaction: RawTransaction,
): Transaction => {
  let details: TransactionDetail[] = [];
  if (rawTransaction.details) {
    details = rawTransaction.details.map(
      (rawTransactionDetails: RawTransactionDetail) => {
        const detail: TransactionDetail = {
          id: rawTransactionDetails.id,
          currency: rawTransactionDetails.currency,
          price: rawTransactionDetails.price,
          roleId: rawTransactionDetails.role_id,
          roleName: rawTransactionDetails.role_name,
          transactionId: rawTransactionDetails.transaction_id,
          userId: rawTransactionDetails.user_id,
          packageId: rawTransactionDetails.package_id,
          packageName: rawTransactionDetails.package_name,
          discountRate: rawTransactionDetails.discount_rate,
          discountAmount: rawTransactionDetails.discount_amount,
          quantity: rawTransactionDetails.quantity,
          expiresAt: format(
            Number(rawTransactionDetails.expires_at),
            'HH:mm dd/MM/yyyy',
          ),
          createdAt: format(
            Number(rawTransactionDetails.created_at),
            'HH:mm dd/MM/yyyy',
          ),
        };
        return detail;
      },
    );
  }
  const trans: Transaction = {
    id: rawTransaction.id,
    userId: rawTransaction.user_id,
    paymentId: rawTransaction.payment_id,
    paymentMethod: rawTransaction.payment_method,
    description: rawTransaction.description,
    status: rawTransaction.status,
    sellAmount: formatSellAmount(rawTransaction.sell_amount),
    sellCurrency: rawTransaction.sell_currency,
    buyCurrency: rawTransaction.buy_currency,
    email: rawTransaction.email,
    username: rawTransaction.username,
    phone: rawTransaction.phone,
    firstName: rawTransaction.first_name,
    lastName: rawTransaction.last_name,
    buyAmount: rawTransaction.buy_amount,
    parentId: rawTransaction.parent_id,
    walletAddress: rawTransaction.wallet_address,
    details,
    updatedAt: format(Number(rawTransaction.updated_at), 'HH:mm dd/MM/yyyy'),
    createdAt: format(Number(rawTransaction.created_at), 'HH:mm dd/MM/yyyy'),
  };

  return trans;
};

export const normalizeTransactionLog = (
  rawTransactionLogs: RawTransactionLog[],
): TransactionLog[] => {
  return rawTransactionLogs.map((transLog: RawTransactionLog) => {
    return {
      id: transLog.id,
      transactionId: transLog.transaction_id,
      transactionEvent: transLog.transaction_event,
      transactionStatus: transLog.transaction_status,
      metadata: transLog.metadata,
      createdAt: format(Number(transLog.created_at), 'HH:mm dd/MM/yyyy'),
    };
  });
};

export const normalizeCheckTransaction = (
  rawCheckTransaction: RawCheckTransaction,
): CheckTransaction => {
  return {
    transactionEvent: rawCheckTransaction.transaction_event,
    transactionStatus: rawCheckTransaction.transaction_status,
    metadata: rawCheckTransaction.metadata,
    createdAt: format(Date.now(), 'HH:mm dd/MM/yyyy'),
  };
};

export const normalizeTransactionExport = (
  rawTransaction: RawTransaction,
): TransactionExport => {
  let packages = '';
  if (rawTransaction.details && rawTransaction.details.length > 0) {
    packages = rawTransaction.details
      .map((detail) => detail.role_name)
      .toString();
  }
  const trans: TransactionExport = {
    id: rawTransaction.id,
    fullname: `${rawTransaction.last_name} ${rawTransaction.first_name}`,
    paymentId: rawTransaction.payment_id,
    status: rawTransaction.status,
    sellAmount: formatSellAmount(rawTransaction.sell_amount),
    sellCurrency: rawTransaction.sell_currency,
    email: rawTransaction.email,
    walletAddress: rawTransaction.wallet_address,
    packages: packages,
    createdAt: `'${format(
      Number(rawTransaction.created_at),
      'HH:mm dd/MM/yyyy',
    )}`,
  };
  return trans;
};

export interface ParamsTransactionList {
  page: number;
  size: number;
  keyword?: string;
  status?: string;
  from: number;
  to: number;
}
export interface RawRefundCreate {
  transaction_id: string;
  transfer_id: string;
  amount: number;
  fee: number;
  currency: string;
  status: string;
  description: string;
}

export type RawTransactionRefund = {
  id: string;
  transaction_id: string;
  transfer_id: string;
  user_id: string;
  amount: number;
  currency: string;
  fee: number;
  status: string;
  description: string;
  owner_created: string;
  email: string;
  username: string;
  phone: string;
  first_name: string;
  last_name: string;
  created_at: number;
  updated_at: number;
};
export interface RawInterventionResponse {
  transaction: RawTransaction;
  transactionLogs: RawTransactionLog[];
}

export interface RawRepaymentCreate {
  parent_id: string;
  amount: number;
  description: string;
}
export const listTransaction = (params: ParamsTransactionList) => {
  const paramsString = convertToParamsString<ParamsTransactionList>(params);
  return get<Response<RawResponseTransactionList>>({})(
    API_ADMIN.TRANSACTION_LIST + '?' + paramsString,
  );
};
export const getTransaction = (id: string) => {
  return get<Response<RawTransaction>>({})(API_ADMIN.TRANSACTION + '/' + id);
};
export const listTransactionLog = (id: string) => {
  return get<Response<RawTransactionLog[]>>({})(
    API_ADMIN.TRANSACTION + '/' + id + '/logs',
  );
};
export const checkTransaction = (id: string) => {
  return get<Response<RawCheckTransaction>>({})(
    API_ADMIN.TRANSACTION + '/' + id + '/check',
  );
};
