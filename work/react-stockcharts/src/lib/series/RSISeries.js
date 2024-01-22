import React, { Component } from "react";
import PropTypes from "prop-types";
import LineSeries from "./LineSeries";
import AreaOnlySeries from "./AreaOnlySeries";
import StraightLine from "./StraightLine";
import StraightArea from "./StraightArea";

class RSISeries extends Component {
  constructor(props) {
    super(props);

    this.bollingerBaseBot = (scale, d) => {
      const { yAccessors } = this.props;
      const yAccessor = yAccessors.bollingerBottom;
      return scale(yAccessor(d));
    };
  }

  render() {
    const { className, yAccessors } = this.props;
    const { rsiBackground, bollingerBackground } = this.props;
    const { rsiMA, bollingerTop, bollingerBottom } = this.props;
    const { rsi, rsiTop, rsiMiddle, rsiBottom } = this.props;
    const { highlightOnHover, hoverTolerance } = this.props;
    const { onClick, onDoubleClick, onContextMenu } = this.props;

    const sharedProps = {
      selected: true,
      disableDrag: true,
      showCursorWhenHovering: true,
      highlightOnHover,
      hoverTolerance,
      onClick,
      onDoubleClick,
      onContextMenu,
    };

    return (
      <g className={className}>
        {/* rsi background */}
        {rsiBackground.fill && (
          <StraightArea
            yValue1={rsiBottom.value}
            yValue2={rsiTop.value}
            fill={rsiBackground.fillColor}
            opacity={rsiBackground.fillOpacity}
          />
        )}

        {/* bollinger background */}
        {bollingerBackground.fill && (
          <AreaOnlySeries
            yAccessor={yAccessors.bollingerTop}
            base={this.bollingerBaseBot}
            fill={bollingerBackground.fillColor}
            opacity={bollingerBackground.fillOpacity}
          />
        )}

        {/* rsi line */}
        {rsi.show && (
          <LineSeries
            yAccessor={yAccessors.rsi}
            stroke={rsi.lineColor}
            strokeDasharray={rsi.lineType}
            strokeWidth={rsi.lineSize}
            strokeOpacity={rsi.lineOpacity}
            hoverStrokeWidth={rsi.lineSize}
            {...sharedProps}
          />
        )}

        {/* ma lines */}
        {rsiMA.show && (
          <LineSeries
            yAccessor={yAccessors.rsiMA}
            stroke={rsiMA.lineColor}
            strokeDasharray={rsiMA.lineType}
            strokeWidth={rsiMA.lineSize}
            strokeOpacity={rsiMA.lineOpacity}
            hoverStrokeWidth={rsiMA.lineSize}
            {...sharedProps}
          />
        )}
        {bollingerTop.show && (
          <LineSeries
            yAccessor={yAccessors.bollingerTop}
            stroke={bollingerTop.lineColor}
            strokeDasharray={bollingerTop.lineType}
            strokeWidth={bollingerTop.lineSize}
            strokeOpacity={bollingerTop.lineOpacity}
            hoverStrokeWidth={bollingerTop.lineSize}
            {...sharedProps}
          />
        )}
        {bollingerBottom.show && (
          <LineSeries
            yAccessor={yAccessors.bollingerBottom}
            stroke={bollingerBottom.lineColor}
            strokeDasharray={bollingerBottom.lineType}
            strokeWidth={bollingerBottom.lineSize}
            strokeOpacity={bollingerBottom.lineOpacity}
            hoverStrokeWidth={bollingerBottom.lineSize}
            {...sharedProps}
          />
        )}

        {/* rsi straight lines */}
        {rsiTop.show && (
          <StraightLine
            yValue={rsiTop.value}
            stroke={rsiTop.lineColor}
            strokeDasharray={rsiTop.lineType}
            strokeWidth={rsiTop.lineSize}
            opacity={rsiTop.lineOpacity}
          />
        )}
        {rsiMiddle.show && (
          <StraightLine
            yValue={rsiMiddle.value}
            stroke={rsiMiddle.lineColor}
            strokeDasharray={rsiMiddle.lineType}
            strokeWidth={rsiMiddle.lineSize}
            opacity={rsiMiddle.lineOpacity}
          />
        )}
        {rsiBottom.show && (
          <StraightLine
            yValue={rsiBottom.value}
            stroke={rsiBottom.lineColor}
            strokeDasharray={rsiBottom.lineType}
            strokeWidth={rsiBottom.lineSize}
            opacity={rsiBottom.lineOpacity}
          />
        )}
      </g>
    );
  }
}

