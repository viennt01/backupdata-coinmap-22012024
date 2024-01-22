import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseCanvas } from "../GenericComponent";
import { hexToRGBA } from "../utils";
import { timeFormat } from "d3-time-format";

const AXIS_HEIGHT = 30;

class EdgeAreaMarkerX extends Component {
  constructor(props) {
    super(props);
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
    this.drawMarker = this.drawMarker.bind(this);
  }
  drawMarker(ctx, moreProps, markerValue) {
    const { markerColor, markerTextColor, fontFamily, fontSize } = this.props;
    const { areaHeight, displayFormat } = this.props;
    const { height, xScale } = moreProps;
    const chartHeight = height - AXIS_HEIGHT;

    // get text width
    const TEXT_PADDING = 12;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = "middle";
    const xTimeValue = xScale.value(markerValue);
    const textDisplay = displayFormat(xTimeValue);
    const textWidth = Math.round(ctx.measureText(textDisplay).width + TEXT_PADDING);

    // draw marker background
    ctx.beginPath();
    ctx.fillStyle = markerColor;
    ctx.roundRect(
      xScale(markerValue) - textWidth / 2,
      chartHeight,
      textWidth,
      areaHeight,
      4
    );
    ctx.fill();

    // draw marker value
    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.fillStyle = markerTextColor;
    ctx.fillText(textDisplay, xScale(markerValue) - 2, chartHeight + areaHeight / 2);
  }
  drawOnCanvas(ctx, moreProps) {
    const { startValue, endValue, areaHeight, areaColor, areaOpacity } = this.props;
    const { startMarker, endMarker } = this.props;
    const { height, xScale } = moreProps;
    const chartHeight = height - AXIS_HEIGHT;

    // draw area rectangle on axis
    ctx.beginPath();
    ctx.fillStyle = hexToRGBA(areaColor, areaOpacity);
    ctx.rect(
      xScale(startValue),
      chartHeight,
      xScale(endValue) - xScale(startValue),
      areaHeight
    );
    ctx.fill();

    // draw markers
    if (startMarker) this.drawMarker(ctx, moreProps, startValue);
    if (endMarker) this.drawMarker(ctx, moreProps, endValue);
  }
  render() {
    const { canvasToDraw, drawOn } = this.props;
    return (
      <GenericChartComponent
        clip={false}
        canvasDraw={this.drawOnCanvas}
        canvasToDraw={canvasToDraw}
        drawOn={drawOn}
      />
    );
  }
}

EdgeAreaMarkerX.propTypes = {
  startValue: PropTypes.number.isRequired,
  endValue: PropTypes.number.isRequired,
  areaHeight: PropTypes.number,
  areaColor: PropTypes.string,
  areaOpacity: PropTypes.number,
  markerColor: PropTypes.string,
  markerTextColor: PropTypes.string,
  startMarker: PropTypes.bool,
  endMarker: PropTypes.bool,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  displayFormat: PropTypes.func,
  canvasToDraw: PropTypes.func,
  drawOn: PropTypes.array,
};

EdgeAreaMarkerX.defaultProps = {
  areaHeight: 30,
  areaColor: "#14C8D8",
  areaOpacity: 0.3,
  markerColor: "#196B86",
  markerTextColor: "#FFFFFF",
  startMarker: false,
  endMarker: false,
  fontFamily: "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif",
  fontSize: 10,
  displayFormat: timeFormat("%e %b %Y %H:%M"),
  canvasToDraw: getMouseCanvas,
  drawOn: ["pan", "drag", "mousemove"],
};

export default EdgeAreaMarkerX;
