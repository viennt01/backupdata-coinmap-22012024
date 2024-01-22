import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericChartComponent from "../../GenericChartComponent";
import { last } from "../../utils";
import { getFullDataIndex } from "../../utils/ChartDataUtil";
import { SvgChevronDown, SvgChevronUp } from "./SvgIcon";
import LayerTooltipItem from "./LayerTooltipItem";

class LayerTooltip extends Component {
  constructor(props) {
    super(props);
    this.renderSVG = this.renderSVG.bind(this);
  }

  renderSVG(moreProps) {
    return this.props.children(this.props, moreProps);
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

LayerTooltip.propTypes = {
  children: PropTypes.func,
  origin: PropTypes.array, // [x, y] top left position of indicator list
  layers: PropTypes.array, // list of indicator object data
  collapsedIndicators: PropTypes.bool, // using to expand or collapse indicator list
  onCollapseIndicators: PropTypes.func, // expand or collapse indicator list event
  onAddIndicator: PropTypes.func, // add new indicator event
};

LayerTooltip.defaultProps = {
  children: defaultDisplay,
  origin: [0, 0],
  layers: [],
  collapsedIndicators: false,
  onCollapseIndicators: () => null,
  onAddIndicator: () => null,
};

function defaultDisplay(props, moreProps) {
  /* eslint-disable */
  const {
    origin,
    layers,
    collapsedIndicators,
    onCollapseIndicators,
    onAddIndicator,
  } = props;
  /* eslint-enable */

  const [x, y] = origin;

  return (
    <>
      <g
        className="react-stockcharts-enable-interaction"
        transform={`translate(${x}, ${y})`}
      >
        <foreignObject style={{ overflow: "visible" }} width="1" height="1">
          <div className="layerTooltip">
            {!collapsedIndicators &&
              layers.map((layer) => (
                <LayerTooltipItem
                  key={layer.key}
                  show={layer.show}
                  disabled={layer.disabled}
                  disabledSetting={layer.disabledSetting}
                  infoTooltip={layer.infoTooltip}
                  onClickView={layer.onClickView}
                  onClickSetting={layer.onClickSetting}
                  onClickMoveDown={layer.onClickMoveDown}
                  onClickMoveUp={layer.onClickMoveUp}
                  onClickDelete={layer.onClickDelete}
                  content={layer.getContent(
                    getCurrentItem(moreProps, layer.offset)
                  )}
                />
              ))}
            {!collapsedIndicators && (
              <button className="buttonAddIndicator" onClick={onAddIndicator}>
                Add indicator
              </button>
            )}
            {layers.length > 1 && (
              <button
                className="buttonToggleLayerList"
                onClick={onCollapseIndicators}
              >
                {!collapsedIndicators ? (
                  <SvgChevronUp width={12} />
                ) : (
                  <SvgChevronDown width={12} />
                )}
                {collapsedIndicators && (
                  <span className="layerCount">{layers.length}</span>
                )}
              </button>
            )}
          </div>
        </foreignObject>
      </g>
      <style jsx>{`
        .layerTooltip {
          display: flex;
          width: 1px;
          flex-direction: column;
          gap: 4px;
          color: white;
        }

        .layerTooltip .buttonAddIndicator {
          display: block;
          width: fit-content;
          height: 22px;
          padding: 0 4px;
          border-radius: 2px;
          border: 1px solid rgba(0, 0, 0, 0.3);
          color: white;
          font-size: 12px;
          white-space: nowrap;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(3px);
          transition: 0.5s;
        }
        .layerTooltip .buttonAddIndicator:hover {
          background-image: linear-gradient(
            to right,
            #814d8a 0%,
            #12bfe1 51%,
            #814d8a 100%
          );
          background-size: 200% auto;
          border: 1px solid rgba(238, 238, 238, 0.3);
        }

        .layerTooltip .buttonToggleLayerList {
          display: inline-flex;
          width: fit-content;
          height: 19px;
          padding: 0 6px;
          align-items: center;
          gap: 4px;
          border: 1px solid #363a45;
          border-radius: 2px;
          color: white;
          background: rgba(12, 18, 42, 0.8);
        }
        .layerTooltip .buttonToggleLayerList:hover {
          cursor: pointer;
          border-color: rgba(238, 238, 238, 0.3);
          background: #252b41;
        }

        .layerTooltip .buttonToggleLayerList .layerCount {
          font-size: 12px;
        }
      `}</style>
    </>
  );
}

// get current item with offset
function getCurrentItem(moreProps, offset) {
  const { mouseXY, fullData, xScale } = moreProps;
  const dataIndex = getFullDataIndex(xScale, mouseXY?.[0]);
  if (!dataIndex || !fullData.length) return undefined;

  const shiftedDataIndex = dataIndex - (offset ?? 0);
  if (shiftedDataIndex > fullData.length - 1) return last(fullData);
  return fullData[shiftedDataIndex];
}

export default LayerTooltip;
