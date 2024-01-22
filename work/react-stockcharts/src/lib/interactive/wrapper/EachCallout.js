import React, { Component } from "react";
import PropTypes from "prop-types";

import { noop } from "../../utils";
import { saveNodeType, isHover } from "../utils";
import { getXValue } from "../../utils/ChartDataUtil";
import { ascending as d3Ascending } from "d3-array";

import DrawCallout from "../components/DrawCallout";
import ClickableCircleV2 from "../components/ClickableCircleV2";

class EachCallout extends Component {
  constructor(props) {
    super(props);

    this.handleLineDragStart = this.handleLineDragStart.bind(this);
    this.handleLineDrag = this.handleLineDrag.bind(this);

    this.handleEdge1Drag = this.handleEdge1Drag.bind(this);
    this.handleEdge1DragStart = this.handleEdge1DragStart.bind(this);
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

    const x2 = xScale(x2Value);
    const y2 = yScale(y2Value);

    const dx = startPos[0] - mouseXY[0];
    const dy = startPos[1] - mouseXY[1];
    const newX2Value = getXValue(
      xScale,
      xAccessor,
      [x2 - dx, y2 - dy],
      fullData
    );
    const newY2Value = yScale.invert(y2 - dy);

    onDrag(index, {
      x1Value: x1Value,
      y1Value: y1Value,
      x2Value: newX2Value,
      y2Value: newY2Value,
    });
  }
  handleEdge1DragStart() {
    this.setState({
      anchor: "edge1",
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
      fill,
      fillOpacity,
      strokeOpacity,
      strokeWidth,
      textFill,
      textOpacity,
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      text,
      selected,
      onDragComplete,
      onDoubleClick,
      stroke,
      r,
    } = this.props;
    const { hover } = this.state;
    const hoverHandler = {
      onHover: this.handleHover,
      onUnHover: this.handleHover,
    };

    return (
      <g>
        <DrawCallout
          ref={this.saveNodeType("text")}
          selected={selected || hover}
          interactiveCursorClass="react-stockcharts-pointer-cursor"
          {...hoverHandler}
          onDragStart={this.handleLineDragStart}
          onDrag={this.handleLineDrag}
          onDoubleClick={onDoubleClick}
          onDragComplete={onDragComplete}
          x1Value={x1Value}
          y1Value={y1Value}
          x2Value={x2Value}
          y2Value={y2Value}
          bgFill={fill}
          bgFillOpacity={fillOpacity}
          bgStrokeOpacity={strokeOpacity}
          bgStroke={stroke}
          bgStrokeWidth={strokeWidth}
          textFill={textFill}
          bgTextOpacity={textOpacity}
          fontFamily={fontFamily}
          fontStyle={fontStyle}
          fontWeight={fontWeight}
          fontSize={fontSize}
          text={text}
          r={r}
        />
        <ClickableCircleV2
          ref={this.saveNodeType("edge1")}
          show={selected || hover}
          cx={x1Value}
          cy={y1Value}
          selected={selected}
          hover={hover}
          interactiveCursorClass={"react-stockcharts-default-cursor"}
          onDragStart={this.handleEdge1DragStart}
          onDrag={this.handleEdge1Drag}
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

EachCallout.propTypes = {
  index: PropTypes.number,
  x1Value: PropTypes.any.isRequired,
  x2Value: PropTypes.any.isRequired,
  y1Value: PropTypes.any.isRequired,
  y2Value: PropTypes.any.isRequired,

  fill: PropTypes.string.isRequired,
  bgFillOpacity: PropTypes.number.isRequired,
  bgStrokeOpacity: PropTypes.number.isRequired,
  bgTextOpacity: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  stroke: PropTypes.string,
  textFill: PropTypes.string.isRequired,

  fontWeight: PropTypes.string.isRequired,
  fontFamily: PropTypes.string.isRequired,
  fontStyle: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,

  text: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,

  onDrag: PropTypes.func.isRequired,
  onDragComplete: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
};

EachCallout.defaultProps = {
  onDrag: noop,
  onDragComplete: noop,
  onDoubleClick: noop,
  bgFillOpacity: 1,
  bgStrokeOpacity: 1,
  bgTextOpacity: 1,
  bgStrokeWidth: 1,
  bgStroke: "#0097a7",
  selected: false,
  hovering: false,

  fill: "#12bfe1",
  stroke: "#12bfe1",

  r: 5,
  strokeWidth: 1,
  strokeOpacity: 1,
  strokeDasharray: "Solid",
};

export default EachCallout;
