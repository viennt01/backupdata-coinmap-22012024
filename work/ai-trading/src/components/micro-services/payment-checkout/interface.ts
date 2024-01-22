export enum TRANSACTION_STATUS {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
  COMPLETE = 'COMPLETE',
}

export interface Currency {
  created_at: string;
  currency: string;
  description: string;
  id: string;
  image_url: string;
  name: string;
  order: number;
  owner_created: string;
  status: boolean;
  type: string;
  updated_at: string;
}

export interface Package {
  created_at: string;
  discount_amount: number;
  discount_rate: number;
  id: string;
  name: string;
  owner_created: string;
  quantity: number;
  status: true;
  type: string;
  updated_at: string;
}

export interface Role {
  id: string;
  type: string;
  category: string;
  name: string;
  description: string;
  image_url: string;
  price: string;
}

export interface CreateTransaction {
  payment_method: string;
  items: {
    id: string;
    quantity: number;
    type: string;
    category: string;
  }[];
  amount: string;
  currency: string;
}

export interface Transaction {
  amount: string;
  checkout_url: string;
  created_at: string;
  currency: string;
  items: {
    category: string;
    commission_cash: number;
    commission_rate: number;
    discount_amount: number;
    discount_rate: number;
    id: string;
    name: string;
    price: string;
    quantity: number;
    type: string;
    balance: number;
  }[];
  order_id: string;
  payment_id: string;
  payment_method: string;
  qrcode_url: string;
  status: TRANSACTION_STATUS;
  status_url: string;
  timeout: string;
  transaction_id: string;
  updated_at: string;
  wallet_address: string;
}
