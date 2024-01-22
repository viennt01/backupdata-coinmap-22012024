import { get, GATEWAY, post } from '@/fetcher';
import { API_USER } from '@/fetcher/endpoint';

export const getRoleList = () => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW_V2,
  })(API_USER.ROLE_LIST);
};

export const getPackageList = () => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(`${API_USER.PACKAGE_LIST}`);
};

export const postUpgradeTrial = (data) => {
  return post({ data, gw: GATEWAY.API_USER_ROLES_GW })(API_USER.UPGRADE_TRIAL);
};
