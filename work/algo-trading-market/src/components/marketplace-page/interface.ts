export interface PnlData {
  bot_id: string;
  created_at: number;
  updated_at: number;
  pnl_day_cash: number;
  pnl_day_percent: number;
  balance: number;
  current_balance: number;
}

export interface TradeHistory {
  bot_id: string;
  close_price: number;
  created_at: string;
  day_completed: string;
  day_started: string;
  entry_price: number;
  id: string;
  owner_created: string;
  profit: number;
  profit_cash: number;
  side: string;
  status: string;
  subscriber_id: string;
  token_first: string;
  token_second: string;
  updated_at: string;
  user_id: string;
}

export enum BOT_STATUS {
  ALL = '',
  OPEN = 'OPEN',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE', // connect broker but dont trade
  PROCESSING = 'PROCESSING',
  // suspended: dont trade
  EXPIRED = 'EXPIRED',
  DISCONNECTED = 'DISCONNECTED',
  NOT_ENOUGH_BALANCE = 'NOT_ENOUGH_BALANCE',
  // tab not connected: not connect to broker, dont trade
  CONNECTING = 'CONNECTING',
  NOT_CONNECT = 'NOT_CONNECT',
}
// need to connect broker when user has these status:  DISCONNECTED | NOT_CONNECT
// need to disconnect broker when user has these status:  ACTIVE | INACTIVE

export interface BACK_TEST {
  bot_name: string;
  from: string;
  to: string;
  banner: {
    boxs: {
      [key: string]: {
        id: number;
        title: string;
        value: number;
      };
    };
    chart: { label: string; value: number }[];
    information: {
      average_trade: number;
      daily_avg_profit: number;
      drawdown: number;
      monthly_avg_profit: number;
      of_trades: number;
      percent_drawdown: number;
      profit_fator: number;
      return_do_ratio: number;
      sharpe_ratio: number;
      winning_percent: number;
    };
  };
  column_chart: {
    monthly_pln: { month: string; name: string; value: number }[];
    trades_of_weekly: { month: string; name: string; value: number }[];
  };
  performance: {
    apr: string;
    aug: string;
    dec: string;
    feb: string;
    jan: string;
    jul: string;
    jun: string;
    key: string;
    mar: string;
    may: string;
    nov: string;
    oct: string;
    sep: string;
    year: string;
    ytd: string;
  }[];
  pie_chart: {
    long_short_ratio: { type: string; value: number }[];
    pln_buy: { type: string; value: number }[];
    pln_sell: { type: string; value: number }[];
  };
  transaction: {
    average_loss: number;
    average_win: number;
    gross_loss: number;
    gross_profit: number;
    largest_loss: number;
    largest_win: number;
    max_consec_loss: number;
    max_consec_win: number;
    of_cancelled_expired: number;
    of_losses: number;
    of_wins: number;
  };
}

export interface BOT {
  broker?: string;
  broker_account?: string;
  broker_server?: string;
  bought: number;
  real_bought: string;
  code: string;
  created_at: string;
  currency: string;
  description: string;
  expires_at: string | undefined | null;
  id: string;
  image_url: string;
  name: string;
  max_drawdown: string;
  pnl: string;
  order: string;
  owner_created: string;
  price: string;
  status: string;
  type: string;
  updated_at: string;
  user_status: Omit<BOT_STATUS, BOT_STATUS.ALL>;
  work_based_on: string[];

  balance: number;
  current_balance: number;
  pnl_day_current: number;
  total_trade: number;

  back_test: string;
}

export interface TradeHistoryFilter {
  page: number;
  size: number;
  bot_id?: BOT['id'];
  status?: BOT_STATUS;
  from?: string;
  to?: string;
  total: number;
}

export interface Currency {
  created_at: string;
  currency: string;
  description: string;
  id: string;
  image_url: string;
  name: string;
  order: number;
  owner_created: string;
  status: boolean;
  type: string;
  updated_at: string;
}

export interface CurrencyInfo {
  created_at: string;
  currency: string;
  description: string;
  id: string;
  image_url: string;
  name: string;
  order: number;
  owner_created: string;
  status: boolean;
  type: string;
  updated_at: string;
}

export interface BotSetting {
  id: string;
  name: string;
  value: string;
  description: null | string;
  owner_created: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}
