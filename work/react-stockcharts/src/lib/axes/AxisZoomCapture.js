

import React, { Component } from "react";
import PropTypes from "prop-types";
import { select, event as d3Event, mouse, touches } from "d3-selection";
import { mean } from "d3-array";

import {
	first,
	last,
	isDefined,
	noop,
	mousePosition,
	d3Window,
	MOUSEMOVE,
	MOUSEUP,
	TOUCHMOVE,
	TOUCHEND,
	touchPosition,
	getTouchProps,
	sign,
} from "../utils";

class AxisZoomCapture extends Component {
	constructor(props) {
		super(props);
		this.handleDragStartMouse = this.handleDragStartMouse.bind(this);
		this.handleDragStartTouch = this.handleDragStartTouch.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);
		this.handleRightClick = this.handleRightClick.bind(this);
		this.saveNode = this.saveNode.bind(this);
		this.handleWheel = this.handleWheel.bind(this);
		this.state = {
			startPosition: null
		};
	}
	saveNode(node) {
		this.node = node;
	}
	handleRightClick(e) {
		e.stopPropagation();
		e.preventDefault();

		const { onContextMenu } = this.props;

		const mouseXY = mousePosition(e, this.node.getBoundingClientRect());

		select(d3Window(this.node))
			.on(MOUSEMOVE, null)
			.on(MOUSEUP, null);
		this.setState({
			startPosition: null,
		});

		onContextMenu(mouseXY, e);

		this.contextMenuClicked = true;
	}
	handleDragStartMouse(e) {
		this.mouseInteraction = true;

		const { getScale, getMoreProps } = this.props;
		const startScale = getScale(getMoreProps());
		this.dragHappened = false;

		if (startScale.invert) {
			select(d3Window(this.node))
				.on(MOUSEMOVE, this.handleDrag, false)
				.on(MOUSEUP, this.handleDragEnd, false);

			const startXY = mousePosition(e);

			this.setState({
				startPosition: {
					startXY,
					startScale,
				}
			});
		}
		e.preventDefault();
	}
	handleDragStartTouch(e) {
		this.mouseInteraction = false;

		const { getScale, getMoreProps } = this.props;
		const startScale = getScale(getMoreProps());
		this.dragHappened = false;

		if (e.touches.length === 1 && startScale.invert) {
			select(d3Window(this.node))
				.on(TOUCHMOVE, this.handleDrag)
				.on(TOUCHEND, this.handleDragEnd);

			const startXY = touchPosition(getTouchProps(e.touches[0]), e);

			this.setState({
				startPosition: {
					startXY,
					startScale,
				}
			});
		}
	}
	handleDrag() {
		const { startPosition } = this.state;
		const { getMouseDelta, inverted } = this.props;

		this.dragHappened = true;
		if (isDefined(startPosition)) {
			const { startScale } = startPosition;
			const { startXY } = startPosition;

			const mouseXY = this.mouseInteraction
				? mouse(this.node)
				: touches(this.node)[0];

			const diff = getMouseDelta(startXY, mouseXY);

			const center = mean(startScale.range());

			const tempRange = startScale.range()
				.map(d => inverted ? d - sign(d - center) * diff : d + sign(d - center) * diff);

			const newDomain = tempRange.map(startScale.invert);

			if (sign(last(startScale.range()) - first(startScale.range())) === sign(last(tempRange) - first(tempRange))) {

				const { axisZoomCallback } = this.props;
				// console.log(startXScale.domain(), newXDomain)
				axisZoomCallback(newDomain);
			}
		}
	}
	handleDragEnd() {

		if (!this.dragHappened) {
			if (this.clicked) {
				const e = d3Event;
				const mouseXY = this.mouseInteraction
					? mouse(this.node)
					: touches(this.node)[0];
				const { onDoubleClick } = this.props;

				onDoubleClick(mouseXY, e);
			} else {
				this.clicked = true;
				setTimeout(() => {
					this.clicked = false;
				}, 300);
			}
		}

		select(d3Window(this.node))
			.on(MOUSEMOVE, null)
			.on(MOUSEUP, null)
			.on(TOUCHMOVE, null)
			.on(TOUCHEND, null);

		this.setState({
			startPosition: null,
		});
	}
	handleWheel(e) {
		const { enableWheelX, enableWheelY, zoomMultiplier } = this.props;
		const { getScale, getMoreProps, axisZoomCallback } = this.props;
		const moreProps = getMoreProps();
		const initialScale = getScale(getMoreProps());
		const { plotData } = moreProps;
		const zoomDirection = e.deltaY > 0 ? 1 : -1;
		const yZoom = Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 0;

		// prevent it's parent scroll
		if (e.cancelable && (enableWheelX || enableWheelY)) e.preventDefault();

		if (yZoom) {
			// handle zoom in and zoom out when scrolling vertically
			if (!enableWheelX && !enableWheelY) return;
			const c = zoomDirection > 0 ? 1 * zoomMultiplier : 1 / zoomMultiplier;
			const center = enableWheelX ?  initialScale(last(plotData).idx.index) : mean(initialScale.range());
			const newDomain = initialScale.range().map(d => initialScale.invert(center + (d - center) * c));
			axisZoomCallback(newDomain);
		} else {
			// TODO: handle pan chart when scrolling horizontally
		}
	}
	componentDidMount() {
		if (this.node) {
			this.node.addEventListener("wheel", this.handleWheel, { passive: false });
		}
	}
	componentWillUnmount() {
		if (this.node) {
			this.node.removeEventListener("wheel", this.handleWheel, { passive: false });
		}
	}
	render() {
		const { bg, className, zoomCursorClassName, enableWheelX, enableWheelY } = this.props;

		const cursor = isDefined(this.state.startPosition) || enableWheelX || enableWheelY
			? zoomCursorClassName
			: "react-stockcharts-default-cursor";

		return <rect
			className={`react-stockcharts-enable-interaction ${cursor} ${className}`}
			ref={this.saveNode}
			x={bg.x} y={bg.y} opacity={0} height={bg.h} width={bg.w}
			onContextMenu={this.handleRightClick}
			onMouseDown={this.handleDragStartMouse}
			onTouchStart={this.handleDragStartTouch}
		/>;
	}
}

AxisZoomCapture.propTypes = {
	innerTickSize: PropTypes.number,
	outerTickSize: PropTypes.number,
	tickFormat: PropTypes.func,
	tickPadding: PropTypes.number,
	tickSize: PropTypes.number,
	ticks: PropTypes.number,
	tickValues: PropTypes.array,
	showDomain: PropTypes.bool,
	showTicks: PropTypes.bool,
	className: PropTypes.string,
	axisZoomCallback: PropTypes.func,
	inverted: PropTypes.bool,
	bg: PropTypes.object.isRequired,
	zoomCursorClassName: PropTypes.string.isRequired,
	getMoreProps: PropTypes.func.isRequired,
	getScale: PropTypes.func.isRequired,
	getMouseDelta: PropTypes.func.isRequired,
	onDoubleClick: PropTypes.func.isRequired,
	onContextMenu: PropTypes.func.isRequired,
	enableWheelX: PropTypes.bool,
	enableWheelY: PropTypes.bool,
	zoomMultiplier: PropTypes.number,
};

AxisZoomCapture.defaultProps = {
	onDoubleClick: noop,
	onContextMenu: noop,
	inverted: true,
	enableWheelX: false,
	enableWheelY: false,
	zoomMultiplier: 1.05,
};

export default AxisZoomCapture;
