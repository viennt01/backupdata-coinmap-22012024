import React, { Component } from "react";
import PropTypes from "prop-types";

import { ascending as d3Ascending } from "d3-array";
import { noop, strokeDashTypes } from "../../utils";
import { saveNodeType, isHover } from "../utils";
import { getXValue } from "../../utils/ChartDataUtil";

import StraightLine from "../components/StraightLine";
import ClickableCircleV2 from "../components/ClickableCircleV2";


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

class EachPath extends Component {
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
    const { points } = this.props;

    this.dragStart = [
			...points,
		];
  }
  handleLineDrag(moreProps) {
    const { index, onDrag } = this.props;

    const {
      xScale,
      chartConfig: { yScale },
      xAccessor,
      fullData,
    } = moreProps;
    const { startPos, mouseXY } = moreProps;

    const dx = startPos[0] - mouseXY[0];
    const dy = startPos[1] - mouseXY[1];

		const newPoints = this.dragStart.map((point) => {
			const x = xScale(point[0]);
			const y = yScale(point[1]);
			const newX = getXValue(
				xScale,
				xAccessor,
				[x - dx, y - dy],
				fullData
			);
			const newY = yScale.invert(y - dy);

			return [newX, newY];
		});

    onDrag(index, newPoints);
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
  handlePointDragStart = (index) => {
    this.setState({ anchor: `edge${index}` });
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
  handlePointDrag = (pointIndex, moreProps) => {
    const { index, onDrag, points } = this.props;

    const newXY = getNewXY(moreProps);
		const newPoints = [...points];
		newPoints[pointIndex] = newXY;

    onDrag(index, newPoints);
  }
  handleHover(moreProps) {
    if (this.state.hover !== moreProps.hovering) {
      this.setState({
        hover: moreProps.hovering,
      });
    }
  }

  renderLines = () => {
    const {
      points,
      type,
      stroke,
      strokeWidth,
      strokeOpacity,
      strokeDasharray,
      selected,

      onDragComplete,
    } = this.props;

    const { hover } = this.state;

    if (!Array.isArray(points) || points.length < 2) {
      return null;
    }

    const lines = [];
    const circles = [];
    for (let i = 0; i < points.length; i++) {
      const curPoint = points[i];

      circles.push(
        <ClickableCircleV2
					key={i}
          ref={this.saveNodeType(`edge${i}`)}
          show={selected || hover}
          cx={curPoint[0]}
          cy={curPoint[1]}
          selected={selected}
          hover={hover}
          interactiveCursorClass={"react-stockcharts-default-cursor"}
          onDragStart={(moreProps) => this.handlePointDragStart(i, moreProps)}
          onDrag={(moreProps) => this.handlePointDrag(i, moreProps)}
          onDragComplete={this.handleDragComplete}
        />
      );

      if (i < 1) {
        continue;
      }

      const prePoint = points[i - 1];
      lines.push(
        <StraightLine
          key={i}
          ref={this.saveNodeType(`line${i}`)}
          selected={selected || hover}
          onHover={this.handleHover}
          onUnHover={this.handleHover}
          x1Value={prePoint[0]}
          y1Value={prePoint[1]}
          x2Value={curPoint[0]}
          y2Value={curPoint[1]}
          type={type}
          stroke={stroke}
          strokeWidth={hover || selected ? strokeWidth + 1 : strokeWidth}
          strokeOpacity={strokeOpacity}
          strokeDasharray={strokeDasharray}
          interactiveCursorClass={"react-stockcharts-pointer-cursor"}
          onDragStart={this.handleLineDragStart}
          onDrag={this.handleLineDrag}
          onDragComplete={onDragComplete}
          // getHoverInteractive={this.props.getHoverInteractive}
        />
      );
    }

    return { lines, circles };
  };

  render() {
    const { lines, circles } = this.renderLines();

    return (
      <g>
        {lines}
        {circles}
      </g>
    );
  }
}

EachPath.propTypes = {
  points: PropTypes.array.isRequired,

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

EachPath.defaultProps = {
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

export default EachPath;
