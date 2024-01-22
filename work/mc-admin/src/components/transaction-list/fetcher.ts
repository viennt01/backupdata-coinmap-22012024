import { get, ResponseWithPayload } from '@/fetcher';
import { API_MERCHANT } from '@/fetcher/endpoint';

export interface Item {
  id: string;
  name: string;
  type: string;
  price: string;
  category: string;
  quantity: number;
  discount_rate: number;
  discount_amount: number;
}

export interface Transaction {
  id: string;
  order_id: string;
  order_type: string;
  fullname: string;
  email: string;
  amount: string;
  status: string;
  created_at: string;
  updated_at: string;
  items: Item[];
}

export interface TransactionList {
  rows: Transaction[];
  page: number;
  size: number;
  count: number;
  total: number;
}

export interface Package {
  id: string;
  name: string;
  clone_name?: string;
}

export interface PackageList {
  [key: string]: Package[];
}

export const getTransactionList = (queryString: string) => {
  return get<undefined, ResponseWithPayload<TransactionList>>({})(
    API_MERCHANT.TRANSACTION_LIST + queryString
  );
};

export const getBotList = () => {
  return get<undefined, ResponseWithPayload<Package[]>>({})(
    API_MERCHANT.BOT_LIST
  );
};

export const getRoleList = () => {
  return get<undefined, ResponseWithPayload<Package[]>>({})(
    API_MERCHANT.ROLE_LIST
  );
};

export const getBotTradingList = () => {
  return get<undefined, ResponseWithPayload<Package[]>>({})(
    API_MERCHANT.BOT_TRADING_LIST
  );
};
