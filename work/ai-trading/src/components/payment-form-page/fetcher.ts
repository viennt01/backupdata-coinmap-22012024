import { get, GATEWAY, post, ResponseWithPayload } from '@/fetcher';
import {
  ADDITIONAL_DATA_TYPE,
  API_BOT,
  API_MERCHANT_ADDITIONAL_DATA,
} from '@/fetcher/endpoint';
import {
  BalanceRangeList,
  BotPrice,
  CreateTransaction,
  Currency,
  GetBotPrice,
  PackageLocale,
  AdditionalData,
  Role,
} from './interface';

export const getUnitCurrency = () => {
  return get<unknown, ResponseWithPayload<Currency[]>>({})(
    API_BOT.CURRENCY_LIST + '?all=false&category=TBOT'
  );
};

export const getRole = (roleId: string) => {
  return get<unknown, ResponseWithPayload<Role>>({})(
    `${API_BOT.BOT_TRADING}/${roleId}`
  );
};

export const getPackageList = () => {
  return get<unknown, ResponseWithPayload<PackageLocale[]>>({})(
    `${API_BOT.PACKAGE}/list?type=TBOT_PERIOD`
  );
};

export const getBalanceRange = () => {
  return get<unknown, ResponseWithPayload<BalanceRangeList>>({})(
    API_BOT.BALANCE_AND_FEE
  );
};

export const getAdditionalList = () => {
  return get<unknown, ResponseWithPayload<AdditionalData[]>>({
    gw: GATEWAY.API_USER_GW,
  })(
    `${API_MERCHANT_ADDITIONAL_DATA.LIST}?type=${ADDITIONAL_DATA_TYPE.POLICY}`
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

export const getBotPrice = (data: GetBotPrice, options?: RequestInit) => {
  return post<GetBotPrice, ResponseWithPayload<BotPrice>>({
    data,
    options,
  })(API_BOT.BALANCE_AND_FEE);
};
