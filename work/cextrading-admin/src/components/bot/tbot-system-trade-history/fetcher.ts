import { get, VERSION_BASE_URL } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response } from 'fetcher/interface';
import { format } from 'date-fns';
import {
  ResponseTBotSystemTradeHistoryList,
  TBotSystemTradeHistory,
} from './interface';
import { convertToParamsString } from 'fetcher/utils';

export interface RawTBotSystemTradeHistory {
  name_bot: string;
  client_id: string;
  order_id: number;
  open_time: number;
  close_time: number;
  type: string;
  size: number;
  symbol: string;
  resolution: string;
  stop_lost: number;
  take_profit: number;
  commission: number;
  swap: number;
  profit: number;
  comment: string;
  extradata: any;
  open_price: number;
  close_price: number;
  position_side: string;
}

export const normalizeTBotSystemTradeHistory = (
  trade: RawTBotSystemTradeHistory,
): TBotSystemTradeHistory => {
  const tradeHistory: TBotSystemTradeHistory = {
    nameBot: trade.name_bot,
    clientId: trade.client_id,
    orderId: trade.order_id,
    openTime: format(Number(trade.open_time), 'dd/MM/yyyy'),
    closeTime: format(Number(trade.close_time), 'dd/MM/yyyy'),
    type: trade.type,
    size: trade.size,
    symbol: trade.symbol,
    resolution: trade.resolution,
    stopLost: trade.stop_lost,
    takeProfit: trade.take_profit,
    commission: trade.commission,
    swap: trade.swap,
    profit: trade.profit,
    comment: trade.comment,
    extradata: trade.extradata,
    openPrice: trade.open_price,
    closePrice: trade.close_price,
    positionSide: trade.position_side,
  };

  return tradeHistory;
};

export interface RawResponseTBotSystemTradeHistoryList {
  rows: RawTBotSystemTradeHistory[];
  page: number;
  size: number;
  count: number;
  total: number;
}

export const normalizeTBotSystemTradeHistoryList = (
  responseUserList: RawResponseTBotSystemTradeHistoryList,
): ResponseTBotSystemTradeHistoryList => {
  const rows: TBotSystemTradeHistory[] = responseUserList.rows.map((r) => {
    return normalizeTBotSystemTradeHistory(r);
  });
  return {
    rows,
    page: responseUserList.page,
    size: responseUserList.size,
    count: responseUserList.count,
    total: responseUserList.total,
  };
};

export interface ParamTBotSystemTradeHistoryList {
  page: number;
  size: number;
  keyword?: string;
  types?: string;
  symbols?: string;
  name_bots?: string;
  resolutions?: string;
  position_side?: string;
  sort_by?: string;
  order_by?: 'desc' | 'asc';
  from?: number;
  to?: number;
}
export const getTBotSystemTradeHistory = (
  params: ParamTBotSystemTradeHistoryList,
) => {
  const paramsString =
    convertToParamsString<ParamTBotSystemTradeHistoryList>(params);
  return get<Response<RawResponseTBotSystemTradeHistoryList>>({
    version: VERSION_BASE_URL.V1,
  })(`${API_ADMIN.TBOT_SYSTEM_TRADE_HISTORIES}?${paramsString}`);
};
