import { get, ResponseWithPayload } from '@/fetcher';
import { API_MERCHANT } from '@/fetcher/endpoint';

export interface UserReport {
  count_confirmed: number;
  count_not_confirmed: number;
  pageView: number;
}

export interface UserChart {
  time: string;
  visitor: number;
}

export interface TransactionReport {
  count_pending: number;
  count_complete: number;
  count_failed: number;
  amount_pending: number;
  amount_complete: number;
  amount_failed: number;
  commission_cash: number;
}

export interface TransactionChart {
  time: string;
  count_complete: number;
  amount_complete: number;
}

export const getUserReport = (queryString: string) => {
  return get<undefined, ResponseWithPayload<UserReport>>({})(
    API_MERCHANT.USER_REPORT + queryString
  );
};

export const getUserChart = () => {
  return get<undefined, ResponseWithPayload<UserChart[]>>({})(
    API_MERCHANT.USER_CHART
  );
};

export const getTransactionReport = (queryString: string) => {
  return get<undefined, ResponseWithPayload<TransactionReport>>({})(
    API_MERCHANT.TRANSACTION_REPORT + queryString
  );
};

export const getTransactionChart = (queryString: string) => {
  return get<undefined, ResponseWithPayload<TransactionChart[]>>({})(
    API_MERCHANT.TRANSACTION_CHART + queryString
  );
};
