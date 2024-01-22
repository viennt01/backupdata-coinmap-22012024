

import React, { Component } from "react";
import PropTypes from "prop-types";
import Axis from "./Axis";
import { hexToRGBA, getStrokeDasharray } from "../utils";


class XAxis extends Component {
	constructor(props, context) {
		super(props, context);
		this.axisZoomCallback = this.axisZoomCallback.bind(this);
		this.drawTicksProps = this.drawTicksProps.bind(this);
		this.drawTickLabelsProps = this.drawTickLabelsProps.bind(this);
	}
	axisZoomCallback(newXDomain) {
		const { xAxisZoom } = this.context;
		xAxisZoom(newXDomain);
	}
	drawTicksProps(ctx, result) {
		drawTicks(ctx, result, this.props);
	}
	drawTickLabelsProps(ctx, result) {
		drawTickLabels(ctx, result, this.props);
	}

	render() {
		const { showTicks, enableWheelX, zoomMultiplier } = this.props;
		const moreProps = helper(this.props, this.context);

		return <Axis {...this.props} {...moreProps} x
			zoomEnabled={this.props.zoomEnabled && showTicks}
			axisZoomCallback={this.axisZoomCallback}
			zoomCursorClassName="react-stockcharts-ew-resize-cursor"
			drawTicksProps={this.drawTicksProps}
			drawTickLabelsProps={this.drawTickLabelsProps}
			enableWheelX={enableWheelX}
			zoomMultiplier={zoomMultiplier} />;
	}
}

XAxis.propTypes = {
	axisAt: PropTypes.oneOfType([
		PropTypes.oneOf(["top", "bottom", "middle"]),
		PropTypes.number
	]).isRequired,
	orient: PropTypes.oneOf(["top", "bottom"]).isRequired,
	innerTickSize: PropTypes.number,
	outerTickSize: PropTypes.number,
	tickFormat: PropTypes.func,
	tickPadding: PropTypes.number,
	tickSize: PropTypes.number,
	ticks: PropTypes.number,
	tickValues: PropTypes.array,
	showTicks: PropTypes.bool,
	className: PropTypes.string,
	zoomEnabled: PropTypes.bool,
	onContextMenu: PropTypes.func,
	onDoubleClick: PropTypes.func,
	daySeparators: PropTypes.object,
	weekSeparators: PropTypes.object,
	monthSeparators: PropTypes.object,
	yearSeparators: PropTypes.object,
	enableWheelX: PropTypes.bool,
	zoomMultiplier: PropTypes.number,
	height: PropTypes.number,
};

XAxis.defaultProps = {
	showTicks: true,
	showTickLabel: true,
	showDomain: true,
	className: "react-stockcharts-x-axis",
	ticks: 10,
	outerTickSize: 0,
	fill: "none",
	stroke: "#000000", // x axis stroke color
	strokeWidth: 1,
	opacity: 1, // x axis opacity
	domainClassName: "react-stockcharts-axis-domain",
	innerTickSize: 5,
	tickPadding: 6,
	tickStroke: "#000000", // tick/grid stroke
	tickStrokeOpacity: 1,
	fontFamily: "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif",
	fontSize: 12,
	fontWeight: 400,
	xZoomHeight: 30,
	zoomEnabled: true,
	getMouseDelta: (startXY, mouseXY) => startXY[0] - mouseXY[0],
	enableWheelX: false,
	zoomMultiplier: 1.05,
	height: 30,
};

XAxis.contextTypes = {
	chartConfig: PropTypes.object.isRequired,
	xAxisZoom: PropTypes.func.isRequired,
};

function helper(props, context) {
	const { axisAt, xZoomHeight, orient } = props;
	const { chartConfig: { width, height } } = context;

	let axisLocation;
	const x = 0, w = width, h = xZoomHeight;

	if (axisAt === "top") axisLocation = 0;
	else if (axisAt === "bottom") axisLocation = height;
	else if (axisAt === "middle") axisLocation = (height) / 2;
	else axisLocation = axisAt;

	const y = (orient === "top") ? -xZoomHeight : 0;

	return {
		transform: [0, axisLocation],
		range: [0, width],
		getScale: getXScale,
		bg: { x, y, h, w },
	};
}

