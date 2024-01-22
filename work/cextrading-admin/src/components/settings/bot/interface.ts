export interface Bot {
  id: string;
  name: string;
  params: ParamsObject;
  ownerCreated: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBot {
  name: string;
  params: ParamsObject;
  status: boolean;
}
interface ParamsObject {
  [key: string]: ParamBot;
}

export interface ParamBot {
  order: number;
  name: string;
  default: any;
  type: TypeValue;
  error?: boolean;
}
export enum TypeValue {
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  TEXT = 'text',
  ARRAY = 'array',
  OBJECT = 'object',
}

export interface ParamsTradingHistoryList {
  page: number;
  size: number;
  bot_id: string;
  status: string;
  user_id: string;
}

export interface TradeHistory {
  rows: ListResponTradeHistory[];
  page: number;
  size: number;
  count: number;
  total: number;
}
export interface ListResponTradeHistory {
  user_id: string;
  owner_created: string;
  token_first: string;
  token_second: string;
  status: string;
  side: string;
  entry_price: string;
  close_price: string;
  profit: string;
  profit_cash: string;
  volume: string;
  day_started: number;
  day_completed: number;
  subscriber_id: string;
  bot_id: string;
  id: string;
  created_at: number;
  updated_at: number;
}
