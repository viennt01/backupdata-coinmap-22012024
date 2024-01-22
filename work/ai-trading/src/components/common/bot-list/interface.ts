import { Language } from '@/hook/use-locale';

export enum BOT_STATUS {
  ALL = '',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE', // connect broker but dont trade
  PROCESSING = 'PROCESSING',
  // suspended: dont trade
  EXPIRED = 'EXPIRED',
  DISCONNECTED = 'DISCONNECTED',
  NOT_ENOUGH_BALANCE = 'NOT_ENOUGH_BALANCE',
  INACTIVE_BY_SYSTEM = 'INACTIVE_BY_SYSTEM', // temporary lock by system, need to contact admin to change status to INACTIVE
  STOP_OUT = 'STOP_OUT', // lock by max drawdown, user can active bot to continue trade
  // tab not connected: not connect to broker, dont trade
  CONNECTING = 'CONNECTING',
  NOT_CONNECT = 'NOT_CONNECT',
}
// need to connect broker when user has these status:  DISCONNECTED | NOT_CONNECT
// need to disconnect broker when user has these status:  ACTIVE | INACTIVE

export enum BOT_TYPE {
  ALL = '',
  FOREX = 'FOREX',
  CRYPTO = 'CRYPTO',
}

export interface Filter {
  status: BOT_STATUS;
  type: BOT_TYPE;
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

export interface BOT {
  broker?: string;
  broker_account?: string;
  broker_server?: string;

  code: string;
  created_at: string;
  currency: string;
  description: string;
  id: string;
  image_url: string;
  name: string;
  order: string;
  owner_created: string;
  price: string;
  status: string;
  type: string;
  updated_at: string;
  user_status: Omit<BOT_STATUS, BOT_STATUS.ALL>;
  work_based_on: string[];
  count_inactive_by_system: number;
  inactive_by_system_at: string;
  min_balance: number;

  balance: number;
  balance_current: number;
  balance_init: number;
  gain: number;
  pnl_7_day_current: number;
  pnl_7_day_init: number;
  pnl_30_day_current: number;
  pnl_30_day_init: number;
  pnl_day_current: number;
  pnl_day_init: number;
  profit: number;
  total_trade: number;
  translation: Record<
    Language,
    {
      description: BOT['description'];
      work_based_on: BOT['work_based_on'];
    }
  >;
  error?: {
    error_code: string;
    message: string;
  };
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

export interface PnlData {
  bot_id: string;
  created_at: number;
  updated_at: number;
  pnl_day_cash: number;
  pnl_day_percent: number;
}

export interface ConnectBroker {
  bot_id: string;
  broker_code: string | null;
  broker_server: string | null;
  account_id: string;
  password: string;
  platform: string | null;
  profile_id: string | null;
}

export interface BrokerSetting {
  id: string;
  name: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface Broker {
  code: string;
  name: string;
  required_profile: boolean;
  check_referral_broker: boolean;
  servers: string[];
  referral_setting: {
    name: string;
    key: string;
    type: string;
  }[];
}

export interface UpdateBotStatus {
  bot_id: BOT['id'];
  status: BOT['status'];
}

export interface DisconnectBroker {
  bot_id: BOT['id'];
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
