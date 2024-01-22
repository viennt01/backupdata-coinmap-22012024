import { get, post, put } from '@/fetcher';
import { API_MERCHANTS, API_PAYMENTS } from '@/fetcher/endpoint';
import { NETWORK, Payment } from './interface';

export interface MerchantUpdatePayment {
  status: string;
  transaction_id: string;
  description: string;
  type: NETWORK;
}

export const getPayments = (from: number, to: number, name: string) => {
  return get<Payment[]>({})(
    `${API_PAYMENTS.LIST}?from=${from}&to=${to}&keyword=${name}`
  );
};

export const updateMerchant = (data: MerchantUpdatePayment, id: string) => {
  return put<MerchantUpdatePayment>({ data })(
    `${API_PAYMENTS.SAVE_PAYMENT}/${id}/update-invoice`
  );
};

export const getMerchants = () => {
  return get({})(API_MERCHANTS.LIST);
};

export const getTransactionReport = (merchantId: string) => {
  return get({})(API_MERCHANTS.TRANSACTION_REPORT(merchantId));
};

export const getMerchantDetail = (merchantId: string) => {
  return get({})(`${API_MERCHANTS.CREATE}/${merchantId}`);
};

export const createInvoice = (merchantId: string, data: { amount: number }) => {
  return post({ data })(API_MERCHANTS.CREATE_INVOICE(merchantId));
};
