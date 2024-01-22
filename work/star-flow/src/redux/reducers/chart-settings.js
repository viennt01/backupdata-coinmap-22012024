import { LOCAL_SETTINGS_CACHE_KEY } from '@/config';
import { DRAW_TOOLS } from '@/config/consts/drawTool';
import * as Types from '../const/ActionTypes';
import { defaultSettings } from './utils/chart-settings';

export const defaultSettingsState = {
  charts: {
    [defaultSettings.value.chart.chartId]: {
      ...defaultSettings.value.chart,
    },
    [defaultSettings.value.tradingview.chartId]: {
      ...defaultSettings.value.tradingview,
    },
  },

  symbolSearchChartId: '',
  symbolFilter: {
    query: '',
    type: '',
    exchange: '',
  },
};

let initialState = {
  charts: {},
  symbolSearchChartId: '',
  symbolFilter: {
    query: '',
    type: '',
    exchange: '',
  },
};

const chartSettings = (state = initialState, action) => {
  switch (action.type) {
    // add chart from server to redux
    case Types.SET_CHARTS_FROM_SERVER: {
      return {
        ...state,
        charts: action.charts,
      };
    }
    // update watch list settings only
    case Types.UPDATE_WATCH_LIST_FROM_SERVER: {
      const charts = {};
      Object.keys(state.charts ?? {}).forEach((chartId) => {
        let newChartId = chartId;
        let newChart = state.charts[chartId];
        if (newChart.type === 'watchlist') {
          newChart = action.watchlistSettings;
          newChartId = action.watchlistSettings.chartId;
        }

        charts[newChartId] = newChart;
      });

      return {
        ...state,
        charts,
      };
    }
    // add a new chart
    case Types.ADD_CHART: {
      const newChartId = action.chartId;
      const sectionLayout = {
        ...action.layout,
        i: newChartId,
      };

      return {
        ...state,
        charts: {
          ...state.charts,
          [newChartId]: {
            ...defaultSettings.value[action.sectionType],
            chartId: newChartId,
            sectionType: action.sectionType,
            layout: sectionLayout,
            selected: action.selected,
          },
        },
      };
    }
    case Types.UPDATE_CHART: {
      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...state.charts[action.chartId],
            ...action.chartUpdate,
          },
        },
      };
    }
    case Types.UPDATE_CHART_SYMBOL: {
      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...action.chartUpdate,
          },
        },
      };
    }
    case Types.LAYER_SETTING: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }
      const selectedTime = state.charts[action.chartId].interval;
      const layers = chart.layers.map((layer) => {
        if (layer.i !== action.layerId) {
          return layer;
        } else {
          const status = action.timeGroup.some((item) => {
            let numberMin = item.valueMin;
            let numberMax = item.valueMax;
            if (item.name === 'Hours') {
              numberMin = item.valueMin * 60;
              numberMax = item.valueMax * 60;
            }
            if (
              selectedTime >= numberMin &&
              selectedTime <= numberMax &&
              item.enable === true &&
              item.name === 'Days'
            ) {
              return false;
            }
            return (
              (selectedTime >= numberMin &&
                selectedTime <= numberMax &&
                item.enable === true) ||
              (selectedTime === '1D' && item.enable === true)
            );
          });
          return {
            ...layer,
            show: status,
            timeGroup: action.timeGroup,
          };
        }
      });
      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            layers,
          },
        },
      };
    }
    case Types.UPDATE_CHART_INTERVAL: {
      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...state.charts[action.chartId],
            ...action.chartUpdate,
          },
        },
      };
    }
    case Types.DELETE_CHART: {
      const charts = {};
      Object.keys(state.charts).forEach((key) => {
        if (state.charts[key].chartId !== action.chartId) {
          charts[key] = state.charts[key];
        }
      });

      return {
        ...state,
        charts,
      };
    }
    case Types.UPDATE_SYMBOL_SEARCH_CHART_ID: {
      return {
        ...state,
        symbolSearchChartId: action.chartId,
      };
    }
    case Types.SET_SYMBOL_FILTER: {
      return {
        ...state,
        symbolFilter: {
          ...state.symbolFilter,
          ...action.filter,
        },
      };
    }
    // SETTINGS
    case Types.SET_FOOTPRINT_SETTINGS: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            footprintSettings: action.data,
          },
        },
      };
    }
    case Types.SET_VIEW_SETTINGS: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }
      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            viewSettings: {
              ...chart.viewSettings,
              ...action.data,
            },
          },
        },
      };
    }
    case Types.SET_STATUS_LINE_SETTINGS: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }
      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            statusLineSettings: {
              ...chart.statusLineSettings,
              ...action.data,
            },
          },
        },
      };
    }

    case Types.SET_TIME_SCALE_SETTINGS: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }
      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            timeScaleSettings: {
              ...chart.timeScaleSettings,
              ...action.data,
            },
          },
        },
      };
    }

    case Types.SET_PRICE_SCALE_SETTINGS: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }
      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            priceScaleSettings: {
              ...chart.priceScaleSettings,
              ...action.data,
            },
          },
        },
      };
    }

    case Types.SET_CHART_THEME: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            themeSettings: {
              ...chart.themeSettings,
              ...action.data,
            },
          },
        },
      };
    }
    case Types.RESTORE_SETTING_FROM_LOCAL: {
      const charts = action.charts || state.charts;
      const layout = action.layout || state.layout;

      return {
        ...state,
        charts,
        layout,
      };
    }
    case Types.SET_LAYOUT: {
      const chart = state.charts[action.chartId];

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            layout: action.layout,
          },
        },
      };
    }
    case Types.SET_SELECTED_CHART: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            selected: action.selected,
          },
        },
      };
    }
    case Types.LAYER_LIST_TOGGLE: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }
      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            showLayers: chart.showLayers,
          },
        },
      };
    }
    case Types.LAYER_TOGGLE: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }
      const layers = chart.layers.map((layer) => {
        if (layer.i !== action.layerId) {
          return layer;
        }

        return {
          ...layer,
          show: !layer.show,
        };
      });

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            layers,
          },
        },
      };
    }
    case Types.LAYER_ADD: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }
      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...action.chartUpdate,
          },
        },
      };
    }
    case Types.LAYER_DEL: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }
      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...action.chartUpdate,
          },
        },
      };
    }
    case Types.LAYER_MOVE: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }
      const layers = [...chart.layers];
      // calculate layer index based on indicator index with conditions:
      // - layer index of chart is 0
      // - indicator list excludes chart type
      const actualLayerIndex = action.layerIndex + 1;
      const fromPos = actualLayerIndex;
      const toPos = actualLayerIndex + action.num;
      if (layers[toPos] && toPos > 0) {
        // swap position
        const newPosition = layers[toPos].position;
        layers[toPos].position = layers[fromPos].position;
        layers[fromPos].position = newPosition;

        // swap index
        const tmpLayer = layers[toPos];
        layers[toPos] = layers[fromPos];
        layers[fromPos] = tmpLayer;
      }

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            layers,
          },
        },
      };
    }
    case Types.LAYER_UPDATE: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }
      const layers = chart.layers.map((layer) => {
        if (layer.i !== action.layerId) {
          return layer;
        }

        return {
          ...layer,
          ...action.layerData,
        };
      });

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            layers,
          },
        },
      };
    }
    case Types.DRAW_START: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }
      // enable start draw tool
      const symbolDraws = chart.draws[chart.symbolInfo.symbol];

      symbolDraws = {
        ...symbolDraws,
        enable: action.drawType,
      };

      const draws = { ...chart.draws, [chart.symbolInfo.symbol]: symbolDraws };

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            draws,
          },
        },
      };
    }

    case Types.DRAW_UPDATE: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }

      const symbolDraws = chart.draws[chart.symbolInfo.symbol];

      const existedDraw = symbolDraws[action.drawType];
      if (!existedDraw) {
        symbolDraws[action.drawType] = {
          ...action.dataUpdate,
        };
      } else {
        symbolDraws[action.drawType] = {
          ...symbolDraws[action.drawType],
          ...action.dataUpdate,
        };
      }

      const draws = { ...chart.draws, [chart.symbolInfo.symbol]: symbolDraws };

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            draws,
          },
        },
      };
    }
    case Types.DRAW_END: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }
      const symbolDraws = { ...chart.draws[chart.symbolInfo.symbol] };

      symbolDraws[action.drawType] = {
        ...symbolDraws[action.drawType],
        showModal: false,
        data: action.data,
        ...(action.otherData || {}),
      };

      symbolDraws.enable = null;

      const draws = { ...chart.draws, [chart.symbolInfo.symbol]: symbolDraws };

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            draws,
          },
        },
      };
    }
    case Types.DRAW_SELECT: {
      const chart = state.charts[action.chartId];
      if (!chart || !chart.draws) {
        return state;
      }

      const symbolDraws = { ...chart.draws[chart.symbolInfo.symbol] };
      Object.keys(symbolDraws).forEach((drawType) => {
        if (!DRAW_TOOLS[drawType]) {
          return;
        }

        const drawData = symbolDraws[drawType];
        let items = drawData?.data?.items ?? [];
        items = items.map((item) => ({
          ...item,
          selected: action.selectedItemIds.includes(item.id),
        }));

        symbolDraws[drawType] = {
          ...drawData,
          data: {
            ...drawData.data,
            items,
          },
        };
      });
      const draws = { ...chart.draws, [chart.symbolInfo.symbol]: symbolDraws };

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            draws,
          },
        },
      };
    }
    case Types.DRAW_DELETE: {
      // Filter all selected draws of selected chart

      const chart = state.charts[action.chartId];
      if (!chart || !chart?.draws) {
        return state;
      }

      const symbolDraws = { ...chart.draws[chart.symbolInfo.symbol] };
      Object.keys(symbolDraws).forEach((drawType) => {
        const drawData = symbolDraws[drawType]?.data;
        if (!drawData || !Array.isArray(drawData.items)) {
          return false;
        }

        const items = drawData.items.filter((item) => !item.selected);
        // 1 or more draw filtered
        if (items.length !== drawData.items.length) {
          symbolDraws[drawType] = {
            ...symbolDraws[drawType],
            data: {
              ...drawData,
              items,
            },
          };
        }
      });

      const draws = { ...chart.draws, [chart.symbolInfo.symbol]: symbolDraws };

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            draws,
          },
        },
      };
    }
    case Types.SET_DRAW_SETTING: {
      const { chartId, drawType, drawId, settings } = action;
      const chart = state.charts[chartId];
      if (!chart) return state;

      const symbolDraws = { ...chart.draws[chart.symbolInfo.symbol] };
      const drawsItems = symbolDraws[drawType]?.data?.items || [];
      const selectedDraw = drawsItems.find((draw) => draw.id === drawId);
      Object.assign(selectedDraw, settings);

      const draws = { ...chart.draws, [chart.symbolInfo.symbol]: symbolDraws };

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            draws,
          },
        },
      };
    }

    case Types.TOOGLE_ADD_LAYER_MODAL: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            showAddLayerModal: !chart.showAddLayerModal,
          },
        },
      };
    }
    case Types.TOGGLE_MODAL_JUMP_TO: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            showJumpToModal: !chart.showJumpToModal,
          },
        },
      };
    }
    case Types.TOGGLE_MODAL_EXPORT: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            showExportModal: !chart.showExportModal,
          },
        },
      };
    }
    case Types.BOT_SIGNALS_PANE_TOGGLE: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            showBotSignalsPane: !chart.showBotSignalsPane,
          },
        },
      };
    }
    case Types.BOT_SIGNALS_UPDATE_DATA: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            botSignalOptions: action.data.botSignalOptions,
          },
        },
      };
    }
    case Types.CHANGE_CHART_TYPE: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...action.chartUpdate,
          },
        },
      };
    }
    case Types.SET_LAYER_ID_SETTING: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            layerIdSetting: action.layerId,
          },
        },
      };
    }
    case Types.SET_LAYER_SETTING: {
      const chart = state.charts[action.chartId];
      if (!chart) {
        return state;
      }

      let layers = chart.layers || [];
      layers = layers.map((layer) => {
        if (layer.i !== action.layerId) {
          return layer;
        }

        return {
          ...layer,
          settings: action.settings,
        };
      });

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            layers,
          },
        },
      };
    }
    default:
      return state;
  }
};
// TODO: remove save chart to localstorage
const excludedActions = [Types.RESTORE_SETTING_FROM_LOCAL];
const watchAndSave = (state, action) => {
  const newState = chartSettings(state, action);

  if (action && excludedActions.includes(action.type)) {
    return newState;
  }

  const isChartsChanged =
    state && state.charts && state.charts !== newState.charts;
  const isLayoutChanged =
    state && state.layout && state.layout !== newState.layout;
  if (isChartsChanged || isLayoutChanged) {
    localStorage.setItem(
      LOCAL_SETTINGS_CACHE_KEY,
      JSON.stringify({
        charts: newState.charts,
        layout: newState.layout,
      })
    );
  }

  return newState;
};

export default watchAndSave;
