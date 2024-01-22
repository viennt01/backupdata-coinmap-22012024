import {
  CANDLE_LIMIT,
  ERROR_TYPES,
  LOADER_PERIOD_SEPARATOR,
  RETRY_REQUEST_LIMIT,
} from '@/config/consts/data';
import { CUSTOM_DATA_IDENTITY, LAYERS_MAP } from '@/config/consts/layer';
import VIEW_SETTINGS from '@/config/consts/settings/view';
import { fetchCandles } from '@/redux/actions';
import { actAddError } from '@/redux/actions/common';
import { ABORT_MESSAGE } from '@/utils/apiCaller';
import {
  intervalToSeconds,
  invetervalToNanoSeconds,
  sliceToSmallPeriods,
} from '@/utils/calculator';
import { getCurrentFootprintSetting } from '@/utils/chart';
import { isFootprintChart } from '@/utils/common';
import { getDateUTCStart } from '@/utils/datetime';
import { convertCandlestickV3 } from '@/utils/format';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { ChartSectionContext } from '../ChartSection';
import Loading from '../Loading';
import Chart from './Chart';
import ModalJumpTo from './components/ModalJumpTo';
import PaneBotSignalsWrapper from './components/PaneBotSignalsWrapper';
import useViewSettings from './hocs/view-settings';
import ability, { symbolToFeatureId } from '@/utils/authorize/ability';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { FEATURE_IDS } from '@/config/consts/features';
import ModalExport from './components/ModalExport';
import useNotification from '@/hook/notification';

import useSocket, {
  useLogic,
  getKeyDataLoader,
  LIMIT_CANDLE_EXPORT,
} from './hook';
import useLoader from './hook/loadData';

