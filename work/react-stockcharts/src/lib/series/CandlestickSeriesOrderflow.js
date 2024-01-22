import { nest } from "d3-collection";
import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import {
  isDefined,
  functor,
  plotDataLengthBarWidth,
  hexToRGBA,
  last,
  head,
  fixLikeTickValue,
} from "../utils";
import { format } from "d3-format";

const formatInteger = format(".3s");
const formatVol = format(".2s");
const formatNumberTextVolume = (number) =>
  number ? String(formatInteger(number)) : "0";
const defaultWidth = (maxVolume) => maxVolume * 0.2;
const marginTop = 0;
const clusterOpacity = 0.8;
const wickWidth = 4;
const MIN_WITH_ORDERFLOW = 30;
const MIN_TICK_HEIGHT = 16;

class CandlestickSeries extends Component {
  constructor(props) {
    super(props);
    this.renderSVG = this.renderSVG.bind(this);
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
  }
  drawOnCanvas(ctx, moreProps) {
    drawOnCanvas(ctx, this.props, moreProps);
  }
  renderSVG(moreProps) {
    const { className, wickClassName, candleClassName } = this.props;
    const {
      xScale,
      chartConfig: { yScale },
      plotData,
      xAccessor,
    } = moreProps;

    const candleData = getCandleData(
      this.props,
      xAccessor,
      xScale,
      yScale,
      plotData
    );

    return (
      <g className={className}>
        <g className={wickClassName} key="wicks">
          {getWicksSVG(candleData)}
        </g>
        <g className={candleClassName} key="candles">
          {getCandlesSVG(this.props, candleData)}
        </g>
      </g>
    );
  }

  render() {
    const { clip } = this.props;
    return (
      <GenericChartComponent
        clip={clip}
        svgDraw={this.renderSVG}
        canvasDraw={this.drawOnCanvas}
        canvasToDraw={getAxisCanvas}
        drawOn={["pan"]}
      />
    );
  }
}

const defaultColors = {
  volume: "#01566c",
  clusterBuy: "#01566c",
  clusterSell: "#01566c",
  imbalanceBuyBg: "#01566c",
  imbalanceSellBg: "#01566c",
  imbalanceBuyColor: "#31eecc",
  imbalanceSellColor: "#eb602e",
  highlightZeroBg: "#7a6e88",
  highlightZeroColor: "#FFFFFF",
  unFinishedAuctionBg: "#02b358",
  unFinishedAuctionColor: "#FFFFFF",
  poc: {
    color: "#FFFF00",
    textColor: "#FFFFFF",
  },
  va: "#01566c",
  totalBidAsk: "#01566c",
};
export const DELTA_DIVERGENCE = {
  DELTAL: "delta",
  CANDLESTICK: "candlestick",
};

export const POC_TYPE = {
  COMBINED: "combined",
  SEPERATOR: "seperator",
};

const RED_COLOR = "#E96D38";
const BLUE_COLOR = "#2BDBEA";
const DARK_BLUE_COLOR = "#327ABC";
const YELLOW_COLOR = "#D19B0E";

export const DEFAULT_SETTINGS = {
  type: "imbalance",
  clusterVisualization: "histogram",
  volume: {
    display: true,
    color: BLUE_COLOR,
  },
  delta: true,
  ratioHigh: true,
  ratioLow: true,
  stackImbalance: true,
  imbalance: {
    display: true,
    ratio: 3,
    zoneCount: 3,
    filterVolume: 10,
    sellColor: RED_COLOR,
    buyColor: BLUE_COLOR,
    noSellColor: RED_COLOR,
    noBuyColor: BLUE_COLOR,
  },
  // point of control
  poc: {
    display: true,
    color: YELLOW_COLOR,
    textColor: DARK_BLUE_COLOR,
    type: POC_TYPE.SEPERATOR,
  },
  // value area
  va: {
    display: true,
    value: 70,
    color: "#01566c",
  },
  highlightZero: {
    display: true,
    color: BLUE_COLOR,
    textColor: DARK_BLUE_COLOR,
  },
  unFinishedAuction: {
    display: true,
    color: BLUE_COLOR,
    textColor: DARK_BLUE_COLOR,
  },
  // arrow direction
  deltaDivergence: {
    display: true,
    type: "delta",
  },
  exhaustionAirow: {
    display: true,
    value: 3,
  },
  totalBidAsk: true,
};

