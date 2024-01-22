import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";
import { first, head, hexToRGBA, isFloatEqual, last } from "../utils";
import { format } from "d3-format";
import { HeatmapTooltip } from "../tooltip";

// import workerJs from './HeatMap.worker.js.raw';

// default volume will be colored as orange in heatmap
const DEFAULT_BASE_ORANGE = 150;
// where to get new volume to colored as orange
const BASE_ORANGE_RATIO = 0.75;
const UPDATE_BASE_ORANGE_INTERVAL = 15 * 1000; // 15s
const BUY_SELL = {
  BUY: 1,
  SELL: 0,
};

const formatInteger = format(".2s");

export const tooltipContent = ({
  currentItem,
  xAccessor,
  props,
  moreProps,
}) => {
  const {
    xScale,
    chartConfig: { yScale },
    plotData,
  } = moreProps;
  const { tickFormat } = props;

  if (!yScale) {
    return null;
  }

  const { mouseXY } = moreProps;
  const y = last(mouseXY);
  const yValue = yScale.invert(y);
  const minY = Math.min(...yScale.domain());
  if (yValue < minY) {
    return null;
  }

  const tickValue = currentItem?.heatmap?.tv || 0;
  const { prev, next } = findNearCandles(currentItem, plotData);
  const items = findHeatmapItems(yValue, currentItem?.heatmap || [], tickValue);
  const prevItems = findHeatmapItems(yValue, prev?.heatmap || [], tickValue);
  const nextItems = findHeatmapItems(yValue, next?.heatmap || [], tickValue);

  const currentPrice = yValue - (yValue % tickValue);

  const tableData = [];
  const prevRows = prevItems.map((item) => {
    if (item?.price && item?.vol) {
      return {
        ...item,
        label: "prev " + item.price,
        value: formatInteger(item.vol),
      };
    }

    return null;
  });
  tableData.push(prevRows);

  const currentRows = items.map((item) => {
    if (item?.price && item?.vol) {
      return {
        ...item,
        label: "current " + item.price,
        value: formatInteger(item.vol),
      };
    }

    return null;
  });
  tableData.push(currentRows);

  const nextRows = nextItems.map((item) => {
    if (item?.price && item?.vol) {
      return {
        ...item,
        label: "next " + item.price,
        value: formatInteger(item.vol),
      };
    }

    return null;
  });
  tableData.push(nextRows);

  tableData.push([
    { value: tickFormat(currentPrice + tickValue) },
    { value: tickFormat(currentPrice) },
    { value: tickFormat(currentPrice - tickValue) },
  ]);

  return tableData;
};

const findHeatmapItems = (price = 0, heatmap = [], tickValue) => {
  if (!Array.isArray(heatmap)) {
    return [null, null, null];
  }

  const index = heatmap.findIndex((item) => {
    return item.price <= price && item.price + tickValue >= price;
  });

  if (index === -1) {
    return [null, null, null];
  }

  const item = heatmap[index];
  let gtItem = heatmap[index - 1];
  if (
    gtItem &&
    !isFloatEqual(gtItem.price, item.price - tickValue) &&
    !isFloatEqual(gtItem.price, item.price + tickValue)
  ) {
    gtItem = undefined;
  }
  let ltItem = heatmap[index + 1];
  if (
    ltItem &&
    !isFloatEqual(ltItem.price, item.price + tickValue) &&
    !isFloatEqual(ltItem.price, item.price - tickValue)
  ) {
    ltItem = undefined;
  }

  let tmpSwap = null;
  if (ltItem && gtItem && ltItem.price > gtItem.price) {
    tmpSwap = gtItem;
    gtItem = ltItem;
    ltItem = tmpSwap;
  }

  return [gtItem, item, ltItem];
};

const findNearCandles = (currentItem, plotData) => {
  const firstItem = first(plotData);
  const realIndex = Math.abs(currentItem.idx.index - firstItem.idx.index);

  const prev = plotData[realIndex - 1];
  const next = plotData[realIndex + 1];

  return { prev, next };
};

