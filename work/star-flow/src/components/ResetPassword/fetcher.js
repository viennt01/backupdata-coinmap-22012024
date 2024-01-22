import { GATEWAY, post } from '@/fetcher';
import { API_USER } from '@/fetcher/endpoint';

export const userResetPassword = (data) => {
  return post({ data, gw: GATEWAY.API_USER_ROLES_GW })(API_USER.RESET_PASSWORD);
};
