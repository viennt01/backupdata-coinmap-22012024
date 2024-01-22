import { GATEWAY, get } from '@/fetcher';
import { API_USER } from '@/fetcher/endpoint';

export const getRole = (roleId) => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(`${API_USER.ROLE}/${roleId}`);
};

export const getTransaction = (transactionId) => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW_V2,
  })(`${API_USER.TRANSACTION}/${transactionId}`);
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

export const getCurrencyList = () => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(API_USER.CURRENCY_LIST);
};
