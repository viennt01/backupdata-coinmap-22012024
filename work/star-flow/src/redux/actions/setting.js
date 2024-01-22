import { GATEWAY, post } from '@/fetcher';
import { formatChartDataBeforeUpdate } from '@/utils/chart';
import {
  ADD_CHART,
  BOT_SIGNALS_PANE_TOGGLE,
  CHANGE_CHART_TYPE,
  DRAW_END,
  DRAW_START,
  DRAW_UPDATE,
  LAYER_ADD,
  LAYER_DEL,
  LAYER_LIST_TOGGLE,
  LAYER_MOVE,
  LAYER_TOGGLE,
  LAYER_UPDATE,
  RESTORE_SETTING_FROM_LOCAL,
  SET_CHART_THEME,
  SET_LAYOUT,
  SET_SELECTED_CHART,
  SET_SYMBOL_FILTER,
  TOGGLE_MODAL_JUMP_TO,
  TOGGLE_MODAL_EXPORT,
  TOOGLE_ADD_LAYER_MODAL,
  UPDATE_CHART_INTERVAL,
  UPDATE_SYMBOL_SEARCH_CHART_ID,
  LAYER_SETTING,
  SET_FOOTPRINT_SETTINGS,
  SET_VIEW_SETTINGS,
  SET_STATUS_LINE_SETTINGS,
  SET_TIME_SCALE_SETTINGS,
  SET_PRICE_SCALE_SETTINGS,
  SET_LAYER_ID_SETTING,
  SET_LAYER_SETTING,
  SET_CHARTS_FROM_SERVER,
  UPDATE_CHART,
  DRAW_SELECT,
  DRAW_DELETE,
  SET_DRAW_SETTING,
  UPDATE_WATCH_LIST_FROM_SERVER,
} from '../const/ActionTypes';
import { setLoadingCommon } from './common';

export const setChartsFromServer = (charts) => ({
  type: SET_CHARTS_FROM_SERVER,
  charts,
});

export const updateWatchListFromServer = (watchlistSettings) => ({
  type: UPDATE_WATCH_LIST_FROM_SERVER,
  watchlistSettings,
});

export const setTheme = (chartId, data) => ({
  type: SET_CHART_THEME,
  chartId,
  data,
});

export const setFootprintSettings = (chartId, data) => ({
  type: SET_FOOTPRINT_SETTINGS,
  chartId,
  data,
});

export const setViewSettings = (chartId, data) => ({
  type: SET_VIEW_SETTINGS,
  chartId,
  data,
});

export const setStatusLineSettings = (chartId, data) => ({
  type: SET_STATUS_LINE_SETTINGS,
  chartId,
  data,
});

export const setTimeScaleSettings = (chartId, data) => ({
  type: SET_TIME_SCALE_SETTINGS,
  chartId,
  data,
});

export const setPriceScaleSettings = (chartId, data) => ({
  type: SET_PRICE_SCALE_SETTINGS,
  chartId,
  data,
});
export const updateReduxChart = (chartId, chartUpdate) => ({
  type: UPDATE_CHART,
  chartId,
  chartUpdate,
});

export const updateInterval = (chartId, chartUpdate) => ({
  type: UPDATE_CHART_INTERVAL,
  chartId,
  chartUpdate,
});

export const toggleSymbolSearch = (chartId) => ({
  type: UPDATE_SYMBOL_SEARCH_CHART_ID,
  chartId,
});

export const setSymbolFilter = (filter) => ({
  type: SET_SYMBOL_FILTER,
  filter,
});

export const actRestoreSettings = ({ charts, layout }) => ({
  type: RESTORE_SETTING_FROM_LOCAL,
  charts,
  layout,
});

export const actSetLayout = (layout, chartId) => ({
  type: SET_LAYOUT,
  layout,
  chartId,
});

export const actSetSelectedChart = (selected, chartId) => ({
  type: SET_SELECTED_CHART,
  selected,
  chartId,
});

export const actToggleLayerList = (chartId) => ({
  type: LAYER_LIST_TOGGLE,
  chartId,
});
//
export const actSettingLayer = (chartId, layerId, timeGroup) => ({
  type: LAYER_SETTING,
  chartId,
  layerId,
  timeGroup,
});

