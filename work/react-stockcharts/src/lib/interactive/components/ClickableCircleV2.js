import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas, getDrawCanvas } from "../../GenericComponent";

import { isDefined, noop, hexToRGBA } from "../../utils";

class ClickableCircleV2 extends Component {
  constructor(props) {
    super(props);
    this.saveNode = this.saveNode.bind(this);
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
    this.renderSVG = this.renderSVG.bind(this);
    this.isHover = this.isHover.bind(this);
  }
  saveNode(node) {
    this.node = node;
  }
  isHover(moreProps) {
    const { mouseXY } = moreProps;
    const { hoverTolerance } = this.props;

    const r = this.props.r + hoverTolerance;
    const [x, y] = helper(this.props, moreProps);

    const [mx, my] = mouseXY;
    const hover = x - r < mx && mx < x + r && y - r < my && my < y + r;

    return hover;
  }
  drawOnCanvas(ctx, moreProps) {
    const { show, selected, r } = this.props;
    const {
      edgeFillHover,
      edgeFillSelected,
      edgeStrokeHover,
      edgeStrokeSelected,
    } = this.props;

    const [x, y] = helper(this.props, moreProps);

    if (!show) return;

    ctx.lineWidth = 1;
    ctx.fillStyle = hexToRGBA(selected ? edgeFillSelected : edgeFillHover, 1);
    ctx.strokeStyle = hexToRGBA(selected ? edgeStrokeSelected : edgeStrokeHover, 1);

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }
  renderSVG(moreProps) {
    const {
      show,
      edgeFillHover,
      edgeFillSelected,
      edgeStrokeHover,
      edgeStrokeSelected,
      selected,
      r,
    } = this.props;

    if (!show) return null;

    const [x, y] = helper(this.props, moreProps);

    return (
      <circle
        cx={x}
        cy={y}
        r={r}
        stroke={selected ? edgeStrokeSelected : edgeStrokeHover}
        fill={selected ? edgeFillSelected : edgeFillHover}
      />
    );
  }
  render() {
    const { interactiveCursorClass } = this.props;
    const { show, selected } = this.props;
    const { onDragStart, onDrag, onDragComplete } = this.props;

    return (
      <GenericChartComponent
        ref={this.saveNode}
        interactiveCursorClass={interactiveCursorClass}
        selected={selected}
        enablePropagationHover
        isHover={this.isHover}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragComplete={onDragComplete}
        svgDraw={this.renderSVG}
        canvasDraw={this.drawOnCanvas}
        canvasToDraw={show ? getMouseCanvas : getDrawCanvas}
        drawOn={["pan", "mousemove", "drag"]}
      />
    );
  }
}

function helper(props, moreProps) {
  const { xyProvider, cx, cy, placement, height } = props;

  if (isDefined(xyProvider)) {
    return xyProvider(moreProps);
  }

  const {
    xScale,
    chartConfig: { yScale },
  } = moreProps;

  if (placement === "top") {
    const x = xScale(cx);
    const y = yScale(cy) - height / 2 - 5;

    return [x, y];
  }

  if (placement === "bottom") {
    const x = xScale(cx);
    const y = yScale(cy) + height / 2 + 5;

    return [x, y];
  }

  const x = xScale(cx);
  const y = yScale(cy);
  return [x, y];
}
ClickableCircleV2.propTypes = {
  xyProvider: PropTypes.func,

  onDragStart: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDragComplete: PropTypes.func.isRequired,
  r: PropTypes.number,
  edgeFillHover: PropTypes.string,
  edgeFillSelected: PropTypes.string,
  edgeStrokeHover: PropTypes.string,
  edgeStrokeSelected: PropTypes.string,

  cx: PropTypes.number,
  cy: PropTypes.number,

  className: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  hover: PropTypes.bool.isRequired,
  interactiveCursorClass: PropTypes.string.isRequired,
  strokeOpacity: PropTypes.number,
  fillOpacity: PropTypes.number,
  hoverTolerance: PropTypes.number,
};

ClickableCircleV2.defaultProps = {
  className: "react-stockcharts-interactive-line-edge",
  onDragStart: noop,
  onDrag: noop,
  onDragComplete: noop,
  onMove: noop,
  show: false,
  fillOpacity: 1,
  strokeOpacity: 1,
  r: 5,
  edgeFillHover: "#17233A",
  edgeFillSelected: "#14C8D8",
  edgeStrokeHover: "#ffffff",
  edgeStrokeSelected: "#14C8D8",
  hoverTolerance: 7,
};

export default ClickableCircleV2;
