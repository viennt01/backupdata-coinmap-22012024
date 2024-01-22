import React, { Component } from "react";
import PropTypes from "prop-types";

import { noop } from "../../utils";
import { saveNodeType, isHover } from "../utils";
import { getXValue } from "../../utils/ChartDataUtil";

import InteractiveText from "../components/InteractiveText";

class EachText extends Component {
  constructor(props) {
    super(props);

    this.handleHover = this.handleHover.bind(this);

    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);

    this.isHover = isHover.bind(this);
    this.saveNodeType = saveNodeType.bind(this);
    this.nodes = {};

    this.state = {
      hover: false,
    };
  }
  handleDragStart() {
    const { x1Value, y1Value } = this.props;

    this.dragStart = {
      x1Value,
      y1Value,
    };
  }
  handleDrag(moreProps) {
    const { index, onDrag } = this.props;
    const { x1Value, y1Value } = this.dragStart;
    const {
      xScale,
      chartConfig: { yScale },
      xAccessor,
      fullData,
    } = moreProps;
    const { startPos, mouseXY } = moreProps;

    const x1 = xScale(x1Value);
    const y1 = yScale(y1Value);

    const dx = startPos[0] - mouseXY[0];
    const dy = startPos[1] - mouseXY[1];
    const newX1Value = getXValue(
      xScale,
      xAccessor,
      [x1 - dx, y1 - dy],
      fullData
    );
    const newY1Value = yScale.invert(y1 - dy);

    onDrag(index, {
      x1Value: newX1Value,
      y1Value: newY1Value,
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
      fill,
      fillOpacity,
      strokeOpacity,
      stroke,
      textOpacity,
      strokeWidth,
      textFill,
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      text,
      selected,
      onDragComplete,
      onDoubleClick,
    } = this.props;
    const { hover } = this.state;
    const hoverHandler = {
      onHover: this.handleHover,
      onUnHover: this.handleHover,
    };

    return (
      <g>
        <InteractiveText
          ref={this.saveNodeType("text")}
          selected={selected || hover}
          interactiveCursorClass="react-stockcharts-pointer-cursor"
          {...hoverHandler}
          onDragStart={this.handleDragStart}
          onDrag={this.handleDrag}
          onDoubleClick={onDoubleClick}
          onDragComplete={onDragComplete}
          x1Value={x1Value}
          y1Value={y1Value}
          bgFill={fill}
          bgFillOpacity={fillOpacity}
          bgStroke={stroke}
          bgStrokeOpacity={strokeOpacity}
          bgStrokeWidth={strokeWidth}
          textFill={textFill}
          bgTextOpacity={textOpacity}
          fontFamily={fontFamily}
          fontStyle={fontStyle}
          fontWeight={fontWeight}
          fontSize={fontSize}
          text={text}
        />
      </g>
    );
  }
}

EachText.propTypes = {
  x1Value: PropTypes.any.isRequired,
  x2Value: PropTypes.any.isRequired,

  position: PropTypes.array.isRequired,
  bgFill: PropTypes.string.isRequired,
  bgFillOpacity: PropTypes.number.isRequired,
  bgStrokeOpacity: PropTypes.number.isRequired,
  bgTextOpacity: PropTypes.number.isRequired,
  bgStrokeWidth: PropTypes.number.isRequired,
  bgStroke: PropTypes.string,
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

EachText.defaultProps = {
  onDrag: noop,
  onDragComplete: noop,
  onDoubleClick: noop,
  bgFillOpacity: 0,
  bgStrokeOpacity: 0,
  bgTextOpacity: 1,
  bgStrokeWidth: 1,
  selected: false,
  fill: "#12bfe1",
};

export default EachText;
