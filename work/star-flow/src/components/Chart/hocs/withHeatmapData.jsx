import { ChartSectionContext } from '@/components/ChartSection';
import Loading from '@/components/Loading';
import { URLS } from '@/config';
import { LAYERS_MAP, CHART_TYPES } from '@/config/consts/layer';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import ability, { symbolToFeatureId } from '@/utils/authorize/ability';
import {
  cloneHeatmap,
  combineHeatmapCandles,
  combineHeatmapTicks,
  combineToOneDot,
  fixLikeTickValue,
  ticksCombine,
  updateOneHeamapSnapshot,
} from '@/utils/calculator';
import { getChartConfig } from '@/utils/chart';
import { checkIsHeatmap } from '@/utils/common';
import { formatOrderbookHeatmap, snapshotToHeatmap } from '@/utils/format';
import { cLog } from '@/utils/log';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { last } from '@coinmap/react-stockcharts/lib/utils';
import { initSocketWorker } from '@/wokers/socketWithWorker';
import { GATEWAY, get } from '@/fetcher';
import { setShowNeedUpgradePlan } from '@/redux/actions/common';

import styles from './withHeatmap.module.scss';

const HEATMAP_BASE_INTERVAL = 500;
const DEFAULT_WS_CLOSE = 1000;
const MIN_HEATMAP_CANDLE_WIDTH = 2;
const MIN_HEATMAP_DATA_LENGTH = 6;
const MAIN_CHART_ID = 1;
const DEFAULT_HEATMAP_DATA = {
  bufferVolDot: [],
  bufferUpdate: [],
  data: null,
  offset: 0,
  dataZoom: null,
  offsetZoom: 0,
  currentInterval: HEATMAP_BASE_INTERVAL,
  newDomain: null,
  tickValue: null,
  originTickValue: null,
  snapshotPriceIndexMap: {
    bids: {},
    asks: {},
    t: 0,
  },
  snapshot: {
    t: 0,
  },
  cvd: {
    min: null,
    max: null,
    current: 0,
    lastUpdate: 0,
  },
  vwap: {
    baseVol: 0,
    vol: 0,
    lastUpdate: 0,
  },
};
const TICK_VALUE_RATIO = [1, 2, 5, 10, 15, 20, 25, 30, 35, 40, 50, 100, 150];

