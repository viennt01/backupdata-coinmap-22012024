import { get, put, uploadFile, GATEWAY, post } from '@/fetcher';
import { API_USER } from '@/fetcher/endpoint';

export const checkUserName = (data) => {
  return get({
    gw: GATEWAY.API_USER_ROLES_GW,
  })(`${API_USER.CHECK_NAME}/${data}`);
};

export const updateProFile = (data) => {
  return put({ data, gw: GATEWAY.API_USER_ROLES_GW })(API_USER.UPDATE_PROFILE);
};

export const ACTION_UPLOAD = process.env.API_USER_ROLES_GW + '/user/upload';

export const updateEmail = (data) => {
  return post({ data, gw: GATEWAY.API_USER_ROLES_GW })(API_USER.CHANGE_EMAIL);
};

export const getUserBotPlans = () => {
  return get({ gw: GATEWAY.API_USER_ROLES_GW })(`${API_USER.USER_BOT_PLANS}`);
};

export const getUserTradingBotPlans = () => {
  return get({ gw: GATEWAY.API_USER_ROLES_GW })(
    `${API_USER.USER_TRADING_BOT_PLANS}`
  );
};

export const getUserRolePlans = () => {
  return get({ gw: GATEWAY.API_USER_ROLES_GW_V2 })(
    `${API_USER.USER_ROLE_PLANS}`
  );
};

export const getPaymentList = (filter) => {
  const queryString = '';
  Object.keys(filter).forEach((key) => {
    if (filter[key]) {
      queryString += `&${key}=${filter[key]}`;
    }
  });
  return get({ gw: GATEWAY.API_USER_ROLES_GW })(
    `${API_USER.USER_PAYMENT_LIST}?${queryString}`
  );
};