const PADDING = 5;
const X = 2;
const Y = 2;
export const tooltipCanvas = (
  { fontFamily, fontSize, fontFill },
  content,
  ctx,
  { colWidth, rowHeight }
) => {
  const startY = Y + rowHeight / 2 + (rowHeight - 2 * PADDING) / 2;

  ctx.font = `lighter ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = fontFill;
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";

  for (let colIndex = 0; colIndex < content.length; colIndex++) {
    const col = content[colIndex];

    col.forEach((row, i) => {
      if (!row) {
        return;
      }
      const textY = startY + rowHeight * i;
      ctx.fillText(row.value, X + colWidth * colIndex + colWidth / 2, textY);
    });
  }
};

class HeatMap extends Component {
  constructor(props) {
    super(props);
    // this.renderSVG = this.renderSVG.bind(this);
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
    this.lastUpdateBaseOrange = 0;
  }

  calculateData = (moreProps) => {
    const {
      xAccessor,
      xScale,
      chartConfig: { yScale },
      plotData,
    } = moreProps;
    const {
      yAccessor,
      buyGradient,
      sellGradient,
      extendLastX,
      showTopRatio,
      tickCombineDiff,
    } = this.props;

    const candleWidth = xScale(1) - xScale(0) + 1;
    const tickValue = last(plotData)?.heatmap?.tv || 0.001;

    if (this.isWorkerRunning) {
      const data = {
        props: {
          buyGradient,
          sellGradient,
          extendLastX,
          showTopRatio,
          tickCombineDiff,
          candleWidth,
          domain: yScale.domain(),
          height: Math.abs(yScale(0) - yScale(tickValue)),
          baseOrange: DEFAULT_BASE_ORANGE,
        },
        plotData,
        // plotData: plotData.map((item) => ({
        //   ...item,
        //   idx: item.idx.index,
        // })),
      };
      new Promise((resolve) => {
        this.worker.postMessage(data);
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
      delete this.timeoutCalc;
      return;
    }

    try {
      const {
        baseOrange: oldBaseOrange,
        maxVolSet: oldMaxVolSet,
        tickValue: oldTickValue,
        showTopRatio: oldShowTopRatio,
      } = this.lastCalculatedData;

      const updateBaseOrangeDiff = Date.now() - this.lastUpdateBaseOrange;
      const shouldCalculateBase =
        updateBaseOrangeDiff > UPDATE_BASE_ORANGE_INTERVAL ||
        showTopRatio !== oldShowTopRatio ||
        tickValue !== oldTickValue;

      this.lastCalculatedData = calcDataV2({
        props: this.props,
        plotData: [...plotData],
        xScale,
        xAccessor,
        yScale,
        yAccessor,
        oldCalculatedData: this.lastCalculatedData,
        shouldCalculateBase,
      });

      if (
        this.lastCalculatedData.useCachedData &&
        oldBaseOrange &&
        ((!shouldCalculateBase &&
          oldTickValue === this.lastCalculatedData.tickValue) ||
          !this.lastCalculatedData.baseOrange)
      ) {
        this.lastCalculatedData.baseOrange = oldBaseOrange;
        this.lastCalculatedData.maxVolSet = oldMaxVolSet;
      } else {
        this.lastUpdateBaseOrange = Date.now();
      }
    } catch (error) {
      console.log("HEATMAP - caclculate data error", error);
    }

    if (this.timeoutCalc) {
      delete this.timeoutCalc;
    }
    this.requestUpdateCount = 0;
  };

  onWorkerMessage = (event) => {
    const { data } = event;
    if (data === "pong") {
      this.isWorkerRunning = true;
      return;
    }

    this.lastCalculatedData = data;
  };

  componentDidMount() {
    // const blob2 = new Blob([workerJs], { type: "text/javascript" });
    // this.worker = new Worker(URL.createObjectURL(blob2), { type: "module" });
    // this.worker.postMessage("ping");
    // this.worker.addEventListener("message", this.onWorkerMessage);
  }

  requestCalculateData = (moreProps) => {
    if (this.timeoutCalc) {
      this.requestUpdateCount++;
      return;
    }

    this.timeoutCalc = new Promise((resolve) => {
      this.calculateData(moreProps);
      resolve(Date.now());
    }).then(() => {
      delete this.timeoutCalc;
    });
  };

  drawOnCanvas(ctx, moreProps) {
    if (this.drawing) {
      return;
    }

    const {
      xScale,
      chartConfig: { yScale },
      plotData,
      xAccessor,
    } = moreProps;

    const { yAccessor, buyGradient } = this.props;

    let drawData;
    if (this.lastCalculatedData) {
      drawData = this.lastCalculatedData;
      this.requestCalculateData(moreProps);
    } else {
      drawData = calcDataV2({
        props: this.props,
        plotData: [...plotData],
        xScale,
        xAccessor,
        yScale,
        yAccessor,
        oldCalculatedData: this.lastCalculatedData,
        shouldCalculateBase: true,
      });
      this.lastCalculatedData = drawData;
    }

    this.drawing = true;
    drawOnCanvasV2(ctx, drawData, { xScale, yScale, buyGradient });
    this.drawing = false;
  }

  render() {
    const { clip, showTooltip, tickFormat } = this.props;

    return (
      <>
        <GenericChartComponent
          clip={clip}
          // svgDraw={this.renderSVG}
          canvasDraw={this.drawOnCanvas}
          canvasToDraw={getAxisCanvas}
          drawOn={["pan"]}
        />
        {showTooltip && (
          <HeatmapTooltip
            tooltipContent={tooltipContent}
            tooltipCanvas={tooltipCanvas}
            tickFormat={tickFormat}
            fontFill="#FFFFFF"
            fill="#000000"
            stroke="#814d8a"
            bgOpacity={0.25}
          />
        )}
      </>
    );
  }
  // renderSVG(moreProps) {
  // 	const { xAccessor } = moreProps;
  // 	const { xScale, chartConfig: { yScale }, plotData } = moreProps;

  // 	const { yAccessor } = this.props;

  // 	const candles = getRenko(this.props, plotData, xScale, xAccessor, yScale, yAccessor)
  // 		.map((each, idx) => (<rect key={idx} className={each.className}
  // 			fill={each.fill}
  // 			x={each.x}
  // 			y={each.y}
  // 			width={each.width}
  // 			height={each.height} />));

  // 	return (
  // 		<g>
  // 			<g className="candle">
  // 				{candles}
  // 			</g>
  // 		</g>
  // 	);
  // }
}

HeatMap.propTypes = {
  classNames: PropTypes.shape({
    up: PropTypes.string,
    down: PropTypes.string,
  }),
  stroke: PropTypes.shape({
    up: PropTypes.string,
    down: PropTypes.string,
  }),
  fill: PropTypes.shape({
    up: PropTypes.string,
    down: PropTypes.string,
    partial: PropTypes.string,
  }),
  yAccessor: PropTypes.func.isRequired,
  clip: PropTypes.bool.isRequired,
  gradient: PropTypes.array,
  buyGradient: PropTypes.array,
  sellGradient: PropTypes.array,
  showTooltip: PropTypes.bool,
  tickFormat: PropTypes.func,
  extendLastX: PropTypes.number,
  showTopRatio: PropTypes.number,
  sameMaxVol: PropTypes.bool,
  tickCombineDiff: PropTypes.number,
};

HeatMap.defaultProps = {
  classNames: {
    up: "up",
    down: "down",
  },
  stroke: {
    up: "none",
    down: "none",
  },
  fill: {
    up: "#6BA583",
    down: "#E60000",
    partial: "#4682B4",
  },
  yAccessor: (d) => ({
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
  }),
  clip: true,
  gradient: [
    "e50dd8",
    "cc0cc0",
    "b20aa8",
    "990990",
    "7f0778",
    "660660",
    "4c0448",
    "330330",
    "190118",
    "020102",
  ],
  buyGradient: [
    "e50dd8",
    "cc0cc0",
    "b20aa8",
    "990990",
    "7f0778",
    "660660",
    "4c0448",
    "330330",
    "190118",
    "020102",
  ],
  sellGradient: [
    "e50dd8",
    "cc0cc0",
    "b20aa8",
    "990990",
    "7f0778",
    "660660",
    "4c0448",
    "330330",
    "190118",
    "020102",
  ],
  showTooltip: true,
  tickFormat: formatInteger,
  extendLastX: 1000,
  showTopRatio: 0.8,
  sameMaxVol: false,
  tickCombineDiff: 12,
};

const drawDot = ({
  ctx,
  dot,
  minR,
  maxR,
  color,
  darkColor,
  maxDotVol,
  candleWidth,
  xScale,
  yScale,
}) => {
  if (dot.vol / maxDotVol < 0.002) {
    return;
  }
  ctx.beginPath();
  let r = Math.min(Math.max(maxR * (dot.vol / maxDotVol), minR), maxR);
  if (r / maxR < 0.2) {
    r = r * 2;
  }

  const dotX = xScale(dot.x) - 0.5 * candleWidth + dot.dxRatio * candleWidth;
  const dotY = yScale(dot.y);

  const graX = dotX + r / 2;
  const graY = dotY - r / 4;
  const gradient = ctx.createRadialGradient(
    graX,
    graY,
    (r * 0.5).toFixed(2),
    graX,
    graY,
    (2 * r).toFixed(2)
  );
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, darkColor);
  ctx.fillStyle = gradient;
  ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  ctx.moveTo(dotX + r, dotY);
  ctx.arc(dotX, dotY, r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
};

/**
 * Check cached data can use for new conditions
 * @param {{ tickValue, minPrice, maxPrice, showTopRatio, baseOrange, usedBaseOrange, oldestOpentime }} cachedData old calculated data conditions
 * @param {{ tickValue, minPrice, maxPrice, showTopRatio, baseOrange, oldestOpentime }} currentConditions current data condition
 */
const canUseCache = (cachedData, currentConditions) => {
  if (cachedData.tickValue !== currentConditions.tickValue) {
    return false;
  }

  if (cachedData.minPrice > currentConditions.minPrice) {
    return false;
  }

  if (cachedData.maxPrice < currentConditions.maxPrice) {
    return false;
  }

  if (cachedData.showTopRatio !== currentConditions.showTopRatio) {
    return false;
  }

  if (
    !cachedData.oldestOpentime ||
    !currentConditions.oldestOpentime ||
    cachedData.oldestOpentime > currentConditions.oldestOpentime ||
    currentConditions.oldestOpentime - cachedData.oldestOpentime >
      UPDATE_BASE_ORANGE_INTERVAL
  ) {
    return false;
  }

  const baseOrangeDiff = Math.abs(
    cachedData.usedBaseOrange - currentConditions.baseOrange
  );
  const baseOrangeChangePercent =
    (baseOrangeDiff / cachedData.usedBaseOrange) * 100;
  if (baseOrangeChangePercent > 5) {
    return false;
  }

  return true;
};

const drawBars = ({ bars }, lastX, options) => {
  if (!Array.isArray(bars) || bars.length < 1) {
    return;
  }

  const { ctx, extendXRatio, height, yScale, width } = options;
  const x = lastX - width;

  bars.forEach((item) => {
    const y = yScale(item.y);

    // const shadowColorIndex = Math.max(Math.floor((item.colorIndex / 3) * 2), 0);
    // const shadowColor = buyGradient[item.colorIndex];
    // const shadowColorRGBA = hexToRGBA(`#${shadowColor}`, 0);
    // const mainColorOpacity = extendXRatio > 1 ? 1 : 0.5;
    // const mainColorRGBA = hexToRGBA(`#${shadowColor}`, mainColorOpacity);

    // const grd = ctx.createLinearGradient(0, y, 0, y + height);
    // grd.addColorStop(0, shadowColorRGBA);
    // grd.addColorStop(0.45, mainColorRGBA);
    // grd.addColorStop(0.55, mainColorRGBA);
    // grd.addColorStop(1, shadowColorRGBA);
    // ctx.fillStyle = grd;
    ctx.fillStyle = item.color;
    ctx.fillRect(x, y, width * extendXRatio + 1, height);
  });
};