CandlestickSeries.propTypes = {
  className: PropTypes.string,
  wickClassName: PropTypes.string,
  candleClassName: PropTypes.string,
  widthRatio: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  classNames: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  stroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  wickStroke: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  yAccessor: PropTypes.func,
  clip: PropTypes.bool,
  footprintColors: PropTypes.object,
  ticks: PropTypes.number,
  minTicks: PropTypes.number,
  settings: {
    volume: {
      display: PropTypes.bool,
      color: PropTypes.string,
    },
    delta: PropTypes.bool,
    ratioHigh: PropTypes.bool,
    ratioLow: PropTypes.bool,
    stackImbalance: PropTypes.bool,
    imbalance: {
      display: PropTypes.bool,
      ratio: PropTypes.number,
      zoneCount: PropTypes.number,
      filterVolume: PropTypes.number,
      noSellColor: PropTypes.string,
      sellColor: PropTypes.string,
      noBuyColor: PropTypes.string,
      buyColor: PropTypes.string,
    },
    // point of control
    poc: {
      display: PropTypes.bool,
      color: PropTypes.string,
      textColor: PropTypes.string,
      type: "Combined" | "Seperate",
    },
    // value area
    va: {
      display: PropTypes.bool,
      value: PropTypes.number,
      color: PropTypes.string,
    },
    highlightZero: {
      display: PropTypes.bool,
      color: PropTypes.string,
      textColor: PropTypes.string,
    },
    unFinishedAuction: {
      display: PropTypes.bool,
      color: PropTypes.string,
      textColor: PropTypes.string,
    },
    deltaDivergence: {
      display: PropTypes.bool,
      type: PropTypes.string,
    },
    exhaustionAirow: {
      display: PropTypes.bool,
      value: PropTypes.number,
    },
    totalBidAsk: PropTypes.bool,
  },
};

CandlestickSeries.defaultProps = {
  className: "react-stockcharts-candlestick",
  wickClassName: "react-stockcharts-candlestick-wick",
  candleClassName: "react-stockcharts-candlestick-candle",
  yAccessor: (d) => ({
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
  }),
  classNames: (d) => (d.close > d.open ? "up" : "down"),
  width: plotDataLengthBarWidth,
  wickStroke: "#000000",
  // wickStroke: d => d.close > d.open ? "#6BA583" : "#FF0000",
  fill: (d) => (d.close > d.open ? "#6BA583" : "#FF0000"),
  // stroke: d => d.close > d.open ? "#6BA583" : "#FF0000",
  stroke: "#000000",
  candleStrokeWidth: 0.5,
  // stroke: "none",
  widthRatio: 0.8,
  opacity: 0.5,
  clip: true,
  footprintColors: defaultColors,
  ticks: 10,
  minTicks: 10,
  settings: DEFAULT_SETTINGS,
};

function getWicksSVG(candleData) {
  const wicks = candleData.map((each, idx) => {
    const d = each.wick;
    return (
      <path
        key={idx}
        className={each.className}
        stroke={d.stroke}
        d={`M${d.x},${d.y1} L${d.x},${d.y2} M${d.x},${d.y3} L${d.x},${d.y4}`}
      />
    );
  });

  return wicks;
}

function getCandlesSVG(props, candleData) {
  /* eslint-disable react/prop-types */
  const { opacity, candleStrokeWidth } = props;
  /* eslint-enable react/prop-types */

  const candles = candleData.map((d, idx) => {
    if (d.width <= 1)
      return (
        <line
          className={d.className}
          key={idx}
          x1={d.x}
          y1={d.y}
          x2={d.x}
          y2={d.y + d.height}
          stroke={d.fill}
        />
      );
    else if (d.height === 0)
      return (
        <line
          key={idx}
          x1={d.x}
          y1={d.y}
          x2={d.x + d.width}
          y2={d.y + d.height}
          stroke={d.fill}
        />
      );
    return (
      <rect
        key={idx}
        className={d.className}
        fillOpacity={opacity}
        x={d.x}
        y={d.y}
        width={d.width}
        height={d.height}
        fill={d.fill}
        stroke={d.stroke}
        strokeWidth={candleStrokeWidth}
      />
    );
  });
  return candles;
}

const getWidth = (maxWith, maxValue, value) => maxWith * (value / maxValue);

