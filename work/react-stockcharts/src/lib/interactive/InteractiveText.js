import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, noop } from "../utils";

import {
  getValueFromOverride,
  terminate,
  saveNodeType,
  isHoverForInteractiveType,
} from "./utils";

import EachText from "./wrapper/EachText";
import MouseLocationIndicator from "./components/MouseLocationIndicator";

import GenericChartComponent from "../GenericChartComponent";

class InteractiveText extends Component {
  constructor(props) {
    super(props);

    this.handleStart = this.handleStart.bind(this);
    this.handleDrawLine = this.handleDrawLine.bind(this);
    this.handleDragLine = this.handleDragLine.bind(this);
    this.handleDragLineComplete = this.handleDragLineComplete.bind(this);

    this.terminate = terminate.bind(this);
    this.saveNodeType = saveNodeType.bind(this);

    this.getSelectionState = isHoverForInteractiveType("textList").bind(this);
    this.getHoverInteractive = this.getHoverInteractive.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);

    this.state = {};
    this.nodes = [];
  }
  handleDragLine(index, newXYValue) {
    const { textList } = this.props;
    const selectedItem = textList[index];
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
      const { textList } = this.props;
      const newTextLists = textList.map((each, idx) =>
        idx === override.index
          ? {
              ...each,
              start: [override.x1Value, override.y1Value],
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
          this.props.onComplete(newTextLists, moreProps);
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
          start: xyValue,
        },
      });
    }
  }
  handleStart(xyValue, moreProps, e) {
    const { textList, appearance, type } = this.props;

    const newTrends = [
      ...textList.map((d) => ({ ...d, selected: false })),
      {
        start: xyValue,
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
        this.props.textComplete(newTrends, moreProps, e);
      }
    );
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
    const { appearance } = this.props;
    const { enabled } = this.props;
    const { textList } = this.props;
    const { override } = this.state;

    return (
      <>
        {textList.map((each, idx) => {

          const props = {
            ...appearance,
            ...each,
          };
          return (
            <EachText
              key={each.id}
              ref={this.saveNodeType(idx)}
              index={idx}
              type={each.type}
              selected={each.selected}
              {...props}
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
              onDrag={this.handleDragLine}
              onDragComplete={this.handleDragLineComplete}
              edgeInteractiveCursor="react-stockcharts-move-cursor"
              getHoverInteractive={(hovering) =>
                this.getHoverInteractive(hovering, each)
              }
            />
          );
        })}
        {enabled && (
          <MouseLocationIndicator
            enabled={enabled}
            onMouseDown={this.handleStart}
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
        drawOn={["mousemove"]}
        onDoubleClick={this.handleDoubleClick}
      />
    );
  }
}

InteractiveText.propTypes = {
  snap: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
  snapTo: PropTypes.func,
  shouldDisableSnap: PropTypes.func.isRequired,

  onStart: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  textComplete: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  onDoubleClick: PropTypes.func,

  textList: PropTypes.array.isRequired,

  appearance: PropTypes.shape({
    fill: PropTypes.string.isRequired,
    stroke: PropTypes.string.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    strokeOpacity: PropTypes.number.isRequired,
    fillOpacity: PropTypes.number.isRequired,
    textOpacity: PropTypes.number.isRequired,
    textFill: PropTypes.string.isRequired,
    fontFamily: PropTypes.string.isRequired,
    fontWeight: PropTypes.string.isRequired,
    fontStyle: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
  isHover: PropTypes.func,
};

InteractiveText.defaultProps = {
  onStart: noop,
  onComplete: noop,
  textComplete: noop,
  onSelect: noop,
  isHover: noop,

  shouldDisableSnap: (e) => e.button === 2 || e.shiftKey,
  textList: [],

  appearance: {
    stroke: "#12bfe1",
    strokeWidth: 0,
    strokeOpacity: 0,
    fill: "#12bfe1",
    fillOpacity: 0,
    textFill: "#F10040",
    textOpacity: 1,
    fontFamily: "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
    text: "Text...",
  },
};

export default InteractiveText;
