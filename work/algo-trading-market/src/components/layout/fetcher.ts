import { GATEWAY, get, ResponseWithPayload } from '@/fetcher';
import { API_MERCHANT, API_USER } from '@/fetcher/endpoint';
import { MerchantInfo, UserProfile } from './interface';

export const getMerchantInfo = (queryString?: string) => {
  return get<unknown, ResponseWithPayload<MerchantInfo>>({
    gw: GATEWAY.API_USER_GW,
  })(`${API_MERCHANT.MERCHANT_INFO}?${queryString ?? ''}`);
};

export const getUserProfile = (queryString?: string) => {
  return get<unknown, ResponseWithPayload<UserProfile>>({})(
    `${API_USER.PROFILE}?${queryString ?? ''}`
  );
};
