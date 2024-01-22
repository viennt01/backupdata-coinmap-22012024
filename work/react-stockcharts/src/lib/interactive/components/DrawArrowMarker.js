import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas, getDrawCanvas } from "../../GenericComponent";

import {
  isDefined,
  noop,
  hexToRGBA,
  getStrokeDasharray,
  strokeDashTypes,
} from "../../utils";

class DrawArrowMarker extends Component {
  hover1 = false;
  hover2 = false;

  isHover = (moreProps) => {
    const { tolerance, onHover, getHoverInteractive } = this.props;

    if (isDefined(onHover)) {
      const { x1Value, x2Value, y1Value, y2Value, type } = this.props;
      const { mouseXY, xScale } = moreProps;
      const {
        chartConfig: { yScale },
      } = moreProps;
      const hovering = this.hover1 || this.hover2;
      if (getHoverInteractive) {
        getHoverInteractive(hovering);
      }
      return hovering;
    }
    return false;
  };
  drawOnCanvas = (ctx, moreProps) => {
    const { stroke, strokeWidth, strokeOpacity, strokeDasharray } = this.props;
    const { x1, y1, x2, y2 } = helper(this.props, moreProps);
    const { mouseXY } = moreProps;
    const ratio = window.devicePixelRatio;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const headlen = Math.sqrt(dx * dx + dy * dy) * 0.3; // length of head in pixels
    const angle = Math.atan2(dy, dx);

    const c1 = x2 - headlen * Math.cos(angle - Math.PI / 6);
    const c2 = y2 - headlen * Math.sin(angle - Math.PI / 6);

    const d1 = x2 - headlen * Math.cos(angle + Math.PI / 6);
    const d2 = y2 - headlen * Math.sin(angle + Math.PI / 6);

    const path1 = new Path2D();
    path1.lineTo(c1, c2);
    path1.lineTo(x2, y2);
    path1.lineTo(d1, d2);
    path1.closePath();
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.strokeStyle = stroke;
    ctx.fillStyle = stroke;
    ctx.fill(path1);
    ctx.stroke(path1);

    const path2 = new Path2D();
    path2.lineTo(x1, y1);
    path2.lineTo((x2 + c1) / 2, (y2 + c2) / 2);
    path2.lineTo((x2 + d1) / 2, (y2 + d2) / 2);
    path2.closePath();
    ctx.fill(path2);
    ctx.stroke(path2);

    if (mouseXY !== undefined) {
      this.hover1 = ctx.isPointInPath(
        path1,
        mouseXY[0] * ratio,
        mouseXY[1] * ratio
      );
      this.hover2 = ctx.isPointInPath(
        path2,
        mouseXY[0] * ratio,
        mouseXY[1] * ratio
      );
    }
  };
  renderSVG = (moreProps) => {
    const { stroke, strokeWidth, strokeOpacity, strokeDasharray } = this.props;

    const lineWidth = strokeWidth;

    const { x1, y1, x2, y2 } = helper(this.props, moreProps);
    return (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={lineWidth}
        strokeDasharray={getStrokeDasharray(strokeDasharray)}
        strokeOpacity={strokeOpacity}
      />
    );
  };
  render() {
    const { selected, interactiveCursorClass } = this.props;
    const { onDragStart, onDrag, onDragComplete, onHover, onUnHover } =
      this.props;

    return (
      <GenericChartComponent
        isHover={this.isHover}
        svgDraw={this.renderSVG}
        canvasToDraw={selected ? getMouseCanvas : getDrawCanvas}
        canvasDraw={this.drawOnCanvas}
        interactiveCursorClass={interactiveCursorClass}
        selected={selected}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragComplete={onDragComplete}
        onHover={onHover}
        onUnHover={onUnHover}
        drawOn={selected ? ["mousemove", "pan", "drag"] : ["mousemove", "pan"]}
      />
    );
  }
}

export function isHovering2(start, end, [mouseX, mouseY], tolerance) {
  const m = getSlope(start, end);

  if (isDefined(m)) {
    const b = getYIntercept(m, end);
    const y = m * mouseX + b;
    return (
      mouseY < y + tolerance &&
      mouseY > y - tolerance &&
      mouseX > Math.min(start[0], end[0]) - tolerance &&
      mouseX < Math.max(start[0], end[0]) + tolerance
    );
  } else {
    return (
      mouseY >= Math.min(start[1], end[1]) &&
      mouseY <= Math.max(start[1], end[1]) &&
      mouseX < start[0] + tolerance &&
      mouseX > start[0] - tolerance
    );
  }
}

function helper(props, moreProps) {
  const { x1Value, x2Value, y1Value, y2Value, type } = props;

  const {
    xScale,
    chartConfig: { yScale },
  } = moreProps;

  const modLine = generateLine({
    type,
    start: [x1Value, y1Value],
    end: [x2Value, y2Value],
    xScale,
    yScale,
  });

  const x1 = xScale(modLine.x1);
  const y1 = yScale(modLine.y1);
  const x2 = xScale(modLine.x2);
  const y2 = yScale(modLine.y2);

  return {
    x1,
    y1,
    x2,
    y2,
  };
}

