import { get, GATEWAY } from '@/fetcher';
import { API_USER } from '@/fetcher/endpoint';

export const getTradingBotList = () => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(API_USER.BOT_TRADING_LIST);
};

export const getTradeHistory = (queryString) => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(`${API_USER.BOT_TRADING_TRADE_HISTORY}${queryString}&strategy_trade=true`);
};

export const getPnlData = (botId) => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(`${API_USER.BOT_TRADING}/${botId}/pnl?strategy_trade=true`);
};

export const getCurrencyList = () => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(API_USER.CURRENCY_LIST + '?all=true');
};

export const getPackageList = () => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(`${API_USER.PACKAGE_LIST}`);
};
