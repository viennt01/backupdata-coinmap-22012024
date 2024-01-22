import * as Types from '../const/ActionTypes';
export const initialState = [
  {
    price: [],
  },
];

const tradehistory = (state = initialState, action) => {
  switch (action.type) {
    case Types.FETCH_TRAHISTORY_SYMBOL_BINANCE:
      state = action.price;

      // return [...state];
      return [state];
    default:
      return [...state];
  }
};

export default tradehistory;