// For load data, socket connect, layers handler
const ChartWrapper = ({
  chartId,
  width,
  height,
  saveCanvasNode,
  sectionRef,
  showTopRatio,
  heatmapColor,
  initData,
  setReloadChart,
  isFullScreen,
  currentWsRef,
}) => {
  const [openNotification, contextHolder] = useNotification();
  const contextValue = useContext(ChartSectionContext);
  const { botSignals, chartSettings, common } = useSelector(
    (state) => ({
      botSignals: state.chartData.charts[chartId]?.botSignals || {},
      domain: state.chartData.charts[chartId]?.domain || null,
      chartSettings: state.chartSettings.charts[chartId],
      common: state.common,
    }),
    shallowEqual
  );

  const viewSettings = useSelector(
    (state) =>
      state.chartSettings.charts[chartId].viewSettings || VIEW_SETTINGS,
    shallowEqual
  );

  const loading = useRef(false);
  const shouldLoadTo = useRef(null);
  const lastLoadedTime = useRef(new Date().getTime());
  const loadOrderFlowCounter = useRef(0);
  const loadDataCounter = useRef({
    accumulatedDelta: 0,
    vwap: 0,
  });

  const {
    themeSettings,
    showLayers,
    layers,
    draws,
    showAddLayerModal,
    showJumpToModal,
    showExportModal,
    chartType,
    showBotSignalsPane,
    footprintSettings,
    statusLineSettings,
    timeScaleSettings,
    priceScaleSettings,
    timezone,
    symbolInfo,
  } = chartSettings;

  const { exchange, symbol, ticksOfSymbol, symbolType, interval, asset } =
    symbolInfo;

  const footprintChart = isFootprintChart(chartType);

  useViewSettings({ chartId });

  const dispatch = useDispatch();

  const [rerender, setRerender] = useState(false);
  const [data, setData] = useState(initData || []);
  // FLAG FOR FEATURE: SUBSCRIBE NEW SYMBOL WHEN USER CHANGE SYMBOL FROM WATCH LIST AND MODAL SERCH
  const [currentSymbol, setCurrentSymbol] = useState(symbol);
  const [currentExchange, setCurrentExchange] = useState(exchange);

  const currentNeededDataKeys = useRef(null);
  const currentData = useRef(initData || []);
  const currentSocketInfo = useRef({
    intervalUpdate: 0,
    lastUpdateTime: 0,
    lastSocketOpenTime: 0,
  });

  const chartInfoRef = useRef({
    symbol,
    interval,
    footprintSettings: null,
    chartType,
    timezone,
  });

  useEffect(() => {
    if (!Array.isArray(footprintSettings)) {
      return;
    }
    const currentFootprintSettings = getCurrentFootprintSetting(
      footprintSettings,
      {
        symbol,
        interval,
      }
    );

    chartInfoRef.current.footprintSettings = currentFootprintSettings;
    chartInfoRef.current.symbol = symbol;
    chartInfoRef.current.interval = interval;
    chartInfoRef.current.chartType = chartType;
    chartInfoRef.current.timezone = timezone;
  }, [interval, symbol, footprintSettings, chartType, timezone]);

  const apiController = useRef([]);

  // create abort controller for each request
  const createAbortController = () => {
    const abortController = new AbortController();
    apiController.current.push(abortController);
    return abortController.signal;
  };

  // abort all pending api
  const clearAbortController = () => {
    if (apiController.current.length > 0) {
      apiController.current.forEach((controller) => controller.abort());
      apiController.current = [];
    }
  };

  useEffect(() => {
    clearAbortController();
    loading.current = false;
    setData([]);
  }, [symbol]);

  const { fetchAccumulatedDelta, fetchVWAP, fetchOrderFlow } = useLoader({
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
  });

  // handle all load data by key
  const dataLoaders = useMemo(
    () => ({
      accumulatedDelta: fetchAccumulatedDelta,
      vwap: fetchVWAP,
      orderflow: fetchOrderFlow,
    }),
    [fetchAccumulatedDelta, fetchVWAP, fetchOrderFlow]
  );

  const loadDataForNewKeys = useCallback(
    (newDataKeys) => {
      if (
        !contextValue.chartRef ||
        !Array.isArray(contextValue.chartRef?.state?.data) ||
        contextValue.chartRef.state.data.length < 2
      ) {
        return;
      }

      // start time and end time of main data need to load additional data
      const data = contextValue.chartRef.state.data;
      const currentStartTime = data[0].opentime;
      const currentEndTime = data[data.length - 1].closetime;

      const onePeriod = intervalToSeconds(interval) * 1000 * 200; // nano seconds * num of items for loading
      const periods = sliceToSmallPeriods(
        currentStartTime,
        currentEndTime,
        onePeriod
      );

      if (Array.isArray(periods)) {
        periods.forEach((period) => {
          const [startTime, endTime] = period;
          let loadDataProps = {
            startTime,
            endTime,
            symbol,
            interval,
            chartId,
          };

          Object.keys(newDataKeys).forEach((key) => {
            const [loaderKey, props] = getKeyDataLoader(key);
            loadDataProps = {
              ...loadDataProps,
              ...props,
            };
            const loader = dataLoaders[loaderKey];
            if (!loader) {
              return;
            }

            setTimeout(() => loader(loadDataProps, dispatch), 1);
          });
        });
      }
    },
    [symbol, interval, chartId, dispatch, dataLoaders, contextValue.chartRef]
  );

  useEffect(() => {
    const dataKeys = {};
    const newDataKeys = {};
    if (!Array.isArray(layers) || layers.length === 0) {
      currentNeededDataKeys.current = {};
      return;
    }

    layers.forEach((layer) => {
      const layerTypeData = LAYERS_MAP[layer.type];
      if (!Array.isArray(layerTypeData.dataKeys)) {
        return;
      }

      layerTypeData.dataKeys.forEach((baseKey) => {
        let key = baseKey;

        /**
         * Custom identity for data key
         * include more settings to reload data on each changed
         * */
        if (CUSTOM_DATA_IDENTITY[layer.type]) {
          const toIdentity = CUSTOM_DATA_IDENTITY[layer.type].toIdentity;
          const identity = toIdentity(layer);

          key = `${baseKey}${LOADER_PERIOD_SEPARATOR}${identity}`;
        }
        dataKeys[key] = true;

        if (
          currentNeededDataKeys.current &&
          !currentNeededDataKeys.current[key]
        ) {
          newDataKeys[key] = true;
        }
      });
    });

    // Load new data for new data keys here
    if (Object.keys(newDataKeys).length > 0) {
      loadDataForNewKeys(newDataKeys);
    }

    currentNeededDataKeys.current = dataKeys;
  }, [layers, loadDataForNewKeys]);

  useSocket({
    chartInfoRef,
    currentSocketInfo,
    currentNeededDataKeys,
    setReloadChart,
    symbol,
    exchange,
    interval,
    currentWsRef,
  });

  // load candle history data
  const loadData = useCallback(
    async (newDomain) => {
      const signal = createAbortController();

      let canSetNewDomain = true;
      try {
        if (loading.current || shouldLoadTo.current === null) {
          return;
        }
        loading.current = true;
        setRerender((prev) => !prev);

        const limit = CANDLE_LIMIT;
        const intervalNanoSeconds = invetervalToNanoSeconds(interval);
        const periodNanoSeconds = intervalNanoSeconds * limit;
        let startTime = lastLoadedTime.current - periodNanoSeconds;
        if (startTime < shouldLoadTo.current) {
          startTime = shouldLoadTo.current;
          shouldLoadTo.current = null;
        }
        const endTime = lastLoadedTime.current - 1;
        if (startTime >= endTime - intervalNanoSeconds + 1) {
          loading.current = false;
          shouldLoadTo.current = null;
          setRerender((prev) => !prev);
          return;
        }

        let result;
        // Fetch with retry
        for (let i = 0; i < RETRY_REQUEST_LIMIT; i++) {
          try {
            const nanoSecondOf1Months = 30 * 24 * 60 * 60 * 1000;
            const res = await fetchCandles({
              symbol,
              interval,
              startTime: endTime - nanoSecondOf1Months,
              endTime,
              signal,
              limit,
              asset: asset,
              type: symbolType,
              exchange: exchange,
            });

            // return when request is aborted
            if (res?.message === ABORT_MESSAGE) return;

            // No data, skip period to load from last candle
            if (res.data?.[0]?.nextTime) {
              lastLoadedTime.current = res.data[0].nextTime;
              const tmpLoadTo = lastLoadedTime.current - periodNanoSeconds;
              shouldLoadTo.current =
                getDateUTCStart(tmpLoadTo).getMilliseconds() * 1000;

              loading.current = false;
              loadData(newDomain);
              return;
            }

            if (res && Array.isArray(res.data)) {
              result = res.data;
              break;
            }
          } catch (error) {
            dispatch(
              actAddError({
                chartId,
                errorType: ERROR_TYPES.LOAD_DATA,
                message: `Load history data error, retrying ${i + 2} time!`,
                delay: 3000,
              })
            );
            console.log('ERROR fetchCandles', error);
          }
        }

        if (!Array.isArray(result) || result.length === 0) {
          shouldLoadTo.current = null;
          loading.current = false;
          if (!Array.isArray(result)) {
            dispatch(
              actAddError({
                message:
                  'Load data error, please check your network or contact us for support!',
                delay: 5000,
              })
            );
          } else {
            dispatch(
              actAddError({
                message: 'No more data to load!',
                showType: 'info',
                delay: 5000,
              })
            );
          }

          setRerender(!rerender);
          return;
        }

        const dataPartStartTime = result[result.length - 1].t;
        const dataPartEndTime = result[0].t;
        lastLoadedTime.current = dataPartStartTime;
        const candles = convertCandlestickV3(result);
        if (contextValue.chartRef) {
          contextValue.chartRef.prependData(candles);
        } else {
          currentData.current = candles.concat(currentData.current);
          setRerender(!rerender);
          setData(currentData.current);
        }

        Object.keys(currentNeededDataKeys.current).forEach((key) => {
          const [loaderKey, props] = getKeyDataLoader(key);
          if (dataLoaders[loaderKey]) {
            dataLoaders[loaderKey](
              {
                interval,
                startTime: dataPartStartTime,
                endTime: dataPartEndTime,
                symbol,
                chartId,
                ...props,
              },
              dispatch
            );
          }
        });

        loading.current = false;
        if (!shouldLoadTo.current) {
          setRerender(!rerender);
          return;
        }

        canSetNewDomain = false;
        setTimeout(() => {
          loadData(newDomain);
        }, 300);
      } catch (error) {
        console.log('load data error', error);
      } finally {
        if (canSetNewDomain && newDomain && contextValue.chartRef) {
          contextValue.chartRef.updateXDomain(newDomain);
        }
      }
    },
    [
      dispatch,
      symbol,
      interval,
      setRerender,
      rerender,
      contextValue,
      chartId,
      dataLoaders,
    ]
  );

  // Load data on update symbol || interval
  useEffect(() => {
    lastLoadedTime.current = new Date().getTime();
    currentData.current = [];
    setData(currentData.current);
    if (contextValue.chartRef) {
      contextValue.chartRef.replaceAllData([]);
    }

    const baseCandleWidth = 10;
    let candleToShow = width / baseCandleWidth;
    if (currentData.current.length < candleToShow - 1) {
      let tmpLoadTo =
        lastLoadedTime.current -
        candleToShow * intervalToSeconds(interval) * 1000;
      const newDate = new Date(tmpLoadTo);
      newDate.setHours(0, 0, 0, 0);
      shouldLoadTo.current =
        newDate.getTime() - newDate.getTimezoneOffset() * 60 * 1000;

      loadData();
      // SUBSCRIBE NEW SYMBOL WHEN USER CHANGE SYMBOL FROM WATCH LIST AND MODAL SERCH
      if (currentSymbol !== symbol) {
        const oldData = {
          oldExchange: currentExchange,
          oldSymbol: currentSymbol,
          oldInterval: interval,
        };
        const newData = {
          newExchange: exchange,
          newSymbol: symbol,
          newInterval: interval,
        };
        currentWsRef.current.subscribeNewSymbol({ newData, oldData });
      }
      setCurrentSymbol(symbol);
      setCurrentExchange(exchange);
    }
    // restart checking missing socket data
    currentSocketInfo.current.lastSocketOpenTime = 0;
  }, [symbol, interval, chartType]);

  const saveChartRef = useCallback(
    (node) => {
      contextValue.chartRef = node;
    },
    [contextValue]
  );

  const {
    indicatorList,
    handleExport,
    handleJumpTo,
    loadMore,
    mineSaveCanvasNode,
  } = useLogic({
    layers,
    symbol,
    interval,
    timezone,
    limit: LIMIT_CANDLE_EXPORT,
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
  });

  let minDataLength = 2;

  const showLoading = loading.current || loadOrderFlowCounter.current > 0;

  const showBotSignals =
    showBotSignalsPane &&
    ability.can(
      PERMISSION_ACTIONS.VIEW,
      symbolToFeatureId(symbol),
      FEATURE_IDS.TOOL_BOTSIGNAL
    );

  return (
    <>
      {contextHolder}
      {data.length < minDataLength && <Loading />}
      {data.length >= minDataLength && (
        <Chart
          ref={saveChartRef}
          loading={showLoading}
          type="hybrid"
          symbol={symbol}
          ticksOfSymbol={ticksOfSymbol}
          loadMore={loadMore}
          data={data}
          themeSettings={themeSettings}
          viewSettings={viewSettings}
          statusLineSettings={statusLineSettings}
          timeScaleSettings={timeScaleSettings}
          priceScaleSettings={priceScaleSettings}
          width={showBotSignals ? width - 250 : width}
          height={height}
          ratio={1}
          interval={interval}
          layers={layers}
          chartType={chartType}
          draws={draws[symbol]} // get draws by symbol
          saveCanvasNode={mineSaveCanvasNode}
          dispatch={dispatch}
          chartId={chartId}
          currentHeatmap={[]}
          showTopRatio={showTopRatio}
          heatmapColor={heatmapColor}
          showBotSignals={showBotSignals}
          botSignals={botSignals}
          symbolInfo={symbolInfo}
          resolutions={common.resolutions}
          sectionRef={sectionRef}
          isFullScreen={isFullScreen}
          showAddLayerModal={showAddLayerModal}
          showLayers={showLayers}
          indicatorList={indicatorList}
          timezone={timezone}
          symbolType={symbolType}
        />
      )}
      <ModalJumpTo
        chartId={chartId}
        showModal={showJumpToModal}
        onSubmit={handleJumpTo}
      />
      {showBotSignals && (
        <PaneBotSignalsWrapper
          onJump={handleJumpTo}
          chartId={chartId}
          symbol={symbol}
          interval={interval}
        />
      )}
      <ModalExport
        chartId={chartId}
        showModal={showExportModal}
        interval={interval}
        limit={LIMIT_CANDLE_EXPORT}
        onSubmit={handleExport}
      />
    </>
  );
};

export default ChartWrapper;
