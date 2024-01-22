import { candleIntervalsMap } from '@/config/consts/interval';
import { GATEWAY, get } from '@/fetcher';
import { BOT_SIGNALS_UPDATE_DATA } from '../const/ActionTypes';
import { actAddError } from './common';

export const actUpdateBotSignals = (chartId, botSignals, botSignalOptions) => ({
  type: BOT_SIGNALS_UPDATE_DATA,
  chartId,
  data: {
    botSignals,
    botSignalOptions,
  },
});

export const actFetchBotSignals = (options) => {
  return async (dispatch) => {
    const { chartId, interval, ...params } = options;
    try {
      if (params.from) {
        params.from = new Date(params.from).getTime();
      }
      if (params.to) {
        params.to = new Date(params.to).getTime();
      }

      const query = new URLSearchParams(params).toString();
      const url = `?resolution=${candleIntervalsMap[interval]}&${query}`;
      const result = await get({ gw: GATEWAY.BOT_COINMAP_GW })(url);

      if (!Array.isArray(result?.data)) {
        throw new Error('Bot signals result is not an array!');
      }

      const signalsMap = result.data.reduce((tmp, signal) => {
        tmp[signal.t] = signal;
        return tmp;
      }, {});

      const signalData = { signalsMap, ...result };
      return dispatch(actUpdateBotSignals(chartId, signalData, options));
    } catch (error) {
      console.log('load signals error', error);
      dispatch(
        actAddError({
          message: 'Can not get bot signals',
          delay: 20,
        })
      );
      return dispatch(actUpdateBotSignals(chartId, {}, options));
    }
  };
};
