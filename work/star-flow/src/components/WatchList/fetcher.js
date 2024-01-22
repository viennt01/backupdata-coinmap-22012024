import { GATEWAY, post, get, deleteGW } from '@/fetcher';
import { API_MAIN } from '@/fetcher/endpoint';

// get all symbols of watch list
export const getWatchList = () => {
  return get({ gw: GATEWAY.API_MAIN_GW })(API_MAIN.WATCH_LIST_LIST);
};

// add symbol to watch list
export const createWatchList = (data) => {
  return post({ data, gw: GATEWAY.API_MAIN_GW })(API_MAIN.WATCH_LIST_CREATE);
};

// delete symbol of watch list
export const deleteWatchList = (id, type) => {
  return deleteGW({ gw: GATEWAY.API_MAIN_GW })(
    `${API_MAIN.WATCH_LIST_DELETE}/${id}?type=${type}`
  );
};

// delete all symbol of watch list
export const deleteAllWatchList = () => {
  return deleteGW({ gw: GATEWAY.API_MAIN_GW })(API_MAIN.WATCH_LIST_DELETE);
};

// get symbols for search list
export const getSymbolSearchList = async ({ limit, query, type, exchange }) => {
  try {
    let pairs = [];
    while (true) {
      const queryString = `?limit=${limit}&offset=${pairs.length}&query=${query}&type=${type}&exchange=${exchange}`;
      const res = await get({ gw: GATEWAY.API_MAIN_GW })(
        API_MAIN.SYMBOL_SEARCH_LIST + queryString
      );
      if (!res || !Array.isArray(res) || res[0]?.s === 'no_symbol') {
        break;
      }

      pairs = pairs.concat(res);

      if (res.length < limit) {
        break;
      }
    }
    return pairs;
  } catch (err) {}
};
