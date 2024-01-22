import { get, post, put } from '@/fetcher';
import { API_APP_SETTING } from '@/fetcher/endpoint';
import { APP_SETTING_NAME } from '../interface';

export interface Create {
  value: string;
}

export const getBrokerSettings = () => {
  const params = `name=${APP_SETTING_NAME.BROKER_SETTING}`;
  return get({})(`${API_APP_SETTING.LIST}?${params}`);
};

export const getById = (id: string) => {
  return get({})(`${API_APP_SETTING.CREATE}/${id}`);
};

export const createNew = (data: Create) => {
  interface Data extends Create {
    name: APP_SETTING_NAME.BROKER_SETTING;
  }
  return post<Data>({
    data: {
      ...data,
      name: APP_SETTING_NAME.BROKER_SETTING,
    },
  })(API_APP_SETTING.CREATE);
};

export interface Update extends Create {
  id: string;
}

export const updateById = (data: Update, id: string) => {
  interface Data extends Update {
    name: APP_SETTING_NAME.BROKER_SETTING;
  }
  return put<Data>({
    data: {
      ...data,
      name: APP_SETTING_NAME.BROKER_SETTING,
    },
  })(`${API_APP_SETTING.CREATE}/${id}`);
};
