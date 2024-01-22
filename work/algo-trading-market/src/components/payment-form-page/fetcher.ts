import { get, GATEWAY, post, ResponseWithPayload } from '@/fetcher';
import { API_BOT } from '@/fetcher/endpoint';
import { CreateTransaction, Currency, Package, Role } from './interface';

export const getUnitCurrency = () => {
  return get<unknown, ResponseWithPayload<Currency[]>>({})(
    API_BOT.CURRENCY_LIST
  );
};

export const getRole = (roleId: string) => {
  return get<unknown, ResponseWithPayload<Role>>({})(
    `${API_BOT.ROLE}/${roleId}`
  );
};

export const getPackage = (packageId: string) => {
  return get<unknown, ResponseWithPayload<Package>>({})(
    `${API_BOT.PACKAGE}/${packageId}`
  );
};

export const getPackageList = () => {
  return get<unknown, ResponseWithPayload<Package[]>>({})(
    `${API_BOT.PACKAGE}/list`
  );
};

export const createTransaction = (data: CreateTransaction) => {
  return post<
    CreateTransaction,
    ResponseWithPayload<{ transaction_id: string }>
  >({
    data,
    gw: GATEWAY.API_USER_GW,
  })(`/api/v2${API_BOT.TRANSACTION}`);
};
