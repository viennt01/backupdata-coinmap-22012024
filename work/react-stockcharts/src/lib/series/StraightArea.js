import React, { Component } from "react";
import PropTypes from "prop-types";

import { hexToRGBA, isDefined, isNotDefined } from "../utils";

import GenericChartComponent from "../GenericChartComponent";
import { getAxisCanvas } from "../GenericComponent";

class StraightArea extends Component {
  constructor(props) {
    super(props);
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
  }
  drawOnCanvas(ctx, moreProps) {
    const { type, stroke, fill, opacity } = this.props;
    const { yValue1, yValue2, xValue1, xValue2 } = this.props;
    const { xScale } = moreProps;
    const {
      chartConfig: { yScale, width: chartWidth, height: chartHeight },
    } = moreProps;

    ctx.beginPath();

    ctx.fillStyle = hexToRGBA(fill, opacity);
    ctx.strokeStyle = stroke;

    const { x1, y1, width, height } = getLineCoordinates(
      type,
      xScale,
      yScale,
      xValue1,
      xValue2,
      yValue1,
      yValue2,
      chartWidth,
      chartHeight
    );

    ctx.fillRect(x1, y1, width, height);
  }
  render() {
    return (
      <GenericChartComponent
        canvasDraw={this.drawOnCanvas}
        canvasToDraw={getAxisCanvas}
        drawOn={["pan"]}
      />
    );
  }
}

function getLineCoordinates(
  type,
  xScale,
  yScale,
  xValue1,
  xValue2,
  yValue1,
  yValue2,
  width,
  height
) {
  return type === "horizontal"
    ? {
        x1: 0,
        y1: Math.round(yScale(yValue2)),
        width,
        height: Math.abs(Math.round(yScale(yValue2) - yScale(yValue1))),
      }
    : {
        x1: Math.round(xScale(xValue1)),
        y1: 0,
        width: Math.abs(Math.round(xScale(xValue1)) - xScale(xValue2)),
        height,
      };
}

StraightArea.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(["vertical", "horizontal"]),
  stroke: PropTypes.string,
  fill: PropTypes.string,
  opacity: PropTypes.number.isRequired,
  yValue1: function(props, propName /* , componentName */) {
    if (props.type === "vertical" && isDefined(props[propName]))
      return new Error(
        "Do not define `yValue1` when type is `vertical`, define the `xValue` prop"
      );
    if (props.type === "horizontal" && isNotDefined(props[propName]))
      return new Error("when type = `horizontal` `yValue1` is required");
    // if (isDefined(props[propName]) && typeof props[propName] !== "number") return new Error("prop `yValue` accepts a number");
  },
  yValue2: function(props, propName /* , componentName */) {
    if (props.type === "vertical" && isDefined(props[propName]))
      return new Error(
        "Do not define `yValue2` when type is `vertical`, define the `xValue` prop"
      );
    if (props.type === "horizontal" && isNotDefined(props[propName]))
      return new Error("when type = `horizontal` `yValue2` is required");
    // if (isDefined(props[propName]) && typeof props[propName] !== "number") return new Error("prop `yValue` accepts a number");
  },
  xValue1: function(props, propName /* , componentName */) {
    if (props.type === "horizontal" && isDefined(props[propName]))
      return new Error(
        "Do not define `xValue1` when type is `horizontal`, define the `yValue` prop"
      );
    if (props.type === "vertical" && isNotDefined(props[propName]))
      return new Error("when type = `vertical` `xValue1` is required");
    // if (isDefined(props[propName]) && typeof props[propName] !== "number") return new Error("prop `xValue` accepts a number");
  },
  xValue2: function(props, propName /* , componentName */) {
    if (props.type === "horizontal" && isDefined(props[propName]))
      return new Error(
        "Do not define `xValue2` when type is `horizontal`, define the `yValue` prop"
      );
    if (props.type === "vertical" && isNotDefined(props[propName]))
      return new Error("when type = `vertical` `xValue2` is required");
    // if (isDefined(props[propName]) && typeof props[propName] !== "number") return new Error("prop `xValue` accepts a number");
  },
};

StraightArea.defaultProps = {
  className: "area ",
  type: "horizontal",
  fill: "#000000",
  opacity: 1,
};

export default StraightArea;
