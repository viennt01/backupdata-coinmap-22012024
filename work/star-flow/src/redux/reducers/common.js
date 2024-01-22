import { WARNING_CLOSE_CHART } from '@/config/consts/section';
import { genSimpleID } from '@/utils/generator';
import * as Types from '../const/ActionTypes';

export const initialState = {
  errors: {},
  pairs: [],
  resolutions: [],
  loading: false,
  showNeedUpgradePlan: false,
  deactivate: false,
  warningCloseChart: WARNING_CLOSE_CHART.OPEN,
  merchantInfo: {
    checkPermission: false,
    profile: {
      domain: null,
      code: '',
      config: {
        home_path: '/',
        logo_url: '',
        rect_logo_url: '',
        copyright: '',
        social_media: {
          facebook_url: '',
          twitter_url: '',
          telegram_url: '',
          youtube_url: '',
          discord_url: '',
        },
        support: {
          email: '',
        },
        permission: {
          pages: [],
          features: [],
        },
      },
    },
  },
};

const defaultErrorAttr = {
  type: 'toast',
  showType: 'default',
};

const common = (state = initialState, action) => {
  switch (action.type) {
    case Types.ADD_ERROR: {
      const newKey = genSimpleID();

      return {
        ...state,
        errors: {
          ...state.errors,
          [newKey]: {
            ...defaultErrorAttr,
            ...action.error,
          },
        },
      };
    }
    case Types.DEL_ERROR: {
      const errors = { ...state.errors };
      delete errors[action.errorId];
      return {
        ...state,
        errors,
      };
    }
    case Types.UPDATE_LIST_PAIRS: {
      const pairs = (action.pairs ?? []).sort((a, b) =>
        a.full_name.localeCompare(b.full_name)
      );
      return {
        ...state,
        pairs,
      };
    }

    case Types.SET_RESOLUTION_LIST: {
      return {
        ...state,
        resolutions: action.resolutions,
      };
    }
    case Types.LOADING: {
      return {
        ...state,
        loading: action.loading,
      };
    }
    case Types.SET_SHOW_NEED_UPGRADE_PLAN: {
      return {
        ...state,
        showNeedUpgradePlan: action.showNeedUpgradePlan,
      };
    }
    case Types.SET_DEACTIVATE: {
      return {
        ...state,
        deactivate: action.deactivate,
      };
    }
    case Types.SET_WARNING_CLOSE_CHART: {
      return {
        ...state,
        warningCloseChart: action.warningCloseChart,
      };
    }
    case Types.SET_MERCHANT_INFO: {
      return {
        ...state,
        merchantInfo: {
          ...action.merchantInfo,
        },
      };
    }
    default:
      return state;
  }
};

export default common;
