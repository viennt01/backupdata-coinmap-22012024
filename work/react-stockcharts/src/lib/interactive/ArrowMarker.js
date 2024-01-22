import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop, strokeDashTypes } from "../utils";

import {
  getValueFromOverride,
  terminate,
  saveNodeType,
  isHoverForInteractiveType,
} from "./utils";

import EachArrowMarker from "./wrapper/EachArrowMarker";
import DrawArrowMarker from "./components/DrawArrowMarker";
import MouseLocationIndicator from "./components/MouseLocationIndicator";

import GenericChartComponent from "../../lib/GenericChartComponent";

class ArrowMarker extends Component {
  constructor(props) {
    super(props);

    this.handleStart = this.handleStart.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleDrawLine = this.handleDrawLine.bind(this);
    this.handleDragLine = this.handleDragLine.bind(this);
    this.handleDragLineComplete = this.handleDragLineComplete.bind(this);

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
        }
      );
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
    const { appearance } = this.props;
    const { enabled, snap, shouldDisableSnap, snapTo, type } = this.props;
    const { currentPositionRadius, currentPositionStroke } = this.props;
    const { currentPositionstrokeOpacity, currentPositionStrokeWidth } =
      this.props;
    const { trends } = this.props;
    const { current, override } = this.state;

    const tempLine =
      isDefined(current) && isDefined(current.end) ? (
        <DrawArrowMarker
          type={type}
          noHover
          selected
          x1Value={current.start[0]}
          y1Value={current.start[1]}
          x2Value={current.end[0]}
          y2Value={current.end[1]}
          stroke={appearance.stroke}
          strokeWidth={appearance.strokeWidth}
          strokeOpacity={appearance.strokeOpacity}
        />
      ) : null;

    return (
      <>
        {trends.map((each, idx) => {
          const eachAppearance = isDefined(each.appearance)
            ? { ...appearance, ...each.appearance }
            : appearance;

          return (
            <EachArrowMarker
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
              stroke={eachAppearance.stroke}
              strokeWidth={eachAppearance.strokeWidth}
              strokeOpacity={eachAppearance.strokeOpacity}
              strokeDasharray={eachAppearance.strokeDasharray}
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
    return <GenericChartComponent svgDraw={this.renderSVG} drawOn={[]} />;
  }
}

ArrowMarker.propTypes = {
  snap: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
  snapTo: PropTypes.func,
  shouldDisableSnap: PropTypes.func.isRequired,

  onStart: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
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

  appearance: PropTypes.shape({
    stroke: PropTypes.string.isRequired,
    strokeOpacity: PropTypes.number.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    strokeDasharray: PropTypes.oneOf(strokeDashTypes),
  }).isRequired,
  isHover: PropTypes.func,
};

ArrowMarker.defaultProps = {
  type: "XLINE",

  onStart: noop,
  onComplete: noop,
  onSelect: noop,
  isHover: noop,

  currentPositionStroke: "#000000",
  currentPositionstrokeOpacity: 1,
  currentPositionStrokeWidth: 3,
  currentPositionRadius: 0,

  shouldDisableSnap: (e) => e.button === 2 || e.shiftKey,
  trends: [],

  appearance: {
    stroke: "#00d5ff",
    strokeOpacity: 1,
    strokeWidth: 1,
    strokeDasharray: "Solid",
  },
};

export default ArrowMarker;
