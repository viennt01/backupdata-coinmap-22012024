import { get, post, put } from '@/fetcher';
import { API_ADDITIONAL_DATA } from '@/fetcher/endpoint';
import { BotPeriod } from './interface';
import { ADDITIONAL_DATA_TYPE } from '../interface';

export interface Create {
  name: string;
  data: {
    translation: {
      vi: {
        name: string;
        quantity: number;
        discount_amount: number;
        discount_rate: number;
        type: string;
        order: number;
      };
      en: {
        name: string;
        quantity: number;
        discount_amount: number;
        discount_rate: number;
        type: string;
        order: number;
      };
    };
  };
}
export interface MerchantUpdatePayment {
  status: string;
  transaction_id: string;
  description: string;
}

export interface BotPeriodFilter {
  keyword: string;
  type?: string;
}

export const getBotPeriod = (filter: BotPeriodFilter) => {
  const params = `type=${ADDITIONAL_DATA_TYPE.TBOT_PERIOD}&keyword=${filter.keyword}`;
  return get<BotPeriod>({})(`${API_ADDITIONAL_DATA.LIST}?${params}`);
};

export const getById = (id: string) => {
  return get({})(`${API_ADDITIONAL_DATA.CREATE}/${id}`);
};

export const createNew = (data: Create) => {
  interface Data extends Create {
    type: ADDITIONAL_DATA_TYPE.TBOT_PERIOD;
  }
  return post<Data>({
    data: {
      ...data,
      type: ADDITIONAL_DATA_TYPE.TBOT_PERIOD,
    },
  })(API_ADDITIONAL_DATA.CREATE);
};

export interface Update extends Create {
  id: string;
}

export const updateById = (data: Update, id: string) => {
  interface Data extends Update {
    type: ADDITIONAL_DATA_TYPE.TBOT_PERIOD;
  }
  return put<Data>({
    data: {
      ...data,
      type: ADDITIONAL_DATA_TYPE.TBOT_PERIOD,
    },
  })(`${API_ADDITIONAL_DATA.CREATE}/${id}`);
};
