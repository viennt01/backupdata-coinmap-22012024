import { get, post, put, ResponseWithPayload } from '@/fetcher';
import { API_MERCHANT } from '@/fetcher/endpoint';
import { MerchantInfo } from '@/interface/merchant-info';

interface VerifyPassword {
  password: string;
}

interface GetOtp {
  password: string;
  wallet_address: string;
  type: NETWORK_TYPE;
}

interface UpdateWallet extends VerifyPassword {
  wallet_address: string;
  otp: string;
  type: NETWORK_TYPE;
}

export enum NETWORK_TYPE {
  'TRC20' = 'TRC20',
  'BSC20' = 'BSC20',
}

export interface TransactionReport {
  count_pending: number;
  count_complete: number;
  count_failed: number;
  amount_pending: number;
  amount_complete: number;
  amount_failed: number;
  commission_cash: number;
  payout_complete: number;
  payout_pending: number;
}

export interface Payment {
  id: string;
  transaction_id: string;
  wallet_network?: NETWORK_TYPE;
  wallet_address: string;
  amount_commission_complete: number;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentDetails extends Payment {
  metadata: {
    histories: Payment[];
  };
}

export interface PaymentList {
  rows: PaymentDetails[];
  page: number;
  size: number;
  count: number;
  total: number;
}

export interface CreateInvoice {
  amount: number;
}

export const getMerchantInfo = () => {
  return get<undefined, ResponseWithPayload<MerchantInfo>>({})(
    API_MERCHANT.INFO
  );
};

export const verifyPassword = (data: VerifyPassword) => {
  return put<VerifyPassword, ResponseWithPayload<boolean>>({ data })(
    API_MERCHANT.VERIFY_PASSWORD
  );
};

export const getWalletOtp = (data: GetOtp) => {
  return put<GetOtp, ResponseWithPayload<boolean>>({ data })(
    API_MERCHANT.SEND_OTP_WALLET
  );
};

export const updateWallet = (data: UpdateWallet) => {
  return put<UpdateWallet, ResponseWithPayload<boolean>>({ data })(
    API_MERCHANT.CREATE_WALLET
  );
};

export const getTransactionReport = () => {
  return get<undefined, ResponseWithPayload<TransactionReport>>({})(
    API_MERCHANT.TRANSACTION_REPORT
  );
};

export const getPaymentList = (queryString: string) => {
  return get<string, ResponseWithPayload<PaymentList>>({})(
    API_MERCHANT.INVOICE_LIST + queryString
  );
};

export const createInvoice = (data: CreateInvoice) => {
  return post<CreateInvoice, ResponseWithPayload<boolean>>({ data })(
    API_MERCHANT.INVOICE
  );
};
