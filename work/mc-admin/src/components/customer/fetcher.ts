import { deleteGW, get, post, put, ResponseWithPayload } from '@/fetcher';
import { API_MERCHANT } from '@/fetcher/endpoint';

import {
  BotByMechant,
  BotByUserId,
  BOT_STATUS,
  CreateBotOfCustomer,
  NumberOfBot,
  NumberOfBotResponse,
  User,
  UserCreate,
  USER_BOT_STATUS,
  HistoryOfCustomer,
} from './interface';

export interface Package {
  user_bot_id: string;
  quantity: number;
  package_type: string;
  id: string;
  name: string;
}

export interface PackageValueCustomer {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
}
export interface PackageValueBot {
  value: string;
  label: string;
}

export const createCustomer = (data: UserCreate) => {
  return post<UserCreate, ResponseWithPayload<User>>({ data })(
    `${API_MERCHANT.CREATE_USER}`
  );
};

export const getUserDetail = (id: string) => {
  return get<undefined, ResponseWithPayload<User>>({})(
    `${API_MERCHANT.USER_INFORMATION}/${id}`
  );
};

export const updateCustomer = (
  data: Omit<UserCreate, 'password'>,
  id: string
) => {
  return put<Omit<UserCreate, 'password'>, ResponseWithPayload<UserCreate>>({
    data,
  })(`${API_MERCHANT.UPDATE_USER(id)}`);
};

export const updateNumberOfBot = (data: NumberOfBot, id: string) => {
  return put<NumberOfBot, UserCreate>({ data })(
    `${API_MERCHANT.ADD_NUMBER_OF_BOT(id)}`
  );
};

export const getBotTradingListByMechant = () => {
  return get<
    undefined,
    ResponseWithPayload<{
      rows: BotByMechant[];
    }>
  >({})(API_MERCHANT.COMMISSION_LIST + `?status=${BOT_STATUS.ACTIVE}`);
};

export const getNumberBotOfCustomer = (id: string) => {
  return get<undefined, ResponseWithPayload<NumberOfBotResponse>>({})(
    `${API_MERCHANT.GET_NUMBER_OF_BOT(id)}`
  );
};

export const addCustomerBot = (
  data: { rows: CreateBotOfCustomer[] },
  id: string
) => {
  return put<{ rows: CreateBotOfCustomer[] }, ResponseWithPayload<boolean>>({
    data,
  })(`${API_MERCHANT.ADD_USER_ASSET(id)}`);
};

export const getBotTradingListOfUser = (id: string) => {
  return get<undefined, ResponseWithPayload<BotByUserId[]>>({})(
    `${API_MERCHANT.BOT_TRADING_LIST}/?user_id=${id}`
  );
};

// id: user_bot_id
export const updateStatusBot = (
  status: USER_BOT_STATUS,
  usserBotId: string
) => {
  return put<
    {
      status: USER_BOT_STATUS;
    },
    ResponseWithPayload<BotByUserId[]>
  >({
    data: {
      status,
    },
  })(`${API_MERCHANT.UPDATE_STATUS_BOT(usserBotId)}`);
};

export const deleteBotOfCustomer = (userBotId: BotByUserId['user_bot_id']) => {
  return deleteGW<{
    rows: { user_asset_id: BotByUserId['user_bot_id'] }[];
  }>({
    data: {
      rows: [
        {
          user_asset_id: userBotId,
        },
      ],
    },
  })(`${API_MERCHANT.REMOVE_BOT_OF_USER}`);
};

export const getListHistory = (id: string) => {
  return get<undefined, ResponseWithPayload<HistoryOfCustomer[]>>({})(
    `${API_MERCHANT.LIST_HISTORY}/${id}/list-inactive-by-system`
  );
};