export const actSetLayerIdSetting = (chartId, layerId) => ({
  type: SET_LAYER_ID_SETTING,
  chartId,
  layerId,
});

export const actSetLayerSetting = (chartId, layerId, settings) => ({
  type: SET_LAYER_SETTING,
  chartId,
  layerId,
  settings,
});

export const actToggleLayer = (chartId, layerId) => ({
  type: LAYER_TOGGLE,
  chartId,
  layerId,
});
export const actDelLayer = (chartId, chartUpdate) => ({
  type: LAYER_DEL,
  chartId,
  chartUpdate,
});
export const actAddLayer = (chartId, chartUpdate) => ({
  type: LAYER_ADD,
  chartId,
  chartUpdate,
});
export const actLayerMove = ({ chartId, layerId, layerIndex, num = -1 }) => ({
  type: LAYER_MOVE,
  chartId,
  layerId,
  layerIndex,
  num,
});
export const actLayerUpdate = ({ chartId, layerId, layerData }) => ({
  type: LAYER_UPDATE,
  chartId,
  layerId,
  layerData,
});
export const actLayerMoveUp = ({ chartId, layerId, layerIndex }) =>
  actLayerMove({ chartId, layerId, layerIndex, num: 1 });
export const actLayerMoveDown = ({ chartId, layerId, layerIndex }) =>
  actLayerMove({ chartId, layerId, layerIndex, num: -1 });

export const actAddSection = (sectionType, layout, chartId, selected) => ({
  type: ADD_CHART,
  sectionType,
  layout,
  chartId,
  selected,
});

export const actStartDraw = (drawType, chartId) => ({
  type: DRAW_START,
  drawType,
  chartId,
});

export const actUpdateDraw = (drawType, dataUpdate, chartId) => ({
  type: DRAW_UPDATE,
  drawType,
  dataUpdate,
  chartId,
});

export const actEndDraw = (drawType, chartId, data, otherData) => ({
  type: DRAW_END,
  drawType,
  chartId,
  data,
  otherData,
});

export const actSelectDraw = (chartId, selectedItemIds) => ({
  type: DRAW_SELECT,
  chartId,
  selectedItemIds,
});

export const actDeleteDraws = (chartId) => ({
  type: DRAW_DELETE,
  chartId,
});

export const actSetDrawSetting = (chartId, drawType, drawId, settings) => ({
  type: SET_DRAW_SETTING,
  chartId,
  drawType,
  drawId,
  settings,
});

export const toggleAddLayerModal = (chartId) => ({
  type: TOOGLE_ADD_LAYER_MODAL,
  chartId,
});

export const actChangeChartType = (chartId, chartUpdate) => ({
  type: CHANGE_CHART_TYPE,
  chartId,
  chartUpdate,
});

export const actToggleJumpToModal = (chartId) => ({
  type: TOGGLE_MODAL_JUMP_TO,
  chartId,
});

export const actToggleExportModal = (chartId) => ({
  type: TOGGLE_MODAL_EXPORT,
  chartId,
});

export const actToggleBotSignalsPane = (chartId) => ({
  type: BOT_SIGNALS_PANE_TOGGLE,
  chartId,
});

/**
 *
 * @param {string|number} chartId ID of chart
 *
 * Get chart from state by chartId
 * Post to server to save
 */
export const actUpdateChartToSever = (chartId) => {
  return async (dispatch, getState) => {
    const state = getState();
    const chart = state.chartSettings.charts[chartId];
    if (!chart) {
      return null;
    }
    const newChart = formatChartDataBeforeUpdate({ chart });

    const data = {
      chartname: newChart.symbolInfo.symbol,
      resolution: newChart.symbolInfo.interval,
      symbol: newChart.symbolInfo.symbol,
      content: JSON.stringify(newChart),
      clientid: '',
    };

    dispatch(setLoadingCommon(true));

    try {
      return await post({
        data,
        gw: GATEWAY.API_MAIN_GW,
      })(`/chart/update/${newChart.id}`);
    } finally {
      dispatch(setLoadingCommon(false));
    }
  };
};