function drawCandles(ctx, props, moreProps) {
  const { opacity, candleStrokeWidth } = props;
  const {
    xScale,
    chartConfig: { yScale },
    plotData,
    xAccessor,
  } = moreProps;

  // const wickData = getWickData(props, xAccessor, xScale, yScale, plotData);
  const candleData = getCandleData(props, xAccessor, xScale, yScale, plotData);

  const candleNest = nest()
    .key((d) => d.stroke)
    .key((d) => d.fill)
    .entries(candleData);

  candleNest.forEach((outer) => {
    const { key: strokeKey, values: strokeValues } = outer;
    if (strokeKey !== "none") {
      ctx.strokeStyle = strokeKey;
      ctx.lineWidth = candleStrokeWidth;
    }
    strokeValues.forEach((inner) => {
      const { key, values } = inner;
      const fillStyle = head(values).width <= 1 ? key : hexToRGBA(key, opacity);
      ctx.fillStyle = fillStyle;

      values.forEach((d) => {
        if (d.width <= 1) {
          // <line className={d.className} key={idx} x1={d.x} y1={d.y} x2={d.x} y2={d.y + d.height}/>
          /*
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x, d.y + d.height);
          ctx.stroke();
          */
          ctx.strokeRect(d.x - 0.5, d.y, 1, d.height);
        } else if (d.height === 0) {
          // <line key={idx} x1={d.x} y1={d.y} x2={d.x + d.width} y2={d.y + d.height} />
          /*
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + d.width, d.y + d.height);
          ctx.stroke();
          */
          ctx.strokeRect(d.x, d.y - 0.5, d.width, 1);
        } else {
          /*
          ctx.beginPath();
          ctx.rect(d.x, d.y, d.width, d.height);
          ctx.closePath();
          ctx.fill();
          if (strokeKey !== "none") ctx.stroke();
          */
          ctx.strokeRect(d.x, d.y, d.width, d.height);
          if (strokeKey !== "none") ctx.strokeRect(d.x, d.y, d.width, d.height);
        }
      });
    });
  });

  const wickNest = nest()
    .key((d) => d.wick.stroke)
    .entries(candleData);

  wickNest.forEach((outer) => {
    const { key, values } = outer;
    ctx.strokeStyle = key;
    ctx.fillStyle = key;
    values.forEach((each) => {
      const d = each.wick;
      ctx.beginPath();
      ctx.fillRect(d.x - 0.5, d.y1, 1, d.y2 - d.y1);
      ctx.fillRect(d.x - 0.5, d.y3, 1, d.y4 - d.y3);
      ctx.fill();
    });
  });

  return wickNest;
}