/**
 * Draw line on canvas from points data
 * @param {Array<{x: number, y: number}>} points
 * @param {String} color
 * @param {{ ctx, xScale, yScale, width }} options
 */
const drawLine = (points, color, options) => {
  if (!Array.isArray(points)) {
    return;
  }

  const { ctx, xScale, yScale, width } = options;
  ctx.strokeStyle = color;
  let previous = null;
  ctx.beginPath();
  points.forEach((item, index) => {
    if (!item) {
      return;
    }

    const itemX = xScale(item.x) - 0.5 * width;
    const itemY = yScale(item.y);
    if (index === 0) {
      ctx.moveTo(itemX + 1000 * width, itemY);
      ctx.lineTo(itemX, itemY);
      previous = {
        x: itemX,
        y: itemY,
      };
      return;
    }

    if (previous && previous.y !== item.y) {
      ctx.lineTo(itemX, previous.y);
      ctx.lineTo(itemX, itemY);
    }
    previous = {
      x: itemX,
      y: itemY,
    };
  });
  if (previous) {
    ctx.lineTo(previous.x + width, previous.y);
  }
  ctx.stroke();
};

/**
 * Draw
 * @param {CanvasRenderingContext2D} ctx Canvas context 2D
 * @param {{ dotArrs: Array<Array<Object>>, calculatedCandles: Array<Object>, tickValue: number, maxDotVol: number }} drawData
 * @param {{ xScale: Function, yScale: Function, buyGradient: Array }} options
 */
