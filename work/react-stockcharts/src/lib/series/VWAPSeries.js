import React, { Component } from "react";
import PropTypes from "prop-types";

import { strokeDashTypes, noop, indexGroupId } from "../utils";
import LineSeries from "./LineSeries";
import AreaOnlySeries from "./AreaOnlySeries";

class VWAPSeries extends Component {
  constructor(props) {
    super(props);

    this.baseBot1 = this.createBaseFunc("botBand1");
    this.baseBot2 = this.createBaseFunc("botBand2");
    this.baseBot3 = this.createBaseFunc("botBand3");
  }

  createBaseFunc =
    (accessorKey = "botBand1") =>
    (scale, d) => {
      const { bandsYAccessors } = this.props;
      const yAccessor = bandsYAccessors?.[accessorKey] || noop;
      return scale(yAccessor(d));
    };

  render() {
    const { groupId, yAccessor, bandsYAccessors, bandsOptions, offset, highlightOnHover, hoverTolerance } = this.props;
    const { onClick, onDoubleClick, onContextMenu } = this.props;

    const topBand1 = bandsYAccessors?.topBand1 || noop;
    const topBand2 = bandsYAccessors?.topBand2 || noop;
    const topBand3 = bandsYAccessors?.topBand3 || noop;

    return (
      <>
        {bandsOptions?.band3?.fill && (
          <AreaOnlySeries
            groupId={indexGroupId(groupId, 1)}
            yAccessor={topBand3}
            base={this.baseBot3}
            offset={offset}
            stroke="none"
            fill={bandsOptions.band3.fillColor}
            opacity={bandsOptions.band3.fillOpacity}
          />
        )}
        {bandsOptions?.band2?.fill && (
          <AreaOnlySeries
            groupId={indexGroupId(groupId, 2)}
            yAccessor={topBand2}
            base={this.baseBot2}
            offset={offset}
            stroke="none"
            fill={bandsOptions.band2.fillColor}
            opacity={bandsOptions.band2.fillOpacity}
          />
        )}
        {bandsOptions?.band1?.fill && (
          <AreaOnlySeries
            groupId={indexGroupId(groupId, 3)}
            yAccessor={topBand1}
            base={this.baseBot1}
            offset={offset}
            stroke="none"
            fill={bandsOptions.band1.fillColor}
            opacity={bandsOptions.band1.fillOpacity}
          />
        )}
        <VWAPLines
          groupId={groupId}
          index={4}
          offset={offset}
          yAccessor={yAccessor}
          bandsOptions={bandsOptions}
          bandsYAccessors={bandsYAccessors}
          highlightOnHover={highlightOnHover}
          hoverTolerance={hoverTolerance}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onContextMenu={onContextMenu}
        />
      </>
    );
  }
}

VWAPSeries.propTypes = {
	groupId: PropTypes.shape({
    drawingType: PropTypes.string,
    id: PropTypes.string,
    groupIndex: PropTypes.number,
    itemIndex: PropTypes.number,
  }),
  className: PropTypes.string,
  strokeWidth: PropTypes.number,
  strokeOpacity: PropTypes.number,
  stroke: PropTypes.string,
  hoverStrokeWidth: PropTypes.number,
  fill: PropTypes.string,
  defined: PropTypes.func,
  hoverTolerance: PropTypes.number,
  strokeDasharray: PropTypes.oneOf(strokeDashTypes),
  highlightOnHover: PropTypes.bool,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onHover: PropTypes.func,
  onUnHover: PropTypes.func,
  onContextMenu: PropTypes.func,
  yAccessor: PropTypes.func,
  connectNulls: PropTypes.bool,
  interpolation: PropTypes.func,
  canvasClip: PropTypes.func,
  style: PropTypes.object,
  shouldBreak: PropTypes.func,
  offset: PropTypes.number,
  bandsOptions: PropTypes.object,
  bandsYAccessors: PropTypes.object,
};

