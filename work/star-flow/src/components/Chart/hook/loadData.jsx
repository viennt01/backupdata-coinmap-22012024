import { RETRY_REQUEST_LIMIT } from '@/config/consts/data';
import { actAddError } from '@/redux/actions/common';
import { candleIntervalsMap } from '@/config/consts/interval';
import { GATEWAY, get } from '@/fetcher';
import { ABORT_MESSAGE } from '@/utils/apiCaller';
import { getCurrentFootprintSetting } from '@/utils/chart';
import { formatAggTradesV3 } from '@/utils/format';
import { getTypeOfData } from '@/components/Chart/hook';
import { getAccumulatedDelta, getOrderFlow } from '../fetcher';

export default function useLoader({
  dispatch,
  contextValue,
  loadDataCounter,
  footprintSettings,
  footprintChart,
  createAbortController,
  loadOrderFlowCounter,
  asset,
  symbolType,
  exchange,
}) {
  const fetchAccumulatedDelta = async (
    { startTime, endTime, interval, symbol },
    dispatch
  ) => {
    // const expectedCount = calcExpectedCandleCount({ startTime, endTime, interval });
    try {
      loadDataCounter.current.accumulatedDelta++;

      const signal = createAbortController();

      // Load with retry
      for (let i = 0; i < RETRY_REQUEST_LIMIT; i++) {
        try {
          const res = await getAccumulatedDelta({
            symbol,
            interval,
            startTime,
            endTime,
            signal,
            asset,
            type: symbolType,
            exchange,
          });

          if (res?.message === ABORT_MESSAGE) break;

          if (!res || !Array.isArray(res)) {
            dispatch(
              actAddError({
                message: 'No accumulated delta data response from server',
                delay: 3000,
              })
            );
            break;
          }

          if (Array.isArray(res)) {
            const dataToMap = res.map((item) => ({
              opentime: item.t,
              data: { cvd: item.cvd },
            }));
            if (contextValue.chartRef) {
              contextValue.chartRef.mapDataWithCandles(dataToMap);
            }
          }
          break;
        } catch (error) {
          dispatch(
            actAddError({
              message: 'An error occur when loading order flow data',
              delay: 3000,
            })
          );
        }
      }
    } catch (error) {
      dispatch(
        actAddError({
          message: 'An error occur when loading order flow data',
          delay: 3000,
        })
      );
    } finally {
      loadDataCounter.current.accumulatedDelta--;
    }
  };
  const fetchVWAP = async (
    {
      layerId,
      startTime,
      endTime,
      interval,
      symbol,
      period = 'Day',
      source = 'hl2',
      bandsmultiplier = '1,2,3',
    },
    dispatch
  ) => {
    try {
      loadDataCounter.current.vwap++;
      const uri = `/getindicatorsvwap?symbol=${symbol}&exchange=${exchange}&asset=${asset}&type=${symbolType}&typedata=${getTypeOfData()}&resolution=${interval}&from=${startTime}&to=${endTime}&countback=1000&period=${period.toLowerCase()}&source=${source}&bandsmultiplier=${bandsmultiplier}`;

      const signal = createAbortController();

      // Load with retry
      for (let i = 0; i < RETRY_REQUEST_LIMIT; i++) {
        try {
          const res = await get({
            gw: GATEWAY.API_MAIN_GW,
            options: { signal },
          })(uri);

          if (res?.message === ABORT_MESSAGE) break;

          if (!res || !Array.isArray(res)) {
            dispatch(
              actAddError({
                message: 'No vwap data response from server',
                delay: 3000,
              })
            );
            break;
          }

          if (Array.isArray(res)) {
            const dataToMap = res.map((item) => ({
              opentime: item.t,
              data: { vwap: item.data.vwap, vwapData: item.data },
            }));
            if (contextValue.chartRef) {
              contextValue.chartRef.mapIndicatorWithCandles(layerId, dataToMap);
            }
          }
          break;
        } catch (error) {
          console.log('error', error);
          dispatch(
            actAddError({
              message: 'An error occur when loading VWAP data',
              delay: 3000,
            })
          );
        }
      }
    } catch (error) {
      console.log('error', error);
      dispatch(
        actAddError({
          message: 'An error occur when loading VWAP data',
          delay: 3000,
        })
      );
    } finally {
      loadDataCounter.current.vwap--;
    }
  };

  const fetchOrderFlow = async ({ startTime, endTime, interval, symbol }) => {
    // const expectedCount = calcExpectedCandleCount({ startTime, endTime, interval });
    try {
      loadOrderFlowCounter.current++;

      const signal = createAbortController();

      // Load with retry
      for (let i = 0; i < RETRY_REQUEST_LIMIT; i++) {
        try {
          const res = await getOrderFlow({
            symbol,
            interval,
            startTime,
            endTime,
            signal,
            asset,
            type: symbolType,
            exchange,
          });

          if (res?.message === ABORT_MESSAGE) break;

          if (!res || !Array.isArray(res)) {
            dispatch(
              actAddError({
                message: 'No orderflow data response from server',
                delay: 3000,
              })
            );
            break;
          }

          res.forEach((item) => {
            item.orderFlow = formatAggTradesV3(item.aggs, item.tv);
            item.openTime = item.t;
          });

          if (contextValue.chartRef) {
            if (footprintChart) {
              const settingsFp = getCurrentFootprintSetting(footprintSettings, {
                symbol,
                interval,
              });
              contextValue.chartRef.mapOrderFlowWithCandles(res, settingsFp);
            } else {
              contextValue.chartRef.mapOrderFlowWithCandles(res);
            }
          }
          break;
        } catch (error) {
          dispatch(
            actAddError({
              message: 'An error occur when loading order flow data',
              delay: 3000,
            })
          );
          console.log('fetchOrderFlow', error);
        }
      }
    } catch (error) {
      dispatch(
        actAddError({
          message: 'An error occur when loading order flow data',
          delay: 3000,
        })
      );
    } finally {
      loadOrderFlowCounter.current--;
    }
  };

  return {
    fetchAccumulatedDelta,
    fetchVWAP,
    fetchOrderFlow,
  };
}