const drawOnCanvasV2 = (ctx, drawData, { xScale, yScale, buyGradient }) => {
  const { tickValue, maxDotVol, dotArrs, calculatedCandles } = drawData;

  if (!Array.isArray(calculatedCandles) || calculatedCandles.length < 2) {
    return;
  }

  let width = (xScale(1) - xScale(0)).toFixed(5);
  const height = Math.abs(yScale(0) - yScale(tickValue)).toFixed(2);

  if (Array.isArray(calculatedCandles) && calculatedCandles.length > 1) {
    width = Math.abs(
      xScale(calculatedCandles?.[0]?.candleX) -
        xScale(calculatedCandles[1].candleX)
    );
  }

  const options = {
    ctx,
    xScale,
    yScale,
    extendXRatio: 1,
    width,
    height,
    buyGradient,
  };

  // Draw dot vol
  const maxR = 30;
  const minR = 2;
  const darkColor = hexToRGBA("#000000", 0.9);
  const defaultDotProps = {
    ctx,
    minR,
    maxR,
    darkColor,
    maxDotVol,
    candleWidth: width,
    xScale,
    yScale,
  };
  const buyColor = hexToRGBA("#008b46", 0.85);
  const sellColor = hexToRGBA("#b94845", 0.85);
  const unknownColor = hexToRGBA("#FFFFFF", 0.85);
  const colorMap = {
    buy: buyColor,
    sell: sellColor,
    unknown: unknownColor,
  };

  ctx.strokeWidth = 0;

  if (Array.isArray(calculatedCandles) && calculatedCandles.length > 0) {
    const halfCandleWidth = width / 2;
    let lastX = (
      xScale(calculatedCandles[0]?.candleX) + halfCandleWidth
    ).toFixed(5);
    for (let index = 0; index < calculatedCandles.length; index++) {
      const candle = calculatedCandles[index];
      if (!candle || !Array.isArray(candle.bars)) {
        lastX -= width;
        continue;
      }

      if (index === 0) {
        drawBars(candle, lastX, { ...options, extendXRatio: 1000 });
      } else {
        drawBars(candle, lastX, options);
      }
      lastX -= width;
    }
  }

  drawLine(drawData.bestBids, "#00FF00", options);
  drawLine(drawData.bestAsks, "#FF0000", options);

  if (Array.isArray(dotArrs)) {
    dotArrs.forEach((dots) => {
      if (!dots || !Array.isArray(dots)) {
        return;
      }

      dots.forEach((dot) => {
        if (!dot) {
          return;
        }

        const color = colorMap[dot.type];
        drawDot({
          dot,
          color,
          ...defaultDotProps,
        });
      });
    });
  }
};

