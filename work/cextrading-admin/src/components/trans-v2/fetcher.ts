import { get, VERSION_BASE_URL } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response } from 'fetcher/interface';
import { format } from 'date-fns';
import {
  PAYMENT_METHOD,
  TRANSACTION_STATUS,
  TRANSACTION_CATEGORY,
  Transaction,
  Merchant,
  Pkg,
  RawSBot,
  RawTBot,
  ResponseTransactionList,
  TransactionExport,
  Metadata,
  Log,
} from './interface';
import { convertToParamsString } from 'fetcher/utils';

export interface RawLog {
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
  payment_id: string;
  payment_method: PAYMENT_METHOD;
  status: TRANSACTION_STATUS;
  integrate_service: string;
  ipn_url: string;
  order_id: string;
  user_id: string;
  order_type: TRANSACTION_CATEGORY;
  currency: string;
  amount: number;
  merchant_code: string;
  items: Array<any>;
  email: string;
  fullname: string;
  created_at: number;
  updated_at: number;
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

export interface RawMetadata {
  attribute: string;
  value: string;
  created_at: number;
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
  const trans: Transaction = {
    id: rawTransaction.id,
    amount: rawTransaction.amount,
    currency: rawTransaction.currency,
    merchantCode: rawTransaction.merchant_code,
    name: rawTransaction.items,
    status: rawTransaction.status,
    paymentMethod: rawTransaction.payment_method,
    paymentId: rawTransaction.payment_id,
    email: rawTransaction.email,
    fullname: rawTransaction.fullname,

    integrateService: rawTransaction.integrate_service,
    ipnUrl: rawTransaction.ipn_url,
    userId: rawTransaction.user_id,
    orderId: rawTransaction.order_id,
    category: rawTransaction.order_type,

    updatedAt: format(Number(rawTransaction.updated_at), 'HH:mm dd/MM/yyyy'),
    createdAt: format(Number(rawTransaction.created_at), 'HH:mm dd/MM/yyyy'),
  };

  return trans;
};

export const normalizeTransactionLog = (
  rawTransactionLogs: RawLog[],
): Log[] => {
  return rawTransactionLogs
    .sort((a, b) => Number(a.created_at) - Number(b.created_at))
    .map((transLog: RawLog) => {
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

export const normalizeMetadatas = (rawMetadatas: RawMetadata[]): Metadata[] => {
  return rawMetadatas.map((rawMetadata) => ({
    attribute: rawMetadata.attribute,
    value: rawMetadata.value,
    createdAt: format(Number(rawMetadata.created_at), 'HH:mm dd/MM/yyyy'),
  }));
};

export const normalizeTransactionExport = (
  rawTransaction: RawTransaction,
): TransactionExport => {
  const trans: TransactionExport = {
    id: rawTransaction.id,
    fullname: rawTransaction.fullname,
    paymentId: rawTransaction.payment_id,
    status: rawTransaction.status,
    amount: rawTransaction.amount,
    currency: rawTransaction.currency,
    email: rawTransaction.email,
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
  category?: string;
  merchant_code?: string;
  name?: string;
  from: number;
  to: number;
}

export const listTransaction = (params: ParamsTransactionList) => {
  const paramsString = convertToParamsString<ParamsTransactionList>(params);
  return get<Response<RawResponseTransactionList>>({
    version: VERSION_BASE_URL.V2,
  })(API_ADMIN.TRANSACTION_V2_LIST + '?' + paramsString);
};

export const getTransactionDetail = (id: string) => {
  return get<
    Response<{
      transaction: RawTransaction;
      metadatas: RawMetadata[];
      logs: RawLog[];
    }>
  >({
    version: VERSION_BASE_URL.V2,
  })(API_ADMIN.TRANSACTION + '/' + id);
};

export const getMerchantCode = () => {
  return get<Response<Merchant[]>>({ version: VERSION_BASE_URL.V2 })(
    API_ADMIN.GET_MERCHANT,
  );
};

export const getRoles = () => {
  return get<Response<Pkg[]>>({ version: VERSION_BASE_URL.V1 })(
    API_ADMIN.USER_ROLE_LISTING,
  );
};

export const getBotSignal = () => {
  return get<Response<RawSBot[]>>({ version: VERSION_BASE_URL.V1 })(
    API_ADMIN.GET_BOT_SIGNAL,
  );
};

export const getBotTrading = () => {
  return get<Response<RawTBot[]>>({ version: VERSION_BASE_URL.V1 })(
    API_ADMIN.GET_BOT_TRADING,
  );
};
