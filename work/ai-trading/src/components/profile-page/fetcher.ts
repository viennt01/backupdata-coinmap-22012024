import { put, ResponseWithPayload, get } from '@/fetcher';
import { API_USER, API_BOT } from '@/fetcher/endpoint';
import { BotPlan, UserProfile, Payment } from './interface';

export const ACTION_UPLOAD = process.env.API_MAIN_GW + '/user/upload';

export const getUserProfile = (queryString?: string) => {
  return get<unknown, ResponseWithPayload<UserProfile>>({})(
    `${API_USER.PROFILE}?${queryString ?? ''}`
  );
};

export const updateUserProFile = (data: UserProfile) => {
  return put<UserProfile, ResponseWithPayload<UserProfile>>({
    data,
  })(API_USER.PROFILE);
};

export const getUserPlanTradingBot = () => {
  return get<unknown, ResponseWithPayload<BotPlan[]>>({})(
    API_BOT.LIST_BOT_PLANS
  );
};

export const getPaymentList = (queryString?: string) => {
  return get<
    unknown,
    ResponseWithPayload<{
      rows: Payment[];
      count: number;
      page: number;
      size: number;
      total: number;
    }>
  >({})(`${API_USER.PAYMENT_LIST}${queryString ?? ''}`);
};