const combineDots = (dotXYs) => {
  const result = [];
  let maxDotVol = 0;
  Object.keys(dotXYs).forEach((keyXY) => {
    const dots = dotXYs[keyXY];
    if (!Array.isArray(dots) || dots.length < 1) {
      return;
    }

    const firstDot = head(dots);
    const newDot = {
      ...firstDot,
    };

    for (let i = 1; i < dots.length; i++) {
      const dot = dots[i];
      newDot.vol += dot.vol;
      newDot.nTrade += dot.nTrade;
    }

    if (maxDotVol < newDot.vol) {
      maxDotVol = newDot.vol;
    }

    result.push(newDot);
  });

  result.maxDotVol = maxDotVol;

  return result;
};

const combineDotByTypes = ({ buy, sell, unknown }) => {
  return {
    buy: combineDots(buy),
    sell: combineDots(sell),
    unknown: combineDots(unknown),
  };
};

const toKey = (n, diff = 16) => {
  return Math.floor(n - (n % diff) + diff / 2);
};

const toXKey = (time, timeToCombine) => {
  return Math.floor(time - (time % timeToCombine) + timeToCombine / 2);
};

const getColor = (vol, colors = [], minShownVol, maxVol) => {
  const colorLength = colors.length;
  if (colorLength === 0) {
    return null;
  }
  const volDiff = maxVol - (minShownVol ? minShownVol : maxVol / colorLength);
  const normalColorLength = Math.floor(colorLength * 0.95);
  const step = volDiff / normalColorLength;
  const lastColor = colorLength - 1;
  const colorIndex = Math.min(
    Math.max(Math.floor((vol - minShownVol) / step), 0),
    lastColor
  );

  const color = colors[colorIndex];
  const opacity = (colorIndex / colorLength).toFixed(2);
  return { color: hexToRGBA(`#${color}`, 1), colorIndex, opacity };
};

