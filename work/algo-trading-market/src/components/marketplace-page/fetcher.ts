import { get, GATEWAY, ResponseWithPayload } from '@/fetcher';
import { API_BOT, API_USER } from '@/fetcher/endpoint';
import {
  BOT,
  CurrencyInfo,
  PnlData,
  TradeHistory,
  BotSetting,
} from '@/components/marketplace-page/interface';

export const getTradingBotList = () => {
  return get<undefined, ResponseWithPayload<BOT[]>>({
    gw: GATEWAY.API_MAIN_GW,
  })(API_BOT.LIST_BOT);
};

export const getCurrencyList = () => {
  return get<undefined, ResponseWithPayload<CurrencyInfo[]>>({
    gw: GATEWAY.API_MAIN_GW,
  })(API_BOT.CURRENCY_LIST + '?all=true');
};

export const getTradeHistory = (queryString: string) => {
  return get<
    string,
    ResponseWithPayload<{
      count: number;
      page: number;
      rows: TradeHistory[];
      size: number;
      total: number;
    }>
  >({
    gw: GATEWAY.API_MAIN_GW,
  })(`${API_BOT.TRADE_HISTORY}?${queryString}&strategy_trade=true`);
};

export const getPnlData = (botId: string) => {
  return get<string, ResponseWithPayload<PnlData[]>>({
    gw: GATEWAY.API_MAIN_GW,
  })(`${API_BOT.BOT_TRADING}/${botId}/pnl?strategy_trade=true`);
};

export const getAppSetting = (name: string) => {
  return get<undefined, ResponseWithPayload<BotSetting>>({
    gw: GATEWAY.API_MAIN_GW,
  })(`${API_USER.APP_SETTING}/${name}`);
};
