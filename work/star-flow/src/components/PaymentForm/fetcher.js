import { get, GATEWAY, post } from '@/fetcher';
import { API_USER } from '@/fetcher/endpoint';

export const getUnitCurrency = (queryString) => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(API_USER.CURRENCY_LIST + queryString);
};

export const getRole = (roleId) => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(`${API_USER.ROLE}/${roleId}`);
};

export const getPackage = (packageId) => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(`${API_USER.PACKAGE}/${packageId}`);
};

export const getPackageList = () => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(`${API_USER.PACKAGE_LIST}`);
};

export const getBot = (botId) => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(`${API_USER.BOT}/${botId}`);
};

export const getTradingBot = (botId) => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(`${API_USER.BOT_TRADING}/${botId}`);
};

export const createTransaction = (data) => {
  return post({ data, gw: GATEWAY.API_USER_ROLES_GW_V2 })(API_USER.TRANSACTION);
};