function drawOnCanvas(ctx, props, moreProps) {
  const {
    xScale,
    chartConfig: { yScale },
    plotData,
    xAccessor,
  } = moreProps;
  const widthFunctor = functor(props.width);
  const width = widthFunctor(props, {
    xScale,
    xAccessor,
    plotData,
  });
  const { settings } = props;

  /**
   * Check height to draw order flow or not
   *  */
  if (!Array.isArray(plotData) || plotData.length < 1) {
    return drawCandles(ctx, props, moreProps);
  }

  // Find an order flow
  let orderFlow = plotData?.[0]?.orderFlow;
  let i = 0;
  while (
    i < plotData.length - 1 &&
    (!Array.isArray(orderFlow) || orderFlow.length === 0)
  ) {
    i++;
    orderFlow = plotData[i].orderFlow;
  }
  // No orderflow
  if (!Array.isArray(orderFlow) || orderFlow.length < 1) {
    return drawCandles(ctx, props, moreProps);
  }
  // Calc height
  const height =
    yScale(orderFlow[0].p) - yScale(orderFlow[0].p + orderFlow[0].tick);

  if (height < 3 || width < MIN_WITH_ORDERFLOW) {
    return drawCandles(ctx, props, moreProps);
  }

  const candleData = getCandleData(props, xAccessor, xScale, yScale, plotData);
  const wickNest = nest()
    .key((d) => d.wick.stroke)
    .entries(candleData);

  wickNest.forEach((outer) => {
    const { key, values } = outer;
    ctx.strokeStyle = key;
    ctx.fillStyle = key;

    values.forEach((each) => {
      const d = each.wick;
      if (
        !d.candlesChild ||
        !Array.isArray(d.candlesChild) ||
        d.candlesChild.length === 0
      ) {
        return;
      }

      const {
        ratioHigh,
        ratioLow,
        askvol,
        bidvol,
        delta,
        volume,
        flowDirection,
        deltaDirection,
      } = each;
      const imbalance = each.stackImbalance
        ? each.stackImbalance
        : { buy: [], sell: [] };

      if (d.candlesChild[d.candlesChild.length - 1]) {
        const maxWidth = each.width / 2;
        let clusterHeight = 16;
        if (d.candlesChild.length) {
          clusterHeight = d.candlesChild[0].orderflow.height; // height of child candle (scale by tick)
        }

        const fontSize = getFontSize(width, clusterHeight);

        const font = `lighter ${fontSize}px Roboto`;
        ctx.font = font;
        ctx.textBaseline = "bottom";

        const metrics = ctx.measureText("HMgyẾụp");
        const fontHeight =
          (metrics.fontBoundingBoxAscent || metrics.actualBoundingBoxAscent) +
          (metrics.fontBoundingBoxDescent ||
            metrics.actualBoundingBoxDescent + 1);

        const inforMargin = {
          top: 10,
          bottom: 20,
        };

        // Center line
        ctx.beginPath();
        ctx.lineWidth = wickWidth;
        ctx.strokeStyle = d.stroke;
        ctx.moveTo(d.x, d.y2);
        ctx.lineTo(d.x, d.y3);
        ctx.stroke();

        // sum row volume
        const maxVolume =
          d.maxVolumeSell > d.maxVolumeBuy ? d.maxVolumeSell : d.maxVolumeBuy;
        for (const num of d.candlesChild) {
          drawSell({
            ctx,
            maxWidth,
            maxVolume,
            num,
            settings,
            clusterHeight,
            d,
            fontSize,
            fontHeight,
            maxTotalVolumeBidAsk: d.maxTotalVolumeBidAsk,
          });

          // restore font when have imbalance sell
          if (num.orderflow.imbalanceSell) {
            ctx.font = font;
          }

          drawBuy({
            ctx,
            maxWidth,
            maxVolume,
            num,
            settings,
            clusterHeight,
            d,
            fontSize,
            fontHeight,
            maxTotalVolumeBidAsk: d.maxTotalVolumeBidAsk,
          });

          // restore font when have imbalance sell
          if (num.orderflow.imbalanceBuy) {
            ctx.font = font;
          }
        }
        // ctx.font = "bold 15px sans-serif"
        // 	sum total volume

        // Find max y for bottom margin
        const minY =
          yScale(last(d.candlesChild)?.orderflow?.p + d.tick) || d.y1;
        const maxY = yScale(head(d.candlesChild)?.orderflow?.yRL) || d.y4;

        const lineHeight = fontHeight + 4;
        let numLineTop = 1;
        let numLineBottom = 1;

        const LEFT = 5;
        const RIGHT = 8;

        // imbalance ratio
        if (settings.imbalance.display) {
          drawImbalanceSell(
            ctx,
            imbalance,
            d.x - LEFT,
            minY - lineHeight * numLineTop - inforMargin.top,
            settings.imbalance.noSellColor
          ); // stack imbalance buy
          drawImbalanceBuy(
            ctx,
            imbalance,
            d.x + RIGHT + wickWidth,
            minY - lineHeight * numLineTop - inforMargin.top,
            settings.imbalance.noBuyColor
          ); // total bid/ask volume
          numLineTop = numLineTop + 1;
        }

        if (settings.ratioHigh) {
          drawRH(
            ctx,
            ratioHigh,
            d.x - 0.5,
            minY - lineHeight * numLineTop - inforMargin.top
          );
          numLineTop = numLineTop + 1;
        }

        if (settings.delta) {
          drawDelta(
            ctx,
            delta,
            d.x,
            minY - lineHeight * numLineTop - inforMargin.top
          );
          numLineTop = numLineTop + 1;
        }

        if (settings.volume.display) {
          drawV(
            ctx,
            volume,
            d.x,
            minY - lineHeight * numLineTop - inforMargin.top
          );
          numLineTop = numLineTop + 1;
        }

        if (settings.deltaDivergence.display) {
          drawTriangleUp(
            ctx,
            deltaDirection,
            d.x,
            minY - lineHeight * numLineTop - inforMargin.top / 2
          );
          drawTriangleDown(
            ctx,
            deltaDirection,
            d.x,
            minY - lineHeight * numLineTop - inforMargin.top / 2
          );
        }

        if (settings.exhaustionAirow.display) {
          drawArrowUp(
            ctx,
            flowDirection,
            d.x - Math.min(maxWidth / 2, 25),
            maxY + inforMargin.top / 2 + 20
          );
          drawArrowDown(
            ctx,
            flowDirection,
            d.x + Math.min(maxWidth / 2, 25),
            minY - inforMargin.top / 2
          );
        }

        ctx.font = font;

        if (settings.ratioLow) {
          drawRL(
            ctx,
            ratioLow,
            d.x - 0.5,
            maxY + lineHeight * numLineBottom
          );
          numLineBottom = numLineBottom + 1;
        }

        if (settings.totalBidAsk) {
          // stack imbalance sell
          drawTotalBidVol(
            ctx,
            formatVol(+bidvol),
            d.x - LEFT,
            maxY + lineHeight * numLineBottom
          );
          drawTotalAskVol(
            ctx,
            formatVol(+askvol),
            d.x + RIGHT,
            maxY + lineHeight * numLineBottom
          );
          numLineBottom = numLineBottom + 1;
        }
      }
    });
  });
}

