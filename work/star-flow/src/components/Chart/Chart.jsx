import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'd3-format';
import { ChartCanvas, Chart } from '@coinmap/react-stockcharts';
import { StraightLine } from '@coinmap/react-stockcharts/lib/series';
import {
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  EdgeIndicator,
} from '@coinmap/react-stockcharts/lib/coordinates';
import { discontinuousTimeScaleProviderBuilder } from '@coinmap/react-stockcharts/lib/scale';
import StatusLineTooltip from '@coinmap/react-stockcharts/lib/tooltip/StatusLineTooltip';
import { head, last, noop } from '@coinmap/react-stockcharts/lib/utils';
import { DrawingObjectSelector } from '@coinmap/react-stockcharts/lib/interactive';
import {
  LabelAnnotation,
  Annotate,
  Label,
  PathAnnotation,
} from '@coinmap/react-stockcharts/lib/annotation';

import THEMES from '@/config/theme';
import Loading from '../Loading';
import { calcCandleWithOrderFlow, intervalToSeconds } from '@/utils/calculator';
import { toIndexMap } from '@/utils/mapping';
import {
  defaultFormatters,
  formatTimezoneForDataOfChart,
  getTickFormat,
} from '@/utils/format';
import { saveInteractiveNodes, getInteractiveNodes } from './interactiveUtils';
import { actLayerUpdate } from '@/redux/actions/setting';
import { DRAW_TOOLS } from '@/config/consts/drawTool';
import chartMethods from './methods';
import DrawFloatBarWrapper from './components/DrawFloatBar';
import { LAYERS_MAP, LAYER_DISPLAY_TYPES } from '@/config/consts/layer';
import Orderbook from './components/OrderBook';
import CountDown from './components/CountDown';
import { checkIsHeatmap } from '@/utils/common';
import { timeFormat } from 'd3-time-format';
import {
  DEFAULT_ZOOM_MULTIPLIER_X,
  DEFAULT_ZOOM_MULTIPLIER_Y,
  HEATMAP_ZOOM_MULTIPLIER_X,
  HEATMAP_ZOOM_MULTIPLIER_Y,
} from '@/config/consts/chart';
import style from './style.module.scss';
import { SvgPlay } from '@/assets/images/svg';
import { getChartConfig } from '@/utils/chart';
import ChartLayers from './ChartLayers';
import useChartPanes from './ChartPanes';
import useChartOverlayPanes from './ChartOverlayPanes';
import { getSymbolInStatusLine, generateFutureData } from './utils';
import XAxisComponent from './components/XAxis';
import YAxisComponent, { Y_AXIS_WIDTH } from './components/YAxis';
import LayerTooltipWrapper from './LayerTooltipWrapper';
import { mapIndicators } from '@/utils/indicator';

const fontWeight = 300;
const fontSize = 10;
const MAIN_CHART_ID = 1;
const DEFAULT_PADDING_RATIO = 0.006;
const ORDER_FLOW_PADDING_RATIO = 0.02;

const numberFormat = format(',.2s');

class CustomChartWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.domainDiff = 0.01;

    for (const methodName in chartMethods) {
      if (Object.hasOwnProperty.call(chartMethods, methodName)) {
        const methodFunc = chartMethods[methodName];
        this[methodName] = methodFunc.bind(this);
      }
    }

    const { data: initialData, width, chartType, interval, timezone } = props;

    const calculatedData = formatTimezoneForDataOfChart(initialData, timezone);
    const isHeatmapChart = checkIsHeatmap(chartType);

    this.futureData = [];
    if (!isHeatmapChart) {
      const lastDatum = calculatedData[calculatedData.length - 1];
      this.futureData = generateFutureData(
        this.futureData,
        lastDatum,
        interval,
        timezone
      );
    }

    const indexCalculator = discontinuousTimeScaleProviderBuilder()
      .setLocale(null, defaultFormatters)
      .indexCalculator();
    this.indexCalculator = indexCalculator;
    const { index } = indexCalculator(calculatedData.concat(this.futureData));
    this.startIndex = index?.[0]?.index || 0;

    const xScaleProvider = discontinuousTimeScaleProviderBuilder()
      .setLocale(null, defaultFormatters)
      .inputDateAccessor((d) => d.date)
      .withIndex(index);
    this.xScaleProvider = xScaleProvider;
    const { data, xScale, xAccessor, displayXAccessor } =
      xScaleProvider(calculatedData);

    const draws = this.getShowableDraws(data, interval);

    const baseWidth = isHeatmapChart ? -3 : 10;
    const dataLength = Math.floor(width / baseWidth);
    // +15 for padding right
    const start = xAccessor(last(data)) + 15;
    const end = start - dataLength + 15;
    const xExtents = [start, end];
    if (isHeatmapChart) {
      xExtents[0] = xAccessor(head(data));
    }
    // [(d) => [d.low + d.low * 0.006, d.high - d.high * 0.006]
    let minPrice = Infinity;
    let maxPrice = 0; // max number
    for (let i = Math.max(0, data.length - dataLength); i < data.length; i++) {
      const d = data[i];
      if (d.low < minPrice) {
        minPrice = d.low;
      }
      if (d.high > maxPrice) {
        maxPrice = d.high;
      }
    }
    const paddingRatio = this.getPaddingRatio();
    const padding = minPrice * paddingRatio;
    const yExtents = [minPrice - padding, maxPrice + padding];

    this.dataIndexMap = toIndexMap(data);
    this.lastDraw = 0;

    this.state = {
      data,
      xScale,
      xAccessor,
      displayXAccessor,
      xExtents,
      yExtents,
      index,
      draws,
      reDraw: 0,
    };

    this.saveInteractiveNodes = saveInteractiveNodes.bind(this);
    this.getInteractiveNodes = getInteractiveNodes.bind(this);

    /* ------------------------ Initialize some things ----------------------- */
    // Init props of path annotation for show bot signals order
    this.initBotOrderAnnotation();
  }

  componentDidUpdate(prevProps) {
    // Update draws state when draws redux change
    const { interval } = this.props;
    if (prevProps.draws !== this.props.draws) {
      const draws = this.getShowableDraws(this.state.data, interval);
      this.setState({
        draws,
      });
    }
    // format date of candle when changing timezone
    if (prevProps.timezone !== this.props.timezone) {
      this.formatDateByTimezone();
    }

    // interval to miliseconds
    this.intervalMiliseconds = intervalToSeconds(interval) * 1000;
  }

  getPaddingRatio = () => {
    const { chartType } = this.props;

    return chartType === LAYERS_MAP.orderflow.id
      ? ORDER_FLOW_PADDING_RATIO
      : DEFAULT_PADDING_RATIO;
  };

  checkXDomain = async (xScale) => {
    const { data, xAccessor, showResetButtun } = this.state;
    this.lastXScale = xScale;
    const lastDataX = xAccessor(last(data));

    const maxDomainX = Math.max(...xScale.domain());
    if (lastDataX <= maxDomainX) {
      if (showResetButtun) {
        this.setState({ showResetButtun: false });
      }
      return;
    }

    this.setState({ showResetButtun: true });
  };

  /**
   * Check if the main chart is having space on the right side
   * Move all series of the chart to the left one step
   * Note: Keep y scale
   */
  autoStepBack = () => {
    if (!this.canvasNode?.state?.xScale) {
      return;
    }

    // check chart having space on the right side (unit: candlestick)
    const { data, xAccessor } = this.state;
    const { xScale } = this.canvasNode.state;
    const lastCandle = last(data);
    const lastX = xAccessor(lastCandle);
    const xDomain = xScale.domain();
    const maxDomainX = Math.max(...xDomain);
    const domainDiff = maxDomainX - lastX;

    if (!domainDiff || domainDiff < 1) {
      return;
    }

    // Keep y scale
    const mainChartConfig = getChartConfig(
      this.canvasNode.state,
      MAIN_CHART_ID
    );
    const { yScale } = mainChartConfig;
    const currentYDomain = yScale.domain();
    const yDiff = Math.abs(currentYDomain[0] - currentYDomain[1]) / 2;
    this.domainDiff = yDiff / Math.max(...currentYDomain);
    this.lastYDomain = [lastCandle.close - yDiff, lastCandle.close + yDiff];

    const xExtents = [xDomain[0] + 1, xDomain[1] + 1];
    this.updateXDomain(xExtents);
  };

  handleResetChartPosition = () => {
    if (!this.lastXScale) {
      return;
    }
    const { data, xAccessor } = this.state;
    const lastX = xAccessor(last(data));
    const lastXDomain = this.lastXScale.domain();
    const domainDiff = Math.abs(lastXDomain[0] - lastXDomain[1]) || 100;

    const mainChartConfig = getChartConfig(
      this.canvasNode.state,
      MAIN_CHART_ID
    );
    const { yScale } = mainChartConfig;
    const realYDomain = yScale.domain();
    const yDiff = Math.abs(realYDomain[0] - realYDomain[1]) / 2;
    this.domainDiff = yDiff / Math.max(...realYDomain);
    const lastCandle = last(data);
    this.lastYDomain = [lastCandle.close - yDiff, lastCandle.close + yDiff];

    this.setState({
      showResetButtun: false,
      xExtents: [lastX - domainDiff, lastX],
      toggleReset: !this.state.toggleReset,
    });
  };

  handleResetZoomY = () => {
    const { data } = this.state;

    const mainChartConfig = getChartConfig(
      this.canvasNode.state,
      MAIN_CHART_ID
    );
    const { yScale } = mainChartConfig;
    const realYDomain = yScale.domain();
    const yDiff = Math.abs(realYDomain[0] - realYDomain[1]) / 2;
    this.domainDiff = yDiff / Math.max(...realYDomain);
    const lastCandle = last(data);
    this.lastYDomain = [lastCandle.close - yDiff, lastCandle.close + yDiff];
    this.canvasNode.resetYDomain();
  };

  updateYDomain = (props) => {
    const { chartConfig, xScale } = props;
    const mainChartConfig =
      (chartConfig || []).find((config) => config.id === 1) || {};

    this.checkXDomain(xScale);

    const { yScale } = mainChartConfig;
    const realYDomain = yScale.domain();
    if (!Array.isArray(realYDomain)) {
      return;
    }

    if (
      this.currentDomain?.[0] !== realYDomain?.[0] ||
      this.currentDomain?.[1] !== realYDomain?.[1]
    ) {
      this.currentDomain = [...realYDomain];
      this.lastYDomain = [...realYDomain];
      this.setState({
        reDraw: Date.now(),
      });
    }
  };

  chartEventHandler = (type, props, state) => {
    const { onZoomY, onZoomX } = this.props;
    if (type === 'zoom' && onZoomX) {
      onZoomX(props, state);
    }
    if (type === 'panend') {
      this.updateYDomain(props);
      onZoomY(props, state);
    }
    if (type === 'zoomY') {
      this.updateYDomain(props);
      onZoomY(props, state);
    }
  };

  saveCanvasNode = (node) => {
    if (this.props.saveCanvasNode) {
      this.props.saveCanvasNode(node);
    }
    this.canvasNode = node;
    if (!this.canvasNode) {
      return;
    }
    this.canvasNode.subscribe('main_panend_update_y_domain', {
      listener: this.chartEventHandler,
    });
  };

  currentMainYScale = () => {
    if (!this?.canvasNode?.getChildContext) {
      return null;
    }
    const context = this.canvasNode.state;
    const chartConfig = context.chartConfig || [];
    const mainConfig = chartConfig.find(
      (config) => config.id === MAIN_CHART_ID
    );

    return mainConfig?.yScale;
  };

  currentMainChartConfig = () => {
    if (!this?.canvasNode?.getChildContext) {
      return null;
    }
    const context = this.canvasNode.state;
    const chartConfig = context.chartConfig || [];
    const mainConfig = chartConfig.find(
      (config) => config.id === MAIN_CHART_ID
    );

    return mainConfig;
  };

  handleDownloadMore = (startIndex, endIndex) => {
    if (!this.props.loadMore) {
      return;
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
      delete this.timeout;
    }

    // console.log('loadmore', { startIndex, endIndex });
    // const { xAccessor } = this.state;
    const { data } = this.state;
    const { loadMore, symbolInfo } = this.props;
    const candle = data[0];
    if (!candle) {
      return;
    }

    const endTime = +candle.opentime - 1;
    const timeDiff = this.intervalMiliseconds * (startIndex - endIndex);
    let startTime = endTime + timeDiff;
    const newDate = new Date(startTime);
    newDate.setHours(0, 0, 0, 0);
    const newStartTime =
      newDate.getTime() - newDate.getTimezoneOffset() * 60 * 1000;
    if (newStartTime > startTime) {
      startTime = newStartTime - 24 * 60 * 60 * 1000;
    } else {
      startTime = newStartTime;
    }

    this.startIndex = Math.ceil(startIndex);
    this.endIndex = endIndex;
    this.timeout = setTimeout(() => {
      loadMore({ symbol: symbolInfo.symbol, startTime, endTime });
      delete this.timeout;
    }, 200);
  };

  /**
   * Index data to use for chart
   * @param {Array<Candle>} inputData
   * @param {number} indexStartAt
   * @returns {{
   *  data: Array<Candle>,
   *  index: Array<Object>,
   *  xScale: Function,
   *  xAccessor: Function,
   *  displayXAccessor: Function
   * }} indexed data and index list
   */
  indexData = (inputData, indexStartAt = null) => {
    try {
      const { index: oldIndex } = this.state;
      const { interval, chartType, timezone } = this.props;

      const lastStart = head(oldIndex)?.index;
      const initialIndex = indexStartAt || lastStart || 0;
      const indexCalculator = discontinuousTimeScaleProviderBuilder()
        .setLocale(null, defaultFormatters)
        .initialIndex(initialIndex)
        .indexCalculator();

      if (!checkIsHeatmap(chartType)) {
        const lastDatum = inputData[inputData.length - 1];
        this.futureData = generateFutureData(
          this.futureData,
          lastDatum,
          interval,
          timezone
        );
      }

      const { index } = indexCalculator(inputData.concat(this.futureData));
      this.xScaleProvider.withIndex(index);
      const { data, xScale, xAccessor, displayXAccessor } =
        this.xScaleProvider(inputData);

      return { data, index, xScale, xAccessor, displayXAccessor };
    } catch (error) {
      console.log('error', error);
      return { data: [], index: [] };
    }
  };

  /**
   * Update x domain to set chart position
   * @param {[number, number]} xExtents new x domain
   */
  updateXDomain = (xExtents) => {
    if (this.updateDomainTimeout) {
      clearTimeout(this.updateDomainTimeout);
      delete this.updateDomainTimeout;
      this.updateXDomain(xExtents);
    }

    this.updateDomainTimeout = setTimeout(() => {
      this.setState({ xExtents });
      delete this.updateDomainTimeout;
    }, 100);
  };

  formatDateByTimezone = () => {
    try {
      const { timezone, layers } = this.props;
      const { data: inputData, index: oldIndex } = this.state;
      const dataFormated = formatTimezoneForDataOfChart(inputData, timezone);
      const { data, index, xScale, xAccessor, displayXAccessor } =
        this.indexData(dataFormated, head(oldIndex)?.index || 0);

      this.dataIndexMap = toIndexMap(data);
      mapIndicators(data, layers);

      const newState = {
        data,
        index,
        xScale,
        xAccessor,
        displayXAccessor,
      };

      this.setState(newState);
    } catch (error) {
      console.log('error', error);
    }
  };

  /**
   * Append data
   * @param {Array<Candle>} inputData array of candle to append
   * @returns {void}
   */
  appendData = (inputData) => {
    this.processNewData = true;
    try {
      const { timezone, layers } = this.props;
      const { data: oldData, index: oldIndex } = this.state;
      const dataFormated = formatTimezoneForDataOfChart(inputData, timezone);

      // Auto step back on add 1 candlestick
      if (dataFormated.length === 1) {
        this.autoStepBack();
      }

      const { data, index, xScale, xAccessor, displayXAccessor } =
        this.indexData(
          oldData.concat(dataFormated),
          head(oldIndex)?.index || 0
        );

      this.dataIndexMap = toIndexMap(data);
      mapIndicators(data, layers);

      const newState = {
        data,
        index,
        xScale,
        xAccessor,
        displayXAccessor,
      };

      this.setState(newState);
      return;
    } catch (error) {
      console.log('error', error);
    } finally {
      this.processNewData = false;
    }
  };

  /**
   * Update last candle data
   * @param {Candle} candle
   */
  replaceLastCandle = (candle) => {
    const { data } = this.state;
    const { layers } = this.props;
    const lastCandle = last(data);
    const updatedCandle = {
      ...lastCandle,
      ...candle,
    };

    data[data.length - 1] = updatedCandle;
    mapIndicators(data, layers);

    if (Date.now() - this.lastDraw < 100) {
      return;
    }

    const currentTime = Date.now();
    this.lastDraw = currentTime;

    this.setState({ reDraw: this.lastDraw });
  };

  /**
   * Replace old data by new data
   * Keep old index start
   * @param {Array<Candle>} newData list candle to replace
   */
  replaceAllData = (newData) => {
    try {
      const { index: oldIndex } = this.state;
      const { interval } = this.props;
      const startIndex = oldIndex?.[0]?.index || 0;
      const { timezone } = this.props;
      const dataFormated = formatTimezoneForDataOfChart(newData, timezone);

      const { data, index, xScale, xAccessor, displayXAccessor } =
        this.indexData(dataFormated, startIndex);
      this.dataIndexMap = toIndexMap(data);
      const draws = this.getShowableDraws(data, interval);

      this.setState({
        data,
        index,
        xScale,
        xAccessor,
        displayXAccessor,
        draws,
      });
    } catch (error) {
      console.log('replaceAllData error', error);
    }
  };

  /**
   * Place input data at start of old data
   * new index start = old start - length(new candle)
   * @param {Array<Candle>} inputData array of candle
   */
  prependData = (inputData) => {
    try {
      const { index: oldIndex, data: oldData } = this.state;
      const { interval, timezone } = this.props;
      const dataFormated = formatTimezoneForDataOfChart(inputData, timezone);
      const startIndex = (oldIndex?.[0]?.index || 0) - dataFormated.length;
      const { data, index, xScale, xAccessor, displayXAccessor } =
        this.indexData(dataFormated.concat(oldData), startIndex);

      this.dataIndexMap = toIndexMap(data);
      const draws = this.getShowableDraws(data, interval);

      this.setState({
        data,
        index,
        displayXAccessor,
        xScale,
        xAccessor,
        draws,
      });
    } catch (error) {
      console.log('replaceAllData error', error);
    }
  };

  /**
   * Map order flow
   * @param {Array} orderFlow Order flow array
   */
  mapOrderFlowWithCandles = (orderFlow, settings) => {
    const { data } = this.state;

    orderFlow.forEach((item) => {
      const candleIndex = this.dataIndexMap[item.openTime];
      if (!data[candleIndex]) {
        return;
      }
      const candle = data[candleIndex];
      candle.orderFlow = item.orderFlow;
      calcCandleWithOrderFlow(candle, settings);
    });

    this.setState({ reDraw: Date.now() });
  };

  /**
   * Map data to candle
   * @param {Array<{opentime: number, data: Object}>} listItems Data with opentime array
   */
  mapDataWithCandles = (listItems) => {
    const { data } = this.state;

    const keys = Object.keys(listItems[0]?.data);
    listItems.forEach((item) => {
      const candleIndex = this.dataIndexMap[item.opentime];
      if (!data[candleIndex]) {
        return;
      }
      const candle = data[candleIndex];

      keys.forEach((key) => {
        candle[key] = item?.data?.[key];
      });
    });

    this.setState({ reDraw: Date.now() });
  };

  /**
   * Map indicator data to candles
   * @param {string} layerId id of layer
   * @param {Array<{opentime: number, data: Object}>} listItems Data with opentime array
   */
  mapIndicatorWithCandles = (layerId, listItems) => {
    const { data } = this.state;

    const keys = Object.keys(listItems[0]?.data);
    listItems.forEach((item) => {
      const candleIndex = this.dataIndexMap[item.opentime];
      if (!data[candleIndex]) {
        return;
      }
      const candle = data[candleIndex];

      candle[layerId] = {};
      keys.forEach((key) => {
        candle[layerId][key] = item?.data?.[key];
      });
    });

    this.setState({ reDraw: Date.now() });
  };

  handleUpdateLayerHeight = (newHeight, layerId) => {
    const { height, dispatch, chartId } = this.props;

    if (newHeight > (height * 2) / 3 || newHeight < 50) {
      return false;
    }

    dispatch(
      actLayerUpdate({
        chartId,
        layerId,
        layerData: {
          height: newHeight,
        },
      })
    );
  };

  onYZoom = (chartId, newDomain) => {
    this.currentDomain = newDomain;
    const diff = Math.abs(newDomain[0] - newDomain[1]);
    this.lastYDomain = newDomain;
    this.domainDiff = diff / (Math.max(...newDomain) - diff);
    this.setState({
      reDraw: Date.now(),
    });
  };

  reDrawChartBySettings = (settings) => {
    const { data, reDraw } = this.state;
    const dataNew = data.map((item) => {
      return calcCandleWithOrderFlow(item, settings);
    });

    this.setState({ reDraw: !reDraw, data: dataNew });
  };

  defaultYDomain = (d) => {
    const paddingRatio = this.getPaddingRatio();

    return [d.low - d.low * paddingRatio, d.high + d.low * paddingRatio];
  };

  render() {
    const {
      type,
      width,
      height,
      themeSettings,
      layers,
      chartType,
      showTopRatio,
      heatmapColor,
      showBotSignals,
      botSignals,
      chartId,
      viewSettings,
      statusLineSettings,
      symbolInfo,
      resolutions,
      timeScaleSettings,
      priceScaleSettings,
      heatmapData,
      showAddLayerModal,
      showLayers,
      sectionRef,
      indicatorList,
      dispatch,
      timezone,
    } = this.props;

    const {
      data,
      xScale,
      xAccessor,
      displayXAccessor,
      xExtents,
      showResetButtun,
      draws,
      toggleReset,
    } = this.state;

    const signalsMap = botSignals?.signalsMap ?? {};

    const isHeatmap = chartType === LAYERS_MAP.heatmap.id;

    if (!width || !height || data.length === 0) {
      return <Loading />;
    }

    const themeVars = THEMES?.[themeSettings.activeKey]?.variables || {};
    const theme = {
      ...themeVars,
      ...themeSettings.custom,
    };

    // const height = "auto";
    const deltaChartHeight = Math.floor(height / 6);
    var margin = { left: 0, right: Y_AXIS_WIDTH, top: 0, bottom: 0 };
    var gridHeight = height - margin.top - margin.bottom;
    var gridWidth = width - margin.left - margin.right;

    const tickValue =
      data[data.length - 1]?.orderFlow?.[0]?.tick ||
      data[data.length - 1]?.heatmap?.tv ||
      0;
    const tickFormat = getTickFormat(tickValue, priceScaleSettings);
    const timeDisplayFormat = timeFormat(
      timeScaleSettings.dateFormat + ' %H:%M'
    ); // using to format time on xAxis

    const defaultPanelHeight = deltaChartHeight;
    let nextYPosition = 0;
    const itemTypeMap = {};
    layers.forEach((item) => {
      if (!item.show) {
        return;
      }

      const layerInfo = LAYERS_MAP[item.type];
      if (!itemTypeMap[layerInfo.displayType]) {
        itemTypeMap[layerInfo.displayType] = [];
      }

      itemTypeMap[layerInfo.displayType].push(item);
    });
    const chartPaneLayers = itemTypeMap[LAYER_DISPLAY_TYPES.PANE] || [];
    const resizeHandlers = [];
    let showXAxisMainChart = true;

    // using 1 xGrid for all panes
    const xGrid = {
      innerTickSize: -1 * gridHeight,
      ticks: Math.max(8, Math.floor(gridWidth / 40)),
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [chartPanes, showXAxis, YPosition, extraElements] = useChartPanes({
      chartPaneLayers,
      width,
      handleUpdateLayerHeight: this.handleUpdateLayerHeight,
      height,
      theme,
      fontWeight,
      fontSize,
      xGrid,
      gridWidth,
      tickFormat,
      numberFormat,
      timeDisplayFormat,
      resizeHandlers,
      defaultPanelHeight,
      nextYPosition,
      showXAxisMainChart,
      chartId,
      symbol: symbolInfo.symbol,
      isHeatmap,
      heatmapData,
      dispatch,
    });

    showXAxisMainChart = showXAxis;
    nextYPosition = YPosition;

    const chartDraws = this.renderChartDraws({ tickFormat, timeDisplayFormat });

    const mainChartHeight =
      height - nextYPosition - (showXAxisMainChart ? 30 : 0);

    const yGrid = {
      innerTickSize: -1 * gridWidth,
      ticks: Math.max(8, Math.floor(mainChartHeight / 40)),
    };

    const chartOverlayLayers =
      itemTypeMap[LAYER_DISPLAY_TYPES.PANE_OVERLAY] || [];

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const chartOverlayPanes = useChartOverlayPanes({
      chartOverlayLayers,
      mainChartHeight,
      layersMap: LAYERS_MAP,
      theme,
      fontWeight,
      fontSize,
      gridWidth,
      tickFormat,
      numberFormat,
      showXAxisMainChart,
    });

    const lastCandle = data?.[data.length - 1] || {};

    if (isHeatmap || chartType === 'orderflow') {
      const yDomain = [
        lastCandle.close + lastCandle.close * this.domainDiff,
        lastCandle.close - lastCandle.close * this.domainDiff,
      ];
      if (!this.lastYDomain) {
        this.lastYDomain = yDomain;
      } else {
        const domainDiff = Math.abs(this.lastYDomain[0] - this.lastYDomain[1]);
        const topDiffRatio =
          Math.abs(this.lastYDomain[0] - lastCandle.close) / domainDiff;
        const botDiffRatio =
          Math.abs(lastCandle.close - this.lastYDomain[1]) / domainDiff;
        if (topDiffRatio < 0.3 || botDiffRatio < 0.3) {
          this.lastYDomain = yDomain;
        }
      }
    } else {
      this.lastYDomain = this.defaultYDomain;
    }

    const chartCanvasPadding = { left: 0, right: 0 };
    if (isHeatmap) {
      chartCanvasPadding.right = 100;
    }

    const chartWidth = isHeatmap && width > 550 ? width - 200 : width;

    const annotationProps = {
      fontSize: 40,
      fill: (candle) => {
        const signal = signalsMap[candle.opentime];
        if (!signal) {
          return '#ffde4b';
        }

        return signal.type;
      },
      opacity: 0.7,
      text: (candle) => {
        const signal = signalsMap[candle.opentime];
        if (!signal) {
          return '⇟';
        }

        return signal.type === 'Red' ? '⇟' : '⇞';
      },
      y: ({ yScale, datum }) => yScale(datum.high + 8 * tickValue),
    };

    const enableZoomY = chartType === 'orderflow';

    const zoomMultiplierX = isHeatmap
      ? HEATMAP_ZOOM_MULTIPLIER_X
      : DEFAULT_ZOOM_MULTIPLIER_X;

    const zoomMultiplierY = isHeatmap
      ? HEATMAP_ZOOM_MULTIPLIER_Y
      : DEFAULT_ZOOM_MULTIPLIER_Y;

    return (
      <>
        <ChartCanvas
          ref={this.saveCanvasNode}
          panEvent
          wheelPan={isHeatmap ? false : true}
          mouseMoveEvent
          zoomEvent
          enableZoomY={enableZoomY}
          height={height}
          width={chartWidth}
          ratio={window.devicePixelRatio}
          margin={margin}
          type={type}
          seriesName={`MAIN_${toggleReset}`}
          data={data}
          xScale={xScale}
          xAccessor={xAccessor}
          displayXAccessor={displayXAccessor}
          xExtents={xExtents}
          onLoadMore={this.handleDownloadMore}
          minPointsPerPxThreshold={1 / 100000}
          pointsPerPxThreshold={isHeatmap ? 4 : 1.5}
          zoomMultiplierX={zoomMultiplierX}
          zoomMultiplierY={zoomMultiplierY}
          padding={chartCanvasPadding}
          className="react-stockchart react-stockchart-canvas"
          fps={viewSettings.fps}
        >
          {chartPanes}
          <Chart
            enableZoomY={enableZoomY}
            id={MAIN_CHART_ID}
            yExtents={[this.lastYDomain]}
            padding={{ top: 0, bottom: 0 }}
            height={mainChartHeight}
          >
            {/* off when chart has a pane, show XAxis of pane chart */}
            {chartPanes.length === 0 && (
              <XAxisComponent
                chartId={chartId}
                {...xGrid}
                zoomMultiplier={zoomMultiplierX}
              />
            )}
            <YAxisComponent
              chartId={chartId}
              onDoubleClick={this.handleResetZoomY}
              tickFormat={(d) => {
                return tickFormat(d);
              }}
              {...yGrid}
              zoomMultiplier={zoomMultiplierY}
            />

            {viewSettings.waterMark.display && !isHeatmap && (
              <Label
                opacity={viewSettings.waterMark.opacity}
                fill="#FFFFFF"
                x={gridWidth / 2}
                y={gridHeight / 2}
                fontSize={viewSettings.waterMark.fontSize}
                text={viewSettings.waterMark.text}
                fontFamily={viewSettings.waterMark.font}
              />
            )}

            <ChartLayers
              chartId={chartId}
              symbol={symbolInfo.symbol}
              layers={layers}
              fontWeight={fontWeight}
              theme={theme}
              tickFormat={tickFormat}
              heatmapColor={heatmapColor}
              showTopRatio={showTopRatio}
              ticks={yGrid.ticks}
              ticksOfSymbol={symbolInfo.ticksOfSymbol}
              timezone={timezone}
              symbolType={symbolInfo.symbolType}
            />

            {!isHeatmap && chartDraws}

            {showXAxisMainChart && (
              <MouseCoordinateX
                at="bottom"
                orient="bottom"
                displayFormat={timeDisplayFormat}
                fontWeight={fontWeight}
                fontSize={fontSize}
              />
            )}

            <MouseCoordinateY
              yAxisPad={3}
              at="right"
              orient="right"
              rectHeight={14}
              fontSize={fontSize}
              strokeWidth={1}
              arrowWidth={3}
              displayFormat={tickFormat}
              fontWeight={fontWeight}
            />

            <EdgeIndicator
              itemType="last"
              orient="right"
              edgeAt="right"
              yAccessor={() => lastCandle.close}
              fill={() =>
                lastCandle.close > lastCandle.open
                  ? theme.upColor
                  : theme.dwColor
              }
              textFill="white"
              rectHeight={fontSize + 3}
              rectWidth={30}
              fontSize={fontSize}
              fontStyle="medium"
              strokeWidth={1}
              arrowWidth={3}
              wickStroke="green"
              stroke="white"
              lineStroke={
                lastCandle.close > lastCandle.open
                  ? theme.upColor
                  : theme.dwColor
              }
              lineOpacity={1}
              yAxisPad={3}
              displayFormat={tickFormat}
              fontWeight={fontWeight}
            />
            {priceScaleSettings.countdown && !isHeatmap && (
              <CountDown
                lastCandle={lastCandle}
                fontWeight={fontWeight}
                fontSize={fontSize}
                upColor={theme.upColor}
                downColor={theme.dwColor}
              />
            )}

            {!isHeatmap && (
              <StatusLineTooltip
                symbol={getSymbolInStatusLine(
                  symbolInfo,
                  symbolInfo.interval,
                  statusLineSettings.symbol,
                  resolutions
                )}
                width={gridWidth}
                symbolType={statusLineSettings.symbol}
                market={true}
                ohlcFormat={tickFormat}
                origin={[3, 5]}
                textFill="#e02949"
                labelFill="white"
                fontSize={fontSize + 2}
                openMarketStatus={statusLineSettings.openMarketStatus}
                OHCLValues={statusLineSettings.OHCLValues}
                barChangeValues={statusLineSettings.barChangeValues}
                volume={statusLineSettings.volume}
              />
            )}

            {viewSettings.crossHair.visible.display && !isHeatmap && (
              <CrossHairCursor
                strokeDasharray={viewSettings.crossHair.visible.type}
                strokeWidth={viewSettings.crossHair.visible.width}
                stroke={viewSettings.crossHair.visible.color}
              />
            )}
            {/* {loading && <LoadingBar y="50%" width={50} x={20} />} */}

            {isHeatmap && (
              <StraightLine
                xValue={xAccessor(lastCandle) + 0.5}
                stroke="#FFFFFF"
                type="vertical"
              />
            )}

            {showBotSignals && (
              <Annotate
                with={LabelAnnotation}
                when={(d) => !!signalsMap[d.opentime]}
                usingProps={annotationProps}
              />
            )}
            {showBotSignals && (
              <Annotate
                with={PathAnnotation}
                when={this.orderPathAnnotaionWhen}
                usingProps={this.orderPathAnnotaionProps}
              />
            )}

            <LayerTooltipWrapper
              chartId={chartId}
              symbol={symbolInfo.symbol}
              layers={indicatorList}
              showAddLayerModal={showAddLayerModal}
              showLayers={showLayers}
              sectionRef={sectionRef}
            />
          </Chart>

          {chartOverlayPanes}

          {!isHeatmap && (
            <DrawingObjectSelector
              enabled
              getInteractiveNodes={this.getInteractiveNodes}
              drawingObjectMap={{
                [DRAW_TOOLS.fibonacci_retracement.type]: 'retracements',
                [DRAW_TOOLS.trend_line.type]: 'trends',
                [DRAW_TOOLS.path.type]: 'trends',
                [DRAW_TOOLS.text.type]: 'textList',
                [DRAW_TOOLS.rectangle.type]: 'trends',
                [DRAW_TOOLS.triangle.type]: 'trends',
                [DRAW_TOOLS.extended_line.type]: 'trends',
                [DRAW_TOOLS.arrow_marker.type]: 'trends',
                [DRAW_TOOLS.vertical_line.type]: 'trends',
                [DRAW_TOOLS.horizontal_ray.type]: 'trends',
                [DRAW_TOOLS.horizontal_line.type]: 'trends',
                [DRAW_TOOLS.callout.type]: 'trends',
                [DRAW_TOOLS.arrow.type]: 'arrows',
                [DRAW_TOOLS.long_position.type]: 'trends',
                [DRAW_TOOLS.short_position.type]: 'trends',
              }}
              onSelect={this.handleSelection}
            />
          )}
        </ChartCanvas>
        {showResetButtun && (
          <button
            onClick={this.handleResetChartPosition}
            className={`btn btn-primary btn-cm-primary ${style.resetBtn} ${
              isHeatmap ? style.heatmapReset : ''
            }`}
          >
            <SvgPlay width={30} height={30} />
          </button>
        )}
        {!isHeatmap && (
          <DrawFloatBarWrapper
            chartId={chartId}
            draws={draws}
            actions={{
              onDelete: this.handleDeleteDraw,
              onToggleLock: this.handleToggleLock,
              onShowSettingModal: this.handleShowSettingModal,
            }}
          />
        )}
        {resizeHandlers}
        {isHeatmap && width > 550 && (
          <Orderbook
            left={width - 200}
            height={mainChartHeight}
            domain={this.currentDomain || this.lastYDomain}
            orderbook={lastCandle.heatmap}
            tickValue={tickValue}
            yScale={this.currentMainYScale()}
            currentPrice={lastCandle.close}
            tickFormat={tickFormat}
            bidColor={theme.upColor}
            askColor={theme.dwColor}
          />
        )}
        {extraElements}
      </>
    );
  }
}

CustomChartWrapper.propTypes = {
  data: PropTypes.array.isRequired,
  loadMore: PropTypes.func.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
  loading: PropTypes.bool.isRequired,
  interval: PropTypes.string.isRequired,
  currentHeatmap: PropTypes.array.isRequired,
  onZoomY: PropTypes.func,
  onZoomX: PropTypes.func,
};

CustomChartWrapper.defaultProps = {
  type: 'hybrid',
  width: 0,
  height: 0,
  onZoomY: noop,
  onZoomX: noop,
};

export default CustomChartWrapper;
