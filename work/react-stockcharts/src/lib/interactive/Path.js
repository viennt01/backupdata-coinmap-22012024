import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop, strokeDashTypes } from "../utils";

import {
  terminate,
  saveNodeType,
  isHoverForInteractiveType,
} from "./utils";

import EachPath from "./wrapper/EachPath";
import StraightLine from "./components/StraightLine";
import MouseLocationIndicator from "./components/MouseLocationIndicator";

import GenericChartComponent from "../../lib/GenericChartComponent";
import ClickableCircle from './components/ClickableCircle';

class Path extends Component {
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

    this.state = {
      points: [],
    };
    this.nodes = [];
  }
  handleDragLine(index, points) {
    const { trends } = this.props;
		const selectedItem = trends[index];
		if (!selectedItem || selectedItem.locked) {
      return;
    }

    this.setState({
      override: {
        index,
        points,
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
              points: override.points,
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
          points: [xyValue],
        },
        () => {
          this.props.onStart(moreProps, e);
        }
      );
    }
  }
  handleAddPoint = (xyValue, moreProps, e) => {
    const { points, current } = this.state;
    if (!this.mouseMoved) {
      return;
    }
    this.mouseMoved = false;

    if (isNotDefined(current) || isNotDefined(current.start)) {
      return;
    }

    this.setState(
      {
        current: {
          start: xyValue,
          end: null,
        },
        points: [...points, xyValue],
      },
      () => {
        if (this.props.onAddPoint) {
          this.props.onAddPoint(moreProps, e);
        }
      }
    );
  };
  handleEnd(xyValue, moreProps, e) {
    const { current, points } = this.state;
    const { trends, appearance, type } = this.props;

    const newPoints = [...points];
    if (this.mouseMoved) {
      newPoints.push(xyValue);
    }

    if (isDefined(current) && isDefined(current.start)) {
      const newTrends = [
        ...trends.map((d) => ({ ...d, selected: false })),
        {
          points: newPoints,
          selected: true,
          appearance,
          type,
        },
      ];
      this.setState(
        {
          current: null,
          points: [],
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
    const { current, override, points } = this.state;

    const tempLine =
      isDefined(current) && isDefined(current.end) ? (
        <StraightLine
          type={type}
          noHover
          x1Value={current.start[0]}
          y1Value={current.start[1]}
          x2Value={current.end[0]}
          y2Value={current.end[1]}
          stroke={appearance.stroke}
          strokeWidth={appearance.strokeWidth}
          strokeOpacity={appearance.strokeOpacity}
        />
      ) : null;

    const allPaths = [...trends];

    if (points.length > 1) {
      const tmpPath = {
        id: "tmp",
        points: points,
        selected: true,
        appearance,
        type,
      };

      allPaths.push(tmpPath);
    }

    const circle = points.length !== 1 ? null : (
      <ClickableCircle
        show
        cx={points[0][0]}
        cy={points[0][1]}
        r={appearance.r}
        fill={appearance.edgeFill}
        stroke={appearance.edgeStroke}
        strokeWidth={appearance.edgeStrokeWidth}
        strokeOpacity={1}
      />
    );

    return (
      <>
        {allPaths.map((each, idx) => {
          const eachAppearance = isDefined(each.appearance)
            ? { ...appearance, ...each.appearance }
            : appearance;

          const points = idx === override?.index ? override.points : each.points;

          return (
            <EachPath
              key={each.id}
              ref={this.saveNodeType(idx)}
              index={idx}
              type={each.type}
              selected={each.selected}
              points={points}
              // x1Value={getValueFromOverride(
              //   override,
              //   idx,
              //   "x1Value",
              //   each.start[0]
              // )}
              // y1Value={getValueFromOverride(
              //   override,
              //   idx,
              //   "y1Value",
              //   each.start[1]
              // )}
              // x2Value={getValueFromOverride(
              //   override,
              //   idx,
              //   "x2Value",
              //   each.end[0]
              // )}
              // y2Value={getValueFromOverride(
              //   override,
              //   idx,
              //   "y2Value",
              //   each.end[1]
              // )}
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
        {circle}
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
            onClick={this.handleAddPoint}
            onDoubleClick={this.handleEnd}
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

Path.propTypes = {
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

Path.defaultProps = {
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
    stroke: "#000000",
    strokeOpacity: 1,
    strokeWidth: 1,
    strokeDasharray: "Solid",
  },
};

export default Path;