function getFontSize(width, height) {
  const ratioWidth = 0.2;
  const ratioHeight = 0.5;

  const fontSize = Math.min(14, width * ratioWidth, height * ratioHeight);
  return fontSize;
}

function drawSell({
  ctx,
  maxWidth,
  maxVolume,
  num,
  settings,
  clusterHeight,
  d,
  fontSize,
  fontHeight,
}) {
  /**
   * SELL
   */
  const widthSell = getWidth(
    maxWidth,
    maxVolume,
    num.orderflow.sumKL_Seller || defaultWidth(maxVolume) // default  = 2/10 maxWidth
  );
  let textColor = "#FFFFFF";
  const strokeStyle = "#50B6D4";
  let fillStyle = hexToRGBA(settings.volume.color, clusterOpacity);

  if (num.display) {
    // POC
    if (settings.poc.display) {
      // combined
      if (settings.poc.type === "combined") {
        if (
          d.maxTotalVolumeBidAsk ===
          num.orderflow.sumKL_Buyer + num.orderflow.sumKL_Seller
        ) {
          fillStyle = settings.poc.color;
          textColor = settings.poc.textColor;
        }
      }
      // seperator
      if (settings.poc.type === "seperator") {
        if (d.maxVolumeSell === num.orderflow.sumKL_Seller) {
          fillStyle = settings.poc.color;
          textColor = settings.poc.textColor;
        }
      }
    }

    if (d.maxPriceOfCandleChild === num.orderflow.p) {
      if (settings.highlightZero.display) {
        // hight zero on sell column
        if (num.orderflow.sumKL_Seller === 0) {
          fillStyle = settings.highlightZero.color;
          textColor = settings.highlightZero.textColor;
        }
      }
      if (settings.unFinishedAuction.display) {
        // unfinished auction
        if (num.orderflow.sumKL_Seller !== 0) {
          fillStyle = settings.unFinishedAuction.color;
          textColor = settings.unFinishedAuction.textColor;
        }
      }
    }

    // imbalance
    if (settings.imbalance.display && num.orderflow.imbalanceSell) {
      textColor = settings.imbalance.sellColor;
    }

    ctx.fillStyle = fillStyle;
    ctx.fillRect(
      num.orderflow.x - widthSell - wickWidth / 2,
      num.orderflow.ySB - marginTop,
      widthSell,
      clusterHeight
    );

    ctx.fillStyle = textColor;
    ctx.strokeStyle = strokeStyle;
    ctx.textAlign = "right";

    if (settings.imbalance.display && num.orderflow.imbalanceSell) {
      ctx.font = `bold ${fontSize}px Roboto`;
    }
    ctx.fillText(
      formatNumberTextVolume(num.orderflow.sumKL_Seller),
      num.orderflow.x - 3,
      num.orderflow.ySB + clusterHeight - (clusterHeight - fontHeight) / 2
    );
  }
}

