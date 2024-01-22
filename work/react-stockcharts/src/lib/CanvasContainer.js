

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, getLogger, roundRect } from "./utils";

const log = getLogger("CanvasContainer");

export const CANVAS_IDS = {
	BACKGROUND: 'bg', // draw background, axis, area, marker
	DRAW: 'draw', // draw line and drawing objects
	AXES: 'axes', // draw charts
	MOUSE_COORD: 'mouseCoord', // draw marker when hovering or selecting
	MOUSE_MARKER: 'mouseMarker', // draw mouse marker
};

class CanvasContainer extends Component {
	constructor(props) {
		super(props);
		this.setDrawCanvas = this.setDrawCanvas.bind(this);
		this.drawCanvas = {};
	}
	UNSAFE_componentWillMount() {
		CanvasRenderingContext2D.prototype.roundRect = roundRect;
	}
	setDrawCanvas(node) {
		if (isDefined(node))
			this.drawCanvas[node.id] = node.getContext("2d");
		else
			this.drawCanvas = {};
	}
	getCanvasContexts() {
		if (isDefined(this.drawCanvas.axes)) {
			return this.drawCanvas;
		}
	}
	render() {
		const { height, width, type, zIndex, ratio } = this.props;
		if (type === "svg") return null;

		log("using ratio ", ratio);

		return (
			<div style={{ position: "absolute", zIndex: zIndex }}>
				<canvas id={CANVAS_IDS.BACKGROUND} ref={this.setDrawCanvas} width={width * ratio} height={height * ratio}
					style={{ position: "absolute", width: width, height: height }} />
				<canvas id={CANVAS_IDS.DRAW} ref={this.setDrawCanvas} width={width * ratio} height={height * ratio}
					style={{ position: "absolute", width: width, height: height }} />
				<canvas id={CANVAS_IDS.AXES} ref={this.setDrawCanvas} width={width * ratio} height={height * ratio}
					style={{ position: "absolute", width: width, height: height }} />
				<canvas id={CANVAS_IDS.MOUSE_COORD} ref={this.setDrawCanvas} width={width * ratio} height={height * ratio}
					style={{ position: "absolute", width: width, height: height }} />
				<canvas id={CANVAS_IDS.MOUSE_MARKER} ref={this.setDrawCanvas} width={width * ratio} height={height * ratio}
					style={{ position: "absolute", width: width, height: height }} />
			</div>
		);
	}
}
/*
				<canvas id="hover" ref={this.setDrawCanvas} width={width * ratio} height={height * ratio}
					style={{ position: "absolute", width: width, height: height }} />
*/
CanvasContainer.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	type: PropTypes.string.isRequired,
	zIndex: PropTypes.number,
	ratio: PropTypes.number.isRequired,
};

export default CanvasContainer;
