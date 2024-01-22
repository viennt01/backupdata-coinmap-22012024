import { get, post, put } from '@/fetcher';
import { API_ADDITIONAL_DATA } from '@/fetcher/endpoint';
import { BotFee } from './interface';
import { ADDITIONAL_DATA_TYPE } from '../interface';

export interface Create {
  name: string;
  data: {
    ranges: {
      from: number;
      to: number;
      percent: number;
    }[];
  };
}

export interface BotFeeFilter {
  keyword: string;
  type?: string;
}

export const getBotFee = (filter: BotFeeFilter) => {
  const params = `type=${ADDITIONAL_DATA_TYPE.TBOT_FEE}&keyword=${filter.keyword}`;
  return get<BotFee>({})(`${API_ADDITIONAL_DATA.LIST}?${params}`);
};

export const getById = (id: string) => {
  return get({})(`${API_ADDITIONAL_DATA.CREATE}/${id}`);
};

export const createNew = (data: Create) => {
  interface Data extends Create {
    type: ADDITIONAL_DATA_TYPE.TBOT_FEE;
  }
  return post<Data>({
    data: {
      ...data,
      type: ADDITIONAL_DATA_TYPE.TBOT_FEE,
    },
  })(API_ADDITIONAL_DATA.CREATE);
};

export interface Update extends Create {
  id: string;
}

export const updateById = (data: Update, id: string) => {
  interface Data extends Update {
    type: ADDITIONAL_DATA_TYPE.TBOT_FEE;
  }
  return put<Data>({
    data: {
      ...data,
      type: ADDITIONAL_DATA_TYPE.TBOT_FEE,
    },
  })(`${API_ADDITIONAL_DATA.CREATE}/${id}`);
};
