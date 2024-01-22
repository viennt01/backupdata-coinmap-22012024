

import React, { Component } from "react";
import PropTypes from "prop-types";
import { area as d3Area } from "d3-shape";

import GenericChartComponent from "../GenericChartComponent";
import { getBackgroundCanvas } from "../GenericComponent";

import { hexToRGBA, isDefined, first, functor } from "../utils";
import { expandPlotData } from "../utils/ChartDataUtil";

class AreaOnlySeries extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
	}
	drawOnCanvas(ctx, moreProps) {
		const { yAccessor, defined, base, canvasGradient, offset } = this.props;
		const { fill, stroke, opacity, interpolation, canvasClip } = this.props;

		const { xScale, chartConfig: { yScale }, plotData, xAccessor, fullData } = moreProps;

		if (canvasClip) {
			ctx.save();
			canvasClip(ctx, moreProps);
		}

		if (canvasGradient != null) {
			ctx.fillStyle = canvasGradient(moreProps, ctx);
		} else {
			ctx.fillStyle = hexToRGBA(fill, opacity);
		}
		ctx.strokeStyle = stroke;

		ctx.beginPath();
		const newBase = functor(base);
		const areaSeries = d3Area()
			.defined(d => defined(yAccessor(d)))
			.x((d) => Math.round(xScale(xAccessor(d) + offset)))
			.y0((d) => newBase(yScale, d, moreProps))
			.y1((d) => Math.round(yScale(yAccessor(d))))
			.context(ctx);

		if (isDefined(interpolation)) {
			areaSeries.curve(interpolation);
		}

		// get more plotData based on offset
		const expandedPlotData = expandPlotData(fullData, plotData, offset, xScale, xAccessor);

		areaSeries(expandedPlotData);
		ctx.fill();

		if (canvasClip) {
			ctx.restore();
		}
	}
	renderSVG(moreProps) {
		const { yAccessor, defined, base, style } = this.props;
		const { stroke, fill, className, opacity, interpolation } = this.props;

		const { xScale, chartConfig: { yScale }, plotData, xAccessor } = moreProps;

		const newBase = functor(base);
		const areaSeries = d3Area()
			.defined(d => defined(yAccessor(d)))
			.x((d) => Math.round(xScale(xAccessor(d))))
			.y0((d) => newBase(yScale, d, moreProps))
			.y1((d) => Math.round(yScale(yAccessor(d))));

		if (isDefined(interpolation)) {
			areaSeries.curve(interpolation);
		}

		const d = areaSeries(plotData);
		const newClassName = className.concat(isDefined(stroke) ? "" : " line-stroke");
		return (
			<path
				style={style}
				d={d}
				stroke={stroke}
				fill={hexToRGBA(fill, opacity)}
				className={newClassName}

			/>
		);
	}
	render() {
		const { drawOn, canvasToDraw, groupId } = this.props;
		return (
			<GenericChartComponent
				groupId={groupId}
				svgDraw={this.renderSVG}
				canvasDraw={this.drawOnCanvas}
				drawOn={drawOn}
				canvasToDraw={canvasToDraw}
			/>
		);
	}
}

AreaOnlySeries.propTypes = {
	groupId: PropTypes.shape({
    drawingType: PropTypes.string,
    id: PropTypes.string,
    groupIndex: PropTypes.number,
    itemIndex: PropTypes.number,
  }),
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	stroke: PropTypes.string,
	fill: PropTypes.string,
	opacity: PropTypes.number,
	defined: PropTypes.func,
	base: PropTypes.oneOfType([
		PropTypes.func, PropTypes.number
	]),
	interpolation: PropTypes.func,
	canvasClip: PropTypes.func,
	style: PropTypes.object,
	canvasGradient: PropTypes.func,
	offset: PropTypes.number,
	drawOn: PropTypes.array,
	canvasToDraw: PropTypes.func,
};

AreaOnlySeries.defaultProps = {
	className: "line ",
	fill: "none",
	opacity: 1,
	defined: d => !isNaN(d),
	base: (yScale /* , d, moreProps */) => first(yScale.range()),
	offset: 0,
	drawOn: ["pan"],
	canvasToDraw: getBackgroundCanvas
};

export default AreaOnlySeries;