/**
 * Sort volume set inc
 * Get min volume to show base on input top ratio
 * Remove noise value with base step
 * Get orange volume base on BASE_ORANGE_RATIO
 * @returns {{ newBaseOrange: number, newMinVolToShow: number }}
 */
const getAnchorInfo = ({
  volSet,
  showTopRatio,
  oldMinVolToShow,
  maxVolSet,
  buyGradient,
}) => {
  const vols = [...volSet].sort((a, b) => a - b);

  // Roll up to remove noise values
  const newBaseStep = Math.floor(
    (maxVolSet * BASE_ORANGE_RATIO) / buyGradient.length
  );
  const rollupedVolsSet = new Set();
  for (let i = 0; i < vols.length; i++) {
    const vol = vols[i];
    rollupedVolsSet.add(Math.floor(vol - (vol % newBaseStep)));
  }
  const rollupedVols = [...rollupedVolsSet];

  // Get min to show
  const indexMinVolToShow = Math.max(
    Math.floor((rollupedVols.length - 1) * showTopRatio),
    0
  );
  let newMinVolToShow = rollupedVols[indexMinVolToShow] || 0;
  // If diff between new and old minVolToShow < 5%, back to old value
  if (Math.abs(newMinVolToShow - oldMinVolToShow) / oldMinVolToShow < 0.03) {
    newMinVolToShow = oldMinVolToShow;
  }

  // Get base orange
  const newBaseOrangeIndex = Math.floor(
    (rollupedVols.length - 1) * BASE_ORANGE_RATIO
  );
  const newBaseOrange = rollupedVols[newBaseOrangeIndex];

  return { newBaseOrange, newMinVolToShow };
};

const calcDots = ({
  dotVol,
  candleOpenTime,
  candleTime,
  candleX,
  currentState,
}) => {
  const dots = [];
  if (Array.isArray(dotVol)) {
    dotVol.forEach((item) => {
      const dxRatio = (item.t - candleOpenTime) / candleTime;
      const y = item.p;
      const dotX = candleX;

      if (item.bv) {
        if (currentState.maxDotVol < item.bv) {
          currentState.maxDotVol = item.bv;
        }
        dots.push({
          dxRatio,
          x: dotX - 1,
          y,
          vol: item.bv,
          nTrade: item.n,
          type: "buy",
        });
      }

      if (item.sv) {
        if (currentState.maxDotVol < item.sv) {
          currentState.maxDotVol = item.sv;
        }
        dots.push({
          dxRatio,
          x: dotX,
          y,
          vol: item.sv,
          nTrade: item.n,
          type: "sell",
        });
      }

      if (item.uv) {
        if (currentState.maxDotVol < item.uv) {
          currentState.maxDotVol = item.uv;
        }
        dots.push({
          dxRatio,
          x: dotX + 1,
          y,
          vol: item.uv,
          fill: "#FFFFFF",
          nTrade: item.n,
          type: "unknown",
        });
      }
    });
  }

  return dots;
};

