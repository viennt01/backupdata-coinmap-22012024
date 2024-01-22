import React, { Component } from "react";
import PropTypes from "prop-types";

import { ascending as d3Ascending } from "d3-array";
import { noop } from "../../utils";
import { saveNodeType, isHover } from "../utils";
import { getXValue } from "../../utils/ChartDataUtil";

import DrawShortPosition from "../components/DrawShortPosition";
import ClickableCircleV2 from "../components/ClickableCircleV2";
import { EdgeIndicator, EdgeAreaMarkerX } from "../../coordinates";
import { getMouseCanvas, getDrawCanvas } from "../../GenericComponent";
class EachShortPosition extends Component {
  constructor(props) {
    super(props);

    this.handleEdgeEntryStartDrag = this.handleEdgeEntryStartDrag.bind(this);
    this.handleEdgeEntryEndDrag = this.handleEdgeEntryEndDrag.bind(this);
    this.handleEdgeStopLossDrag = this.handleEdgeStopLossDrag.bind(this);
    this.handleEdgeTakeProfitDrag = this.handleEdgeTakeProfitDrag.bind(this);

    this.handleYStopLoss = this.handleYStopLoss.bind(this);
    this.handleYEntryEnd = this.handleYEntryEnd.bind(this);
    this.handleYTakeProfit = this.handleYTakeProfit.bind(this);

    this.handleLineDragStart = this.handleLineDragStart.bind(this);
    this.handleLineDrag = this.handleLineDrag.bind(this);

    this.handleEdgeEntryStartDragStart = this.handleEdgeEntryStartDragStart.bind(this);
    this.handleEdgeEntryEndDragStart = this.handleEdgeEntryEndDragStart.bind(this);
    this.handleEdgeStopLossDragStart = this.handleEdgeStopLossDragStart.bind(this);
    this.handleEdgeTakeProfitDragStart = this.handleEdgeTakeProfitDragStart.bind(this);

    this.handleDragComplete = this.handleDragComplete.bind(this);

    this.handleHover = this.handleHover.bind(this);

    this.isHover = isHover.bind(this);
    this.saveNodeType = saveNodeType.bind(this);
    this.nodes = {};

    this.state = {
      hover: false,
      selected: false,
    };
  }
  handleLineDragStart() {
    const {
      xEntryStart,
      yEntryStart,
      xStopLoss,
      yStopLoss,
      xTakeProfit,
      yTakeProfit,
      xEntryEnd,
      yEntryEnd,
    } = this.props;

    this.dragStart = {
      xEntryStart,
      yEntryStart,
      xStopLoss,
      yStopLoss,
      xTakeProfit,
      yTakeProfit,
      xEntryEnd,
      yEntryEnd,
    };
  }
  handleLineDrag(moreProps) {
    const { index, onDrag } = this.props;

    const {
      xEntryStart,
      yEntryStart,
      xStopLoss,
      yStopLoss,
      xTakeProfit,
      yTakeProfit,
      xEntryEnd,
      yEntryEnd,
    } = this.dragStart;

    const {
      xScale,
      chartConfig: { yScale },
      xAccessor,
      fullData,
    } = moreProps;
    const { startPos, mouseXY } = moreProps;

    const x1 = xScale(xEntryStart);
    const y1 = yScale(yEntryStart);
    const x2 = xScale(xStopLoss);
    const y2 = yScale(yStopLoss);
    const x3 = xScale(xTakeProfit);
    const y3 = yScale(yTakeProfit);
    const x4 = xScale(xEntryEnd);
    const y4 = yScale(yEntryEnd);

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

    const newX3Value = getXValue(
      xScale,
      xAccessor,
      [x3 - dx, y3 - dy],
      fullData
    );
    const newY3Value = yScale.invert(y3 - dy);

    const newX4Value = getXValue(
      xScale,
      xAccessor,
      [x4 - dx, y4 - dy],
      fullData
    );
    const newY4Value = yScale.invert(y4 - dy);

    onDrag(index, {
      xStart: newX1Value,
      yStart: newY1Value,
      xStopLoss: newX2Value,
      yStopLoss: newY2Value,
      xTakeProfit: newX3Value,
      yTakeProfit: newY3Value,
      xEnd: newX4Value,
      yEnd: newY4Value,
    });
  }
  handleEdgeEntryStartDragStart() {
    this.setState({
      anchor: "edge2",
    });
  }
  handleEdgeEntryStartDrag(moreProps) {
    const { yStopLoss, yTakeProfit, xEntryEnd, index, onDrag } = this.props;
    const [x1, y1] = getNewXY(moreProps);
    let yStart;

    if (y1 <= yTakeProfit) {
      yStart = yTakeProfit;
    }
    if (y1 >= yStopLoss) {
      yStart = yStopLoss;
    }
    if (y1 > yTakeProfit && y1 < yStopLoss) {
      yStart = y1;
    }
    if (yStart === yStopLoss) {
      yStart = yStopLoss - 0.01;
    }
    if (yStart === yTakeProfit) {
      yStart = yTakeProfit + 0.01;
    }

    const xStopLoss = x1;
    const xTakeProfit = x1;
    const yEnd = yStart;

    onDrag(index, {
      xStart: x1,
      yStart,
      xStopLoss,
      yStopLoss,
      xTakeProfit,
      yTakeProfit,
      xEnd: xEntryEnd,
      yEnd,
    });
  }
  handleEdgeEntryEndDragStart() {
    this.setState({
      anchor: "edge1",
    });
  }
  handleEdgeEntryEndDrag(moreProps) {
    const {
      xEntryStart,
      xStopLoss,
      yStopLoss,
      xTakeProfit,
      yTakeProfit,
      index,
      onDrag,
    } = this.props;

    const [x1, y1] = getNewXY(moreProps);
    let yEnd;
    const xEnd = x1;

    if (y1 <= yTakeProfit) {
      yEnd = yTakeProfit;
    }
    if (y1 >= yStopLoss) {
      yEnd = yStopLoss;
    }
    if (y1 > yTakeProfit && y1 < yStopLoss) {
      yEnd = y1;
    }
    if (yEnd === yStopLoss) {
      yEnd = yStopLoss + 0.01;
    }
    if (yEnd === yTakeProfit) {
      yEnd = yTakeProfit - 0.01;
    }

    onDrag(index, {
      xStart: xEntryStart,
      yStart: yEnd,
      xStopLoss,
      yStopLoss,
      xTakeProfit,
      yTakeProfit,
      xEnd,
      yEnd,
    });
  }
  handleEdgeStopLossDragStart() {
    this.setState({
      anchor: "edge4",
    });
  }
  handleEdgeStopLossDrag(moreProps) {
    const { yEntryStart, yTakeProfit, xEntryEnd, yEntryEnd, index, onDrag } =
      this.props;

    const [x, y] = getNewXY(moreProps);
    const xStopLoss = x;
    let yStopLoss = y;
    const xStart = xStopLoss;
    const xTakeProfit = xStopLoss;

    yStopLoss = Math.max(yStopLoss, yEntryStart);

    if (yEntryStart === yStopLoss) {
      yStopLoss = yStopLoss + 0.01;
    }

    onDrag(index, {
      xStart,
      yStart: yEntryStart,
      xStopLoss,
      yStopLoss,
      xTakeProfit,
      yTakeProfit,
      xEnd: xEntryEnd,
      yEnd: yEntryEnd,
    });
  }
  handleEdgeTakeProfitDragStart() {
    this.setState({
      anchor: "edge3",
    });
  }
  handleEdgeTakeProfitDrag(moreProps) {
    const { yEntryStart, yStopLoss, xEntryEnd, yEntryEnd, index, onDrag } =
      this.props;

    const [x, y] = getNewXY(moreProps);
    const xTakeProfit = x;
    let yTakeProfit = y;
    const xStart = xTakeProfit;
    const xStopLoss = xTakeProfit;

    yTakeProfit = Math.min(yTakeProfit, yEntryStart);
    if (yEntryStart === yTakeProfit) {
      yTakeProfit = yTakeProfit - 0.01;
    }

    onDrag(index, {
      xStart,
      yStart: yEntryStart,
      xStopLoss,
      yStopLoss,
      xTakeProfit,
      yTakeProfit,
      xEnd: xEntryEnd,
      yEnd: yEntryEnd,
    });
  }
  handleDragComplete(...rest) {
    this.setState({
      anchor: undefined,
    });
    this.props.onDragComplete(...rest);
  }
  handleHover(moreProps) {
    if (this.state.hover !== moreProps.hovering) {
      this.setState({
        hover: moreProps.hovering,
      });
    }
  }
  handleYStopLoss() {
    const { yStopLoss } = this.props;
    return yStopLoss;
  }
  handleYEntryEnd() {
    const { yEntryEnd } = this.props;
    return yEntryEnd;
  }
  handleYTakeProfit() {
    const { yTakeProfit } = this.props;
    return yTakeProfit;
  }

