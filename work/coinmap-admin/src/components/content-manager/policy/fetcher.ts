import { get, post, put } from '@/fetcher';
import { API_ADDITIONAL_DATA } from '@/fetcher/endpoint';
import { ADDITIONAL_DATA_TYPE } from '@/components/affiliate/interface';
import { FormValues } from './interface';

export const createPolicyContent = (data: FormValues) => {
  return post({
    data: {
      type: ADDITIONAL_DATA_TYPE.POLICY,
      data,
    },
  })(API_ADDITIONAL_DATA.CREATE);
};

export const updatePolicyContent = (id: string, data: FormValues) => {
  return put({
    data: {
      type: ADDITIONAL_DATA_TYPE.POLICY,
      data,
    },
  })(`${API_ADDITIONAL_DATA.CREATE}/${id}`);
};

export const getPolicyContent = () => {
  const params = `type=${ADDITIONAL_DATA_TYPE.POLICY}`;
  return get({})(`${API_ADDITIONAL_DATA.LIST}?${params}`);
};
