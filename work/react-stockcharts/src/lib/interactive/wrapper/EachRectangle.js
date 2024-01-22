import React, { Component } from "react";
import PropTypes from "prop-types";

import { ascending as d3Ascending } from "d3-array";
import { noop, strokeDashTypes } from "../../utils";
import { saveNodeType, isHover } from "../utils";
import { getXValue } from "../../utils/ChartDataUtil";

import RectangleShape from "../components/RectangleShape";
import ClickableCircleV2 from "../components/ClickableCircleV2";

class EachRectangle extends Component {
  constructor(props) {
    super(props);

    this.handleEdge1Drag = this.handleEdge1Drag.bind(this);
    this.handleEdge2Drag = this.handleEdge2Drag.bind(this);
    this.handleLineDragStart = this.handleLineDragStart.bind(this);
    this.handleLineDrag = this.handleLineDrag.bind(this);

    this.handleEdge1DragStart = this.handleEdge1DragStart.bind(this);
    this.handleEdge2DragStart = this.handleEdge2DragStart.bind(this);

    this.handleDragComplete = this.handleDragComplete.bind(this);

    this.handleHover = this.handleHover.bind(this);

    this.isHover = isHover.bind(this);
    this.saveNodeType = saveNodeType.bind(this);
    this.nodes = {};

    this.state = {
      hover: false,
    };
  }
  handleLineDragStart() {
    const { x1Value, y1Value, x2Value, y2Value } = this.props;

    this.dragStart = {
      x1Value,
      y1Value,
      x2Value,
      y2Value,
    };
  }
  handleLineDrag(moreProps) {
    const { index, onDrag } = this.props;

    const { x1Value, y1Value, x2Value, y2Value } = this.dragStart;

    const {
      xScale,
      chartConfig: { yScale },
      xAccessor,
      fullData,
    } = moreProps;
    const { startPos, mouseXY } = moreProps;

    const x1 = xScale(x1Value);
    const y1 = yScale(y1Value);
    const x2 = xScale(x2Value);
    const y2 = yScale(y2Value);

    const dx = startPos[0] - mouseXY[0];
    const dy = startPos[1] - mouseXY[1];

    const newX1Value = getXValue(
      xScale,
      xAccessor,
      [x1 - dx, y1 - dy],
      fullData
    );
    const newY1Value = yScale.invert(y1 - dy);
    const newX2Value = getXValue(
      xScale,
      xAccessor,
      [x2 - dx, y2 - dy],
      fullData
    );
    const newY2Value = yScale.invert(y2 - dy);

    onDrag(index, {
      x1Value: newX1Value,
      y1Value: newY1Value,
      x2Value: newX2Value,
      y2Value: newY2Value,
    });
  }
  handleEdge1DragStart() {
    this.setState({
      anchor: "edge2",
    });
  }
  handleEdge2DragStart() {
    this.setState({
      anchor: "edge1",
    });
  }
  handleEdge3DragStart = () => {
    this.setState({
      anchor: "edge4",
    });
  }
  handleEdge4DragStart = () => {
    this.setState({
      anchor: "edge3",
    });
  }
  handleEdge5DragStart = () => {
    this.setState({
      anchor: "edge6",
    });
  }
  handleEdge6DragStart = () => {
    this.setState({
      anchor: "edge5",
    });
  }
  handleEdge7DragStart = () => {
    this.setState({
      anchor: "edge8",
    });
  }
  handleEdge8DragStart = () => {
    this.setState({
      anchor: "edge7",
    });
  }
  handleDragComplete(...rest) {
    this.setState({
      anchor: undefined,
    });
    this.props.onDragComplete(...rest);
  }
  handleEdge1Drag(moreProps) {
    const { index, onDrag } = this.props;
    const { x2Value, y2Value } = this.props;

    const [x1Value, y1Value] = getNewXY(moreProps);

    onDrag(index, {
      x1Value,
      y1Value,
      x2Value,
      y2Value,
    });
  }
  handleEdge2Drag(moreProps) {
    const { index, onDrag } = this.props;
    const { x1Value, y1Value } = this.props;

    const [x2Value, y2Value] = getNewXY(moreProps);

    onDrag(index, {
      x1Value,
      y1Value,
      x2Value,
      y2Value,
    });
  }
  handleEdge3Drag = (moreProps) => {
    const { index, onDrag } = this.props;
    const { x1Value, y2Value } = this.props;

    const [x2Value, y1Value] = getNewXY(moreProps);

    onDrag(index, {
      x1Value,
      y1Value,
      x2Value,
      y2Value,
    });
  }
  handleEdge4Drag = (moreProps) => {
    const { index, onDrag } = this.props;
    const { x2Value, y1Value } = this.props;

    const [x1Value, y2Value] = getNewXY(moreProps);

    onDrag(index, {
      x1Value,
      y1Value,
      x2Value,
      y2Value,
    });
  }
  handleEdge5Drag = (moreProps) => {
    const { index, onDrag } = this.props;
    const { x1Value, x2Value, y2Value } = this.props;

    const [a, b] = getNewXY(moreProps);
    const y1Value = b;

    onDrag(index, {
      x1Value,
      y1Value,
      x2Value,
      y2Value,
    });
  }
  handleEdge6Drag = (moreProps) => {
    const { index, onDrag } = this.props;
    const { x1Value, x2Value, y1Value } = this.props;

    const [a, b] = getNewXY(moreProps);
    const y2Value = b;
    onDrag(index, {
      x1Value,
      y1Value,
      x2Value,
      y2Value,
    });
  }
  handleEdge7Drag = (moreProps) => {
    const { index, onDrag } = this.props;
    const { x2Value, y1Value, y2Value } = this.props;

    const [a, b] = getNewXY(moreProps);
    const x1Value = a;

    onDrag(index, {
      x1Value,
      y1Value,
      x2Value,
      y2Value,
    });
  }
  handleEdge8Drag = (moreProps) => {
    const { index, onDrag } = this.props;
    const { x1Value, y1Value, y2Value } = this.props;

    const [a, b] = getNewXY(moreProps);
    const x2Value = a;
    onDrag(index, {
      x1Value,
      y1Value,
      x2Value,
      y2Value,
    });
  }
  handleHover(moreProps) {
    if (this.state.hover !== moreProps.hovering) {
      this.setState({
        hover: moreProps.hovering,
      });
    }
  }
  render() {
    const {
      x1Value,
      y1Value,
      x2Value,
      y2Value,
      type,
      stroke,
      strokeWidth,
      strokeOpacity,
      strokeDasharray,
      selected,

      onDragComplete,
    } = this.props;

    const { hover } = this.state;

    return (
      <g>
        <RectangleShape
          ref={this.saveNodeType("line")}
          selected={selected || hover}
          onHover={this.handleHover}
          onUnHover={this.handleHover}
          x1Value={x1Value}
          y1Value={y1Value}
          x2Value={x2Value}
          y2Value={y2Value}
          type={type}
          stroke={stroke}
          strokeWidth={hover || selected ? strokeWidth + 1 : strokeWidth}
          strokeOpacity={strokeOpacity}
          strokeDasharray={strokeDasharray}
          interactiveCursorClass="react-stockcharts-pointer-cursor"
          onDragStart={this.handleLineDragStart}
          onDrag={this.handleLineDrag}
          onDragComplete={onDragComplete}
          getHoverInteractive={this.props.getHoverInteractive}
        />
        <ClickableCircleV2
          ref={this.saveNodeType("edge1")}
          show={selected || hover}
          cx={x1Value}
          cy={y1Value}
          selected={selected}
          hover={hover}
          interactiveCursorClass="react-stockcharts-default-cursor"
          onDragStart={this.handleEdge1DragStart}
          onDrag={this.handleEdge1Drag}
          onDragComplete={this.handleDragComplete}
        />
        <ClickableCircleV2
          ref={this.saveNodeType("edge2")}
          show={selected || hover}
          cx={x2Value}
          cy={y2Value}
          selected={selected}
          hover={hover}
          interactiveCursorClass="react-stockcharts-default-cursor"
          onDragStart={this.handleEdge2DragStart}
          onDrag={this.handleEdge2Drag}
          onDragComplete={this.handleDragComplete}
        />
        <ClickableCircleV2
          ref={this.saveNodeType("edge3")}
          show={selected || hover}
          cx={x2Value}
          cy={y1Value}
          selected={selected}
          hover={hover}
          interactiveCursorClass="react-stockcharts-default-cursor"
          onDragStart={this.handleEdge3DragStart}
          onDrag={this.handleEdge3Drag}
          onDragComplete={this.handleDragComplete}
        />
        <ClickableCircleV2
          ref={this.saveNodeType("edge4")}
          show={selected || hover}
          cx={x1Value}
          cy={y2Value}
          selected={selected}
          hover={hover}
          interactiveCursorClass="react-stockcharts-default-cursor"
          onDragStart={this.handleEdge4DragStart}
          onDrag={this.handleEdge4Drag}
          onDragComplete={this.handleDragComplete}
        />
        <ClickableCircleV2
          ref={this.saveNodeType("edge5")}
          show={selected || hover}
          cx={(x1Value + x2Value) / 2}
          cy={y1Value}
          selected={selected}
          hover={hover}
          interactiveCursorClass="react-stockcharts-default-cursor"
          onDragStart={this.handleEdge5DragStart}
          onDrag={this.handleEdge5Drag}
          onDragComplete={this.handleDragComplete}
        />
        <ClickableCircleV2
          ref={this.saveNodeType("edge6")}
          show={selected || hover}
          cx={(x1Value + x2Value) / 2}
          cy={y2Value}
          selected={selected}
          hover={hover}
          interactiveCursorClass="react-stockcharts-default-cursor"
          onDragStart={this.handleEdge6DragStart}
          onDrag={this.handleEdge6Drag}
          onDragComplete={this.handleDragComplete}
        />
        <ClickableCircleV2
          ref={this.saveNodeType("edge7")}
          show={selected || hover}
          cx={x1Value}
          cy={(y1Value + y2Value) / 2}
          selected={selected}
          hover={hover}
          interactiveCursorClass="react-stockcharts-default-cursor"
          onDragStart={this.handleEdge7DragStart}
          onDrag={this.handleEdge7Drag}
          onDragComplete={this.handleDragComplete}
        />
        <ClickableCircleV2
          ref={this.saveNodeType("edge8")}
          show={selected || hover}
          cx={x2Value}
          cy={(y1Value + y2Value) / 2}
          selected={selected}
          hover={hover}
          interactiveCursorClass="react-stockcharts-default-cursor"
          onDragStart={this.handleEdge8DragStart}
          onDrag={this.handleEdge8Drag}
          onDragComplete={this.handleDragComplete}
        />
      </g>
    );
  }
}

