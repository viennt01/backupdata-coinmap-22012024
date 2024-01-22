import {
  ADD_ERROR,
  DEL_ERROR,
  LOADING,
  SET_RESOLUTION_LIST,
  SET_SHOW_NEED_UPGRADE_PLAN,
  SET_DEACTIVATE,
  SET_WARNING_CLOSE_CHART,
  SET_MERCHANT_INFO,
} from '../const/ActionTypes';

export const actAddError = (
  error = {
    message: 'Lỗi kết nối, vui lòng thử lại!',
    type: 'toast',
    delay: 20,
    closeable: true,
  }
) => ({
  type: ADD_ERROR,
  error,
});

export const actDelError = (errorId) => ({
  type: DEL_ERROR,
  errorId,
});

export const setResolutionList = (resolutions) => ({
  type: SET_RESOLUTION_LIST,
  resolutions,
});

export const setLoadingCommon = (loading) => ({
  type: LOADING,
  loading,
});

export const setShowNeedUpgradePlan = (showNeedUpgradePlan) => ({
  type: SET_SHOW_NEED_UPGRADE_PLAN,
  showNeedUpgradePlan,
});

export const setDeactivate = (deactivate) => ({
  type: SET_DEACTIVATE,
  deactivate,
});

export const actSetWarningCloseChart = (warningCloseChart) => ({
  type: SET_WARNING_CLOSE_CHART,
  warningCloseChart,
});

export const actSetMerchantInfo = (merchantInfo) => ({
  type: SET_MERCHANT_INFO,
  merchantInfo,
});