// eslint-disable-next-line react/display-name
export const withHeatmapData = (ChildComponent) => (props) => {
  const { onZoomY, chartId, saveCanvasNode, sectionRef } = props;
  const { chartSettings } = useSelector(
    (state) => ({
      chartSettings: state.chartSettings.charts[chartId],
    }),
    shallowEqual
  );
  const dispatch = useDispatch();

  const {
    chartType,
    layers,
    themeSettings,
    viewSettings,
    statusLineSettings,
    timeScaleSettings,
    priceScaleSettings,
    showAddLayerModal,
    showLayers,
    draws,
    timezone,
    symbolInfo,
  } = chartSettings;
  const isChartHeatmap = checkIsHeatmap(chartType);

  const { symbolType, symbol, interval } = symbolInfo;

  const [rerender, setRerender] = useState(false);
  const heatmapV1Data = useRef({ ...DEFAULT_HEATMAP_DATA });
  const intervalCheckVolDots = useRef(null);
  const contextValue = useContext(ChartSectionContext);
  const [initData, setInitData] = useState([]);
  const apiController = useRef([]);

  useEffect(() => {
    // abort all pending request
    if (apiController.current.length > 0) {
      apiController.current.forEach((controller) => controller.abort());
      apiController.current = [];
    }

    if (intervalCheckVolDots.current) {
      clearInterval(intervalCheckVolDots.current);
      intervalCheckVolDots.current = null;
    }
    if (heatmapV1Data.current.cntInstance) {
      return;
    }
    // Reset heatmap data
    heatmapV1Data.current = { ...DEFAULT_HEATMAP_DATA };
    setInitData([]);
  }, [symbol]);

  const canNotUseHeatmap = useMemo(
    () =>
      ability.cannot(
        PERMISSION_ACTIONS.VIEW,
        symbolToFeatureId(symbol),
        LAYERS_MAP.heatmap.featureId
      ),
    [symbol]
  );

  const updateHeatmapSnapshot = useCallback(({ asks, bids }) => {
    const { snapshot, snapshotPriceIndexMap } = heatmapV1Data.current;
    if (asks) {
      updateOneHeamapSnapshot(asks, snapshot.a, snapshotPriceIndexMap.asks);
    }
    if (bids) {
      updateOneHeamapSnapshot(bids, snapshot.b, snapshotPriceIndexMap.bids);
    }
  }, []);

  const updateDotForZoomData = useCallback(
    (data) => {
      const currentData = heatmapV1Data.current;
      let chartData = currentData.dataZoom;
      if (
        contextValue?.chartRef?.state?.data?.length &&
        contextValue?.chartRef?.state?.data?.length > 0
      ) {
        chartData = contextValue.chartRef.state.data;
      }

      // find and add dot to candle
      const opentime = data.t - (data.t % currentData.currentInterval);
      const dotCandleIndex =
        currentData.dataZoomMap[opentime] + currentData.offsetZoom;
      const dotCandle = chartData[dotCandleIndex];
      if (!dotCandle) {
        return;
      }

      // update vwap
      const vwapData = heatmapV1Data.current.vwap;
      dotCandle.vwap = vwapData.baseVol / vwapData.vol;

      dotCandle.close = data.p;
      if (dotCandle.high < data.p) {
        dotCandle.high = data.p;
      }
      if (dotCandle.low > data.p) {
        dotCandle.low = data.p;
      }

      if (Array.isArray(dotCandle.heatmap.dotVol)) {
        dotCandle.heatmap.dotVol.push(data);
        dotCandle.volume += data.sv + data.bv + data.uv;
        dotCandle.delta += data.bv - data.sv;
        dotCandle.cvd = data.cvd;
      } else {
        dotCandle.heatmap.dotVol = [data];
        dotCandle.volume += data.sv + data.bv + data.uv;
        dotCandle.delta += data.bv - data.sv;
        dotCandle.cvd = data.cvd;
      }
    },
    [contextValue]
  );

  const handleHeatmapV1VolumeDot = useCallback(
    (data) => {
      const currentData = heatmapV1Data.current;
      if (!currentData.data) {
        currentData.bufferVolDot.push(data);
        return;
      }

      // find and add dot to candle
      const opentime = data.t - (data.t % HEATMAP_BASE_INTERVAL);
      const dotCandleIndex = currentData.dataMap[opentime] + currentData.offset;
      const dotCandle = currentData.data[dotCandleIndex];
      if (!dotCandle) {
        const lastCandle = last(currentData.data);
        if (data.t > lastCandle.closetime) {
          currentData.bufferVolDot.push(data);
        }
        return;
      }

      // UPDATE CVD INFO
      if (
        heatmapV1Data.current.cvd.min === null ||
        heatmapV1Data.current.cvd.min > data.cvd
      ) {
        heatmapV1Data.current.cvd.min = data.cvd;
      }
      if (
        heatmapV1Data.current.cvd.max === null ||
        heatmapV1Data.current.cvd.max < data.cvd
      ) {
        heatmapV1Data.current.cvd.max = data.cvd;
      }
      if (heatmapV1Data.current.cvd.lastUpdate < data.t) {
        heatmapV1Data.current.cvd.current = data.cvd;
      }

      // UPDATE VWAP
      const vwapData = heatmapV1Data.current.vwap;
      const vol = data.sv + data.bv + data.uv;
      if (vwapData.lastUpdate < data.t) {
        vwapData.vol = data.vwap.V;
        vwapData.baseVol = data.vwap.P;
        vwapData.lastUpdate = data.t;
      }
      dotCandle.vwap = vwapData.baseVol / (vwapData.vol ?? 1);

      dotCandle.close = data.p;
      if (dotCandle.high < data.p) {
        dotCandle.high = data.p;
      }
      if (dotCandle.low > data.p) {
        dotCandle.low = data.p;
      }

      if (Array.isArray(dotCandle.heatmap.dotVol)) {
        dotCandle.heatmap.dotVol.push(data);
        dotCandle.volume += vol;
        dotCandle.delta += data.bv - data.sv;
      } else {
        dotCandle.heatmap.dotVol = [data];
        dotCandle.volume += vol;
        dotCandle.delta += data.bv - data.sv;
      }
      updateDotForZoomData(data);
    },
    [updateDotForZoomData]
  );

  const updateNewCandle = ({ data, heatmap, volume, delta }) => {
    const currentData = heatmapV1Data.current;
    const opentime = data.t - (data.t % HEATMAP_BASE_INTERVAL);
    const closetime = opentime + HEATMAP_BASE_INTERVAL - 1;

    const candleIndex = currentData.dataMap[opentime] + currentData.offset;
    const candle = currentData.data[candleIndex];
    if (!candle) {
      if (!Array.isArray(currentData.data)) {
        return;
      }
      // Add new candle
      const lastCandle = currentData.data[currentData.data.length - 1];
      if (!lastCandle) {
        return;
      }

      const newCandle = {
        high: lastCandle.close,
        low: lastCandle.close,
        open: lastCandle.close,
        close: lastCandle.close,
        opentime,
        date: new Date(opentime),
        closetime,
        closeDate: new Date(closetime),
        heatmap,
        volume,
        delta,
        cvd: lastCandle.cvd,
        vwap: currentData.vwap.baseVol / (currentData.vwap.vol ?? 1),
      };
      const dataLength = currentData.data.push(newCandle);
      currentData.dataMap[opentime] = dataLength - 1;
      // if (dataLength > MAX_DATA_LENGTH) {
      //   currentData.offset = currentData.offset || 0 - 1;
      //   currentData.data.shift();
      // }
      return;
    }

    // Update candle
    const dotVol = combineToOneDot([
      ...combineToOneDot(candle.heatmap.dotVol),
      ...combineToOneDot(heatmap.dotVol),
    ]);

    // Update price
    const lastPrice = heatmap.bestbid;
    candle.close = lastPrice;
    candle.low = candle.low > lastPrice ? lastPrice : candle.low;
    candle.low = candle.high < lastPrice ? lastPrice : candle.high;

    candle.heatmap = heatmap;
    candle.heatmap.dotVol = dotVol;
    candle.volume += volume;
    candle.delta += delta;
  };

  const updateNewZoomCandle = useCallback(
    async ({ data, heatmap: inputHeatmap, volume, delta }) => {
      const currentData = heatmapV1Data.current;
      const opentime = data.t - (data.t % currentData.currentInterval);
      const closetime = opentime + currentData.currentInterval - 1;
      const clonedHeatmap = cloneHeatmap(inputHeatmap);
      let chartData = currentData.dataZoom;
      if (
        contextValue?.chartRef?.state?.data?.length &&
        contextValue?.chartRef?.state?.data?.length > 0
      ) {
        chartData = contextValue.chartRef.state.data;
      }

      let heatmap = clonedHeatmap;
      if (heatmap.tv !== currentData.tickValue) {
        const { priceArr, volArr } = ticksCombine(
          clonedHeatmap,
          (item) => item[1],
          currentData.tickValue
        );
        heatmap.priceArr = priceArr;
        heatmap.volArr = volArr;
        heatmap.tv = currentData.tickValue;
        heatmap.dotVol = clonedHeatmap.dotVol;
        heatmap.bestbid = clonedHeatmap.bestbid;
        heatmap.bestask = clonedHeatmap.bestask;
      }

      const candleIndex =
        currentData.dataZoomMap?.[opentime] + currentData.offsetZoom;
      const candle = chartData?.[candleIndex];

      if (!candle) {
        if (!Array.isArray(chartData)) {
          return;
        }
        // Add new candle
        const lastCandle = chartData[chartData.length - 1];
        if (!lastCandle) {
          return;
        }

        heatmap.dotVol = combineToOneDot(heatmap.dotVol);
        const newCandle = {
          high: lastCandle.close,
          low: lastCandle.close,
          open: lastCandle.close,
          close: lastCandle.close,
          opentime,
          date: new Date(opentime),
          closetime,
          closeDate: new Date(closetime),
          heatmap,
          volume,
          delta,
          cvd: lastCandle.cvd,
          vwap: currentData.vwap.baseVol / (currentData.vwap.vol ?? 1),
        };
        const dataLength = chartData.length;
        currentData.dataZoomMap[opentime] = dataLength;
        // if (dataLength > MAX_DATA_LENGTH) {
        //   currentData.offsetZoom = currentData.offsetZoom || 0 - 1;
        //   chartData.shift();
        // }
        if (contextValue.chartRef) {
          contextValue.chartRef.appendData([newCandle]);
        } else {
          chartData.push(newCandle);
          setInitData(chartData);
        }
        return;
      }

      // Update candle
      const old = candle.heatmap;

      // Update price
      const lastPrice = heatmap.bestbid;
      candle.close = lastPrice;
      candle.low = candle.low > lastPrice ? lastPrice : candle.low;
      candle.low = candle.high < lastPrice ? lastPrice : candle.high;

      candle.heatmap = heatmap;
      candle.volume += volume;
      candle.delta += delta;
      candle.heatmap.dotVol = combineToOneDot([
        ...combineToOneDot(old.dotVol),
        ...combineToOneDot(heatmap.dotVol),
      ]);
      if (contextValue.chartRef) {
        contextValue.chartRef.replaceLastCandle(candle);
      } else {
        setRerender(!rerender);
      }
    },
    [contextValue.chartRef, rerender]
  );

  const handleHeatmapV1Update = useCallback(
    (data) => {
      const currentData = heatmapV1Data.current;
      if (!currentData.data) {
        currentData.bufferUpdate.push(data);
        return;
      }
      const { snapshot } = currentData;

      // Invalid update time, skip
      if (snapshot?.t && snapshot.t !== data.T) {
        return;
      }

      updateHeatmapSnapshot({ asks: data.a, bids: data.b });

      snapshot.t = data.t;
      const { priceArr, volArr, minSellPrice } = snapshotToHeatmap(snapshot);
      const heatmap = {
        priceArr,
        volArr,
        minSellPrice,
        dotVol: [],
        tv: data.tv,
        bestask: data.A,
        bestbid: data.B,
      };
      let volume = 0;
      let delta = 0;

      // UPDATE VWAP
      const vwapData = heatmapV1Data.current.vwap;
      // Check buffer dotvol
      const opentime = data.t - (data.t % HEATMAP_BASE_INTERVAL);
      const closetime = opentime + HEATMAP_BASE_INTERVAL - 1;
      if (
        Array.isArray(currentData.bufferVolDot) &&
        currentData.bufferVolDot.length > 0
      ) {
        const dots = [];
        const lastVolDots = currentData.bufferVolDot;
        currentData.bufferVolDot = [];
        lastVolDots.forEach((item) => {
          if (item.t < opentime) {
            return;
          }

          if (item.t >= opentime && item.t <= closetime) {
            dots.push(item);

            const vol = item.sv + item.bv + item.uv;
            if (item.t > vwapData.lastUpdate) {
              vwapData.vol = item.vwap.V;
              vwapData.baseVol = item.vwap.P;
              vwapData.lastUpdate = item.t;
            }

            volume += vol;
            delta += item.bv - item.sv;

            return;
          }

          currentData.bufferVolDot.push(item);
        });
        heatmap.dotVol = dots;
      }

      updateNewCandle({ data, heatmap, volume, delta });

      new Promise((resolve) => {
        return resolve(updateNewZoomCandle({ data, heatmap, volume, delta }));
      });
    },
    [updateHeatmapSnapshot, updateNewZoomCandle]
  );

  const handleHeatmapV1Data = useCallback(
    (data) => {
      const eventHandlers = {
        volumeDot: handleHeatmapV1VolumeDot,
        heatmapUpdate: handleHeatmapV1Update,
      };

      const handler = eventHandlers[data.e];
      if (handler) {
        return handler(data);
      }
      return false;
    },
    [handleHeatmapV1VolumeDot, handleHeatmapV1Update]
  );

  const connectHeatMapV1 = useCallback(
    (symbol) => {
      if (canNotUseHeatmap) {
        dispatch(setShowNeedUpgradePlan(true));
        return;
      }
      const onMessage = (e) => {
        if (heatmapV1Data.current.shouldCloseWs) {
          return;
        }
        const data = JSON.parse(e.data);
        handleHeatmapV1Data(data);
      };

      const onOpen = () => {
        getHeatmapSnapshot(symbol);
      };

      heatmapV1Data.current.shouldCloseWs = false;
      heatmapV1Data.current.cntInstance = initSocketWorker({
        url: `${URLS.WS_HEATMAP}/heatmap?symbol=${symbol.toUpperCase()}`,
        onMessage,
        onOpen,
      });
    },
    [handleHeatmapV1Data, getHeatmapSnapshot, dispatch, canNotUseHeatmap]
  );

  const handleUpdateSnapshot = useCallback(() => {
    const currentData = heatmapV1Data.current;
    const { snapshot, bufferVolDot, bufferUpdate } = currentData;
    heatmapV1Data.current.bufferVolDot = [];
    heatmapV1Data.current.bufferUpdate = [];
    const dots = [];
    let volume = 0;
    let low, high, open;
    if (Array.isArray(bufferVolDot) && bufferVolDot.length > 0) {
      open = bufferVolDot[0].p;
      bufferVolDot.forEach((item) => {
        if (item.t <= snapshot.t) {
          return;
        }
        if (!low || low > item.p) {
          low = item.p;
        }
        if (!high || high < item.p) {
          high = item.p;
        }

        dots.push(item);
        volume += item.sv + item.bv + item.uv;
      });
    }

    if (Array.isArray(bufferUpdate) && bufferUpdate.length > 0) {
      bufferUpdate
        .sort((a, b) => a.t - b.t)
        .forEach((item) => {
          if (item.t <= snapshot.t) {
            return;
          }

          updateHeatmapSnapshot({ asks: item.a, bids: item.b });
        });
      snapshot.t = bufferUpdate[bufferUpdate.length - 1].t;
    }
    const lastUpdateTime = snapshot.t || Date.now();
    const opentime = lastUpdateTime - (lastUpdateTime % HEATMAP_BASE_INTERVAL);
    const closetime = opentime + HEATMAP_BASE_INTERVAL - 1;
    const heatmap = formatOrderbookHeatmap({
      bids: snapshot.b,
      asks: snapshot.a,
    });
    heatmap.dotVol = dots;

    const lastUpdate = bufferUpdate[bufferUpdate.length - 1];
    if (lastUpdate) {
      heatmap.tv = lastUpdate.tv;
      heatmap.bestask = lastUpdate.A;
      heatmap.bestbid = lastUpdate.B;
    } else {
      heatmap.tv = snapshot.tv;
      heatmap.bestask = snapshot.A;
      heatmap.bestbid = snapshot.B;
    }

    const candle = {
      high: high || heatmap.bestask,
      low: low || heatmap.bestbid,
      open: open || heatmap.bestbid,
      close: heatmap.bestask,
      opentime,
      date: new Date(opentime),
      closetime,
      closeDate: new Date(closetime),
      heatmap,
      volume,
      delta: 1,
    };
    currentData.dataMap = {
      [opentime]: 0,
    };
    currentData.dataZoomMap = {
      [opentime]: 0,
    };
    if (!Array.isArray(currentData.data)) {
      currentData.data = [candle];
      currentData.dataMap = { [opentime]: 0 };
      currentData.dataZoom = [candle];
      currentData.dataZoomMap = { [opentime]: 0 };
    } else {
      const dataLength = currentData.data.push(candle);
      currentData.dataMap[opentime] = dataLength - 1;
      const dataZoomLength = currentData.dataZoom.push(candle);
      currentData.dataZoomMap[opentime] = dataZoomLength - 1;
    }

    if (contextValue.chartRef) {
      contextValue.chartRef.replaceLastCandle(currentData.data);
    } else {
      setInitData([...currentData.dataZoom]);
    }
  }, [updateHeatmapSnapshot, contextValue.chartRef]);

  const getHeatmapSnapshot = useCallback(
    async (symbol) => {
      try {
        apiController.current.push(new AbortController());
        const { signal } =
          apiController.current[apiController.current.length - 1];

        const data = await get({
          gw: GATEWAY.API_HEATMAP_GW,
          options: { signal: signal },
        })(`/heatmap?symbol=${symbol.toUpperCase()}`);

        const priceIndexMap = {
          bids: {},
          asks: {},
        };
        heatmapV1Data.current.snapshot = {
          ...data,
          t: 0,
          b: Object.keys(data.b).map((price, index) => {
            priceIndexMap.bids[price] = index;
            const vol = data.b[price];
            return [price, vol];
          }),
          a: Object.keys(data.a)
            .reverse()
            .map((price, index) => {
              priceIndexMap.asks[price] = index;
              const vol = data.a[price];
              return [price, vol];
            }),
        };
        heatmapV1Data.current.snapshotPriceIndexMap = priceIndexMap;
        if (heatmapV1Data.current.tickValue === null) {
          heatmapV1Data.current.tickValue = data.tv;
          heatmapV1Data.current.originTickValue = data.tv;
        }
        handleUpdateSnapshot();
      } catch (error) {
        cLog('load heatmap data error', error);
      }
    },
    [handleUpdateSnapshot]
  );

  useEffect(() => {
    if (intervalCheckVolDots.current) {
      clearInterval(intervalCheckVolDots.current);
      intervalCheckVolDots.current = null;
    }
    if (heatmapV1Data.current.cntInstance) {
      return;
    }
    // Reset heatmap data
    heatmapV1Data.current = { ...DEFAULT_HEATMAP_DATA };
    setInitData([]);

    connectHeatMapV1(symbol);
    intervalCheckVolDots.current = setInterval(() => {
      const heatmapData = heatmapV1Data.current;
      if (
        !Array.isArray(heatmapData.bufferVolDot) ||
        heatmapData.bufferVolDot.length === 0
      ) {
        return;
      }
      const dots = heatmapData.bufferVolDot;
      heatmapData.bufferVolDot = [];
      dots.forEach((dot) => {
        handleHeatmapV1VolumeDot(dot);
      });
    }, 1000);

    return () => {
      if (heatmapV1Data?.current?.cntInstance) {
        cLog('should close heatmap socket');
        const heatmapWs = heatmapV1Data.current.cntInstance?.ws;
        cLog('heatmapWs', heatmapWs);
        if (heatmapWs?.close) {
          heatmapWs.close(DEFAULT_WS_CLOSE);
        }
        heatmapV1Data.current.cntInstance = null;
      }
    };
  }, [symbol, interval]);

  useEffect(() => {
    return () => {
      if (heatmapV1Data?.current?.cntInstance) {
        cLog('should close heatmap socket');
        const heatmapWs = heatmapV1Data.current.cntInstance?.ws;
        if (heatmapWs?.close) {
          heatmapWs.close(DEFAULT_WS_CLOSE);
        }
        heatmapV1Data.current.cntInstance = null;
      }
    };
  }, []);

  const handleUpdateCombineTick = useCallback(
    (props, state) => {
      // Delay until chartRef
      if (!contextValue.chartRef) {
        heatmapV1Data.current.onChartRefCallback = () => {
          handleUpdateCombineTick(props, state);
        };
        return;
      }
      setTimeout(() => onZoomY(props, state), 0);

      const currentData = heatmapV1Data.current;
      const dataZoom = contextValue.chartRef.state.data;

      const currentTickValue = currentData.tickValue;
      const originTickValue = currentData.originTickValue || 1;
      const { yScale } = getChartConfig(state || {}, MAIN_CHART_ID);
      const y0 = yScale(0);
      const tickHeight = y0 - yScale(currentTickValue);
      const minTickHeight = 9;
      let newTickValue = currentData.tickValue;
      if (
        tickHeight < minTickHeight ||
        (tickHeight > 2.3 * minTickHeight &&
          currentTickValue >= 2 * originTickValue)
      ) {
        for (let i = 0; i < TICK_VALUE_RATIO.length; i += 1) {
          const ratio = TICK_VALUE_RATIO[i];
          newTickValue = fixLikeTickValue(
            originTickValue * ratio,
            originTickValue
          );
          const newTickHeight = y0 - yScale(newTickValue);
          if (newTickHeight >= minTickHeight) {
            break;
          }
        }
      }

      if (currentData.tickValue === newTickValue) {
        if (currentData.timeoutZoomY) {
          delete currentData.timeoutZoomY;
        }
        return;
      }

      currentData.tickValue = newTickValue;
      const combinedData = combineHeatmapTicks(
        dataZoom,
        currentData.data,
        currentData.dataMap,
        currentData.offset,
        newTickValue
      );

      if (contextValue.chartRef) {
        contextValue.chartRef.replaceAllData(combinedData);
      } else {
        setInitData(combinedData);
      }

      if (currentData.timeoutZoomY) {
        delete currentData.timeoutZoomY;
      }
    },
    [onZoomY, contextValue.chartRef]
  );

  const delayHandleUpdateCombineTick = useCallback(
    (props, state) => {
      const currentData = heatmapV1Data.current;
      if (currentData.timeoutZoomY) {
        clearTimeout(currentData.timeoutZoomY);
      }

      currentData.timeoutZoomY = setTimeout(() => {
        handleUpdateCombineTick(props, state);
      }, 100);
    },
    [handleUpdateCombineTick]
  );

  const onZoomX = useCallback(
    (props, state) => {
      const currentData = heatmapV1Data.current;
      if (!isChartHeatmap) {
        return;
      }

      try {
        if (currentData.updatingZoom) {
          return;
        }
        currentData.updatingZoom = true;
        const { xScale, fullData } = state;
        const currentDomain = xScale.domain();

        const candleWidth = xScale(2) - xScale(1);
        const [first, second] = fullData;
        let ratio = 1;
        if (candleWidth < MIN_HEATMAP_CANDLE_WIDTH * 0.8) {
          ratio = 0.5;
        } else if (candleWidth / MIN_HEATMAP_CANDLE_WIDTH > 2.4) {
          ratio = 2;
        } else {
          return;
        }
        let newInterval = Math.max(
          (second.opentime - first.opentime) / ratio,
          HEATMAP_BASE_INTERVAL
        );
        newInterval = newInterval - (newInterval % HEATMAP_BASE_INTERVAL);

        if (newInterval !== currentData.currentInterval) {
          const {
            newData: combinedData,
            newDataMap,
            newDomain,
          } = combineHeatmapCandles(
            currentData.data,
            fullData,
            newInterval,
            currentDomain,
            ratio,
            currentData.tickValue
          );

          if (
            combinedData.length < MIN_HEATMAP_DATA_LENGTH ||
            combinedData.length < newDomain[0]
          ) {
            return;
          }
          currentData.currentInterval = newInterval;
          currentData.dataZoom = combinedData;
          currentData.dataZoomMap = newDataMap;
          currentData.offsetZoom = 0;
          currentData.newDomain = newDomain;
          if (contextValue.chartRef) {
            contextValue.chartRef.replaceAllData(combinedData);
            contextValue.chartRef.updateXDomain(newDomain);
          } else {
            setRerender(!rerender);
          }
        }
      } catch (error) {
        cLog('update zoom error', error, state);
      } finally {
        setTimeout(() => {
          currentData.updatingZoom = false;
        }, 100);

        if (currentData.timeoutZoomX) {
          delete currentData.timeoutZoomX;
        }
      }
    },
    [isChartHeatmap, rerender, contextValue.chartRef]
  );

  const delayHandleZoomX = useCallback(
    (props, state) => {
      const currentData = heatmapV1Data.current;
      if (currentData.timeoutZoomX) {
        clearTimeout(currentData.timeoutZoomX);
      }
      currentData.timeoutZoomX = setTimeout(() => {
        onZoomX(props, state);
      }, 100);
    },
    [onZoomX]
  );

  const saveChartRef = useCallback(
    (node) => {
      contextValue.chartRef = node;
      cLog('chartRef', node);

      if (heatmapV1Data.current.onChartRefCallback) {
        heatmapV1Data.current.onChartRefCallback();
      }
    },
    [contextValue]
  );

  const mineSaveCanvasNode = useCallback(
    (node) => {
      if (saveCanvasNode) {
        saveCanvasNode(node);
      }
      if (!node) {
        return;
      }

      cLog('handle combine tick');
      handleUpdateCombineTick(node.state, node.state);
    },
    [saveCanvasNode, handleUpdateCombineTick]
  );

  // remove the chart in layer list to get the indicator list
  const indicatorList = useMemo(() => {
    const chartTypeIds = CHART_TYPES.map((type) => type.id);
    return layers.filter((layer) => !chartTypeIds.includes(layer.type));
  }, [layers]);

  if (canNotUseHeatmap) {
    return (
      <div className={styles.upgradeAlert}>
        <h4>Please upgrade your plan to use Heatmap</h4>
        <button
          className="btn btn-primary btn-cm-primary mt-3"
          onClick={() => {
            dispatch(setShowNeedUpgradePlan(true));
          }}
        >
          Upgrade
        </button>
      </div>
    );
  }

  if ((heatmapV1Data.current.dataZoom?.length || 0) < 2) {
    return <Loading />;
  }

  return (
    <ChildComponent
      {...props}
      ref={saveChartRef}
      loading={false}
      ratio={1}
      draws={draws[symbol]}
      interval={interval}
      layers={layers}
      chartType={chartType}
      chartId={chartId}
      data={initData}
      dispatch={dispatch}
      onZoomX={delayHandleZoomX}
      onZoomY={delayHandleUpdateCombineTick}
      themeSettings={themeSettings}
      saveCanvasNode={mineSaveCanvasNode}
      viewSettings={viewSettings}
      statusLineSettings={statusLineSettings}
      symbolInfo={symbolInfo}
      timeScaleSettings={timeScaleSettings}
      priceScaleSettings={priceScaleSettings}
      heatmapData={heatmapV1Data.current}
      showAddLayerModal={showAddLayerModal}
      symbol={symbol}
      showLayers={showLayers}
      sectionRef={sectionRef}
      indicatorList={indicatorList}
      timezone={timezone}
      symbolType={symbolType}
    />
  );
};
