import { get, post, put } from '@/fetcher';
import { API_ADDITIONAL_DATA } from '@/fetcher/endpoint';
import { ADDITIONAL_DATA_TYPE } from '@/components/affiliate/interface';
import { FormValues } from './interface';

export const createHomePageContent = (data: FormValues) => {
  return post({
    data: {
      type: ADDITIONAL_DATA_TYPE.HOME_PAGE,
      data,
    },
  })(API_ADDITIONAL_DATA.CREATE);
};

export const updateHomePageContent = (id: string, data: FormValues) => {
  return put({
    data: {
      type: ADDITIONAL_DATA_TYPE.HOME_PAGE,
      data,
    },
  })(`${API_ADDITIONAL_DATA.CREATE}/${id}`);
};

export const getHomePageContent = () => {
  const params = `type=${ADDITIONAL_DATA_TYPE.HOME_PAGE}`;
  return get({})(`${API_ADDITIONAL_DATA.LIST}?${params}`);
};
