import { deleteGW, get, post, put } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response, ResponseWithoutPayload } from 'fetcher/interface';
import { format } from 'date-fns';

import { Bot, ParamsTradingHistoryList, TradeHistory } from './interface';
import { convertToParamsString } from 'fetcher/utils';

export interface RawBot {
  id: string;
  name: string;
  params: any;
  owner_created: string;
  status: boolean;
  created_at: number;
  updated_at: number;
}
export interface RawBotCreate {
  name: RawBot['name'];
  params: RawBot['params'];
  status: RawBot['status'];
}
export interface RawBotUpdate {
  name?: RawBot['name'];
  params?: RawBot['params'];
  status?: RawBot['status'];
}

export const normalizeBot = (bots: RawBot[]): Bot[] => {
  return bots.map((b) => ({
    id: b.id,
    name: b.name,
    params: b.params,
    ownerCreated: b.owner_created,
    status: b.status,
    createdAt: format(Number(b.created_at), 'dd/MM/yyyy'),
    updatedAt: format(Number(b.updated_at), 'dd/MM/yyyy'),
  }));
};

export const getBots = () => {
  return get<Response<RawBot[]>>({})(API_ADMIN.SETTING_BOT_LIST);
};

export const createBot = (data: RawBotCreate) => {
  return post<RawBotCreate, Response<RawBot>>({ data })(
    API_ADMIN.SETTING_BOT_CREATE,
  );
};

export const deleteBot = (id: RawBot['id']) => {
  return deleteGW<null, ResponseWithoutPayload>({})(
    `${API_ADMIN.SETTING_BOT_DELETE}/${id}`,
  );
};

export const getBot = (id: RawBot['id']) => {
  return get<Response<RawBot>>({})(`${API_ADMIN.SETTING_BOT_DETAIL}/${id}`);
};

export const editBot = (id: RawBot['id'], data: RawBotUpdate) => {
  return put<RawBotUpdate, Response<RawBot>>({ data })(
    `${API_ADMIN.SETTING_BOT_EDIT}/${id}`,
  );
};

export const listDetailBotTradingHistory = (
  params: ParamsTradingHistoryList,
) => {
  const paramsString = convertToParamsString<ParamsTradingHistoryList>(params);
  return get<Response<TradeHistory>>({})(
    API_ADMIN.BOT_TRADING_HISTORY_LIST + '?' + paramsString,
  );
};
