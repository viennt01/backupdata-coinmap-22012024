import { GATEWAY, get, ResponseWithPayload } from '@/fetcher';
import { API_BOT } from '@/fetcher/endpoint';
import { Currency, Role, Transaction } from './interface';

export const getRole = (roleId: string) => {
  return get<unknown, ResponseWithPayload<Role>>({})(
    `${API_BOT.ROLE}/${roleId}`
  );
};

export const getTransaction = (transactionId: string) => {
  return get<unknown, ResponseWithPayload<Transaction>>({
    gw: GATEWAY.API_USER_GW,
  })(`/api/v2${API_BOT.TRANSACTION}/${transactionId}`);
};

export const getCurrencyList = () => {
  return get<unknown, ResponseWithPayload<Currency[]>>({})(
    API_BOT.CURRENCY_LIST
  );
};
