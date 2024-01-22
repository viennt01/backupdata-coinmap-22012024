import { get } from '@/fetcher';
import { API_BOT, API_MERCHANTS, API_MERCHANT_USER } from '@/fetcher/endpoint';

export const getMerchantUserList = (queryParams: string) => {
  return get({})(API_MERCHANT_USER.LIST + queryParams);
};

export const getMerchants = () => {
  return get({})(API_MERCHANTS.LIST);
};

export const getBotTradingList = () => {
  return get({})(API_BOT.LIST);
};