  render() {
    const {
      xEntryStart,
      yEntryStart,
      xStopLoss,
      yStopLoss,
      xTakeProfit,
      yTakeProfit,
      xEntryEnd,
      yEntryEnd,
      stopLoss,
      opacityStopLoss,
      takeProfit,
      opacityTakeProfit,
      textFill,
      textOpacity,
      textSize,
      entryLineColor,
      entryLineOpacity,
      entryLineSize,
      showPriceLabels,
      alwaysShowStats,
      tickFormat,
      timeDisplayFormat,
      selected,
      onDragComplete,
      onDoubleClick,
    } = this.props;

    const { hover } = this.state;

    return (
      <g>
        <DrawShortPosition
          ref={this.saveNodeType("longPosition")}
          selected={selected || hover}
          onHover={this.handleHover}
          onUnHover={this.handleHover}
          xEntryStart={xEntryStart}
          yEntryStart={yEntryStart}
          xStopLoss={xStopLoss}
          yStopLoss={yStopLoss}
          xTakeProfit={xTakeProfit}
          yTakeProfit={yTakeProfit}
          xEntryEnd={xEntryEnd}
          yEntryEnd={yEntryEnd}
          stopLoss={stopLoss}
          opacityStopLoss={opacityStopLoss}
          takeProfit={takeProfit}
          opacityTakeProfit={opacityTakeProfit}
          textFill={textFill}
          textOpacity={textOpacity}
          textSize={textSize}
          entryLineColor={entryLineColor}
          entryLineOpacity={entryLineOpacity}
          entryLineSize={entryLineSize}
          alwaysShowStats={alwaysShowStats}
          interactiveCursorClass="react-stockcharts-pointer-cursor"
          onDragStart={this.handleLineDragStart}
          onDrag={this.handleLineDrag}
          onDragComplete={onDragComplete}
          onDoubleClick={onDoubleClick}
        />
        {showPriceLabels &&
          <EdgeIndicator
            hideLine
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={this.handleYTakeProfit}
            fill={takeProfit}
            textFill="white"
            rectHeight={10 + 3}
            rectWidth={30}
            fontSize={10}
            strokeWidth={1}
            arrowWidth={3}
            wickStroke={takeProfit}
            stroke={takeProfit}
            lineStroke="white"
            yAxisPad={3}
            displayFormat={tickFormat}
            fontWeight={300}
            canvasToDraw={selected || hover ? getMouseCanvas : getDrawCanvas}
            drawOn={selected || hover ? ["pan", "drag", "mousemove"] : ["pan", "mousemove"]}
          />
        }
        {showPriceLabels &&
          <EdgeIndicator
            hideLine
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={this.handleYEntryEnd}
            fill={entryLineColor}
            textFill="#263048"
            rectHeight={10 + 3}
            rectWidth={30}
            fontSize={10}
            strokeWidth={1}
            arrowWidth={3}
            wickStroke={entryLineColor}
            stroke={entryLineColor}
            lineStroke="white"
            yAxisPad={3}
            displayFormat={tickFormat}
            fontWeight={300}
            canvasToDraw={selected || hover ? getMouseCanvas : getDrawCanvas}
            drawOn={selected || hover ? ["pan", "drag", "mousemove"] : ["pan", "mousemove"]}
          />
        }
        {showPriceLabels &&
          <EdgeIndicator
            hideLine
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={this.handleYStopLoss}
            fill={stopLoss}
            textFill="white"
            rectHeight={10 + 3}
            rectWidth={30}
            fontSize={10}
            strokeWidth={1}
            arrowWidth={3}
            wickStroke={stopLoss}
            stroke={stopLoss}
            lineStroke="white"
            yAxisPad={3}
            displayFormat={tickFormat}
            fontWeight={300}
            canvasToDraw={selected || hover ? getMouseCanvas : getDrawCanvas}
            drawOn={selected || hover ? ["pan", "drag", "mousemove"] : ["pan", "mousemove"]}
          />
        }
        {selected &&
          <EdgeAreaMarkerX
            startValue={xEntryStart}
            endValue={xEntryEnd}
            startMarker
            displayFormat={timeDisplayFormat}
          />
        }
        <ClickableCircleV2
          ref={this.saveNodeType("edge1")}
          show={selected || hover}
          selected={selected}
          hover={hover}
          cx={xEntryStart}
          cy={yEntryStart}
          interactiveCursorClass={"react-stockcharts-default-cursor"}
          onDragStart={this.handleEdgeEntryStartDragStart}
          onDrag={this.handleEdgeEntryStartDrag}
          onDragComplete={this.handleDragComplete}
        />
        <ClickableCircleV2
          ref={this.saveNodeType("edge2")}
          show={selected || hover}
          selected={selected}
          hover={hover}
          cx={xEntryEnd}
          cy={yEntryEnd}
          interactiveCursorClass={"react-stockcharts-default-cursor"}
          onDragStart={this.handleEdgeEntryEndDragStart}
          onDrag={this.handleEdgeEntryEndDrag}
          onDragComplete={this.handleDragComplete}
        />
        <ClickableCircleV2
          ref={this.saveNodeType("edge3")}
          show={selected || hover}
          selected={selected}
          hover={hover}
          cx={xStopLoss}
          cy={yStopLoss}
          interactiveCursorClass={"react-stockcharts-default-cursor"}
          onDragStart={this.handleEdgeStopLossDragStart}
          onDrag={this.handleEdgeStopLossDrag}
          onDragComplete={this.handleDragComplete}
        />
        <ClickableCircleV2
          ref={this.saveNodeType("edge4")}
          show={selected || hover}
          selected={selected}
          hover={hover}
          cx={xTakeProfit}
          cy={yTakeProfit}
          interactiveCursorClass={"react-stockcharts-default-cursor"}
          onDragStart={this.handleEdgeTakeProfitDragStart}
          onDrag={this.handleEdgeTakeProfitDrag}
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

EachShortPosition.propTypes = {
  xEntryStart: PropTypes.any.isRequired,
  yEntryStart: PropTypes.any.isRequired,
  xStopLoss: PropTypes.any.isRequired,
  yStopLoss: PropTypes.any.isRequired,
  xTakeProfit: PropTypes.any.isRequired,
  yTakeProfit: PropTypes.any.isRequired,
  xEntryEnd: PropTypes.any.isRequired,
  yEntryEnd: PropTypes.any.isRequired,

  stopLoss: PropTypes.string.isRequired,
  opacityStopLoss: PropTypes.number.isRequired,
  takeProfit: PropTypes.string.isRequired,
  opacityTakeProfit: PropTypes.number.isRequired,
  textFill: PropTypes.string.isRequired,
  textOpacity: PropTypes.number.isRequired,
  textSize: PropTypes.number.isRequired,
  entryLineColor: PropTypes.string.isRequired,
  entryLineOpacity: PropTypes.number.isRequired,
  entryLineSize: PropTypes.number.isRequired,
  showPriceLabels: PropTypes.bool.isRequired,
  alwaysShowStats: PropTypes.bool.isRequired,
  tickFormat: PropTypes.func.isRequired,
  timeDisplayFormat: PropTypes.func.isRequired,

  index: PropTypes.number,
  onDrag: PropTypes.func.isRequired,
  onDragComplete: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onUnSelect: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  defaultClassName: PropTypes.string,

  selected: PropTypes.bool,
  hovering: PropTypes.bool,
};

EachShortPosition.defaultProps = {
  onDrag: noop,
  onDragComplete: noop,
  onSelect: noop,
  onUnSelect: noop,

  selected: false,
  hovering: false,
};

export default EachShortPosition;
