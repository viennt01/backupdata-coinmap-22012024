import * as Types from '../const/ActionTypes';
export const initialState = {
  symbol: 'BTCUSDT',
  candlestick: [],
  themeSettings: {
    activeKey: 'chadpepe',
    custom: {
      upColor: '#50B6D4',
      borderUpColor: '#50B6D4',
      dwColor: '#EC6649',
      borderDwColor: '#EC6649',
      vpAskDeltaColor: '#EC6649',
      vpBidDeltaColor: '#50B6D4',
    },
  },
  chartSettings: {},
};

const candlestick = (state = initialState, action) => {
  switch (action.type) {
    case Types.FETCH_CANDLESTICK_SYMBOL_BINANCE:
      // const newCandles = (action.data.candlestick || []).reverse();
      // state.candlestick.unshift(...newCandles);
      return {
        ...state,
        ...action.data,
        candlestick: [...action.data.candlestick, ...state.candlestick],
      };
    case Types.SET_THEME: {
      const custom =
        Object.keys(action.data.custom || {}).length === 0
          ? {}
          : {
              ...state.themeSettings.custom,
              ...(action.data.custom || {}),
            };

      return {
        ...state,
        themeSettings: {
          ...state.themeSettings,
          ...action.data,
          custom,
        },
      };
    }
    case Types.SET_CHART_SESSION: {
      return {
        ...state,
        chartSettings: {
          ...state.chartSettings,
          ...action.data,
        },
      };
    }
    default:
      return state;
  }
};

export default candlestick;
