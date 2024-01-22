import { APPLY_SETTINGS_FOR } from '@/config/consts/settings/footprint';
import { deleteGW, GATEWAY, post } from '@/fetcher';
import { setLoadingCommon } from '@/redux/actions/common';
import { defaultSettings } from '@/redux/reducers/utils/chart-settings';
import FOOTPRINT_SETTINGS from '@/config/consts/settings/footprint';
import { CHART_TYPE_KEYS, LAYERS_MAP } from '@/config/consts/layer';
import { localStore } from '@/utils/localStorage';
import { LOCAL_CACHE_KEYS } from '@/config';

export const getChartConfig = (chartState, chartId) => {
  const { chartConfig } = chartState;
  const mainChartConfig =
    (chartConfig || []).find((config) => config.id === chartId) || {};
  return mainChartConfig;
};

export const createChart = ({ chartId, sectionType, layout, selected }) => {
  const content = {
    ...defaultSettings.value[sectionType],
    layout,
    chartId: chartId,
    selected,
    chartType: LAYERS_MAP.candle.id,
  };
  const data = {
    chartname: content.symbolInfo.symbol,
    resolution: content.symbolInfo.interval,
    symbol: content.symbolInfo.symbol,
    content: JSON.stringify(content),
    clientid: '',
  };
  return post({
    data,
    gw: GATEWAY.API_MAIN_GW,
  })(`/chart/create`);
};

export const formatChartDataBeforeUpdate = ({ chart }) => {
  return chart;
};

export const updateChart = ({ chart, dispatch }) => {
  const newChart = formatChartDataBeforeUpdate({ chart });
  const data = {
    chartname: newChart.symbolInfo.symbol,
    resolution: newChart.symbolInfo.interval,
    symbol: newChart.symbolInfo.symbol,
    content: JSON.stringify(newChart),
    clientid: '',
  };
  dispatch(setLoadingCommon(true));
  return post({
    data,
    gw: GATEWAY.API_MAIN_GW,
  })(`/chart/update/${newChart.id}`)
    .catch(() => {})
    .finally(() => {
      dispatch(setLoadingCommon(false));
    });
};

export const deleteChart = (id) => {
  return deleteGW({
    gw: GATEWAY.API_MAIN_GW,
  })(`/chart/delete/${id}`);
};

/**
 * footprint: {
 *  symbol: string;
 *  settings: [];
 *  applySettingsFor:
 * }
 *
 */

export const createFootprintSettings = (chart) => {
  // check footprint is existed => create new or not
  const footprintSettings = chart.footprintSettings;

  const existedFp = footprintSettings.some(
    (f) => f.symbol === chart.symbolInfo.symbol
  );

  // create new footprint settings
  if (!existedFp) {
    const applySettingsFor =
      footprintSettings[0]?.applySettingsFor ||
      FOOTPRINT_SETTINGS.applySettingsFor;
    let newFootprintSettings = {
      ...FOOTPRINT_SETTINGS,
      symbol: chart.symbolInfo.symbol,
    };

    if (applySettingsFor === APPLY_SETTINGS_FOR.ALL) {
      newFootprintSettings = {
        ...footprintSettings[0],
        symbol: chart.symbolInfo.symbol,
      };
    }

    footprintSettings.push(newFootprintSettings);
  }
  return footprintSettings;
};

export const getCurrentFootprintSetting = (footprintSettings, filter) => {
  const DEFAULT_SETTINGS = {
    ...FOOTPRINT_SETTINGS,
    symbol: filter.symbol,
  };

  let settings = footprintSettings.find((f) => f.symbol === filter.symbol);

  return settings || DEFAULT_SETTINGS;
};

export const createDraws = (chart) => {
  const draws = chart.draws;
  const existed = Object.keys(draws).some(
    (symbol) => symbol === chart.symbolInfo.symbol
  );
  if (!existed) {
    draws[chart.symbolInfo.symbol] = {
      enable: '',
    };
  }
  return draws;
};

export const getChartTypeFromLayers = (layers) => {
  if (!Array.isArray(layers)) {
    return null;
  }

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];

    if (CHART_TYPE_KEYS.includes(layer.type)) {
      return layer.type;
    }
  }
};

export const removeToggleIndicatorList = (chartId) => {
  const toggleIndicatorList = localStore.get(
    LOCAL_CACHE_KEYS.TOGGLE_INDICATOR_LIST
  );
  delete toggleIndicatorList[chartId];
  localStore.set(
    LOCAL_CACHE_KEYS.TOGGLE_INDICATOR_LIST,
    JSON.stringify(toggleIndicatorList)
  );
};

export const addToggleIndicatorList = (chartId) => {
  const toggleIndicatorList =
    localStore.get(LOCAL_CACHE_KEYS.TOGGLE_INDICATOR_LIST) || {};
  toggleIndicatorList[chartId] = false;
  localStore.set(
    LOCAL_CACHE_KEYS.TOGGLE_INDICATOR_LIST,
    JSON.stringify(toggleIndicatorList)
  );
};
export const updateToggleIndicatorList = (chartId) => {
  const toggleIndicatorList =
    localStore.get(LOCAL_CACHE_KEYS.TOGGLE_INDICATOR_LIST) || {};
  toggleIndicatorList[chartId] = !toggleIndicatorList[chartId];
  localStore.set(
    LOCAL_CACHE_KEYS.TOGGLE_INDICATOR_LIST,
    JSON.stringify(toggleIndicatorList)
  );
};

export const checkHasSelectedDraw = (chart) => {
  const symbolDraws = chart.draws[chart.symbolInfo.symbol];
  const drawTypes = Object.keys(symbolDraws);
  for (let i = 0; i < drawTypes.length; i++) {
    const drawType = drawTypes[i];
    const drawData = symbolDraws[drawType]?.data;
    if (!drawData || !Array.isArray(drawData.items)) {
      continue;
    }

    for (let j = 0; j < drawData.items.length; j++) {
      const draw = drawData.items[j];
      if (draw.selected) {
        return true;
      }
    }
  }
};
