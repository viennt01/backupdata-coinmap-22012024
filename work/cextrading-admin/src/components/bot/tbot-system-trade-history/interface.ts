export interface TBotSystemTradeHistory {
  nameBot: string;
  clientId: string;
  orderId: number;
  openTime: string;
  closeTime: string;
  type: string;
  size: number;
  symbol: string;
  resolution: string;
  stopLost: number;
  takeProfit: number;
  commission: number;
  swap: number;
  profit: number;
  comment: string;
  extradata: any;
  openPrice: number;
  closePrice: number;
  positionSide: string;
}
export interface ResponseTBotSystemTradeHistoryList {
  rows: TBotSystemTradeHistory[];
  page: number;
  size: number;
  count: number;
  total: number;
}

export interface FILTER {
  page: number;
  size: number;
  keyword?: string;
  type?: string;
  symbols?: string[];
  nameBots?: string[];
  resolutions?: string[];
  positionSide?: string;
  sortBy?: string;
  orderBy?: 'desc' | 'asc';
  from: number;
  to: number;
}