function drawBuy({
  ctx,
  maxWidth,
  maxVolume,
  num,
  settings,
  clusterHeight,
  d,
  fontSize,
  fontHeight,
}) {
  /**
   * BUY
   */
  const widthBuy = getWidth(
    maxWidth,
    maxVolume,
    num.orderflow.sumKL_Buyer || defaultWidth(maxVolume) // default  = 2/10 maxWidth
  );
  let fillStyle = hexToRGBA(settings.volume.color, clusterOpacity);
  let textColor = "#FFFFFF";
  const strokeStyle = "#FF0000";

  if (num.display) {
    // POC
    if (settings.poc.display) {
      // combined
      if (settings.poc.type === "combined") {
        if (
          d.maxTotalVolumeBidAsk ===
          num.orderflow.sumKL_Buyer + num.orderflow.sumKL_Seller
        ) {
          fillStyle = settings.poc.color;
          textColor = settings.poc.textColor;
        }
      }
      // seperator
      if (settings.poc.type === "seperator") {
        if (d.maxVolumeBuy === num.orderflow.sumKL_Buyer) {
          fillStyle = settings.poc.color;
          textColor = settings.poc.textColor;
        }
      }
    }

    if (d.minPriceOfCandleChild === num.orderflow.p) {
      if (settings.highlightZero.display) {
        // hight zero on sell column
        if (num.orderflow.sumKL_Buyer === 0) {
          fillStyle = settings.highlightZero.color;
          textColor = settings.highlightZero.textColor;
        }
      }
      if (settings.unFinishedAuction.display) {
        // unfinished auction
        if (num.orderflow.sumKL_Buyer !== 0) {
          fillStyle = settings.unFinishedAuction.color;
          textColor = settings.unFinishedAuction.textColor;
        }
      }
    }

    // imbalance
    if (settings.imbalance.display && num.orderflow.imbalanceBuy) {
      textColor = settings.imbalance.buyColor;
    }

    ctx.fillStyle = fillStyle;
    ctx.fillRect(
      num.orderflow.x + wickWidth / 2,
      num.orderflow.ySB - marginTop,
      widthBuy,
      clusterHeight
    );

    ctx.fillStyle = textColor;
    ctx.strokeStyle = strokeStyle;
    ctx.textAlign = "left";

    if (settings.imbalance.display && num.orderflow.imbalanceBuy) {
      ctx.font = `bold ${fontSize}px Roboto`;
    }
    ctx.fillText(
      formatNumberTextVolume(num.orderflow.sumKL_Buyer),
      num.orderflow.x + 3,
      num.orderflow.ySB + clusterHeight - (clusterHeight - fontHeight) / 2
    );
  }
}

function drawV(ctx, volume, x, y) {
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#FF0000";
  ctx.textAlign = "center";
  ctx.fillText("V: ".concat(formatInteger(volume)), x, y); // delta
}

function drawDelta(ctx, delta, x, y) {
  if (delta < 0) {
    ctx.fillStyle = "#FF0000";
    ctx.strokeStyle = "#50B6D4";
    ctx.textAlign = "center";
    ctx.fillText("D: ".concat(formatInteger(delta)), x, y);
  } else {
    ctx.fillStyle = "#00FF00";
    ctx.strokeStyle = "#FF0000";
    ctx.textAlign = "center";
    ctx.fillText("D: ".concat(formatInteger(delta)), x, y);
  } // Flow arrow
}
function drawArrowUp(ctx, flowDirection, x, y) {
  if (flowDirection !== null && flowDirection !== void 0 && flowDirection.up) {
    ctx.fillStyle = "#00FF00";
    ctx.fillText("⬆", x, y);
  }
}

function drawArrowDown(ctx, flowDirection, x, y) {
  if (
    flowDirection !== null &&
    flowDirection !== void 0 &&
    flowDirection.down
  ) {
    ctx.fillStyle = "#FF0000";
    ctx.fillText("⬇", x, y);
  }
}

function drawTriangleUp(ctx, deltaDirection, x, y) {
  if (
    deltaDirection !== null &&
    deltaDirection !== void 0 &&
    deltaDirection.up
  ) {
    ctx.fillStyle = "#00FF00";
    ctx.fillText("▲", x, y);
  }
}

function drawTriangleDown(ctx, deltaDirection, x, y) {
  if (
    deltaDirection !== null &&
    deltaDirection !== void 0 &&
    deltaDirection.down
  ) {
    ctx.fillStyle = "#FF0000";
    ctx.fillText("▼", x, y);
  }
}

