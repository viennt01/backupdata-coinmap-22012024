import { GATEWAY, post, get } from '@/fetcher';
import { API_USER } from '@/fetcher/endpoint';

export const userLogin = (data) => {
  return post({ data, gw: GATEWAY.API_USER_ROLES_GW })(API_USER.LOGIN);
};

export const resendEmail = (data) => {
  return post({ data, gw: GATEWAY.API_USER_ROLES_GW })(
    API_USER.RESEND_EMAIL_VERIFY
  );
};

export const getUserProfile = () => {
  return get({ gw: GATEWAY.API_USER_ROLES_GW })(API_USER.PROFILE);
};