export function getNewXY(moreProps) {
  const {
    xScale,
    chartConfig: { yScale },
    xAccessor,
    plotData,
    mouseXY,
  } = moreProps;
  const mouseY = mouseXY[1];

  const x = getXValue(xScale, xAccessor, mouseXY, plotData);

  const [small, big] = yScale.domain().slice().sort(d3Ascending);
  const y = yScale.invert(mouseY);
  const newY = Math.min(Math.max(y, small), big);

  return [x, newY];
}

EachRectangle.propTypes = {
  x1Value: PropTypes.any.isRequired,
  x2Value: PropTypes.any.isRequired,
  y1Value: PropTypes.any.isRequired,
  y2Value: PropTypes.any.isRequired,

  index: PropTypes.number,

  type: PropTypes.oneOf([
    "XLINE", // extends from -Infinity to +Infinity
    "RAY", // extends to +/-Infinity in one direction
    "LINE", // extends between the set bounds
  ]).isRequired,

  onDrag: PropTypes.func.isRequired,
  onEdge1Drag: PropTypes.func.isRequired,
  onEdge2Drag: PropTypes.func.isRequired,
  onDragComplete: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onUnSelect: PropTypes.func.isRequired,

  r: PropTypes.number.isRequired,
  strokeOpacity: PropTypes.number.isRequired,
  defaultClassName: PropTypes.string,

  selected: PropTypes.bool,

  stroke: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  strokeDasharray: PropTypes.oneOf(strokeDashTypes),

  edgeFill: PropTypes.string.isRequired,
};

EachRectangle.defaultProps = {
  onDrag: noop,
  onEdge1Drag: noop,
  onEdge2Drag: noop,
  onDragComplete: noop,
  onSelect: noop,
  onUnSelect: noop,

  selected: false,
  hovering: false,

  strokeWidth: 1,
  strokeOpacity: 1,
  strokeDasharray: "Solid",
};

export default EachRectangle;