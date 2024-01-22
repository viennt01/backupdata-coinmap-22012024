

import React, { Component } from "react";
import PropTypes from "prop-types";
import { curveCatmullRom, line as d3Line } from "d3-shape";

import GenericChartComponent from "../GenericChartComponent";
import { getBackgroundCanvas } from "../GenericComponent";

import {
	isDefined,
	strokeDashTypes,
	getStrokeDasharray,
	hexToRGBA,
	head,
} from "../utils";
import { getFullDataIndex, expandPlotData } from "../utils/ChartDataUtil";

class LineSeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.isHover = this.isHover.bind(this);
	}
	isHover(moreProps) {
		const { highlightOnHover, yAccessor, hoverTolerance, offset } = this.props;
    if (!highlightOnHover) return false;

    const {
      mouseXY,
      xScale,
      fullData,
      chartConfig: { yScale },
    } = moreProps;

    const [mouseX, mouseY] = mouseXY;
    const radius = hoverTolerance;

    // find data index
    const xInvert = xScale.invert(mouseX);
    const dataIndex = getFullDataIndex(xScale, mouseX);
    let lDataIndex = dataIndex - (offset ?? 0);
    if (!fullData[lDataIndex]) return false;

    // find closest data index (left and right) based on mouseX coordinate
    let rDataIndex = lDataIndex;
    if (xInvert > Math.round(xInvert)) {
      rDataIndex++;
    }
    if (xInvert < Math.round(xInvert)) {
      rDataIndex--;
    }

    // check hovering
    if (lDataIndex === rDataIndex) {
      const cx = Math.round(xScale(Math.round(xInvert)));
      const cy = yScale(yAccessor(fullData[lDataIndex]));

      const hovering = Math.pow(mouseX - cx, 2) + Math.pow(mouseY - cy, 2) < Math.pow(radius, 2);
      return hovering;
    } else {
      if (lDataIndex > rDataIndex) {
        [lDataIndex, rDataIndex] = [rDataIndex, lDataIndex];
      }
      const x1 = xScale(Math.floor(xInvert));
      const y1 = yScale(yAccessor(fullData[lDataIndex]));
      const x2 = xScale(Math.ceil(xInvert));
      const y2 = yScale(yAccessor(fullData[rDataIndex]));

      // y = m * x + b
      const m = (y2 - y1) / (x2 - x1); // slope
      const b = -1 * m * x1 + y1; // y intercept
			const distance = Math.abs(m * mouseX - mouseY + b) / Math.sqrt(m * m + 1 * 1); // distance point to line
      const hovering = distance <= radius;
      return hovering;
    }
	}
	drawOnCanvas(ctx, moreProps) {
		const {
			yAccessor,
			stroke,
			strokeOpacity,
			strokeWidth,
			hoverStrokeWidth,
			defined,
			strokeDasharray,
			interpolation,
			canvasClip,
			shouldBreak,
			offset,
		} = this.props;

		const { connectNulls } = this.props;

		const { xAccessor } = moreProps;
		const { xScale, chartConfig: { yScale }, plotData, hovering, fullData } = moreProps;

		if (canvasClip) {
			ctx.save();
			canvasClip(ctx, moreProps);
		}

		ctx.lineWidth = hovering ? hoverStrokeWidth : strokeWidth;

		ctx.strokeStyle = hexToRGBA(stroke, strokeOpacity);
		ctx.setLineDash(getStrokeDasharray(strokeDasharray).split(","));

		const dataSeries = d3Line()
			.x(d => Math.round(xScale(xAccessor(d) + offset)))
			.y(d => Math.round(yScale(yAccessor(d))));

		if (isDefined(interpolation)) {
			let interpolationFunc = interpolation;
			if (typeof interpolation === 'number') {
				interpolationFunc = curveCatmullRom.alpha(interpolation);
			}
			dataSeries.curve(interpolationFunc);
		}
		if (!connectNulls) {
			if (shouldBreak) {
				dataSeries.defined(d => shouldBreak(d));
			} else {
				dataSeries.defined(d => defined(yAccessor(d)));
			}
		}

		// get more plotData based on offset
		const expandedPlotData = expandPlotData(fullData, plotData, offset, xScale, xAccessor);

		ctx.beginPath();
		dataSeries.context(ctx)(expandedPlotData);
		ctx.stroke();

		if (canvasClip) {
			ctx.restore();
		}
	}
	renderSVG(moreProps) {
		const { yAccessor, stroke, strokeOpacity, strokeWidth, hoverStrokeWidth, defined, strokeDasharray } = this.props;
		const { connectNulls } = this.props;
		const { interpolation, style } = this.props;
		const { xAccessor, chartConfig } = moreProps;

		const { xScale, plotData, hovering } = moreProps;

		const { yScale } = chartConfig;
		const dataSeries = d3Line()
			.x(d => Math.round(xScale(xAccessor(d))))
			.y(d => Math.round(yScale(yAccessor(d))));

		if (isDefined(interpolation)) {
			let interpolationFunc = interpolation;
			if (typeof interpolation === 'number') {
				interpolationFunc = curveCatmullRom.alpha(interpolation);
			}
			dataSeries.curve(interpolationFunc);
		}
		if (!connectNulls) {
			dataSeries.defined(d => defined(yAccessor(d)));
		}
		const d = dataSeries(plotData);

		const { fill, className } = this.props;

		return (
			<path
				style={style}
				className={`${className} ${stroke ? "" : " line-stroke"}`}
				d={d}
				stroke={stroke}
				strokeOpacity={strokeOpacity}
				strokeWidth={hovering ? hoverStrokeWidth : strokeWidth}
				strokeDasharray={getStrokeDasharray(strokeDasharray)}
				fill={fill}
			/>
		);
	}
	render() {
		const { highlightOnHover, onHover, onUnHover, drawOn, canvasToDraw, groupId } = this.props;
		const hoverProps = (highlightOnHover || onHover || onUnHover)
			? {
				isHover: this.isHover,
				eventOn: ["mousemove"],
				drawOn,
				canvasToDraw,
			}
			: {
				drawOn,
				canvasToDraw
			};

		return <GenericChartComponent
			groupId={groupId}
			disableDrag={this.props.disableDrag} // prevent drag on line led to unable drag chart
			showCursorWhenHovering={this.props.showCursorWhenHovering} // show cursor when hovering
			svgDraw={this.renderSVG}
			canvasDraw={this.drawOnCanvas}
			onClickWhenHover={this.props.onClick}
			onDoubleClickWhenHover={this.props.onDoubleClick}
			onContextMenuWhenHover={this.props.onContextMenu}
			onHover={this.props.onHover}
			onUnHover={this.props.onUnHover}
			{...hoverProps}
		/>;
	}
}

