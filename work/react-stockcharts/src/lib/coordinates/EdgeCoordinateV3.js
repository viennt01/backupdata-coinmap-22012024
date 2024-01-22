

import React from "react";

import { hexToRGBA, isDefined, getStrokeDasharray } from "../utils";

/* eslint-disable react/prop-types */
export function renderSVG(props) {
	const { className } = props;

	const edge = helper(props);
	if (edge === null) return null;
	let line, coordinateBase, coordinate;

	if (isDefined(edge.line)) {
		line = (
			<line
				className="react-stockcharts-cross-hair"
				strokeOpacity={edge.line.opacity}
				stroke={edge.line.stroke}
				strokeDasharray={getStrokeDasharray(edge.line.strokeDasharray)}
				x1={edge.line.x1}
				y1={edge.line.y1}
				x2={edge.line.x2}
				y2={edge.line.y2}
			/>
		);
	}
	if (isDefined(edge.coordinateBase)) {
		const { rectWidth, rectHeight, arrowWidth } = edge.coordinateBase;

		const path =
			edge.orient === "left"
				? `M0,0L0,${rectHeight}L${rectWidth},${rectHeight}L${rectWidth +
					  arrowWidth},10L${rectWidth},0L0,0L0,0`
				: `M0,${arrowWidth}L${arrowWidth},${rectHeight}L${rectWidth +
					  arrowWidth},${rectHeight}L${rectWidth +
					  arrowWidth},0L${arrowWidth},0L0,${arrowWidth}`;

		coordinateBase =
			edge.orient === "left" || edge.orient === "right" ? (
				<g
					key={1}
					transform={`translate(${edge.coordinateBase.edgeXRect},${
						edge.coordinateBase.edgeYRect
					})`}
				>
					<path
						d={path}
						className="react-stockchart-text-background"
						height={rectHeight}
						width={rectWidth}
						stroke={edge.coordinateBase.stroke}
						strokeLinejoin="miter"
						strokeOpacity={edge.coordinateBase.strokeOpacity}
						strokeWidth={edge.coordinateBase.strokeWidth}
						fill={edge.coordinateBase.fill}
						fillOpacity={edge.coordinateBase.opacity}
					/>
				</g>
			) : (
				<rect
					key={1}
					className="react-stockchart-text-background"
					x={edge.coordinateBase.edgeXRect}
					y={edge.coordinateBase.edgeYRect}
					height={rectHeight}
					width={rectWidth}
					fill={edge.coordinateBase.fill}
					opacity={edge.coordinateBase.opacity}
				/>
			);

		coordinate = (
			<text
				key={2}
				x={edge.coordinate.edgeXText}
				y={edge.coordinate.edgeYText}
				textAnchor={edge.coordinate.textAnchor}
				fontFamily={edge.coordinate.fontFamily}
				fontSize={edge.coordinate.fontSize}
				dy=".32em"
				fill={edge.coordinate.textFill}
			>
				{edge.coordinate.displayCoordinate}
			</text>
		);
	}
	return (
		<g className={className}>
			{line}
			{coordinateBase}
			{coordinate}
		</g>
	);
}
/* eslint-enable react/prop-types */

function helper(props) {
	const {
		coordinate: displayCoordinate,
		show,
		type,
		orient,
		edgeAt,
		hideLine,
		lineStrokeDasharray
	} = props;
	const {
		fill,
		opacity,
		fontFamily,
		fontSize,
		textFill,
		lineStroke,
		lineOpacity
	} = props;
	const { stroke, strokeOpacity, strokeWidth } = props;
	const { arrowWidth, rectWidth, rectHeight, rectRadius } = props;
	let { xCountDown, yCountDown } = props;
	const { x1, y1, x2, y2, dx } = props;

	if (!show) return null;
	if (!xCountDown) {
		xCountDown = 0;
	}
	if (!yCountDown) {
		yCountDown = 0;
	}

	let coordinateBase, coordinate;
	if (isDefined(displayCoordinate)) {
		const textAnchor = "middle"; // TODO: Below it is necessary to implement logic for the possibility of alignment from the right or from the left.

		let edgeXRect, edgeYRect, edgeXText, edgeYText;

		if (type === "horizontal") {
			edgeXRect =
				dx + (orient === "right" ? edgeAt + 1 : edgeAt - rectWidth - 1);
			edgeYRect = y1 - rectHeight / 2 - strokeWidth;
			edgeXText =
				dx +
				(orient === "right"
					? edgeAt + rectWidth / 2
					: edgeAt - rectWidth / 2) + xCountDown;
			edgeYText = y1 + yCountDown;
		} else {
			const dy = orient === "bottom" ? strokeWidth - 1 : -strokeWidth + 1;
			edgeXRect = x1 - rectWidth / 2;
			edgeYRect =
				(orient === "bottom" ? edgeAt : edgeAt - rectHeight) + dy;
			edgeXText = x1;
			edgeYText =
				(orient === "bottom"
					? edgeAt + rectHeight / 2
					: edgeAt - rectHeight / 2) + dy;
		}

		coordinateBase = {
			edgeXRect,
			edgeYRect,
			rectHeight: rectHeight + strokeWidth,
			rectWidth,
			rectRadius,
			fill,
			opacity,
			arrowWidth,
			stroke,
			strokeOpacity,
			strokeWidth
		};
		coordinate = {
			edgeXText,
			edgeYText,
			textAnchor,
			fontFamily,
			fontSize,
			textFill,
			displayCoordinate
		};
	}

	const line = hideLine
		? undefined
		: {
			opacity: lineOpacity,
			stroke: lineStroke,
			strokeDasharray: lineStrokeDasharray,
			x1,
			y1,
			x2,
			y2
		};

	return {
		coordinateBase,
		coordinate,
		line,
		orient
	};
}

