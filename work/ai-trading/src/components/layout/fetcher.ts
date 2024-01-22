import { GATEWAY, get, ResponseWithPayload } from '@/fetcher';
import { API_MERCHANT, API_USER } from '@/fetcher/endpoint';
import { MerchantInfo, UserProfile } from './interface';
import absoluteUrl from 'next-absolute-url';
import { IncomingMessage } from 'http';

export const getMerchantInfo = () => {
  return get<unknown, ResponseWithPayload<MerchantInfo>>({
    gw: GATEWAY.API_USER_GW,
  })(API_MERCHANT.MERCHANT_INFO);
};

export const getMerchantInfoServerSide = (req: IncomingMessage) => {
  const { protocol, host } = absoluteUrl(req);
  return get<unknown, ResponseWithPayload<MerchantInfo>>({
    gw: GATEWAY.API_USER_GW,
    headers: {
      origin: `${protocol}//${host}`,
    },
  })(API_MERCHANT.MERCHANT_INFO);
};

export const getUserProfile = (queryString?: string) => {
  return get<unknown, ResponseWithPayload<UserProfile>>({})(
    `${API_USER.PROFILE}?${queryString ?? ''}`
  );
};
