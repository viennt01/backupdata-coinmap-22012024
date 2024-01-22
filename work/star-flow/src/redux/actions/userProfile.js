import { SET_USER_INFO, SET_USER_PROFILE } from '../const/ActionTypes';

export const setUserProfile = (data) => ({
  type: SET_USER_PROFILE,
  data,
});

export const setUserInfo = (data) => ({
  type: SET_USER_INFO,
  data,
});
