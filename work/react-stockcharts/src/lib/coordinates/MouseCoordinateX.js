

import React, { Component } from "react";
import PropTypes from "prop-types";

import { drawOnCanvas, renderSVG } from "./EdgeCoordinateV3";
import GenericChartComponent from "../GenericChartComponent";
import { getMouseMarkerCanvas } from "../GenericComponent";

import { isNotDefined } from "../utils";

class MouseCoordinateX extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.prevX = 0;
		this.prevCoordinate = "";
	}
	drawOnCanvas(ctx, moreProps) {
		const props = helper(this.props, moreProps, this);
		if (isNotDefined(props)) return null;

		drawOnCanvas(ctx, props);
	}
	renderSVG(moreProps) {
		const props = helper(this.props, moreProps);
		if (isNotDefined(props)) return null;

		return renderSVG(props);
	}
	render() {
		return <GenericChartComponent
			svgDraw={this.renderSVG}
			clip={false}
			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getMouseMarkerCanvas}
			drawOn={["mousemove", "pan", "drag"]}
		/>;
	}
}

MouseCoordinateX.propTypes = {
	displayFormat: PropTypes.func.isRequired,
	yAxisPad: PropTypes.number,
	rectWidth: PropTypes.number,
	rectHeight: PropTypes.number,
	orient: PropTypes.oneOf(["bottom", "top", "left", "right"]),
	at: PropTypes.oneOf(["bottom", "top", "left", "right"]),
	fill: PropTypes.string,
	opacity: PropTypes.number,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	textFill: PropTypes.string,
	snapX: PropTypes.bool
};

function customX(props, moreProps, _this) {
  const { xScale, mouseXY } = moreProps;
  const { snapX, displayFormat } = props;

  if (!snapX) {
    const x = mouseXY[0];
    const coordinate = displayFormat(xScale.invert(x));
    return { x, coordinate };
  }

  const xIndex = Math.round(xScale.invert(mouseXY[0]));
  const xValue = xScale.value(xIndex); // get value (date) based on index
  _this.prevX = xValue ? Math.round(xScale(xIndex)) : _this.prevX;
  _this.prevCoordinate = xValue ? displayFormat(xValue) : _this.prevCoordinate;
  return { x: _this.prevX, coordinate: _this.prevCoordinate };
}

MouseCoordinateX.defaultProps = {
	yAxisPad: 0,
	rectWidth: 80,
	rectHeight: 20,

	// rectRadius: 5,
	// stroke: "#684F1D",
	strokeOpacity: 1,
	strokeWidth: 1,

	orient: "bottom",
	at: "bottom",

	fill: "#61667B",
	opacity: 1,
	fontFamily: "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 13,
	textFill: "#FFFFFF",
	snapX: true,
	customX: customX,
};

function helper(props, moreProps, _this) {
	const { show, currentItem } = moreProps;
	const { chartConfig: { height } } = moreProps;

	if (isNotDefined(currentItem)) return null;

	const { customX } = props;

	const { orient, at } = props;
	const { stroke, strokeOpacity, strokeWidth } = props;
	const { rectRadius, rectWidth, rectHeight } = props;
	const { fill, opacity, fontFamily, fontSize, textFill } = props;

	const edgeAt = (at === "bottom")
		? height
		: 0;

	const {
		x,
		coordinate
	 } = customX(props, moreProps, _this);

	const type = "vertical";
	const y1 = 0, y2 = height;
	const hideLine = true;

	const coordinateProps = {
		coordinate,
		show,
		type,
		orient,
		edgeAt,
		hideLine,
		fill, opacity, fontFamily, fontSize, textFill,
		stroke, strokeOpacity, strokeWidth,
		rectWidth,
		rectHeight,
		rectRadius,
		arrowWidth: 0,
		x1: x,
		x2: x,
		y1,
		y2
	};
	return coordinateProps;
}

export default MouseCoordinateX;
