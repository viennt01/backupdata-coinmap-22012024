import { get, ResponseWithPayload } from '@/fetcher';
import { API_MERCHANT } from '@/fetcher/endpoint';
import { MerchantInfo } from '@/interface/merchant-info';

export const getMerchantInfo = () => {
  return get<undefined, ResponseWithPayload<MerchantInfo>>({})(
    API_MERCHANT.INFO
  );
};