function getXScale(moreProps) {
	return moreProps.xScale;
}


function drawTicks(ctx, result, moreProps) {
	const { tickStroke, tickStrokeOpacity, ticks } = result;

	ctx.strokeStyle = hexToRGBA(tickStroke, tickStrokeOpacity);

	ctx.fillStyle = tickStroke;

	ticks.forEach((tick) => {
		drawEachTick(ctx, tick, result, moreProps);
	});
}

function drawTickLabels(ctx, result) {

	const { tickStroke, tickStrokeOpacity, tickLabelFill } = result;
	const { textAnchor, fontSize, fontFamily, fontWeight, ticks, showTickLabel } = result;

	ctx.strokeStyle = hexToRGBA(tickStroke, tickStrokeOpacity);
	ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
	ctx.fillStyle = tickLabelFill;
	ctx.textAlign = textAnchor === "middle" ? "center" : textAnchor;

	if (showTickLabel) {
		ticks.forEach((tick) => {
			drawEachTickLabel(ctx, tick, result);
		});
	}
}

function drawEachTick(ctx, tick, result, moreProps) {
	const { tickStrokeWidth, tickStrokeDasharray, format, tickStroke, tickStrokeOpacity } = result;
	const { daySeparators, weekSeparators, monthSeparators, yearSeparators } = moreProps;
		// display: true,
    // type: LINE_TYPE.LINE,
    // width: 1,
    // color: PURPLE_COLOR,

	ctx.beginPath();
	ctx.moveTo(tick.x1, tick.y1);
	ctx.lineTo(tick.x2, tick.y2);

	// check time is day, week, month year?
	const [day, week, month, year] = checkTypeOfLabel(format(tick.value));
		if (daySeparators.display) {
			if (day) {
				ctx.lineWidth = daySeparators.width;
				ctx.setLineDash(getStrokeDasharray(daySeparators.type).split(","));
				ctx.strokeStyle = hexToRGBA(daySeparators.color, tickStrokeOpacity);
				ctx.stroke();
				return;
			}
		}
		if (weekSeparators.display) {
			if (week) {
				ctx.lineWidth = weekSeparators.width;
				ctx.setLineDash(getStrokeDasharray(weekSeparators.type).split(","));
				ctx.strokeStyle = hexToRGBA(weekSeparators.color, tickStrokeOpacity);
				ctx.stroke();
				return;
			}
		}
		if (monthSeparators.display) {
			if (month) {
				ctx.lineWidth = monthSeparators.width;
				ctx.setLineDash(getStrokeDasharray(monthSeparators.type).split(","));
				ctx.strokeStyle = hexToRGBA(monthSeparators.color, tickStrokeOpacity);
				ctx.stroke();
				return;
			}
		}
		if (yearSeparators.display) {
			if (year) {
				ctx.lineWidth = yearSeparators.width;
				ctx.setLineDash(getStrokeDasharray(yearSeparators.type).split(","));
				ctx.strokeStyle = hexToRGBA(yearSeparators.color, tickStrokeOpacity);
				ctx.stroke();
				return;
			}
		}
				// default
	ctx.strokeStyle = hexToRGBA(tickStroke, tickStrokeOpacity);
	ctx.lineWidth = tickStrokeWidth;
	ctx.setLineDash(getStrokeDasharray(tickStrokeDasharray).split(","));
	ctx.stroke();

}

function drawEachTickLabel(ctx, tick, result) {
	const { canvas_dy, format } = result;

	ctx.beginPath();
	ctx.fillText(format(tick.value), tick.labelX, tick.labelY + canvas_dy);
}

const days = ['01', '02', '03', '04', '05', '06', '07', '08', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
const years = ["2021", "2022", "2023", "2024"];

function checkTypeOfLabel(stringFormat) {
	let day = false, week = false, month = false, year = false;
	if (days.some(d => d === stringFormat)) {
		day = true;
	}
	if (stringFormat.includes('/')) {
		week = true;
	}
	if (months.some(d => d === stringFormat)) {
		month = true;
	}
	if (years.some(d => d === stringFormat)) {
		year = true;
	}
	return [
		day,
		week,
		month,
		year,
	];
}



export default XAxis;