VWAPSeries.defaultProps = {
  className: "line ",
  strokeWidth: 1,
  strokeOpacity: 1,
  hoverStrokeWidth: 4,
  fill: "none",
  stroke: "#4682B4",
  strokeDasharray: "Solid",
  defined: (d) => !isNaN(d),
  hoverTolerance: 6,
  highlightOnHover: false,
  connectNulls: false,
  onClick: noop,
  onDoubleClick: noop,
  onContextMenu: noop,
  shouldBreak: noop,
  offset: 0,
  bandsOptions: {
    band1: {
      show: true,
      lineColor: "#FF00FF",
      lineOpacity: 1,
      strokeOpacity: 1,
      fill: false,
      fillColor: "none",
      fillOpacity: 0.3,
    },
    band2: {
      show: true,
      lineColor: "#FFFF00",
      lineOpacity: 1,
      strokeOpacity: 1,
      fill: false,
      fillColor: "none",
      fillOpacity: 0.3,
    },
    band3: {
      show: false,
      lineColor: "#00FFFF",
      lineOpacity: 1,
      strokeOpacity: 1,
      fill: false,
      fillColor: "none",
      fillOpacity: 0.3,
    },
  },
  bandsYAccessors: {
    topBand1: ({ vwapData }) => vwapData?.topBand1,
    topBand2: ({ vwapData }) => vwapData?.topBand2,
    topBand3: ({ vwapData }) => vwapData?.topBand3,
    botBand1: ({ vwapData }) => vwapData?.botBand1,
    botBand2: ({ vwapData }) => vwapData?.botBand2,
    botBand3: ({ vwapData }) => vwapData?.botBand3,
  },
};

export default VWAPSeries;

class VWAPLines extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovering: false,
    };
    this.handlerHover = this.handlerHover.bind(this);
    this.handlerUnHover = this.handlerUnHover.bind(this);
  }

  handlerHover() {
    if (this.state.isHovering) return;
    this.setState({ isHovering: true });
  }

  handlerUnHover() {
    if (!this.state.isHovering) return;
    this.setState({ isHovering: false });
  }

  render() {
    const { isHovering } = this.state;
    const {
      groupId,
      index,
      offset,
      yAccessor,
      bandsOptions,
      bandsYAccessors,
      highlightOnHover,
      hoverTolerance,
      onClick,
      onContextMenu,
      onDoubleClick,
    } = this.props;

    const topBand1 = bandsYAccessors?.topBand1 || noop;
    const topBand2 = bandsYAccessors?.topBand2 || noop;
    const topBand3 = bandsYAccessors?.topBand3 || noop;
    const botBand1 = bandsYAccessors?.botBand1 || noop;
    const botBand2 = bandsYAccessors?.botBand2 || noop;
    const botBand3 = bandsYAccessors?.botBand3 || noop;

    const renderLine = (key, yAccessor, index) => {
      if (!bandsOptions?.[key]?.show) return null;
      return (
        <LineSeries
          groupId={indexGroupId(groupId, index)}
          disableDrag
          showCursorWhenHovering
          offset={offset}
          yAccessor={yAccessor}
          stroke={bandsOptions[key].lineColor}
          strokeOpacity={bandsOptions[key].lineOpacity}
          strokeWidth={bandsOptions[key].lineSize + (isHovering ? 1 : 0)}
          strokeDasharray={bandsOptions[key].lineType}
          hoverStrokeWidth={bandsOptions[key].lineSize + 1}
          highlightOnHover={highlightOnHover}
          hoverTolerance={hoverTolerance}
          onHover={this.handlerHover}
          onUnHover={this.handlerUnHover}
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onContextMenu={onContextMenu}
        />
      );
    };

    return (
      <>
        {renderLine('vwap', yAccessor, index)}
        {renderLine('band1', botBand1, index + 1)}
        {renderLine('band1', topBand1, index + 2)}
        {renderLine('band2', botBand2, index + 3)}
        {renderLine('band2', topBand2, index + 4)}
        {renderLine('band3', botBand3, index + 5)}
        {renderLine('band3', topBand3, index + 6)}
      </>
    );
  }
}

VWAPLines.propTypes = {
	groupId: PropTypes.shape({
    drawingType: PropTypes.string,
    id: PropTypes.string,
    groupIndex: PropTypes.number,
    itemIndex: PropTypes.number,
  }),
  index: PropTypes.number,
  offset: PropTypes.number,
  yAccessor: PropTypes.func,
  bandsOptions: PropTypes.object,
  bandsYAccessors: PropTypes.object,
  highlightOnHover: PropTypes.bool,
  hoverTolerance: PropTypes.number,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onContextMenu: PropTypes.func,
};
