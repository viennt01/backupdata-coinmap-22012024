import {
  deleteGW,
  get,
  post,
  put,
  uploadFile,
  VERSION_BASE_URL,
} from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response, ResponseWithoutPayload } from 'fetcher/interface';
import { format } from 'date-fns';
import { Bot } from './interface';

export const getListBots = () => {
  return get<Response<RawBot[]>>({ version: VERSION_BASE_URL.V1 })(
    `${API_ADMIN.BOT_TRADING_LIST}`,
  );
};

export const getBotDetail = (id: RawBot['id']) => {
  return get<Response<RawBot>>({})(`${API_ADMIN.BOT_TRADING_DETAIL}/${id}`);
};

export const createBot = (data: RawBotCreate) => {
  return post<RawBotCreate, Response<RawBot>>({ data })(
    `${API_ADMIN.BOT_TRADING_CREATE}`,
  );
};

export const updateBot = (id: RawBot['id'], data: RawBotCreate) => {
  return put<RawBotCreate, Response<RawBot>>({ data })(
    `${API_ADMIN.BOT_TRADING_EDIT}/${id}`,
  );
};

export const uploadImage = (data: any) => {
  return uploadFile<Response<RawUpload>>({ data })(`${API_ADMIN.UPLOAD_FILE}`);
};

export const uploadCsvFile = (data: FormData) => {
  return uploadFile<Response<RawBot[]>>({ data })(
    `${API_ADMIN.BOT_TRADING_HISTORY_IMPORT_CSV}`,
  );
};

export const deleteBotTrading = (id: Bot['id']) => {
  return deleteGW<undefined, ResponseWithoutPayload>({})(
    `${API_ADMIN.BOT_TRADING_DELETE}/${id}`,
  );
};

interface Metadata {
  name: string;
  type: string;
  default: string | number;
}

interface Params {
  [key: string]: Metadata;
}

export interface RawSettingBot {
  id: string;
  name: string;
  params: Params;
  owner_created: string;
  status: boolean;
  created_at: number;
  updated_at: number;
}

export enum Language {
  VI = 'vi',
  EN = 'en',
}
export interface RawBot {
  id: string;
  name: string;
  clone_name: string;
  type: string;
  code: string;
  description: string;
  work_based_on: string[];
  status: string;
  price: string;
  display_price: number | null;
  currency: string;
  image_url: string;
  order: number;
  bought: number;
  pnl: string;
  max_drawdown: string;
  token_first: string;
  token_second: string;
  balance: string;
  back_test: string;
  max_drawdown_change_percent: number;
  translation: {
    [index: string]: {
      description: RawBot['description'];
      work_based_on: RawBot['work_based_on'];
    };
  };

  owner_created: string;
  created_at: number;
  updated_at: number;
}

export interface RawBotCreate {
  name: string;
  clone_name?: string;
  code: string;
  type: string;
  status: string;
  price: string;
  display_price: number | null;
  currency: string;
  description: string;
  order: number;
  bought: number;
  work_based_on: string[];
  image_url: string;
  pnl: string;
  max_drawdown: string;
  token_first: string;
  token_second: string;
  balance: string;
  back_test: string;
  max_drawdown_change_percent: number;
  translation: {
    [index: string]: {
      description: RawBotCreate['description'];
      work_based_on: RawBotCreate['work_based_on'];
    };
  };
}

export const normalizeBot = (rawBot: RawBot): Bot => {
  const translation: Bot['translation'] = {};
  Object.keys(rawBot.translation).forEach((k) => {
    translation[k] = {
      description: rawBot.translation[k].description,
      workBasedOn: rawBot.translation[k].work_based_on,
    };
  });
  const bot: Bot = {
    id: rawBot.id,
    name: rawBot.name,
    cloneName: rawBot.clone_name,
    type: rawBot.type,
    code: rawBot.code,
    description: rawBot.description,
    status: rawBot.status,
    price: rawBot.price,
    displayPrice: rawBot.display_price,
    currency: rawBot.currency,
    imageUrl: rawBot.image_url,
    order: rawBot.order,
    bought: rawBot.bought,
    workBasedOn: rawBot.work_based_on,
    pnl: rawBot.pnl,
    max_drawdown: rawBot.max_drawdown,
    tokenFirst: rawBot.token_first,
    tokenSecond: rawBot.token_second,
    balance: rawBot.balance,
    backTest: rawBot.back_test,
    maxDrawdownChangePercent: rawBot.max_drawdown_change_percent,
    translation: translation,

    ownerCreated: rawBot.owner_created,
    createdAt: format(Number(rawBot.created_at), 'dd/MM/yyyy'),
    updatedAt: format(Number(rawBot.updated_at), 'dd/MM/yyyy'),
  };

  return bot;
};

export interface RawUpload {
  file_url: string;
}
