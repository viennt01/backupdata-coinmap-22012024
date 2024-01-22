import React, { Component } from "react";
import PropTypes from "prop-types";

import { noop, indexGroupId } from "../utils";
import LineSeries from "./LineSeries";
import AreaOnlySeries from "./AreaOnlySeries";

class BollingerSeries extends Component {
  constructor(props) {
    super(props);

    this.baseBot = (scale, d) => {
      const { bandsYAccessors } = this.props;
      const yAccessor = bandsYAccessors?.bottom || noop;
      return scale(yAccessor(d));
    };
  }

  render() {
    const { bandsYAccessors, bandsOptions, offset, groupId } = this.props;
    const topYAccessor = bandsYAccessors?.top || noop;

    return (
      <>
        {bandsOptions?.background?.fill && (
          <AreaOnlySeries
            groupId={indexGroupId(groupId, 1)}
            yAccessor={topYAccessor}
            base={this.baseBot}
            offset={offset}
            fill={bandsOptions.background.fillColor}
            opacity={bandsOptions.background.fillOpacity}
          />
        )}

        <BollingerLines {...this.props} />
      </>
    );
  }
}

BollingerSeries.propTypes = {
	groupId: PropTypes.shape({
    drawingType: PropTypes.string,
    id: PropTypes.string,
    groupIndex: PropTypes.number,
    itemIndex: PropTypes.number,
  }),
  offset: PropTypes.number,
  bandsOptions: PropTypes.object,
  bandsYAccessors: PropTypes.object,
  highlightOnHover: PropTypes.bool,
  hoverTolerance: PropTypes.number,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onContextMenu: PropTypes.func,
};

BollingerSeries.defaultProps = {
  offset: 0,
  bandsOptions: {
    middle: {
      lineType: "Solid",
      lineSize: 1,
      lineColor: "#ff6d00",
      lineOpacity: 1,
    },
    top: {
      lineType: "Solid",
      lineSize: 1,
      lineColor: "#2196F3",
      lineOpacity: 1,
    },
    bottom: {
      lineType: "Solid",
      lineSize: 1,
      lineColor: "#2196F3",
      lineOpacity: 1,
    },
    background: {
      fill: true,
      fillColor: "#2196F3",
      fillOpacity: 0.05,
    },
  },
  bandsYAccessors: {
    middle: (d) => d?.middle,
    top: (d) => d?.top,
    bottom: (d) => d?.bottom,
  },
  highlightOnHover: false,
  hoverTolerance: 6,
  onClick: () => null,
  onDoubleClick: () => null,
  onContextMenu: () => null,
};

export default BollingerSeries;

class BollingerLines extends Component {
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
      offset,
      bandsOptions,
      bandsYAccessors,
      highlightOnHover,
      hoverTolerance,
      onClick,
      onContextMenu,
      onDoubleClick,
    } = this.props;

    const renderLine = (key, index) => {
      if (!bandsOptions?.[key]?.show) return null;
      return (
        <LineSeries
          groupId={indexGroupId(groupId, index)}
          disableDrag
          showCursorWhenHovering
          offset={offset}
          yAccessor={bandsYAccessors?.[key] || noop}
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
        {renderLine("middle", 2)}
        {renderLine("top", 3)}
        {renderLine("bottom", 4)}
      </>
    );
  }
}

BollingerLines.propTypes = BollingerSeries.propTypes;
