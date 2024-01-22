import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import {
  hexToRGBA,
  isDefined,
  plotDataLengthBarWidth,
} from "../utils";

class StackImbalance extends Component {
  constructor(props) {
    super(props);
    this.renderSVG = this.renderSVG.bind(this);
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
  }
  drawOnCanvas(ctx, moreProps) {
    drawOnCanvas(ctx, this.props, moreProps);
  }
  renderSVG() {
    // renderSVG(moreProps) {
    return null;

    // const { className, wickClassName, candleClassName } = this.props;
    // const {
    //   xScale,
    //   chartConfig: { yScale },
    //   plotData,
    //   xAccessor,
    // } = moreProps;

    // const candleData = getStackImbalanceList(
    //   this.props,
    //   xAccessor,
    //   xScale,
    //   yScale,
    //   plotData
    // );

    // return (
    //   <g className={className}>
    //     <g className={wickClassName} key="wicks">
    //       {getWicksSVG(candleData)}
    //     </g>
    //     <g className={candleClassName} key="candles">
    //       {getCandlesSVG(this.props, candleData)}
    //     </g>
    //   </g>
    // );
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

StackImbalance.propTypes = {
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
};

StackImbalance.defaultProps = {
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
};

// function getWicksSVG(candleData) {
//   const wicks = candleData.map((each, idx) => {
//     const d = each.wick;
//     return (
//       <path
//         key={idx}
//         className={each.className}
//         stroke={d.stroke}
//         d={`M${d.x},${d.y1} L${d.x},${d.y2} M${d.x},${d.y3} L${d.x},${d.y4}`}
//       />
//     );
//   });

//   return wicks;
// }

// function getCandlesSVG(props, candleData) {
//   /* eslint-disable react/prop-types */
//   const { opacity, candleStrokeWidth } = props;
//   /* eslint-enable react/prop-types */

//   const candles = candleData.map((d, idx) => {
//     if (d.width <= 1)
//       return (
//         <line
//           className={d.className}
//           key={idx}
//           x1={d.x}
//           y1={d.y}
//           x2={d.x}
//           y2={d.y + d.height}
//           stroke={d.fill}
//         />
//       );
//     else if (d.height === 0)
//       return (
//         <line
//           key={idx}
//           x1={d.x}
//           y1={d.y}
//           x2={d.x + d.width}
//           y2={d.y + d.height}
//           stroke={d.fill}
//         />
//       );
//     return (
//       <rect
//         key={idx}
//         className={d.className}
//         fillOpacity={opacity}
//         x={d.x}
//         y={d.y}
//         width={d.width}
//         height={d.height}
//         fill={d.fill}
//         stroke={d.stroke}
//         strokeWidth={candleStrokeWidth}
//       />
//     );
//   });
//   return candles;
// }

function drawOnCanvas(ctx, props, moreProps) {
  const {
    xScale,
    chartConfig: { yScale },
    plotData,
    xAccessor,
    width,
  } = moreProps;

  const { imbalanceBuyList, imbalanceSellList } = getStackImbalanceList(
    props,
    xAccessor,
    xScale,
    yScale,
    plotData
  );

  // Buy
  const buyColor = props.fill({ close: 1, open: 0 });
  ctx.fillStyle = hexToRGBA(buyColor, 0.3);
  for (const item of imbalanceBuyList) {
    const { x, y, h, width: tmpWidth } = item;
    const finalWidth = tmpWidth == null ? width : tmpWidth;

    ctx.beginPath();
    ctx.fillRect(x - 0.5, y, finalWidth, h);
    ctx.fill();
  }

  // Sell
  const sellColor = props.fill({ close: 0, open: 1 });
  ctx.fillStyle = hexToRGBA(sellColor, 0.3);
  for (const item of imbalanceSellList) {
    const { x, y, h, width: tmpWidth } = item;
    const finalWidth = tmpWidth == null ? width : tmpWidth;

    ctx.beginPath();
    ctx.fillRect(x - 0.5, y, finalWidth, h);
    ctx.fill();
  }

  // const wickNest = nest()
  //   .key((d) => d.wick.stroke)
  //   .entries(candleData);

  // wickNest.forEach((outer) => {
  //   const { key, values } = outer;
  //   ctx.strokeStyle = key;
  //   ctx.fillStyle = key;
  //   values.forEach((each) => {
  //     /*
	// 		ctx.moveTo(d.x, d.y1);
	// 		ctx.lineTo(d.x, d.y2);

	// 		ctx.beginPath();
	// 		ctx.moveTo(d.x, d.y3);
	// 		ctx.lineTo(d.x, d.y4);
	// 		ctx.stroke(); */
  //     const d = each.wick;

  //     ctx.beginPath();
  //     ctx.fillStyle = key;
  //     ctx.fillRect(d.x - 0.5, d.y1, 1, d.y2 - d.y1);
  //     ctx.fillRect(d.x - 0.5, d.y3, 1, d.y4 - d.y3);

  //     ctx.fill();
  //     if (d.candlesChild && d.candlesChild.length !== 0) {
  //       for (const num of d.candlesChild) {
  //         const { x, y, h, type } = num.stackImbalance;
  //         let { width: widthObject } = num.stackImbalance;
  //         widthObject = widthObject == null ? width : widthObject;

  //         ctx.beginPath();
  //         const fillStyle = type === "sell" ? "#CC625D" : "#006500";
  //         ctx.fillStyle = hexToRGBA(fillStyle, 0.3);
  //         ctx.fillRect(x - 0.5, y, widthObject, h);
  //         ctx.fill();
  //       }
  //     }
  //   });
  // });
}

function findCandestickStackImbalanceSell(
  arrayPlotdata,
  stackImbalanceHight,
  indexCurrent
) {
  for (let i = 0; i < arrayPlotdata.length; i++) {
    const candle = arrayPlotdata[i];
    if (
      i > indexCurrent &&
      candle.close >= candle.open &&
      candle.close > stackImbalanceHight
    ) {
      return i;
    }
  }

  return null;
}

function findCandestickStackImbalanceBuy(
  arrayPlotdata,
  stackImbalanceLow,
  indexCurrent
) {
  for (let i = 0; i < arrayPlotdata.length; i++) {
    const candle = arrayPlotdata[i];
    if (
      i > indexCurrent &&
      candle.close <= candle.open &&
      candle.close < stackImbalanceLow
    ) {
      return i;
    }
  }

  return null;
}

function getStackImbalanceList(props, xAccessor, xScale, yScale, plotData) {
  const { yAccessor } = props;

  const values = plotData;
  const imbalanceBuyList = [];
  const imbalanceSellList = [];

  for (let i = 0; i < plotData.length; i++) {
    const d = plotData[i];
    if (isDefined(yAccessor(d).close)) {
      const x = Math.round(xScale(xAccessor(d)));

      const priceArray = d.orderFlow;
      let tickHeight = 0;
      if (Array.isArray(priceArray) && priceArray.length > 0) {
        tickHeight = Math.abs(
          yScale(priceArray[0].p + priceArray[0].tick) - yScale(priceArray[0].p)
        );
      }
      const heightOffset = tickHeight;

      const stackImbalance = d.stackImbalance;
      if (!stackImbalance) {
        continue;
      }

      const { sell: stackImbalanceSellArr, buy: stackImbalanceBuyArr } =
        stackImbalance;
      if (stackImbalanceSellArr.length > 0) {
        for (const num of stackImbalanceSellArr) {
          // var	stackImbalanceHight = Math.max(...num)
          const stackImbalanceHight = num[0];
          const indexCurrent = i;
          const indexCutStackImbalance = findCandestickStackImbalanceSell(
            values,
            stackImbalanceHight,
            indexCurrent
          );
          const widthStackImbalance =
            xScale(xAccessor(values[indexCutStackImbalance])) - x;

          imbalanceSellList.push({
            x: x,
            y: yScale(num[0]) - heightOffset,
            width: indexCutStackImbalance == null ? null : widthStackImbalance,
            h: yScale(num[num.length - 1]) - yScale(num[0]) + tickHeight,
            type: "sell",
            indexCutStackImbalance,
          });
        }
      }
      if (stackImbalanceBuyArr.length !== 0) {
        for (const num of stackImbalanceBuyArr) {
          // var	stackImbalanceLow = Math.min(...num)
          const stackImbalanceLow = num[num.length - 1];

          const indexCurrent = i;
          const indexCutStackImbalance = findCandestickStackImbalanceBuy(
            values,
            stackImbalanceLow,
            indexCurrent
          );
          imbalanceBuyList.push({
            x: x,
            y: yScale(num[0]) - heightOffset,
            width:
              indexCutStackImbalance == null
                ? null
                : xScale(xAccessor(plotData[indexCutStackImbalance])) - x,
            h: yScale(num[num.length - 1]) - yScale(num[0]) + tickHeight,
            type: "buy",
            indexCutStackImbalance,
          });
        }
      }
    }
  }

  return { imbalanceBuyList, imbalanceSellList };
}

export default StackImbalance;
