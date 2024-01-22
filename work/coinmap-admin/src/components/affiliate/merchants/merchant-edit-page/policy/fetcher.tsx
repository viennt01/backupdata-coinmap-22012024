import { get, put } from '@/fetcher';
import { API_ADDITIONAL_DATA, API_MERCHANTS } from '@/fetcher/endpoint';
import { ADDITIONAL_DATA_TYPE } from '@/components/affiliate/interface';
import { FormValues } from '@/components/content-manager/policy/interface';

export const updatePolicyContent = (
  merchantId: string,
  id: string | undefined,
  data: FormValues
) => {
  return put({
    data: {
      id,
      type: ADDITIONAL_DATA_TYPE.POLICY,
      data,
    },
  })(API_MERCHANTS.UPDATE_STANDALONE_ADDITIONAL_DATA(merchantId));
};

export const getPolicyContent = (id: string) => {
  const params = `type=${ADDITIONAL_DATA_TYPE.POLICY}`;
  return get({})(`${API_MERCHANTS.GET_ADDITIONAL_DATA_MERCHANT(id)}?${params}`);
};

export const getDefaultPolicyContent = () => {
  const params = `type=${ADDITIONAL_DATA_TYPE.POLICY}`;
  return get({})(`${API_ADDITIONAL_DATA.LIST}?${params}`);
};
