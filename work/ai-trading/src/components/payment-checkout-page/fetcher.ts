import { GATEWAY, get, post, ResponseWithPayload } from '@/fetcher';
import { API_BOT } from '@/fetcher/endpoint';
import {
  BotPrice,
  Currency,
  GetBotPrice,
  Role,
  Transaction,
} from './interface';

export const getRole = (roleId: string) => {
  return get<unknown, ResponseWithPayload<Role>>({})(
    `${API_BOT.BOT_TRADING}/${roleId}`
  );
};

export const getTransaction = (transactionId: string) => {
  return get<unknown, ResponseWithPayload<Transaction>>({
    gw: GATEWAY.API_USER_GW,
  })(`/api/v2${API_BOT.TRANSACTION}/${transactionId}`);
};

export const getCurrencyList = () => {
  return get<unknown, ResponseWithPayload<Currency[]>>({})(
    API_BOT.CURRENCY_LIST + '?all=false&category=TBOT'
  );
};

export const getBotPrice = (data: GetBotPrice, options?: RequestInit) => {
  return post<GetBotPrice, ResponseWithPayload<BotPrice>>({
    data,
    options,
  })(API_BOT.BALANCE_AND_FEE);
};
