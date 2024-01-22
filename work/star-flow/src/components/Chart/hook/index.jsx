import { calcCVDForNewCandle } from '@/config/consts/settings/cummulated-delta';
import { calcVwapIndicators } from '@/config/consts/settings/vwap';
import { initSocketWorker } from '@/wokers/socketWithWorker';
import { LOCAL_CACHE_KEYS, URLS } from '@/config';
import {
  formatCandleFromSocketDataV3,
  formatDateUtcCandle,
} from '@/utils/format';

import { CANDLE_LIMIT, LOADER_PERIOD_SEPARATOR } from '@/config/consts/data';
import {
  CUSTOM_DATA_IDENTITY,
  LAYERS_MAP,
  CHART_TYPES,
} from '@/config/consts/layer';
import { invetervalToNanoSeconds } from '@/utils/calculator';
import { exportIndicators } from '@/utils/indicator';
import { actAddError } from '@/redux/actions/common';
import { actToggleJumpToModal } from '@/redux/actions/setting';
import { last } from '@coinmap/react-stockcharts/lib/utils';

import { useEffect, useContext, useMemo, useCallback } from 'react';

import { ChartSectionContext } from '../../ChartSection';
import { localStore } from '@/utils/localStorage';

export const DEFAULT_WS_CLOSE = 1000;
export const MAX_SOCKET_UPDATE_DELAY = 500;
export const LIMIT_CANDLE_EXPORT = 10000;

export const EVENT_SOCKET = {
  PING: 'ping',
  CANDLESTICK: 'CANDLESTICK',
  WATCHLIST: 'WATCHLIST',
};

export const METHOD_SOCKET = {
  SUBSCRIBE: 'SUBSCRIBE',
  UNSUBSCRIBE: 'UNSUBSCRIBE',
};

export const getTypeOfData = () => {
  const type = localStore.get(LOCAL_CACHE_KEYS.XCME_TYPE_DATA);
  return type || 'dly';
};

export default function useSocket({
  chartInfoRef,
  currentSocketInfo,
  currentNeededDataKeys,
  setReloadChart,
  symbol,
  exchange,
  interval,
  currentWsRef,
}) {
  const contextValue = useContext(ChartSectionContext);

  const handleIntervalUpdateData = useCallback(() => {
    if (!contextValue.chartRef) {
      return;
    }
    if (
      Date.now() - currentSocketInfo.current.lastUpdateTime <
      MAX_SOCKET_UPDATE_DELAY
    ) {
      return;
    }

    const candle = last(contextValue.chartRef.state?.data);
    if (!candle) {
      return;
    }

    currentSocketInfo.current.lastUpdateTime = Date.now();
    contextValue.chartRef.replaceLastCandle(candle);
  }, [contextValue.chartRef, currentSocketInfo]);

  const connectSocket = () => {
    currentSocketInfo.current.lastUpdateTime = Date.now();

    if (currentSocketInfo.current.intervalUpdate) {
      clearInterval(currentSocketInfo.current.intervalUpdate);
    }

    const onMessage = (e) => {
      const data = JSON.parse(e.data);
      switch (data.e) {
        case 'ping': {
          const message = JSON.stringify({
            res: 'pong',
          });
          currentWsRef.current.ws.send(message);
          break;
        }
        case EVENT_SOCKET.CANDLESTICK: {
          const { interval, footprintSettings, timezone } =
            chartInfoRef.current;

          const tempCandle = formatCandleFromSocketDataV3(
            data,
            footprintSettings
          );
          const candle = {
            ...tempCandle,
            date: formatDateUtcCandle(tempCandle.opentime, timezone),
            closeDate: formatDateUtcCandle(tempCandle.closetime, timezone),
          };

          let lastCandle = {
            klineclosed: true,
          };
          if (!contextValue?.chartRef) {
            return;
          }

          const candles = contextValue.chartRef.state?.data || [];
          lastCandle = candles[candles.length - 1];
          if (!lastCandle) {
            return;
          }

          let previousCandle = lastCandle;
          const isUpdateCandle =
            !lastCandle.klineclosed && lastCandle.opentime === candle.opentime;
          if (isUpdateCandle) {
            previousCandle = candles[candles.length - 2];
          }

          if (!previousCandle) {
            return;
          }

          const currentDataKeys = Object.keys(currentNeededDataKeys.current);
          calcVwapIndicators({ candle, previousCandle, currentDataKeys });
          calcCVDForNewCandle({ candle, previousCandle });

          if (isUpdateCandle) {
            if (contextValue?.chartRef) {
              contextValue.chartRef.replaceLastCandle(candle);
            } else {
              console.log('no chart ref');
            }
          } else {
            // need to check missing candle and reload chart
            const lastSocketOpenTime =
              currentSocketInfo.current.lastSocketOpenTime;
            const intervalTime = invetervalToNanoSeconds(interval);
            if (
              lastSocketOpenTime &&
              candle.opentime - lastSocketOpenTime !== intervalTime
            ) {
              setReloadChart((prev) => prev + 1);
              return;
            }

            currentSocketInfo.current.lastSocketOpenTime = candle.opentime;

            if (contextValue?.chartRef) {
              contextValue.chartRef.appendData([candle]);
            } else {
              console.log('no chart ref');
            }
          }

          currentSocketInfo.current.lastUpdateTime = Date.now();
          break;
        }
      }
    };

    const onOpen = () => {
      const message = JSON.stringify({
        method: METHOD_SOCKET.SUBSCRIBE,
        event: EVENT_SOCKET.CANDLESTICK,
        params: [
          `${exchange.toLowerCase()}.${symbol.toLowerCase()}.${interval}.${getTypeOfData()}`,
        ],
      });

      if (currentWsRef.current) {
        currentWsRef.current.ws.send(message);
      }
    };

    currentWsRef.current = initSocketWorker({
      url: URLS.WS_STREAM_DATA,
      onMessage,
      onOpen,
    });

    currentWsRef.current.subscribeNewSymbol = subscribeNewSymbol;

    currentSocketInfo.current.intervalUpdate = setInterval(
      handleIntervalUpdateData,
      MAX_SOCKET_UPDATE_DELAY
    );
  };

  const subscribeNewSymbol = ({ newData, oldData }) => {
    const { oldExchange, oldSymbol, oldInterval } = oldData;
    const { newExchange, newSymbol, newInterval } = newData;
    if (currentWsRef.current) {
      const unSubcribeMessage = JSON.stringify({
        method: METHOD_SOCKET.UNSUBSCRIBE,
        event: EVENT_SOCKET.CANDLESTICK,
        params: [
          `${oldExchange.toLowerCase()}.${oldSymbol.toLowerCase()}.${oldInterval}.${getTypeOfData()}`,
        ],
      });
      currentWsRef.current.ws.send(unSubcribeMessage);

      const message = JSON.stringify({
        method: METHOD_SOCKET.SUBSCRIBE,
        event: EVENT_SOCKET.CANDLESTICK,
        params: [
          `${newExchange.toLowerCase()}.${newSymbol.toLowerCase()}.${newInterval}.${getTypeOfData()}`,
        ],
      });
      currentWsRef.current.ws.send(message);
    }
  };

  useEffect(() => {
    connectSocket();
    return () => {
      currentWsRef.current.ws.close();
    };
  }, []);

  return [];
}

