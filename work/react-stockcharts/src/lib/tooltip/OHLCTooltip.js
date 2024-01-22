import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import displayValuesFor from "./displayValuesFor";
import GenericChartComponent from "../GenericChartComponent";

import { isDefined, functor } from "../utils";
import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";

class OHLCTooltip extends Component {
  constructor(props) {
    super(props);
    this.renderSVG = this.renderSVG.bind(this);
  }
  renderSVG(moreProps) {
    const { displayValuesFor } = this.props;
    const {
      xDisplayFormat,
      accessor,
      volumeFormat,
      ohlcFormat,
      percentFormat,
      displayTexts,
      onChange,
      visible
    } = this.props;

    const {
      chartConfig: { width, height },
    } = moreProps;
    const { displayXAccessor } = moreProps;

    const currentItem = displayValuesFor(this.props, moreProps);

    let displayDate, open, high, low, close, volume, percentChange;
    displayDate = open = high = low = close = volume = percentChange =
      displayTexts.na;

    if (isDefined(currentItem) && isDefined(accessor(currentItem))) {
      const item = accessor(currentItem);

      volume = isDefined(item.volume)
        ? volumeFormat(item.volume)
        : displayTexts.na;

      displayDate = xDisplayFormat(displayXAccessor(item));
      open = ohlcFormat(item.open);
      high = ohlcFormat(item.high);
      low = ohlcFormat(item.low);
      close = ohlcFormat(item.close);
      percentChange = percentFormat((item.close - item.open) / item.open);
      if (onChange) {
        onChange({ displayDate, open, high, low, close, volume, percentChange })
      }
    }

    const { origin: originProp } = this.props;
    const origin = functor(originProp);
    const [x, y] = origin(width, height);

    const itemsToDisplay = {
      displayDate,
      open,
      high,
      low,
      close,
      percentChange,
      volume,
      x,
      y,
    };

    return this.props.children(this.props, moreProps, itemsToDisplay);
  }
  render() {
    return (
      <GenericChartComponent
        clip={false}
        svgDraw={this.renderSVG}
        drawOn={["mousemove"]}
      />
    );
  }
}

OHLCTooltip.propTypes = {
  className: PropTypes.string,
  accessor: PropTypes.func,
  xDisplayFormat: PropTypes.func,
  children: PropTypes.func,
  volumeFormat: PropTypes.func,
  percentFormat: PropTypes.func,
  ohlcFormat: PropTypes.func,
  origin: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  onClick: PropTypes.func,
  displayValuesFor: PropTypes.func,
  textFill: PropTypes.string,
  labelFill: PropTypes.string,
  displayTexts: PropTypes.object,
  onChange: PropTypes.func,
  visible: PropTypes.bool,
};

const displayTextsDefault = {
  d: "Date: ",
  o: " O: ",
  h: " H: ",
  l: " L: ",
  c: " C: ",
  v: " Vol: ",
  p: " P: ",
  na: "n/a",
  u: "Last update: "
};

OHLCTooltip.defaultProps = {
  accessor: (d) => {
    return {
      date: d.date,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume,
    };
  },
  xDisplayFormat: timeFormat("%Y-%m-%d"),
  volumeFormat: format(".4s"),
  percentFormat: format(".2%"),
  ohlcFormat: format(".2f"),
  displayValuesFor: displayValuesFor,
  origin: [0, 0],
  children: defaultDisplay,
  displayTexts: displayTextsDefault,
};

function defaultDisplay(props, moreProps, itemsToDisplay) {
  /* eslint-disable */
  const {
    className,
    textFill,
    labelFill,
    onClick,
    fontFamily,
    fontSize,
    displayTexts,
    visible,
    serverTime
  } = props;
  /* eslint-enable */

  const {
    displayDate,
    open,
    high,
    low,
    close,
    percentChange,
    volume,
    x,
    y,
  } = itemsToDisplay;
  // if (!visible) return null
  return (
    <g>
      <rect width="370px" height="35px" fill="#00000070"
      transform={`translate(${x}, ${y})`}
      ></rect>
      <g
        className={`react-stockcharts-tooltip-hover ${className}`}
        transform={`translate(${x + 60}, ${y + 8})`}
        onClick={onClick}
        fill="white"
      >
        <ToolTipText
          x={0}
          y={0}
          fontFamily={fontFamily}
          fontSize={fontSize || 14}
        >
          <ToolTipTSpanLabel fill="white" key="label_O" dy="6px">
            {displayTexts.o}
          </ToolTipTSpanLabel>
          <tspan key="value_O" fill="white">{open}</tspan>
          <tspan key="value_O_divider" fill="#567E9C" dx="10">|</tspan>

          <ToolTipTSpanLabel fill="white" key="label_H" dx="10">
            {displayTexts.h}
          </ToolTipTSpanLabel>
          <tspan key="value_H" fill="white">{high}</tspan>
          <tspan key="value_H_divider" fill="#567E9C" dx="10">|</tspan>

          <ToolTipTSpanLabel fill="white" key="label_L" dx="10">
            {displayTexts.l}
          </ToolTipTSpanLabel>
          <tspan key="value_L" fill="white">{low}</tspan>
          <tspan key="value_L_divider" fill="#567E9C" dx="10">|</tspan>

          <ToolTipTSpanLabel fill="white" key="label_C" dx="10">
            {displayTexts.c}
          </ToolTipTSpanLabel>
          <tspan key="value_C" fill="white">{close}</tspan>
          <tspan key="value_C_divider" fill="#567E9C" dx="10">|</tspan>

          <ToolTipTSpanLabel fill="white" key="label" x="0" y="20">
            {displayTexts.d}
          </ToolTipTSpanLabel>
          <tspan key="value" fill="white">{displayDate}</tspan>
          <tspan key="value_divider" fill="#567E9C" dx="10">|</tspan>

          <ToolTipTSpanLabel fill="white" key="label_Vol" dx="10">
            {displayTexts.v}
          </ToolTipTSpanLabel>
          <tspan key="value_Vol" fill="white">{volume}</tspan>
          <tspan key="value_Vol_divider" fill="#567E9C" dx="10">|</tspan>


          <ToolTipTSpanLabel fill="white" key="label_P" dx="10">
            {displayTexts.p}
          </ToolTipTSpanLabel>
          <tspan key="value_P" fill="white">{percentChange}</tspan>
          <tspan key="value_P_divider" fill="#567E9C" dx="10">|</tspan>

          <ToolTipTSpanLabel fill="white" key="label_U" dx="10">
            {serverTime ? displayTexts.u : ""}
          </ToolTipTSpanLabel>
          <tspan key="value_U" fill="white">{serverTime || ""}</tspan>
          <tspan key="value_U_divider" fill="#567E9C" dx="12px">{serverTime ? "|" : ""}</tspan>
        </ToolTipText>
      </g>
    </g>
  );
}

export default OHLCTooltip;
