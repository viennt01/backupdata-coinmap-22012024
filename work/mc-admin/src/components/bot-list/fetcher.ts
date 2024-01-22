import { get, put, ResponseWithPayload } from '@/fetcher';
import { API_MERCHANT } from '@/fetcher/endpoint';
import { MerchantInfo } from '@/interface/merchant-info';

export interface AvailableBot {
  id: string;
  asset_id: string;
  name: string;
  category: string;
  commission: number;
  status: string;
  image_url: string;
}

export interface AvailableBotList {
  rows: AvailableBot[];
  page: number;
  size: number;
  count: number;
  total: number;
}

export interface BotStatusUpdate {
  category: string;
  data: {
    id: string;
    asset_id: string;
    status: string;
  }[];
}

export const getMerchantInfo = () => {
  return get<undefined, ResponseWithPayload<MerchantInfo>>({})(
    API_MERCHANT.INFO
  );
};

export const getAvailableBots = (queryString: string) => {
  return get<undefined, ResponseWithPayload<AvailableBotList>>({})(
    `${API_MERCHANT.COMMISSION_LIST}?${queryString}`
  );
};

export const updateBotStatus = (data: BotStatusUpdate) => {
  return put<BotStatusUpdate, ResponseWithPayload<boolean>>({ data })(
    API_MERCHANT.COMMISSION_UPDATE
  );
};