function drawRL(ctx, ratioLow, x, y) {
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#50B6D4";
  ctx.textAlign = "center";
  ctx.fillText("R/L: ".concat(ratioLow), x, y);
}

function drawRH(ctx, ratioHigh, x, y) {
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#50B6D4";
  ctx.textAlign = "center";
  ctx.fillText("R/H: ".concat(ratioHigh), x, y);
}

function drawImbalanceSell(ctx, imbalance, x, y, color) {
  // stack imbalance sell
  ctx.fillStyle = color;
  ctx.strokeStyle = "#50B6D4";
  ctx.textAlign = "right";
  ctx.fillText(imbalance.noSell, x, y); // stack imbalance buy
}

function drawImbalanceBuy(ctx, imbalance, x, y, color) {
  // stack imbalance sell
  ctx.fillStyle = color;
  ctx.strokeStyle = "#50B6D4";
  ctx.textAlign = "right";
  ctx.fillText(imbalance.noBuy, x, y); // stack imbalance buy
}

function drawTotalBidVol(ctx, bidvol, x, y) {
  ctx.fillStyle = "#FFFF00";
  ctx.strokeStyle = "#50B6D4";
  ctx.textAlign = "right";
  ctx.fillText(bidvol, x, y);
}

function drawTotalAskVol(ctx, askvol, x, y) {
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#FF0000";
  ctx.textAlign = "left";
  ctx.fillText(askvol, x, y);
}

function getCandleData(props, xAccessor, xScale, yScale, plotData) {
  const { wickStroke: wickStrokeProp, ticks: ticksProps, minTicks } = props;
  const wickStroke = functor(wickStrokeProp);

  const { classNames, fill: fillProp, stroke: strokeProp, yAccessor } = props;
  const className = functor(classNames);

  const fill = functor(fillProp);
  const stroke = functor(strokeProp);

  const widthFunctor = functor(props.width);
  const width = widthFunctor(props, {
    xScale,
    xAccessor,
    plotData,
  });

  /*
  const candleWidth = Math.round(width);
  const offset = Math.round(candleWidth === 1 ? 0 : 0.5 * width);
  */
  const trueOffset = 0.5 * width;
  const offset =
    trueOffset > 0.7 ? Math.round(trueOffset) : Math.floor(trueOffset);

  // eslint-disable-next-line prefer-const
  let candles = [];

  const ticks = getTicskOfYAxis(ticksProps, yScale);
  let tick = minTicks;
  for (let i = minTicks; i <= ticks; i += minTicks) {
    const tickHeight = Math.abs(yScale(i) - yScale(0));
    if (tickHeight >= MIN_TICK_HEIGHT) {
      tick = i;
      break;
    }
  }

  for (let i = 0; i < plotData.length; i++) {
    const d = plotData[i];
    const candlesChild = [];
    if (isDefined(yAccessor(d).close)) {
      const x = xScale(xAccessor(d));
      const ohlc = yAccessor(d);
      const y = yScale(Math.max(ohlc.open, ohlc.close));
      const height = Math.abs(yScale(ohlc.open) - yScale(ohlc.close)); // height of the candle

      const priceArray = d.orderFlow;
      let maxVolumeSell = 0;
      let maxVolumeBuy = 0;
      let maxTotalVolumeBidAsk = 0;
      let maxPriceOfCandleChild = 0;
      let minPriceOfCandleChild = 0;

      const candleMinTick = head(priceArray)?.tick ?? minTicks;
      const newOrderFlow = combineTicks(priceArray, tick, candleMinTick);

      if (Array.isArray(newOrderFlow) && newOrderFlow.length) {
        const height = Math.abs(
          // height of a children of the candle
          yScale(newOrderFlow[0].p + head(newOrderFlow).tick) -
            yScale(newOrderFlow[0].p) // use tick of children of the candle(newOrderFlow)
        );
        minPriceOfCandleChild = newOrderFlow[0].p;

        for (const num of newOrderFlow) {
          if (maxTotalVolumeBidAsk < num.sell + num.buy) {
            maxTotalVolumeBidAsk = num.sell + num.buy;
          }
          if (maxVolumeSell < num.sell) {
            maxVolumeSell = num.sell;
          }
          if (maxVolumeBuy < num.buy) {
            maxVolumeBuy = num.buy;
          }
          if (maxPriceOfCandleChild < num.p) {
            maxPriceOfCandleChild = num.p;
          }

          if (minPriceOfCandleChild > num.p) {
            minPriceOfCandleChild = num.p;
          }

          candlesChild.push({
            // type: "line"
            x: x - offset,
            y: y,
            display: true,
            orderflow: {
              x: x,
              p: num.p,
              yRL: num.p - head(priceArray).tick / 2,
              sumKL_Seller: num.sell ? num.sell : 0,
              sumKL_Buyer: num.buy ? num.buy : 0,
              ySB: (yScale(num.p + tick) ?? y) - 0.5, // - 0.5 to add space between 2 ticks
              height: height - 0.5, // - 0.5 to add space between 2 ticks
              imbalanceSell: num.imbalanceSell || false,
              imbalanceBuy: num.imbalanceBuy || false,
            },
          });
        }
      }

      candles.push({
        // type: "line"
        ...d,
        x: x - offset,
        y: y,
        wick: {
          stroke: wickStroke(ohlc),
          x: x,
          y1: yScale(ohlc.high),
          y2: y,
          y3: y + height, // Math.round(yScale(Math.min(ohlc.open, ohlc.close))),
          y4: yScale(ohlc.low),
          candlesChild,
          index: d.idx.index,
          maxTotalVolumeBidAsk,
          maxVolumeSell,
          maxVolumeBuy,
          maxPriceOfCandleChild,
          minPriceOfCandleChild,
          tick: tick,
        },
        height: height,
        width: offset * 2,
        className: className(ohlc),
        fill: fill(ohlc),
        stroke: stroke(ohlc),
        direction: ohlc.close - ohlc.open,
      });
    }
  }

  return candles;
}

