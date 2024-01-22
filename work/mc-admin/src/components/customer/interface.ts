/*eslint no-unused-vars: "off"*/

export enum GENDER {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
export const GENDER_LABEL = {
  [GENDER.MALE]: 'Male',
  [GENDER.FEMALE]: 'Female',
  [GENDER.OTHER]: 'Other',
};

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  email_confirmed: boolean;
  created_at: string;
  gender: GENDER;
}

export interface UserCreate {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  gender: GENDER;
}

export enum NameOfBot {
  NUMBER_OF_TBOT = 'NUMBER_OF_TBOT',
}

export interface NumberOfBot {
  name: NameOfBot;
  value: string;
  description: string;
}

export interface NumberOfBotResponse extends NumberOfBot {
  id: string;
}

export interface BOT {
  balance: string;
  code: string;
  created_at: string;
  currency: string;
  description: string;
  id: string;
  image_url: string;
  max_drawdown: string;
  name: string;
  order: number;
  owner_created: string;
  pnl: string;
  price: string;
  status: BOT_STATUS;
  token_first: string;
  token_second: string;
  type: string;
  updated_at: string;
  category: string;
  work_based_on: string;
}

export interface BotByMechant extends BOT {
  asset_id: string;
}

export enum BOT_TYPE {
  MONTH = 'MONTH',
  DAY = 'DAY',
}

export interface BotByUserId extends Omit<BOT, 'status'> {
  package_type: BOT_TYPE;
  quantity: string;
  user_bot_id: string;
  status: USER_BOT_STATUS;
}
export interface HistoryOfCustomer {
  bot_id: string;
  bot_name: string;
  subscriber_id: string;
  trade_id: string;
  symbol: string;
  time: number;
}
export interface CreateBotOfCustomer {
  asset_id: BotByUserId['id'];
  quantity: BotByUserId['quantity'];
  type: BOT_TYPE | '';
  status?: BotByUserId['status'];
}

export enum BOT_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  NOT_CONNECT = 'NOT_CONNECT',
}

export enum USER_BOT_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  NOT_CONNECT = 'NOT_CONNECT',
  INACTIVE_BY_SYSTEM = 'INACTIVE_BY_SYSTEM',
  PROCESSING = 'PROCESSING',
  CONNECTING = 'CONNECTING',
  DISCONNECTED = 'DISCONNECTED',
  EXPIRED = 'EXPIRED',
  DELETED = 'DELETED',
}

export const USER_BOT_COLORS = {
  [USER_BOT_STATUS['ACTIVE']]: 'lime',
  [USER_BOT_STATUS['INACTIVE']]: 'volcano',
  [USER_BOT_STATUS['NOT_CONNECT']]: 'red',
  [USER_BOT_STATUS['INACTIVE_BY_SYSTEM']]: 'magenta',
  [USER_BOT_STATUS['PROCESSING']]: 'cyan',
  [USER_BOT_STATUS['CONNECTING']]: 'blue',
  [USER_BOT_STATUS['DISCONNECTED']]: 'gold',
  [USER_BOT_STATUS['EXPIRED']]: 'orrange',
  [USER_BOT_STATUS['DELETED']]: 'red',
};

export enum BOT_CATEGORY {
  TBOT = 'TBOT',
  SBOT = 'SBOT',
  PKG = 'PKG',
}