RSISeries.propTypes = {
  className: PropTypes.string,
  yAccessors: PropTypes.shape({
    rsi: PropTypes.func.isRequired,
    rsiMA: PropTypes.func.isRequired,
    bollingerTop: PropTypes.func.isRequired,
    bollingerBottom: PropTypes.func.isRequired,
  }),
  // rsi line
  rsi: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    lineType: PropTypes.string.isRequired,
    lineSize: PropTypes.number.isRequired,
    lineColor: PropTypes.string.isRequired,
    lineOpacity: PropTypes.number.isRequired,
  }),
  // ma line
  rsiMA: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    lineType: PropTypes.string.isRequired,
    lineSize: PropTypes.number.isRequired,
    lineColor: PropTypes.string.isRequired,
    lineOpacity: PropTypes.number.isRequired,
  }),
  // ma line
  bollingerTop: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    lineType: PropTypes.string.isRequired,
    lineSize: PropTypes.number.isRequired,
    lineColor: PropTypes.string.isRequired,
    lineOpacity: PropTypes.number.isRequired,
  }),
  // ma line
  bollingerBottom: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    lineType: PropTypes.string.isRequired,
    lineSize: PropTypes.number.isRequired,
    lineColor: PropTypes.string.isRequired,
    lineOpacity: PropTypes.number.isRequired,
  }),
  // rsi top straight line
  rsiTop: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    lineType: PropTypes.string.isRequired,
    lineSize: PropTypes.number.isRequired,
    lineColor: PropTypes.string.isRequired,
    lineOpacity: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }),
  // rsi middle straight line
  rsiMiddle: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    lineType: PropTypes.string.isRequired,
    lineSize: PropTypes.number.isRequired,
    lineColor: PropTypes.string.isRequired,
    lineOpacity: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }),
  // rsi bottom straight line
  rsiBottom: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    lineType: PropTypes.string.isRequired,
    lineSize: PropTypes.number.isRequired,
    lineColor: PropTypes.string.isRequired,
    lineOpacity: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }),
  // rsi background
  rsiBackground: PropTypes.shape({
    fill: PropTypes.bool.isRequired,
    fillColor: PropTypes.string.isRequired,
    fillOpacity: PropTypes.number.isRequired,
  }),
  // bollinger background
  bollingerBackground: PropTypes.shape({
    fill: PropTypes.bool.isRequired,
    fillColor: PropTypes.string.isRequired,
    fillOpacity: PropTypes.number.isRequired,
  }),
  highlightOnHover: PropTypes.bool,
  hoverTolerance: PropTypes.number,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onContextMenu: PropTypes.func,
};

RSISeries.defaultProps = {
  className: "react-stockcharts-rsi-series",
  yAccessors: {
    rsi: (d) => d.rsi,
    rsiMA: (d) => d.rsiMA,
    bollingerTop: (d) => d.bollingerTop,
    bollingerBottom: (d) => d.bollingerBottom,
  },
  rsi: {
    show: true,
    lineType: "Solid",
    lineSize: 1,
    lineColor: "#a271f7",
    lineOpacity: 1,
  },
  rsiMA: {
    show: true,
    lineType: "Solid",
    lineSize: 1,
    lineColor: "#ffeb3b ",
    lineOpacity: 1,
  },
  bollingerTop: {
    show: true,
    lineType: "Solid",
    lineSize: 1,
    lineColor: "#4caf50",
    lineOpacity: 1,
  },
  bollingerBottom: {
    show: true,
    lineType: "Solid",
    lineSize: 1,
    lineColor: "#4caf50",
    lineOpacity: 1,
  },
  rsiTop: {
    show: true,
    lineType: "Dash",
    lineSize: 1,
    lineColor: "#787b86",
    lineOpacity: 1,
    value: 70,
  },
  rsiMiddle: {
    show: true,
    lineType: "Dash",
    lineSize: 1,
    lineColor: "#787b86",
    lineOpacity: 0.5,
    value: 50,
  },
  rsiBottom: {
    show: true,
    lineType: "Dash",
    lineSize: 1,
    lineColor: "#787b86",
    lineOpacity: 1,
    value: 30,
  },
  rsiBackground: {
    fill: true,
    fillColor: "#7e57c2",
    fillOpacity: 0.1,
  },
  bollingerBackground: {
    fill: true,
    fillColor: "#4caf50",
    fillOpacity: 0.1,
  },
  highlightOnHover: false,
  hoverTolerance: 6,
  onClick: () => null,
  onDoubleClick: () => null,
  onContextMenu: () => null,
};

export default RSISeries;
