import { get, GATEWAY } from '@/fetcher';
import { DEFAULT } from '@/fetcher/endpoint';

export const getMerchantInfo = () => {
  return get({
    gw: GATEWAY.API_DEFAULT_GW,
  })(DEFAULT.MERCHANT);
};
