import React, { Component } from "react";
import PropTypes from "prop-types";
import { isDefined, noop } from "../utils";
import {
  getValueFromOverride,
  terminate,
  saveNodeType,
  isHoverForInteractiveType,
} from "./utils";
import EachShortPosition from "./wrapper/EachShortPosition";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import GenericChartComponent from "../GenericChartComponent";
import { timeFormat } from "d3-time-format";

class ShortPosition extends Component {
  constructor(props) {
    super(props);

    this.handleStart = this.handleStart.bind(this);
    this.handleDragLine = this.handleDragLine.bind(this);
    this.handleDragLineComplete = this.handleDragLineComplete.bind(this);

    this.terminate = terminate.bind(this);
    this.saveNodeType = saveNodeType.bind(this);

    this.getSelectionState = isHoverForInteractiveType("trends").bind(this);

    this.state = {};
    this.nodes = [];
  }
  handleDragLine(index, newXYValue) {
    const { trends } = this.props;
    const selectedItem = trends[index];
    if (!selectedItem || selectedItem.locked) {
      return;
    }

    this.setState({
      override: {
        index,
        ...newXYValue,
      },
    });
  }
  handleDragLineComplete(moreProps) {
    const { override } = this.state;
    if (isDefined(override)) {
      const { trends } = this.props;
      const newTrends = trends.map((each, idx) =>
        idx === override.index
          ? {
              ...each,
              entryStart: [override.xStart, override.yStart],
              stopLoss: [override.xStopLoss, override.yStopLoss],
              takeProfit: [override.xTakeProfit, override.yTakeProfit],
              entryEnd: [override.xEnd, override.yEnd],
              selected: true,
            }
          : {
              ...each,
              selected: false,
            }
      );

      this.setState(
        {
          override: null,
        },
        () => {
          this.props.onComplete(newTrends, moreProps);
        }
      );
    }
  }
  handleStart(xyValue, moreProps, e) {
    const { trends, appearance } = this.props;
    const {
      xScale,
      chartConfig: { yScale },
    } = moreProps;

    const HEIGHT_RECT = 150;
    const WIDTH_RECT = 165;

    const yPxEntry = yScale(xyValue[1]);
    const yPxStopLoss = yPxEntry - HEIGHT_RECT;
    const stopLoss = [xyValue[0], yScale.invert(yPxStopLoss)];

    const yPxTakeProfit = yPxEntry + HEIGHT_RECT;
    const takeProfit = [xyValue[0], yScale.invert(yPxTakeProfit)];

    const xPxEntry = xScale(xyValue[0]);
    const xPxEnd = Math.round(xScale.invert(xPxEntry + WIDTH_RECT));
    const end = [xPxEnd, xyValue[1]];

    const newTrends = [
      ...trends.map((d) => ({ ...d, selected: false })),
      {
        entryStart: xyValue,
        stopLoss: stopLoss,
        takeProfit: takeProfit,
        entryEnd: end,
        selected: true,
        appearance,
      },
    ];
    this.setState(
      {
        current: null,
        trends: newTrends,
      },
      () => {
        this.props.onComplete(newTrends, moreProps, e);
      }
    );
  }
  renderSVG = () => {
    const { enabled, snap, trends, tickFormat, timeDisplayFormat, onDoubleClick } = this.props;
    const { override } = this.state;
    const { currentPositionRadius } = this.props;
    return (
      <>
        {trends.map((each, idx) => {
          return (
            <EachShortPosition
              key={each.id}
              ref={this.saveNodeType(idx)}
              index={idx}
              type={each.type}
              selected={each.selected}
              xEntryStart={getValueFromOverride(
                override,
                idx,
                "xStart",
                each.entryStart[0]
              )}
              yEntryStart={getValueFromOverride(
                override,
                idx,
                "yStart",
                each.entryStart[1]
              )}
              xStopLoss={getValueFromOverride(
                override,
                idx,
                "xStopLoss",
                each.stopLoss[0]
              )}
              yStopLoss={getValueFromOverride(
                override,
                idx,
                "yStopLoss",
                each.stopLoss[1]
              )}
              xTakeProfit={getValueFromOverride(
                override,
                idx,
                "xTakeProfit",
                each.takeProfit[0]
              )}
              yTakeProfit={getValueFromOverride(
                override,
                idx,
                "yTakeProfit",
                each.takeProfit[1]
              )}
              xEntryEnd={getValueFromOverride(
                override,
                idx,
                "xEnd",
                each.entryEnd[0]
              )}
              yEntryEnd={getValueFromOverride(
                override,
                idx,
                "yEnd",
                each.entryEnd[1]
              )}
              stopLoss= {each.appearance.stopLoss}
              opacityStopLoss= {each.appearance.opacityStopLoss}
              takeProfit= {each.appearance.takeProfit}
              opacityTakeProfit= {each.appearance.opacityTakeProfit}
              textFill= {each.appearance.textFill}
              textOpacity={each.appearance.textOpacity}
              textSize={each.appearance.textSize}
              entryLineColor={each.appearance.entryLineColor}
              entryLineOpacity={each.appearance.entryLineOpacity}
              entryLineSize={each.appearance.entryLineSize}
              showPriceLabels={each.appearance.showPriceLabels}
              alwaysShowStats={each.appearance.alwaysShowStats}
              tickFormat={tickFormat}
              timeDisplayFormat={timeDisplayFormat}
              onDrag={this.handleDragLine}
              onDragComplete={this.handleDragLineComplete}
              onDoubleClick={onDoubleClick}
            />
          );
        })}
        {enabled && (
          <MouseLocationIndicator
            enabled={enabled}
            snap={snap}
            onMouseDown={this.handleStart}
            r={currentPositionRadius}
          />
        )}
      </>
    );
  };

  render() {
    return <GenericChartComponent svgDraw={this.renderSVG} drawOn={[]} />;
  }
}

ShortPosition.propTypes = {
  snap: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
  snapTo: PropTypes.func,
  onStart: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  onDoubleClick: PropTypes.func,
  trends: PropTypes.array.isRequired,
  currentPositionRadius: PropTypes.number,
  appearance: PropTypes.shape({
    stopLoss: PropTypes.string.isRequired,
    opacityStopLoss: PropTypes.number.isRequired,
    takeProfit: PropTypes.string.isRequired,
    opacityTakeProfit: PropTypes.number.isRequired,
    textFill: PropTypes.string.isRequired,
    textOpacity: PropTypes.number,
    textSize: PropTypes.number,
    entryLineColor: PropTypes.string,
    entryLineOpacity: PropTypes.number,
    entryLineSize: PropTypes.number,
    showPriceLabels: PropTypes.bool,
    alwaysShowStats: PropTypes.bool,
  }).isRequired,
  tickFormat: PropTypes.func,
  timeDisplayFormat: PropTypes.func,
  isHover: PropTypes.func,
};

ShortPosition.defaultProps = {
  onStart: noop,
  onComplete: noop,
  onSelect: noop,
  onDoubleClick: noop,
  isHover: noop,
  trends: [],
  currentPositionRadius: 0,
  appearance: {
    stopLoss: "#B22B00",
    opacityStopLoss: 0.2,
    takeProfit: "#1FAA99",
    opacityTakeProfit: "0.2",
    textFill: "#ffffff",
    textOpacity: 1,
    textSize: 12,
    entryLineColor: "#D9D9D9",
    entryLineOpacity: 1,
    entryLineSize: 1,
    showPriceLabels: true,
    alwaysShowStats: false,
  },
  tickFormat: (d) => d,
  timeDisplayFormat: timeFormat("%e %b %Y %H:%M"),
};

export default ShortPosition;
