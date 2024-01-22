import { get, put, ResponseWithPayload, uploadFile } from '@/fetcher';
import { API_BOT, API_USER } from '@/fetcher/endpoint';
import {
  BOT,
  ConnectBroker,
  Currency,
  DisconnectBroker,
  TradeHistory,
  PnlData,
  UpdateBotStatus,
  BrokerSetting,
} from './interface';

export const getListBots = (queryString: string) => {
  return get<unknown, ResponseWithPayload<BOT[]>>({})(
    `${API_BOT.LIST_BOT_PLANS}?${queryString}`
  );
};

export const uploadProfile = (data: FormData) => {
  return uploadFile<
    ResponseWithPayload<{
      profile_id: string;
    }>
  >({ data })(`${API_BOT.BOT_TRADING}/upload-profile`);
};

export const connectBroker = (data: ConnectBroker) => {
  return put<ConnectBroker, ResponseWithPayload<BOT[]>>({ data })(
    `${API_BOT.CONNECT_BROKER}`
  );
};

export const selectAndConnectBroker = (data: ConnectBroker) => {
  return put<ConnectBroker, ResponseWithPayload<BOT[]>>({ data })(
    `${API_BOT.SELECT_AND_CONNECT_BROKER}`
  );
};

export const getBrokerSettings = () => {
  return get<unknown, ResponseWithPayload<BrokerSetting>>({})(
    `${API_USER.APP_SETTING}/BROKER_SETTING`
  );
};

export const updateBotStatus = (data: UpdateBotStatus) => {
  return put<UpdateBotStatus, ResponseWithPayload<BOT>>({ data })(
    `${API_BOT.UPDATE_BOT_STATUS}`
  );
};

export const logoutBroker = (data: DisconnectBroker) => {
  return put<DisconnectBroker, ResponseWithPayload<BOT>>({ data })(
    `${API_BOT.LOG_OUT_BROKER}`
  );
};

export const getTradeHistory = (queryString: string) => {
  return get<
    unknown,
    ResponseWithPayload<{
      rows: TradeHistory[];
      total: number;
    }>
  >({})(`${API_BOT.TRADE_HISTORY}?${queryString}`);
};

export const getCurrencyList = () => {
  const query = {
    all: true,
  };
  const queryString = new URLSearchParams(
    query as unknown as string
  ).toString();
  return get<unknown, ResponseWithPayload<Currency[]>>({})(
    `${API_BOT.CURRENCY_LIST}?${queryString}`
  );
};

export const getPnlData = (botId: string) => {
  return get<unknown, ResponseWithPayload<PnlData[]>>({})(
    `${API_BOT.BOT_TRADING}/${botId}/pnl`
  );
};