export function getSlope(start, end) {
  const m /* slope */ =
    end[0] === start[0] ? undefined : (end[1] - start[1]) / (end[0] - start[0]);
  return m;
}
export function getYIntercept(m, end) {
  const b /* y intercept */ = -1 * m * end[0] + end[1];
  return b;
}

export function generateLine({ type, start, end, xScale, yScale }) {
  const m /* slope */ = getSlope(start, end);
  // console.log(end[0] - start[0], m)
  const b /* y intercept */ = getYIntercept(m, start);

  switch (type) {
    case "XLINE":
      return getXLineCoordinates({
        type,
        start,
        end,
        xScale,
        yScale,
        m,
        b,
      });
    case "RAY":
      return getRayCoordinates({
        type,
        start,
        end,
        xScale,
        yScale,
        m,
        b,
      });
    case "LINE":
      return getLineCoordinates({
        type,
        start,
        end,
        xScale,
        yScale,
        m,
        b,
      });
    case "horizontal":
      return getHorizontalCoordinates({
        start,
        end,
        xScale,
        yScale,
        m,
        b,
      });
  }
}

function getXLineCoordinates({ start, end, xScale, yScale, m, b }) {
  const [xBegin, xFinish] = xScale.domain();
  const [yBegin, yFinish] = yScale.domain();

  if (end[0] === start[0]) {
    return {
      x1: end[0],
      y1: yBegin,
      x2: end[0],
      y2: yFinish,
    };
  }
  const [x1, x2] = end[0] > start[0] ? [xBegin, xFinish] : [xFinish, xBegin];

  return {
    x1,
    y1: m * x1 + b,
    x2,
    y2: m * x2 + b,
  };
}

function getRayCoordinates({ start, end, xScale, yScale, m, b }) {
  const [xBegin, xFinish] = xScale.domain();
  const [yBegin, yFinish] = yScale.domain();

  const x1 = start[0];
  if (end[0] === start[0]) {
    return {
      x1,
      y1: start[1],
      x2: x1,
      y2: end[1] > start[1] ? yFinish : yBegin,
    };
  }

  const x2 = end[0] > start[0] ? xFinish : xBegin;

  return {
    x1,
    y1: m * x1 + b,
    x2,
    y2: m * x2 + b,
  };
}

function getLineCoordinates({ start, end }) {
  const [x1, y1] = start;
  const [x2, y2] = end;
  if (end[0] === start[0]) {
    return {
      x1,
      y1: start[1],
      x2: x1,
      y2: end[1],
    };
  }

  return {
    x1,
    y1,
    x2,
    y2,
  };
}

function getHorizontalCoordinates({ start, end, xScale, yScale, b }) {
  const [xBegin, xFinish] = xScale.domain();
  const [yBegin, yFinish] = yScale.domain();

  const x1 = xBegin;
  if (end[0] === start[0]) {
    return {
      x1,
      y1: yBegin,
      x2: x1,
      y2: end[1] > start[1] ? yFinish : yBegin,
    };
  }

  const x2 = end[0] > start[0] ? xFinish : xBegin;

  return {
    x1,
    y1: b,
    x2,
    y2: b,
  };
}

DrawArrowMarker.propTypes = {
  x1Value: PropTypes.any.isRequired,
  x2Value: PropTypes.any.isRequired,
  y1Value: PropTypes.any.isRequired,
  y2Value: PropTypes.any.isRequired,

  interactiveCursorClass: PropTypes.string,
  stroke: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  strokeOpacity: PropTypes.number.isRequired,
  strokeDasharray: PropTypes.oneOf(strokeDashTypes),

  type: PropTypes.oneOf([
    "XLINE", // extends from -Infinity to +Infinity
    "RAY", // extends to +/-Infinity in one direction
    "LINE", // extends between the set bounds
    "horizontal",
  ]).isRequired,

  onEdge1Drag: PropTypes.func.isRequired,
  onEdge2Drag: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDragComplete: PropTypes.func.isRequired,
  onHover: PropTypes.func,
  onUnHover: PropTypes.func,

  defaultClassName: PropTypes.string,

  r: PropTypes.number.isRequired,
  edgeFill: PropTypes.string.isRequired,
  edgeStroke: PropTypes.string.isRequired,
  edgeStrokeWidth: PropTypes.number.isRequired,
  withEdge: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired,
  tolerance: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
};

DrawArrowMarker.defaultProps = {
  onEdge1Drag: noop,
  onEdge2Drag: noop,
  onDragStart: noop,
  onDrag: noop,
  onDragComplete: noop,

  edgeStrokeWidth: 3,
  edgeStroke: "#000000",
  edgeFill: "#FFFFFF",
  r: 10,
  withEdge: false,
  strokeWidth: 1,
  strokeDasharray: "Solid",
  children: noop,
  tolerance: 7,
  selected: false,
  stroke: "#00d5ff"
};

export default DrawArrowMarker;