const calculateCandle = (
  candle,
  index,
  {
    candleWidth,
    candleTime,
    height,
    minPrice,
    maxPrice,
    xAccessor,
    tickValue,
    minVolToShow,
    sellGradient,
    buyGradient,
    baseOrange,
  },
  currentState
) => {
  const candleX = xAccessor(candle);

  const heatmap = candle.heatmap;
  const dotVol = heatmap.dotVol;
  const bestAskPrice = heatmap.bestask;
  const bestBidPrice = heatmap.bestbid;
  const bars = [];

  const priceArr = heatmap.priceArr;
  const volArr = heatmap.volArr;
  if (priceArr && priceArr.length) {
    for (let i = 0; i < priceArr.length; i++) {
      const price = priceArr[i];
      const vol = Math.floor(volArr[i]);
      const orderType =
        price >= heatmap.minSellPrice ? BUY_SELL.SELL : BUY_SELL.BUY;
      if (price > maxPrice || price < minPrice) {
        continue;
      }

      currentState.volSet.add(vol);
      if (vol > currentState.maxVolSet) {
        currentState.maxVolSet = vol;
      }

      if (vol < minVolToShow) {
        continue;
      }

      const colors = orderType === BUY_SELL.SELL ? sellGradient : buyGradient;

      const { color, colorIndex, opacity } = getColor(
        vol,
        colors,
        minVolToShow,
        baseOrange
      );

      const bar = {
        color,
        colorIndex,
        opacity,
        y: price + tickValue,
        height: height,
        width: candleWidth,
        vol,
        price,
      };

      bars.push(bar);
    }
  }

  let askPrice = bestAskPrice - (bestAskPrice % tickValue) + tickValue / 2;
  if (askPrice < bestAskPrice) {
    askPrice = bestAskPrice;
  }
  let bidPrice = bestBidPrice - (bestBidPrice % tickValue) - tickValue / 2;
  if (bidPrice > bestBidPrice) {
    bidPrice = bestBidPrice;
  }
  const bestAsk = {
    openTime: candle.opentime,
    price: askPrice,
    x: candleX,
    // x: candleX - 0.5 * candleWidth,
    y: askPrice,
  };
  const bestBid = {
    openTime: candle.opentime,
    price: bidPrice,
    x: candleX,
    y: bidPrice,
  };

  const dots = calcDots({
    dotVol,
    candleX,
    currentState,
    candleTime,
    candleOpenTime: candle.opentime,
  });

  const calculatedCandle = {
    openTime: candle.opentime,
    candleX,
    bars,
    bestAsk,
    bestBid,
    dots,
  };

  return calculatedCandle;
};

