import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop, strokeDashTypes } from "../utils";

import {
  getValueFromOverride,
  terminate,
  saveNodeType,
  isHoverForInteractiveType,
} from "./utils";

import EachCallout from "./wrapper/EachCallout";
import DrawCallout from "./components/DrawCallout";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import ClickableCircle from "./components/ClickableCircle";

import GenericChartComponent from "../../lib/GenericChartComponent";

class Callout extends Component {
  constructor(props) {
    super(props);

    this.handleStart = this.handleStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleDrawLine = this.handleDrawLine.bind(this);
    this.handleDragLine = this.handleDragLine.bind(this);
    this.handleDragLineComplete = this.handleDragLineComplete.bind(this);

    this.handleDoubleClick = this.handleDoubleClick.bind(this);

    this.terminate = terminate.bind(this);
    this.saveNodeType = saveNodeType.bind(this);

    this.getSelectionState = isHoverForInteractiveType("trends").bind(this);
    this.getHoverInteractive = this.getHoverInteractive.bind(this);

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
              start: [override.x1Value, override.y1Value],
              end: [override.x2Value, override.y2Value],
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
  handleDrawLine(xyValue) {
    const { current } = this.state;
    if (isDefined(current) && isDefined(current.start)) {
      this.mouseMoved = true;
      this.setState({
        current: {
          start: current.start,
          end: xyValue,
        },
      });
    }
  }
  handleStart(xyValue, moreProps, e) {
    const { current } = this.state;

    if (isNotDefined(current) || isNotDefined(current.start)) {
      this.mouseMoved = false;

      this.setState(
        {
          current: {
            start: xyValue,
            end: null,
          },
        },
        () => {
          this.props.onStart(moreProps, e);
        }
      );
    }
  }
  handleEnd(xyValue, moreProps, e) {
    const { current } = this.state;
    const { trends, appearance, type } = this.props;

    if (this.mouseMoved && isDefined(current) && isDefined(current.start)) {
      const newTrends = [
        ...trends.map((d) => ({ ...d, selected: false })),
        {
          start: current.start,
          end: xyValue,
          selected: true,
          appearance,
          type,
        },
      ];
      this.setState(
        {
          current: null,
          trends: newTrends,
        },
        () => {
          this.props.onComplete(newTrends, moreProps, e);
          this.props.textCallout(newTrends, moreProps, e);
        }
      );
    }
  }
  handleDoubleClick(moreProps, e) {
    const { onDoubleClick } = this.props;
    const { currentText } = this.state;

    if (onDoubleClick && currentText !== null) {
      onDoubleClick(currentText, moreProps, e);
    }
  }

  getHoverInteractive(hovering, trendLine) {
    trendLine.hovering = hovering;
    const { isHover } = this.props;
    if (isHover) {
      isHover(hovering, trendLine);
    }
  }
  renderSVG = () => {
    const { appearance, defaultText } = this.props;
    const { enabled, snap, shouldDisableSnap, snapTo, type } = this.props;
    const { currentPositionRadius, currentPositionStroke } = this.props;
    const { currentPositionstrokeOpacity, currentPositionStrokeWidth } =
      this.props;
    const { trends } = this.props;
    const { current, override } = this.state;

    const tempLine =
      isDefined(current) && isDefined(current.end) ? (
        <>
          <DrawCallout
            type={type}
            noHover
            x1Value={current.start[0]}
            y1Value={current.start[1]}
            x2Value={current.end[0]}
            y2Value={current.end[1]}
            selected={true}
            bgFill={appearance.fill}
            bgFillOpacity={appearance.fillOpacity}
            bgOpacity={appearance.strokeOpacity}
            bgStroke={appearance.stroke}
            bgStrokeOpacity={appearance.strokeOpacity}
            bgStrokeWidth={appearance.strokeWidth}
            textFill={defaultText.textFill}
            bgTextOpacity={defaultText.textOpacity}
            fontFamily={defaultText.fontFamily}
            fontStyle={defaultText.fontStyle}
            fontWeight={defaultText.fontWeight}
            fontSize={defaultText.fontSize}
            text={defaultText.text}
          />
          <ClickableCircle
            show={true}
            cx={current.start[0]}
            cy={current.start[1]}
            r={appearance.r}
            fill={appearance.edgeFill}
            stroke={appearance.stroke}
            strokeWidth={appearance.strokeWidth}
            strokeOpacity={appearance.strokeOpacity}
          />
        </>
      ) : null;

    return (
      <>
        {trends.map((each, idx) => {
          const eachAppearance = isDefined(each.appearance)
            ? { ...appearance, ...each.appearance }
            : appearance;
          const props = {
            ...defaultText,
            ...appearance,
            ...each,
          };

          return (
            <EachCallout
              {...props}
              key={each.id}
              ref={this.saveNodeType(idx)}
              index={idx}
              type={each.type}
              selected={each.selected}
              x1Value={getValueFromOverride(
                override,
                idx,
                "x1Value",
                each.start[0]
              )}
              y1Value={getValueFromOverride(
                override,
                idx,
                "y1Value",
                each.start[1]
              )}
              x2Value={getValueFromOverride(
                override,
                idx,
                "x2Value",
                each.end[0]
              )}
              y2Value={getValueFromOverride(
                override,
                idx,
                "y2Value",
                each.end[1]
              )}
              r={eachAppearance.r}
              onDrag={this.handleDragLine}
              onDragComplete={this.handleDragLineComplete}
              getHoverInteractive={(hovering) =>
                this.getHoverInteractive(hovering, each)
              }
            />
          );
        })}
        {tempLine}
        {enabled && (
          <MouseLocationIndicator
            enabled={enabled}
            snap={snap}
            shouldDisableSnap={shouldDisableSnap}
            snapTo={snapTo}
            r={currentPositionRadius}
            stroke={currentPositionStroke}
            strokeOpacity={currentPositionstrokeOpacity}
            strokeWidth={currentPositionStrokeWidth}
            onMouseDown={this.handleStart}
            onClick={this.handleEnd}
            onMouseMove={this.handleDrawLine}
          />
        )}
      </>
    );
  };

  render() {
    return (
      <GenericChartComponent
        svgDraw={this.renderSVG}
        drawOn={[]}
        onDoubleClick={this.handleDoubleClick}
      />
    );
  }
}

Callout.propTypes = {
  snap: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
  snapTo: PropTypes.func,
  shouldDisableSnap: PropTypes.func.isRequired,

  onStart: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  textCallout: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  onDoubleClick: PropTypes.func,

  currentPositionStroke: PropTypes.string,
  currentPositionStrokeWidth: PropTypes.number,
  currentPositionstrokeOpacity: PropTypes.number,
  currentPositionRadius: PropTypes.number,
  type: PropTypes.oneOf([
    "XLINE", // extends from -Infinity to +Infinity
    "RAY", // extends to +/-Infinity in one direction
    "LINE", // extends between the set bounds
  ]),

  trends: PropTypes.array.isRequired,
  defaultText: PropTypes.shape({
    textFill: PropTypes.string.isRequired,
    textOpacity: PropTypes.number.isRequired,
    fontFamily: PropTypes.string.isRequired,
    fontWeight: PropTypes.string.isRequired,
    fontStyle: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,

  appearance: PropTypes.shape({
    fill: PropTypes.string.isRequired,
    fillOpacity: PropTypes.number.isRequired,
    stroke: PropTypes.string.isRequired,
    strokeOpacity: PropTypes.number.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    strokeDasharray: PropTypes.oneOf(strokeDashTypes),
  }).isRequired,
  isHover: PropTypes.func,
};

Callout.defaultProps = {
  type: "XLINE",

  onStart: noop,
  onComplete: noop,
  textCallout: noop,
  onSelect: noop,
  isHover: noop,
  onDoubleClick: noop,

  defaultText: {
    textFill: "#FFFFFF",
    textOpacity: 1,
    fontFamily: "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "normal",
    text: "Text...",
  },

  currentPositionStroke: "#000000",
  currentPositionstrokeOpacity: 1,
  currentPositionStrokeWidth: 3,
  currentPositionRadius: 0,

  shouldDisableSnap: (e) => e.button === 2 || e.shiftKey,

  appearance: {
    stroke: "#12bfe1",
    strokeWidth: 0,
    strokeOpacity: 1,
    fill: "#12bfe1",
    fillOpacity: 1,
    strokeDasharray: "Solid",
    r: 6,
  },
  trends: [],
};

Callout.contextTypes = {
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  generateSubscriptionId: PropTypes.func.isRequired,
  chartId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default Callout;
