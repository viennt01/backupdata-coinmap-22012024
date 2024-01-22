import { get, GATEWAY } from '@/fetcher';
import { API_USER } from '@/fetcher/endpoint';

export const getBotList = () => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(API_USER.BOT_LIST);
};

export const getPackageList = () => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(`${API_USER.PACKAGE_LIST}`);
};