export function drawOnCanvas(ctx, props) {
	const { fontSize, fontFamily } = props;
	let { xCountDown } = props;
	if (!xCountDown) {
		xCountDown = 0;
	}

	ctx.font = `${fontSize}px ${fontFamily}`;
	ctx.textBaseline = "middle";
	const width = Math.round(ctx.measureText(props.coordinate).width + 10);
	// console.log(width);

	const edge = helper({ ...props, rectWidth: width });

	if (edge === null) return;

	if (isDefined(edge.line)) {
		const dashArray = getStrokeDasharray(edge.line.strokeDasharray)
			.split(",")
			.map(d => +d);
		ctx.setLineDash(dashArray);
		ctx.strokeStyle = hexToRGBA(edge.line.stroke, edge.line.opacity);
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(edge.line.x1, edge.line.y1);
		ctx.lineTo(edge.line.x2, edge.line.y2);
		ctx.stroke();
	}

	ctx.setLineDash([]);
	if (isDefined(edge.coordinateBase)) {
		const {
			rectWidth,
			rectHeight,
			arrowWidth
		} = edge.coordinateBase;

		ctx.fillStyle = hexToRGBA(
			edge.coordinateBase.fill,
			edge.coordinateBase.opacity
		);
		if (isDefined(edge.coordinateBase.stroke)) {
			ctx.strokeStyle = hexToRGBA(
				edge.coordinateBase.stroke,
				edge.coordinateBase.strokeOpacity
			);
			ctx.lineWidth = edge.coordinateBase.strokeWidth;
		}

		let xText = edge.coordinate.edgeXText - 2;
		let x = edge.coordinateBase.edgeXRect;
		const y = edge.coordinateBase.edgeYRect;
		const halfHeight = rectHeight / 2;

		const LABEL_WIDTH = 53;
        const arrayBorder = (xCountDown === 0 ? [4] : [0, 0, 4, 4]);
        let xR = (xCountDown === 0 ? edge.coordinate.edgeXText - width / 2 - edge.coordinateBase.strokeWidth * 2 : edge.coordinate.edgeXText - width / 2 - edge.coordinateBase.strokeWidth * 2 + 2);
		let yR = (xCountDown === 0 ? edge.coordinate.edgeYText - fontSize - edge.coordinateBase.strokeWidth : edge.coordinate.edgeYText - fontSize - edge.coordinateBase.strokeWidth + 3);
        let widthR = (xCountDown === 0 ? LABEL_WIDTH - edge.coordinateBase.strokeWidth : LABEL_WIDTH - edge.coordinateBase.strokeWidth - 18 - 3);
        let heightR = (xCountDown === 0 ? fontSize * 2 : fontSize * 2 - 5);
		if (xCountDown !== 0 && width === 49) {
			xText = edge.coordinate.edgeXText - xCountDown;
			xR = edge.coordinate.edgeXText - width / 2 - edge.coordinateBase.strokeWidth * 2 - 4;
			yR = edge.coordinate.edgeYText - fontSize - edge.coordinateBase.strokeWidth + 3;
			widthR = LABEL_WIDTH - edge.coordinateBase.strokeWidth - 9;
			heightR = fontSize * 2 - 5;
		}
		ctx.beginPath();
		if (edge.orient === "right") {
			x -= arrowWidth;
			ctx.roundRect(xR, yR, widthR, heightR, arrayBorder);
		} else if (edge.orient === "left") {
			// x += arrowWidth;
			ctx.moveTo(x, y);
			ctx.lineTo(x + rectWidth, y);
			ctx.lineTo(x + rectWidth + arrowWidth, y + halfHeight);
			ctx.lineTo(x + rectWidth, y + rectHeight);
			ctx.lineTo(x, y + rectHeight);
			ctx.closePath();
		} else {
			ctx.roundRect(x, y, rectWidth - 2, rectHeight - 2, 4);
		}
		ctx.fill();

		if (isDefined(edge.coordinateBase.stroke)) {
			ctx.stroke();
		}

		ctx.fillStyle = edge.coordinate.textFill;
		ctx.textAlign =
			edge.coordinate.textAnchor === "middle"
				? "center"
				: edge.coordinate.textAnchor;
		ctx.fillText(
			edge.coordinate.displayCoordinate,
			xText,
			edge.coordinate.edgeYText
		);
	}
}

// export default EdgeCoordinate;
