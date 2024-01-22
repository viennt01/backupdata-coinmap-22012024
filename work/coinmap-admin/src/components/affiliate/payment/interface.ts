export enum PAYMENT_STATUS {
  COMPLETED = 'COMPLETED',
  WAITING_PAYMENT = 'WAITING_PAYMENT',
  WALLET_INVALID = 'WALLET_INVALID',
}

export enum NETWORK {
  TRC20 = 'TRC20',
  BSC20 = 'BSC20',
}

export const ICON_NETWORK = {
  TRC20: '/images/icon-network/trc20.svg',
  BSC20: '/images/icon-network/bsc20.svg',
};

export interface PaymentHistory {
  amount_commission_complete: string;
  created_at: string;
  description: string;
  id: string;
  status: PAYMENT_STATUS;
  transaction_id: string;
  updated_at: string;
  wallet_address: string;
  wallet_network: NETWORK;
}

export interface Payment {
  id: string;
  merchant_id: string;
  start_at: string;
  finish_at: string;
  count_pending: number;
  count_complete: number;
  amount_pending: number;
  amount_complete: number;
  amount_commission_pending: number;
  amount_commission_complete: number;
  status: PAYMENT_STATUS;
  transaction_id: string;
  wallet_address: string;
  description: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
  merchant_code: string;
  merchant_email: string;
  merchant_name: string;
  email: string;
  wallet_network: NETWORK;
  metadata: {
    histories: PaymentHistory[];
  };
}

export interface Merchant {
  id: string;
  email: string;
}

export interface TransactionReport {
  commission_cash: number;
  payout_complete: number;
  payout_pending: number;
}
