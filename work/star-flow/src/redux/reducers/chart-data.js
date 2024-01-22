import {
  mapAccumulatedDeltaWithCandle,
  mapOrderFlowWithCandle,
  removeDiscontinuousCandles,
} from '@/utils/mapping';
import * as Types from '../const/ActionTypes';

export const initialState = {
  charts: {},
};

const chartData = (state = initialState, action) => {
  switch (action.type) {
    case Types.UPDATE_CHART_DATA: {
      const chart = state.charts[action.key] || {
        data: [],
      };
      const { candlestick } = action.data;
      const data = removeDiscontinuousCandles([...candlestick, ...chart.data]);

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.key]: {
            ...state.charts[action.key],
            data,
          },
        },
      };
    }
    case Types.REPLACE_CHART_DATA: {
      const chart = state.charts[action.key] || {
        data: [],
      };
      const data = removeDiscontinuousCandles([...action.data.data]);

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.key]: {
            ...chart,
            data,
          },
        },
      };
    }
    case Types.BOT_SIGNALS_UPDATE_DATA: {
      const chart = state.charts[action.chartId] || {
        data: [],
      };

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...chart,
            botSignals: action.data.botSignals,
            botSignalOptions: action.data.botSignalOptions,
          },
        },
      };
    }
    case Types.APPEND_CHART_DATA: {
      const chart = state.charts[action.chartId] || {
        data: [],
      };
      const { candle } = action;
      const data = removeDiscontinuousCandles([...chart.data, candle]);

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...state.charts[action.chartId],
            data,
          },
        },
      };
    }
    case Types.REPLACE_LAST_CANDLE: {
      const chart = state.charts[action.chartId] || {
        data: [],
      };
      const { candle } = action;
      let newData = [...chart.data];
      if (newData.length > 0) {
        newData.pop();
      }
      newData.push(candle);
      const data = removeDiscontinuousCandles(newData);

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...state.charts[action.chartId],
            data,
          },
        },
      };
    }
    case Types.UPDATE_CHART_ORDERFLOW: {
      const { chartId, data: orderFlow } = action;
      const chart = state.charts[chartId] || {
        data: [],
      };
      const newCandle = mapOrderFlowWithCandle(orderFlow, chart.data);

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...state.charts[action.chartId],
            data: newCandle,
          },
        },
      };
    }
    case Types.UPDATE_CHART_ACCUMULATED_DELTA: {
      const { chartId, data: accumulatedDelta } = action;
      const chart = state.charts[chartId] || {
        data: [],
      };
      const newCandle = mapAccumulatedDeltaWithCandle(
        accumulatedDelta,
        chart.data
      );

      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...state.charts[action.chartId],
            data: newCandle,
          },
        },
      };
    }
    case Types.DELETE_CHART: {
      const charts = { ...state.charts };
      delete charts[action.key];
      return {
        ...state,
        charts,
      };
    }
    case Types.UPDATE_CHART_SYMBOL: {
      return {
        ...state,
        charts: {
          ...state.charts,
          [action.chartId]: {
            ...state.charts[action.chartId],
            data: [],
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
            data: [],
          },
        },
      };
    }
    default:
      return state;
  }
};

export default chartData;
