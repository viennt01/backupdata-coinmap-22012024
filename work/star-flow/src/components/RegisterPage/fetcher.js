import { GATEWAY, post } from '@/fetcher';
import { API_USER } from '@/fetcher/endpoint';

export const userRegister = (data, headers) => {
  return post({ headers, data, gw: GATEWAY.API_USER_ROLES_GW })(
    API_USER.REGISTER
  );
};
