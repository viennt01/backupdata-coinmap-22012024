import React, { Component } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import displayValuesFor from "./displayValuesFor";
import GenericChartComponent from "../GenericChartComponent";

import { isDefined, functor } from "../utils";

const RED_COLOR = '#E96D38';
const GREEN_COLOR = '#009688';


class StatusLineTooltip extends Component {
  constructor(props) {
    super(props);
    this.renderSVG = this.renderSVG.bind(this);
    this.state = {
      count: 0,
    };
  }
  renderSVG(moreProps) {
    const { displayValuesFor } = this.props;
    const {
      accessor,
      volumeFormat,
      ohlcFormat,
      percentFormat,
      displayTexts,
      onChange,
      symbol,
      market,
    } = this.props;

    const {
      chartConfig: { width, height },
    } = moreProps;

    const currentItem = displayValuesFor(this.props, moreProps);

    let open, high, low, close, volume, percentChange;
    open = high = low = close = volume = percentChange =
      displayTexts.na;

    let textColor = 'white';

    if (isDefined(currentItem) && isDefined(accessor(currentItem))) {
      const item = accessor(currentItem);

      volume = isDefined(item.volume)
        ? volumeFormat(item.volume)
        : displayTexts.na;

      open = ohlcFormat(item.open);
      high = ohlcFormat(item.high);
      low = ohlcFormat(item.low);
      close = ohlcFormat(item.close);
      percentChange = `${ohlcFormat(item.close - item.open)} (${percentFormat((item.close - item.open) / item.open)})`;
      textColor = item.close - item.open > 0 ? GREEN_COLOR : RED_COLOR;

      if (onChange) {
        onChange({
          open,
          high,
          low,
          close,
          volume,
          percentChange,
          currentItem,
        });
      }
    }

    const { origin: originProp } = this.props;
    const origin = functor(originProp);
    const [x, y] = origin(width, height);

    const itemsToDisplay = {
      open,
      high,
      low,
      close,
      percentChange,
      volume,
      x,
      y,
      symbol,
      market,
      textColor,
      width: this.props.width,
    };

    return this.props.children(this.props, moreProps, itemsToDisplay);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // need to re-render when change symbol type to re-calculate cx
    if (nextProps.symbolType !== this.props.symbolType) {
      this.setState({ count: this.state.count + 1 });
    }
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

StatusLineTooltip.propTypes = {
  className: PropTypes.string,
  accessor: PropTypes.func,
  children: PropTypes.func,
  volumeFormat: PropTypes.func,
  percentFormat: PropTypes.func,
  symbol: PropTypes.string,
  market: PropTypes.bool,
  ohlcFormat: PropTypes.func,
  origin: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  onClick: PropTypes.func,
  displayValuesFor: PropTypes.func,
  displayTexts: PropTypes.object,
  onChange: PropTypes.func,
  openMarketStatus: PropTypes.bool,
  OHCLValues: PropTypes.bool,
  barChangeValues: PropTypes.bool,
  volume: PropTypes.bool,
  symbolType: PropTypes.string,
  width: PropTypes.number,
};

const displayTextsDefault = {
  s: "",
  m: "",
  o: "O",
  h: "H",
  l: "L",
  c: "C",
  v: "Vol",
  p: "",
  na: "n/a"
};

StatusLineTooltip.defaultProps = {
  accessor: (d) => {
    return {
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume,
    };
  },
  symbol: '',
  market: false,
  volumeFormat: format(".4s"),
  percentFormat: format(".2%"),
  ohlcFormat: format(".2f"),
  displayValuesFor: displayValuesFor,
  origin: [0, 0],
  children: defaultDisplay,
  displayTexts: displayTextsDefault,
  openMarketStatus: true,
  OHCLValues: true,
  barChangeValues: true,
  volume: true,
  symbolType: '',
};

function defaultDisplay(props, moreProps, itemsToDisplay) {
  /* eslint-disable */
  const {
    className,
    onClick,
    fontFamily,
    fontSize,
    displayTexts,
    openMarketStatus,
    OHCLValues,
    barChangeValues,
    volume: showVolume,
  } = props;
  /* eslint-enable */

  const {
    open,
    high,
    low,
    close,
    percentChange,
    volume,
    x,
    y,
    symbol,
    market,
    textColor,
    width
  } = itemsToDisplay;
  // if (!visible) return null

  return (
    <>
    <g>
      <g
        className={`react-stockcharts-tooltip-hover ${className}`}
        transform={`translate(${x}, ${y})`}
        onClick={onClick}
        fill="white"
      >
        <foreignObject style={{ overflow: 'visible' }} width="1" height="1">
          <div className="status-line-container">
            <span className="space">{displayTexts.s} {symbol}</span>

            {
              openMarketStatus &&
              <span className={market ? "online space" : "offline space"}></span>
            }

            {
              OHCLValues && <>
                <span  className="space">{displayTexts.o}<span style={{ color: textColor }}>{open}</span></span>
                <span  className="space">{displayTexts.h}<span style={{ color: textColor }}>{high}</span></span>
                <span  className="space">{displayTexts.l}<span style={{ color: textColor }}>{low}</span></span>
                <span  className="space">{displayTexts.c}<span style={{ color: textColor }}>{close}</span></span>
              </>
            }
            {
              barChangeValues && <>
                <span  className="space">{displayTexts.p}<span style={{ color: textColor }}>{percentChange}</span></span>
              </>
            }
            {
              showVolume &&
              <span  className="space">{displayTexts.v}<span style={{ color: textColor }}>{volume}</span></span>
            }
          </div>
        </foreignObject>
      </g>
    </g>
    <style jsx>{
      `
      .status-line-container {
        width: ${width}px;
        color: white;
        font-size: ${fontSize}px;
        font-family: ${fontFamily || 'Roboto'};
        display: flex;
        align-items: center;
        flex-wrap: wrap;
      }
      .online {
        background: ${GREEN_COLOR};
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        position: relative;
      }
      .online::before {
        content: ' ';
        position: absolute;
        z-index: -1;
        width: 18px;
        height: 18px;
        top: 50%;
        left: 50%;
        border-radius: 50%;
        background: inherit;
        background-clip: border-box;
        opacity: 0.15;
        transform: translate(-50%, -50%);
      }
      .offline {
        background: ${RED_COLOR};
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        position: relative;
      }
      .offline::before {
        content: ' ';
        position: absolute;
        z-index: -1;
        width: 18px;
        height: 18px;
        top: 50%;
        left: 50%;
        border-radius: 50%;
        background: inherit;
        background-clip: border-box;
        opacity: 0.15;
        transform: translate(-50%, -50%);
      }
      .space {
        margin: 0 4px;
        white-space: nowrap;
      }
      `
    }
    </style>
    </>
  );
}

export default StatusLineTooltip;