const getTicskOfYAxis = (ticks, yScale) => {
  const rangeY = yScale.ticks(ticks);
  if (rangeY && rangeY.length > 2) {
    return rangeY[1] - rangeY[0];
  }
  return ticks;
};

const combineTwoTick = (candle1, candle2, price, tick, display = true) => {
  const newCandle = {
    buy: candle1.buy + candle2.buy,
    p: price,
    quotevol: candle1.quotevol + candle2.quotevol,
    sell: candle1.sell + candle2.sell,
    takerbuybasevol: candle1.takerbuybasevol + candle2.takerbuybasevol,
    takerbuyquotevol: candle1.takerbuyquotevol + candle2.takerbuyquotevol,
    tick: tick,
    volume: candle1.volume + candle2.volume,
    display: display,
    imbalanceSell: candle2.imbalanceSell,
    imbalanceBuy: candle2.imbalanceBuy,
  };

  return newCandle;
};

const combineTicks = (priceArray, tick, minTicks) => {
  let newOrderFlow = [];
  const display = true;
  let currentPrice = null;
  let tmpCombinedTick = null;
  if (!Array.isArray(priceArray) || priceArray.length === 0) {
    return newOrderFlow;
  }

  const sortedPriceArray = [...priceArray].sort((a, b) => a.p - b.p);

  if (tick <= minTicks) {
    newOrderFlow = sortedPriceArray;
    return newOrderFlow;
  }

  for (let i = 0; i <= sortedPriceArray.length - 1; i++) {
    // target
    const tickInfo = sortedPriceArray[i];
    if (!tickInfo) {
      continue;
    }

    // init step
    if (currentPrice === null) {
      currentPrice = fixLikeTickValue(tickInfo.p - (tickInfo.p % tick), tick);
      tmpCombinedTick = {
        ...tickInfo,
        display,
        p: currentPrice,
        tick,
      };
      continue;
    }

    if (currentPrice + tick > tickInfo.p) {
      // combine
      tmpCombinedTick = combineTwoTick(
        tmpCombinedTick,
        tickInfo,
        currentPrice,
        tick
      );
    } else {
      // insert and start new tick
      newOrderFlow.push(tmpCombinedTick);
      currentPrice += tick;
      tmpCombinedTick = {
        ...tickInfo,
        display,
        p: currentPrice,
        tick,
      };
    }
  }

  if (tmpCombinedTick) {
    newOrderFlow.push(tmpCombinedTick);
  }

  return newOrderFlow;
};

export default CandlestickSeries;
