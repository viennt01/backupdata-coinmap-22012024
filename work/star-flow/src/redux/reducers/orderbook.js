import * as Types from '../const/ActionTypes';
export const initialState = [
  {
    symbol: 'BTCUSDT',
    orderbook: [],
  },
];

const orderbook = (state = initialState, action) => {
  switch (action.type) {
    case Types.FETCH_LASTUPDATEID_ORDERBOOK_SYMBOL_BINANCE:
      state = action.orderbook;
      //return [...state];
      return [state];
    default:
      return [...state];
  }
};

export default orderbook;