/*
function segment(points, ctx) {
	ctx.beginPath();

	const [x, y] = first(points);
	ctx.moveTo(x, y);
	for (let i = 1; i < points.length; i++) {
		const [x1, y1] = points[i];
		ctx.lineTo(x1, y1);
	}

	ctx.stroke();
}
*/

LineSeries.propTypes = {
	groupId: PropTypes.shape({
    drawingType: PropTypes.string,
    id: PropTypes.string,
    groupIndex: PropTypes.number,
    itemIndex: PropTypes.number,
  }),
	className: PropTypes.string,
	strokeWidth: PropTypes.number,
	strokeOpacity: PropTypes.number,
	stroke: PropTypes.string,
	hoverStrokeWidth: PropTypes.number,
	fill: PropTypes.string,
	defined: PropTypes.func,
	hoverTolerance: PropTypes.number,
	strokeDasharray: PropTypes.oneOf(strokeDashTypes),
	highlightOnHover: PropTypes.bool,
	onClick: PropTypes.func,
	onDoubleClick: PropTypes.func,
	onHover: PropTypes.func,
	onUnHover: PropTypes.func,
	onContextMenu: PropTypes.func,
	yAccessor: PropTypes.func,
	connectNulls: PropTypes.bool,
	interpolation: PropTypes.oneOfType(PropTypes.func, PropTypes.number),
	canvasClip: PropTypes.func,
	style: PropTypes.object,
	shouldBreak: PropTypes.func,
	offset: PropTypes.number, // using to shift line series to left side or right side
	disableDrag: PropTypes.bool, // prevent drag on line led to unable drag chart
	showCursorWhenHovering: PropTypes.bool, // show cursor when hovering
	drawOn: PropTypes.array,
	canvasToDraw: PropTypes.func,
};

LineSeries.defaultProps = {
	className: "line ",
	strokeWidth: 1,
	strokeOpacity: 1,
	hoverStrokeWidth: 4,
	fill: "none",
	stroke: "#4682B4",
	strokeDasharray: "Solid",
	defined: d => !isNaN(d),
	hoverTolerance: 6,
	highlightOnHover: false,
	connectNulls: false,
	onClick: () => null,
	onDoubleClick: () => null,
	onContextMenu: () => null,
	shouldBreak: null,
	offset: 0,
	disableDrag: false,
	showCursorWhenHovering: false,
	drawOn: ["pan"],
	canvasToDraw: getBackgroundCanvas
};

export default LineSeries;
