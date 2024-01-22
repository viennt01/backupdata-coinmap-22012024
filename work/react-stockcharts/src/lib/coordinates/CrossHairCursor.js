

import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericComponent, { getMouseCanvas } from "../GenericComponent";

import { hexToRGBA, isDefined, isNotDefined, strokeDashTypes, getStrokeDasharray } from "../utils";

class CrossHairCursor extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
		this.drawOnCanvas = this.drawOnCanvas.bind(this);
		this.prevX = 0;
	}
	drawOnCanvas(ctx, moreProps) {
		const lines = helper(this.props, moreProps, this);
		const { strokeWidth } = this.props;

		if (isDefined(lines)) {

			const { margin, ratio } = this.context;
			const originX = 0.5 * ratio + margin.left;
			const originY = 0.5 * ratio + margin.top;

			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.scale(ratio, ratio);

			ctx.translate(originX, originY);

			lines.forEach(line => {
				const dashArray = getStrokeDasharray(line.strokeDasharray).split(",").map(d => +d);

				ctx.strokeStyle = hexToRGBA(line.stroke, line.opacity);
				ctx.setLineDash(dashArray);
				ctx.beginPath();
				ctx.lineWidth = strokeWidth;
				ctx.moveTo(line.x1, line.y1);
				ctx.lineTo(line.x2, line.y2);
				ctx.stroke();
			});

			ctx.restore();
		}
	}
	renderSVG(moreProps) {
		const { className } = this.props;
		const lines = helper(this.props, moreProps);

		if (isNotDefined(lines)) return null;

		return (
			<g className={`react-stockcharts-crosshair ${className}`}>
				{lines.map(({ strokeDasharray, ...rest }, idx) =>
					<line
						key={idx}
						strokeDasharray={getStrokeDasharray(strokeDasharray)}
						{...rest} />)}
			</g>
		);
	}
	render() {
		return <GenericComponent
			svgDraw={this.renderSVG}
			clip={false}
			canvasDraw={this.drawOnCanvas}
			canvasToDraw={getMouseCanvas}
			drawOn={["mousemove", "pan", "drag"]}
		/>;
	}
}

CrossHairCursor.propTypes = {
	className: PropTypes.string,
	strokeDasharray: PropTypes.oneOf(strokeDashTypes),
	strokeWidth: PropTypes.number,
};

CrossHairCursor.contextTypes = {
	margin: PropTypes.object.isRequired,
	ratio: PropTypes.number.isRequired,
	// xScale for getting update event upon pan end, this is needed to get past the PureComponent shouldComponentUpdate
	// xScale: PropTypes.func.isRequired,
};

function customX(props, moreProps, _this) {
  const { xScale, mouseXY } = moreProps;
  const { snapX } = props;
  if (!snapX) return mouseXY[0];
  const xIndex = Math.round(xScale.invert(mouseXY[0]));
	const xValue = xScale.value(xIndex); // get value (date) based on index
  _this.prevX = xValue ? Math.round(xScale(xIndex)) : _this.prevX;
  return _this.prevX;
}


CrossHairCursor.defaultProps = {
	stroke: "#000000",
	opacity: 0.3,
	strokeDasharray: "ShortDash",
	snapX: true,
	customX,
	strokeWidth: 1,
};

function helper(props, moreProps, _this) {
	const {
		mouseXY, currentItem, show, height, width
	} = moreProps;

	const { customX, stroke, opacity, strokeDasharray } = props;

	if (!show || isNotDefined(currentItem)) return null;

	const line1 = {
		x1: 0,
		x2: width,
		y1: mouseXY[1],
		y2: mouseXY[1],
		stroke, strokeDasharray, opacity,
	};
	const x = customX(props, moreProps, _this);

	const line2 = {
		x1: x,
		x2: x,
		y1: 0,
		y2: height,
		stroke, strokeDasharray, opacity,
	};
	return [line1, line2];
}

export default CrossHairCursor;
