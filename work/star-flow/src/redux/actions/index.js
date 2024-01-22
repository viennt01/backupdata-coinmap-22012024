import { getTypeOfData } from '@/components/Chart/hook';
import * as Types from '@/redux/const/ActionTypes';
import callApi from '@/utils/apiCaller';

export const actFetchOderbookRequest_Lastupdateid = (symbol) => {
  return (dispatch) => {
    return callApi(`depth?symbol=${symbol}&limit=5`, 'GET', null).then(
      (res) => {
        if (!res) {
          return;
        }
        dispatch(actFetchOrderbook_Lastupdateid(res.data, symbol));
      }
    );
  };
};

export const actFetchOrderbook_Lastupdateid = (orderbook, symbol) => {
  return {
    type: Types.FETCH_LASTUPDATEID_ORDERBOOK_SYMBOL_BINANCE,
    orderbook: { symbol: symbol, orderbook: orderbook },
  };
};

export const fetchListPairs = (limit = 10) => {
  return async (dispatch) => {
    let pairs = [];
    while (true) {
      const res = await callApi(
        `/getsearchsymbol?limit=${limit}&offset=${pairs.length}&query=&type=&exchange=`,
        'GET',
        null
      );
      if (
        !res ||
        !res.data ||
        !Array.isArray(res.data) ||
        res.data[0]?.s === 'no_symbol'
      ) {
        break;
      }

      pairs = pairs.concat(res.data);

      if (res.data.length < limit) {
        break;
      }
    }

    return dispatch({
      type: Types.UPDATE_LIST_PAIRS,
      pairs,
    });
  };
};

// Get all data
export const searchSymbol = ({
  type = '',
  query = '',
  exchange = '',
  getAll = true,
}) => {
  return async (dispatch) => {
    const limit = 10;
    let pairs = [];
    while (true) {
      const res = await callApi(
        `/getsearchsymbol?limit=${limit}&offset=${pairs.length}&query=${query}&type=${type}&exchange=${exchange}`,
        'GET',
        null
      );
      if (
        !res ||
        !res.data ||
        !Array.isArray(res.data) ||
        res.data[0]?.s === 'no_symbol'
      ) {
        break;
      }

      pairs = pairs.concat(res.data);

      if (!getAll || res.data.length < limit) {
        break;
      }
    }

    return dispatch({
      type: Types.UPDATE_LIST_PAIRS,
      pairs,
    });
  };
};

export const fetchCandles = ({
  symbol,
  startTime,
  endTime,
  interval,
  signal,
  limit = 1000,
  asset = '',
  type,
  exchange,
}) => {
  return callApi(
    `/getcandlehistory?asset=${asset}&typedata=${getTypeOfData()}&type=${type}&exchange=${exchange}&symbol=${symbol}&resolution=${interval}&from=${startTime}&to=${endTime}&countback=${limit}`,
    'GET',
    undefined,
    {},
    signal
  );
};

export const actReplaceCandlesticks = (data, symbol, key) => {
  return {
    type: Types.REPLACE_CHART_DATA,
    data: { symbol, data },
    key,
  };
};

export const actPostTradehistory = (price) => {
  return (dispatch) => {
    dispatch(actTradehistory(price)); // dữ liệu lấy từ tradehistory
  };
};
export const actTradehistory = (price) => {
  return {
    type: Types.FETCH_TRAHISTORY_SYMBOL_BINANCE,
    price: price,
  };
};

export const actCloseChartById = (chartId) => ({
  type: Types.DELETE_CHART,
  chartId,
});

export const actAppendCandle = ({ chartId, candle }) => ({
  type: Types.APPEND_CHART_DATA,
  chartId,
  candle,
});

export const actReplaceLastCandle = ({ chartId, candle }) => ({
  type: Types.REPLACE_LAST_CANDLE,
  chartId,
  candle,
});

export const fetchPairInfo = ({ symbol }) => {
  return callApi(
    `/search?limit=30&query=${symbol}&type=&exchange=BINANCE`,
    'GET',
    null
  );
};
