import { combineReducers } from 'redux';

import orderbook, {
  initialState as initialStateOrderbook,
} from './redux/reducers/orderbook';
import candlestick, {
  initialState as initialStateCandlestick,
} from './redux/reducers/candlestick';
import tradehistory, {
  initialState as initialStateTradeHistory,
} from './redux/reducers/tradehistory';
import common, {
  initialState as initialStateCommon,
} from './redux/reducers/common';
import chartSettings, {
  defaultSettingsState as initialChartSettings,
} from './redux/reducers/chart-settings';
import chartData, {
  initialState as initialChartData,
} from './redux/reducers/chart-data';

import userProfile, {
  initialState as initialUseProfile,
} from './redux/reducers/userProfile';

export const initialState = {
  orderbook: initialStateOrderbook,
  candlestick: initialStateCandlestick,
  tradehistory: initialStateTradeHistory,
  common: initialStateCommon,
  chartSettings: initialChartSettings,
  chartData: initialChartData,
  userProfile: initialUseProfile,
};

// COMBINED REDUCERS
const reducers = {
  orderbook,
  candlestick,
  tradehistory,
  common,
  chartSettings,
  chartData,
  userProfile,
};

export default combineReducers(reducers);
