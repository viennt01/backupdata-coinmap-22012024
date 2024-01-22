import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

import StackedBarSeries, {
  drawOnCanvasHelper,
  drawOnCanvas2,
  getBarsSVG2,
  svgHelper,
  identityStack,
} from "./StackedBarSeries";

import { functor } from "../utils";

class DeltaSeries extends Component {
  constructor(props) {
    super(props);
    this.renderSVG = this.renderSVG.bind(this);
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
  }
  drawOnCanvas(ctx, moreProps) {
    if (this.props.swapScales) {
      const { xAccessor } = moreProps;
      drawOnCanvasHelper(ctx, this.props, moreProps, xAccessor, identityStack);
    } else {
      const bars = getBars(this.props, moreProps);
      drawOnCanvas2(this.props, ctx, bars);
    }
  }
  renderSVG(moreProps) {
    if (this.props.swapScales) {
      const { xAccessor } = moreProps;
      return (
        <g>{svgHelper(this.props, moreProps, xAccessor, identityStack)}</g>
      );
    } else {
      const bars = getBars(this.props, moreProps);
      return <g>{getBarsSVG2(this.props, bars)}</g>;
    }
  }
  render() {
    const { clip } = this.props;

    return (
      <GenericChartComponent
        clip={clip}
        svgDraw={this.renderSVG}
        canvasToDraw={getAxisCanvas}
        canvasDraw={this.drawOnCanvas}
        drawOn={["pan"]}
      />
    );
  }
}

DeltaSeries.propTypes = {
  baseAt: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  stroke: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  // yAccessor: PropTypes.func.isRequired,
  opacity: PropTypes.number,
  fill: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  clip: PropTypes.bool,
  swapScales: PropTypes.bool,
};

DeltaSeries.defaultProps = StackedBarSeries.defaultProps;

export default DeltaSeries;

/*
 Initially, this program was using StackedBarSeries.getBars
 to benefit from code reuse and having a single place that
 contains the logic for drawing all types of bar charts
 simple, grouped, horizontal, but turnes out
 making it highly cuztimizable also made it slow for the
 most simple case, a regular bar chart.
 This function contains just the necessary logic
 to create bars
*/
function getBars(props, moreProps) {
  const baseAt = props.baseAt,
    fill = props.fill,
    stroke = props.stroke;
  const xScale = moreProps.xScale,
    xAccessor = moreProps.xAccessor,
    plotData = moreProps.plotData,
    yScale = moreProps.chartConfig.yScale;

  const getFill = (0, functor)(fill);
  const getBase = (0, functor)(baseAt);

  const widthFunctor = (0, functor)(props.width);

  const width = widthFunctor(props, {
    xScale: xScale,
    xAccessor: xAccessor,
    plotData: plotData,
  });
  /*
 const barWidth = Math.round(width);
 const offset = Math.round(barWidth === 1 ? 0 : 0.5 * barWidth);
 */
  const offset = Math.floor(0.5 * width);

  const bars = plotData
    .filter((d) => {
      // return (0, isDefined)(yAccessor(d));
      return d;
    })
    .map((d) => {
      // var yValue = yAccessor(d);
      let yValue = 0;
      let deltaHight = 0;
      let deltalow = 0;

      if (d.aggTrades && d.aggTrades.length !== 0) {
        const lastItem = d.aggTrades[d.aggTrades.length - 1];
        yValue = lastItem.deltachart;
        deltaHight = lastItem.deltaHigh;
        deltalow = lastItem.deltaLow;
        // deltaHight = Math.max(
        //   ...d.aggTrades[d.aggTrades.length - 1].deltaHightlow
        // );
        // deltalow = Math.min(
        //   ...d.aggTrades[d.aggTrades.length - 1].deltaHightlow
        // );
        // console.log("123", deltalow, deltaHight, d.aggTrades[d.aggTrades.length-1].deltaHightlow )
      }
      // console.log("delta", { deltalow, deltaHight });

      let y = yScale(yValue);
      let yHight = yScale(deltaHight);
      let yLow = yScale(deltalow);
      const x = Math.round(xScale(xAccessor(d))) - offset;
      let h = getBase(xScale, yScale, d) - yScale(yValue);
      let hHight = getBase(xScale, yScale, d) - yScale(deltaHight);
      let hLow = getBase(xScale, yScale, d) - yScale(deltalow);

      // console.log("x_delta:",x,"getBase:",getBase(xScale, yScale, d),"y_delta:",y)

      if (h < 0) {
        y = y + h;
        h = -h;
      }
      if (hHight < 0) {
        yHight = yHight + hHight;
        hHight = -hHight;
      }
      if (hLow < 0) {
        yLow = yLow + hLow;
        hLow = -hLow;
      }

      return {
        // type: "line"
        x: x,
        y: Math.round(y),
        height: Math.round(h),
        width: offset * 2,
        yHight: Math.round(yHight),
        heighHight: Math.round(hHight),
        yLow: Math.round(yLow),
        heighLow: Math.round(hLow),
        fill: getFill(yValue, 0),
        // fill: yValue > 0 ? "#00FF00" : "#FF0000",
        stroke: stroke ? getFill(yValue, 0) : "none",
      };
    });

  return bars;
}
