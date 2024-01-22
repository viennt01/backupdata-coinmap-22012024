import { get, GATEWAY, ResponseWithPayload } from '@/fetcher';
import {
  ADDITIONAL_DATA_TYPE,
  API_BOT,
  API_MERCHANT_ADDITIONAL_DATA,
  API_USER,
} from '@/fetcher/endpoint';
import {
  BOT,
  CurrencyInfo,
  PnlData,
  TradeHistory,
  BotSetting,
  HomePageContentRecord,
} from '@/components/home-page/interface';

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

export const getHomePageContent = (m_affiliate: string) => {
  return get<undefined, ResponseWithPayload<HomePageContentRecord[]>>({
    gw: GATEWAY.API_USER_GW,
    headers: {
      m_affiliate,
    },
  })(
    `${API_MERCHANT_ADDITIONAL_DATA.LIST}?type=${ADDITIONAL_DATA_TYPE.HOME_PAGE}`
  );
};
