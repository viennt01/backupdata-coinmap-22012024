import * as Types from '../const/ActionTypes';

export const initialState = {
  user: {
    active: false,
    profile_pic: '',
    first_name: '',
    last_name: '',
    username: '',
    country: '',
    year_of_birth: '',
    gender: '',
    email: '',
    phone: '',
    phone_code: '+84',
    id: '',
    roles: [],
  },
  billingInfo: {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: '',
    phone_code: '+84',
  },
  account: {},
};

const userProfile = (state = initialState, action) => {
  switch (action.type) {
    case Types.SET_USER_PROFILE: {
      return {
        ...state,
        user: action.data,
        billingInfo: {
          first_name: action.data.first_name,
          last_name: action.data.last_name,
          email: action.data.email,
          phone: action.data.phone,
          phone_code: action.data.phone_code,
          country: action.data.country,
        },
      };
    }
    case Types.SET_USER_INFO: {
      return {
        ...state,
        user: { ...state.user, ...action.data },
      };
    }
    default:
      return state;
  }
};

export default userProfile;