const calcDataV2 = ({
  oldCalculatedData = { bestAsks: [], bestBids: [], calculatedCandles: [] },
  plotData,
  xScale,
  yScale,
  xAccessor,
  shouldCalculateBase,
  props,
}) => {
  const {
    buyGradient,
    sellGradient,
    showTopRatio,
    // tickCombineDiff,
  } = props;

  let { baseOrange = 200, minVolToShow = 100 } = oldCalculatedData;
  if (!baseOrange) {
    baseOrange = 200;
  }
  const usedBaseOrange = baseOrange;
  if (!minVolToShow) {
    minVolToShow = 100;
  }

  // console.log('xScale(2) - xScale(1)', xScale, (xScale(2) - xScale(1)) - (xScale(4) - xScale(3)));
  const candleWidth = xScale(2) - xScale(1);
  const firstCandle = head(plotData) || {};
  const candleTime = firstCandle.closetime - firstCandle.opentime;
  const tickValue = plotData[0]?.heatmap?.tv || 0.001;
  const height = Math.abs(yScale(0) - yScale(tickValue));
  const domain = yScale.domain();
  const minPrice = Math.min(...domain) - 2 * tickValue;
  const maxPrice = Math.max(...domain);
  const lastIndex = plotData.length - 1;

  let calculatedCandles = [];
  let bestAsks = [];
  let bestBids = [];
  let dotArrs = [];

  const currentState = {
    volSet: new Set(),
    maxVolSet: 0,
    maxDotVol: 0,
  };

  const useCachedData =
    !shouldCalculateBase &&
    canUseCache(oldCalculatedData, {
      tickValue,
      minPrice,
      maxPrice,
      showTopRatio,
      oldestOpentime: firstCandle?.opentime,
      baseOrange,
    });

  // if (oldCalculatedData.isTmpBaseOrange) {
  //   baseOrange = oldCalculatedData.usedBaseOrange;
  // }

  const input = {
    candleWidth,
    candleTime,
    height,
    minPrice,
    maxPrice,
    lastIndex,
    xAccessor,
    xScale,
    yScale,
    minVolToShow,
    baseOrange,
    sellGradient,
    buyGradient,
    tickValue,
  };

  for (let i = plotData.length - 1; i > -1; i--) {
    const candle = plotData[i];

    if (
      useCachedData &&
      calculatedCandles.length > 0 &&
      i > 0 &&
      candle.opentime === oldCalculatedData?.calculatedCandles?.[1]?.openTime
    ) {
      oldCalculatedData.calculatedCandles[0] = last(calculatedCandles);
      calculatedCandles.pop();
      calculatedCandles = calculatedCandles.concat(
        oldCalculatedData.calculatedCandles
      );

      oldCalculatedData.bestAsks[0] = last(bestAsks);
      bestAsks.pop();
      bestAsks = bestAsks.concat(oldCalculatedData.bestAsks);
      oldCalculatedData.bestBids[0] = last(bestBids);
      bestBids.pop();
      bestBids = bestBids.concat(oldCalculatedData.bestBids);
      oldCalculatedData.dotArrs[0] = last(dotArrs);
      dotArrs.pop();
      dotArrs = dotArrs.concat(oldCalculatedData.dotArrs);

      if (currentState.maxVolSet < oldCalculatedData.maxVolSet) {
        currentState.maxVolSet = oldCalculatedData.maxVolSet;
      }
      if (currentState.maxDotVol < oldCalculatedData.maxDotVol) {
        currentState.maxDotVol = oldCalculatedData.maxDotVol;
      }
      break;
    }

    const { bestAsk, bestBid, dots, ...calculatedCandle } = calculateCandle(
      candle,
      i,
      input,
      currentState
    );
    calculatedCandles.push(calculatedCandle);
    bestAsks.push(bestAsk);
    bestBids.push(bestBid);
    dotArrs.push(dots);
  }

  let isTmpBaseOrange = false;
  let newBaseOrange = baseOrange;
  let newMinVolToShow = minVolToShow;
  if (shouldCalculateBase || !useCachedData) {
    const newAnchor = getAnchorInfo({
      showTopRatio,
      buyGradient,
      oldMinVolToShow: minVolToShow,
      volSet: currentState.volSet,
      maxVolSet: currentState.maxVolSet,
    });
    // newBaseOrange =
    //   newAnchor.newBaseOrange > baseOrange
    //     ? newAnchor.newBaseOrange
    //     : baseOrange;
    newBaseOrange = newAnchor.newBaseOrange;
    newMinVolToShow = newAnchor.newMinVolToShow;

    isTmpBaseOrange = !!useCachedData;
  }

  // Remove old data from cached data
  if (useCachedData) {
    const lastCalculatedCandle = last(calculatedCandles);
    if (lastCalculatedCandle.openTime < firstCandle.opentime) {
      const lastIndex = calculatedCandles.length - 1;
      for (let i = lastIndex; i > -1; i--) {
        const item = calculatedCandles[i];
        if (!item) {
          break;
        }
        if (item.openTime >= firstCandle.opentime) {
          break;
        }

        calculatedCandles.pop();
      }
    }
  }

  const oldestOpentime = last(calculatedCandles)?.openTime || null;

  return {
    isTmpBaseOrange,
    usedBaseOrange,
    baseOrange: newBaseOrange,
    minVolToShow: newMinVolToShow,
    calculatedCandles,
    bestAsks,
    bestBids,
    showTopRatio,
    minPrice,
    maxPrice,
    tickValue,
    dotArrs,
    oldestOpentime,
    maxVolSet: currentState.maxVolSet,
    maxDotVol: currentState.maxDotVol,
    useCachedData,
  };
};

export default HeatMap;
