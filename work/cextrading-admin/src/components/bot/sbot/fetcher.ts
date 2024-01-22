import { deleteGW, get, post, put, uploadFile } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response, ResponseWithoutPayload } from 'fetcher/interface';
import { format } from 'date-fns';
import { Bot } from './interface';

export const getListSettingBots = () => {
  return get<Response<RawBot[]>>({})(`${API_ADMIN.SETTING_BOT_LIST}`);
};

export const getListBots = () => {
  return get<Response<RawBot[]>>({})(`${API_ADMIN.BOT_LIST}`);
};

export const getBotDetail = (id: RawBot['id']) => {
  return get<Response<RawBot>>({})(`${API_ADMIN.BOT_DETAIL}/${id}`);
};

export const createBot = (data: RawBotCreate) => {
  return post<RawBotCreate, Response<RawBot>>({ data })(
    `${API_ADMIN.BOT_CREATE}`,
  );
};

export const updateBot = (id: RawBot['id'], data: RawBotCreate) => {
  return put<RawBotCreate, Response<RawBot>>({ data })(
    `${API_ADMIN.BOT_EDIT}/${id}`,
  );
};

export const uploadImage = (data: any) => {
  return uploadFile<Response<RawUpload>>({ data })(`${API_ADMIN.UPLOAD_FILE}`);
};

export const deleteBot = (id: Bot['id']) => {
  return deleteGW<undefined, ResponseWithoutPayload>({})(
    `${API_ADMIN.BOT_DELETE}/${id}`,
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

export interface RawBot {
  id: string;
  name: string;
  type: string;
  bot_setting_id: string;
  description: string;
  work_based_on: string[];
  status: string;
  price: string;
  currency: string;
  image_url: string;
  order: number;

  owner_created: string;
  created_at: number;
  updated_at: number;
}

export interface RawBotCreate {
  name: string;
  bot_setting_id: string;
  type: string;
  status: string;
  price: string;
  currency: string;
  description: string;
  order: number;
  work_based_on: string[];
  image_url: string;
}

export const normalizeBot = (rawBot: RawBot): Bot => {
  const bot: Bot = {
    id: rawBot.id,
    name: rawBot.name,
    type: rawBot.type,
    botSettingId: rawBot.bot_setting_id,
    description: rawBot.description,
    status: rawBot.status,
    price: rawBot.price,
    currency: rawBot.currency,
    imageUrl: rawBot.image_url,
    order: rawBot.order,
    workBasedOn: rawBot.work_based_on,

    ownerCreated: rawBot.owner_created,
    createdAt: format(Number(rawBot.created_at), 'dd/MM/yyyy'),
    updatedAt: format(Number(rawBot.updated_at), 'dd/MM/yyyy'),
  };

  return bot;
};

export interface RawUpload {
  file_url: string;
}