export function useLogic({
  layers,
  symbol,
  interval,
  timezone,
  openNotification,
  contextValue,
  shouldLoadTo,
  loadData,
  showJumpToModal,
  dispatch,
  chartId,
  saveCanvasNode,
  chartType,
  loading,
  lastLoadedTime,
  asset,
  symbolType,
  exchange,
}) {
  const mineSaveCanvasNode = useCallback(
    (node) => {
      saveCanvasNode(node);
    },
    [saveCanvasNode]
  );

  const loadMore = useCallback(
    ({ startTime }) => {
      if (chartType === LAYERS_MAP.heatmap.id) {
        console.log('Load more heatmap history', startTime);
        return;
      }
      if (!shouldLoadTo.current || startTime < shouldLoadTo.current) {
        shouldLoadTo.current = startTime;
        if (!loading.current) {
          loadData();
        }
      }
    },
    [loadData, chartType]
  );

  const handleJumpTo = (timeStr) => {
    try {
      const time = new Date(timeStr).getTime();
      if (contextValue?.chartRef) {
        contextValue.chartRef.replaceAllData([]);
      }
      shouldLoadTo.current =
        time - CANDLE_LIMIT * invetervalToNanoSeconds(interval);
      lastLoadedTime.current =
        time + CANDLE_LIMIT * invetervalToNanoSeconds(interval);
      const newDomain = [-1.5 * CANDLE_LIMIT, -CANDLE_LIMIT / 2];
      loadData(newDomain);
    } catch (error) {
      dispatch(
        actAddError({
          message: 'Error when trying to jumb, please try again',
          closeable: true,
          delay: 20,
        })
      );
    }

    if (showJumpToModal) {
      dispatch(actToggleJumpToModal(chartId));
    }
  };

  const handleExport = async (formValues) => {
    const startTime = new Date(formValues.startTime).getTime();
    const endTime = new Date(formValues.endTime).getTime();

    await exportIndicators({
      layers,
      symbol,
      interval,
      timezone,
      startTime,
      endTime,
      limit: LIMIT_CANDLE_EXPORT,
      openNotification,
      asset,
      symbolType,
      exchange,
    });
  };

  // remove the chart in layer list to get the indicator list
  const indicatorList = useMemo(() => {
    const chartTypeIds = CHART_TYPES.map((type) => type.id);
    return layers.filter((layer) => !chartTypeIds.includes(layer.type));
  }, [layers]);

  return {
    indicatorList,
    handleExport,
    handleJumpTo,
    loadMore,
    mineSaveCanvasNode,
  };
}

export const getKeyDataLoader = (key) => {
  const separatorIndex = key.indexOf(LOADER_PERIOD_SEPARATOR);
  if (separatorIndex > -1) {
    const loaderKey = key.substring(0, separatorIndex);
    const identity = key.substring(
      separatorIndex + LOADER_PERIOD_SEPARATOR.length
    );

    const identityToProps = CUSTOM_DATA_IDENTITY[loaderKey].identityToProps;

    const props = identityToProps(identity);

    return [loaderKey, props];
  }

  return [key, {}];
};
