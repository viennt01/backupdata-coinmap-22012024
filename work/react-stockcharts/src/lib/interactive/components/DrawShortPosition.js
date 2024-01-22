import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas, getDrawCanvas } from "../../GenericComponent";

import {
  isDefined,
  noop,
  hexToRGBA,
  getStrokeDasharray,
  strokeDashTypes,
} from "../../utils";

class DrawShortPosition extends Component {
  hover1 = false;
  hover2 = false;

  isHover = () => {
    const { onHover, getHoverInteractive } = this.props;

    if (isDefined(onHover)) {
      const hovering = this.hover1 || this.hover2;

      if (getHoverInteractive) {
        getHoverInteractive(hovering);
      }
      return hovering;
    }
    return false;
  };
  drawOnCanvas = (ctx, moreProps) => {
    const {
      stopLoss,
      opacityStopLoss,
      takeProfit,
      opacityTakeProfit,
      fontFamily,
      fontStyle,
      fontWeight,
      textFill,
      textOpacity,
      textSize,
      entryLineColor,
      entryLineOpacity,
      entryLineSize,
      strokeWidth,
      strokeDasharray,
    } = this.props;
    const { selected, alwaysShowStats } = this.props;
    const {
      xPxEntryStart,
      yPxEntryStart,
      xPxStopLoss,
      yPxStopLoss,
      xPxTakeProfit,
      yPxTakeProfit,
      xPxEntryEnd,
      yPxEntryEnd,
    } = helper(this.props, moreProps);
    const { yEntryStart, yStopLoss, yTakeProfit } = this.props;
    const { mouseXY } = moreProps;
    const ratio = window.devicePixelRatio;

    const width = xPxEntryEnd - xPxEntryStart;
    const hightStop = yPxStopLoss - yPxEntryStart;
    const heightTarget = yPxEntryStart - yPxTakeProfit;

    const stop = yStopLoss - yEntryStart;
    const stopP = (stop / yEntryStart) * 100;
    const target = yEntryStart - yTakeProfit;
    const targetP = (target / yEntryStart) * 100;

    const rr = target / stop;
    ctx.lineWidth = strokeWidth;
    ctx.setLineDash(getStrokeDasharray(strokeDasharray).split(","));

    const path1 = new Path2D();
    ctx.fillStyle = hexToRGBA(takeProfit, opacityTakeProfit);
    path1.rect(xPxTakeProfit, yPxTakeProfit, width, heightTarget);
    ctx.fill(path1);

    const path2 = new Path2D();
    ctx.fillStyle = hexToRGBA(stopLoss, opacityStopLoss);
    path2.rect(xPxEntryStart, yPxEntryStart, width, hightStop);
    ctx.fill(path2);

    if (mouseXY !== undefined) {
      this.hover1 = ctx.isPointInPath(
        path1,
        mouseXY[0] * ratio,
        mouseXY[1] * ratio
      );
      this.hover2 = ctx.isPointInPath(
        path2,
        mouseXY[0] * ratio,
        mouseXY[1] * ratio
      );
    }

    ctx.strokeStyle = hexToRGBA(entryLineColor, entryLineOpacity);
    ctx.lineWidth = entryLineSize;
    ctx.beginPath();
    ctx.moveTo(xPxEntryStart, yPxEntryStart);
    ctx.lineTo(xPxEntryEnd, yPxEntryEnd);
    ctx.stroke();

    if (selected || alwaysShowStats) {
      if (yPxEntryStart) {
        ctx.font = `${fontStyle} ${fontWeight} ${textSize}px ${fontFamily}`;
        this.text = `Risk/Reward Ratio: ${rr.toFixed(2)}`;
        const { width } = ctx.measureText(this.text);
        ctx.fillStyle = takeProfit;
        ctx.beginPath();
        ctx.roundRect(
          (xPxEntryStart + xPxEntryEnd) / 2 - width / 2 - textSize,
          (yPxEntryStart + yPxEntryEnd) / 2 - textSize,
          width + textSize * 2,
          textSize * 2,
          4
        );
        ctx.fill();
        ctx.fillStyle = hexToRGBA(textFill, textOpacity);
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.beginPath();
        ctx.fillText(
          this.text,
          (xPxEntryStart + xPxEntryEnd) / 2,
          (yPxEntryStart + yPxEntryEnd) / 2
        );
      }
      if (xPxTakeProfit) {
        ctx.font = `${fontStyle} ${fontWeight} ${textSize}px ${fontFamily}`;
        this.text = `Target: ${target.toFixed(2)} (${targetP.toFixed(2)}%)`;
        const { width } = ctx.measureText(this.text);
        ctx.fillStyle = takeProfit;
        ctx.beginPath();
        ctx.roundRect(
          (xPxTakeProfit + xPxEntryEnd) / 2 - width / 2 - textSize,
          yPxTakeProfit,
          width + textSize * 2,
          textSize * 2,
          4
        );
        ctx.fill();
        ctx.fillStyle = hexToRGBA(textFill, textOpacity);
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.beginPath();
        ctx.fillText(
          this.text,
          (xPxTakeProfit + xPxEntryEnd) / 2,
          yPxTakeProfit + textSize
        );
      }
      if (yPxStopLoss) {
        ctx.font = `${fontStyle} ${fontWeight} ${textSize}px ${fontFamily}`;
        this.text = `Stop: ${stop.toFixed(2)} (${stopP.toFixed(2)}%)`;
        const { width } = ctx.measureText(this.text);
        ctx.fillStyle = stopLoss;
        ctx.beginPath();
        ctx.roundRect(
          (xPxStopLoss + xPxEntryEnd) / 2 - width / 2 - textSize,
          yPxStopLoss - textSize * 2,
          width + textSize * 2,
          textSize * 2,
          4
        );
        ctx.fill();
        ctx.fillStyle = hexToRGBA(textFill, textOpacity);
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.beginPath();
        ctx.fillText(
          this.text,
          (xPxStopLoss + xPxEntryEnd) / 2,
          yPxStopLoss - textSize
        );
      }
    }
  };

  render() {
    const { selected, interactiveCursorClass } = this.props;
    const { onDragStart, onDrag, onDragComplete, onHover, onUnHover, onDoubleClick } =
      this.props;

    return (
      <GenericChartComponent
        isHover={this.isHover}
        canvasToDraw={selected ? getMouseCanvas : getDrawCanvas}
        canvasDraw={this.drawOnCanvas}
        interactiveCursorClass={interactiveCursorClass}
        selected={selected}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragComplete={onDragComplete}
        onHover={onHover}
        onUnHover={onUnHover}
        drawOn={selected ? ["mousemove", "pan", "drag"] : ["mousemove", "pan"]}
        onDoubleClickWhenHover={onDoubleClick}
      />
    );
  }
}

function helper(props, moreProps) {
  const {
    xEntryStart,
    yEntryStart,
    xStopLoss,
    yStopLoss,
    xTakeProfit,
    yTakeProfit,
    xEntryEnd,
    yEntryEnd,
  } = props;

  const {
    xScale,
    chartConfig: { yScale },
  } = moreProps;

  const xPxEntryStart = xScale(xEntryStart);
  const yPxEntryStart = yScale(yEntryStart);
  const xPxStopLoss = xScale(xStopLoss);
  const yPxStopLoss = yScale(yStopLoss);
  const xPxTakeProfit = xScale(xTakeProfit);
  const yPxTakeProfit = yScale(yTakeProfit);
  const xPxEntryEnd = xScale(xEntryEnd);
  const yPxEntryEnd = yScale(yEntryEnd);

  return {
    xPxEntryStart,
    yPxEntryStart,
    xPxStopLoss,
    yPxStopLoss,
    xPxTakeProfit,
    yPxTakeProfit,
    xPxEntryEnd,
    yPxEntryEnd,
  };
}

DrawShortPosition.propTypes = {
  xEntryStart: PropTypes.any.isRequired,
  yEntryStart: PropTypes.any.isRequired,
  xStopLoss: PropTypes.any.isRequired,
  yStopLoss: PropTypes.any.isRequired,
  xTakeProfit: PropTypes.any.isRequired,
  yTakeProfit: PropTypes.any.isRequired,
  xEntryEnd: PropTypes.any.isRequired,
  yEntryEnd: PropTypes.any.isRequired,

  interactiveCursorClass: PropTypes.string,
  strokeWidth: PropTypes.number.isRequired,
  strokeDasharray: PropTypes.oneOf(strokeDashTypes),

  stopLoss: PropTypes.string.isRequired,
  opacityStopLoss: PropTypes.number.isRequired,
  takeProfit: PropTypes.string.isRequired,
  opacityTakeProfit: PropTypes.number.isRequired,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  fontStyle: PropTypes.string,
  fontWeight: PropTypes.string,
  textFill: PropTypes.string.isRequired,
  textOpacity: PropTypes.number.isRequired,
  textSize: PropTypes.number.isRequired,
  entryLineColor: PropTypes.string.isRequired,
  entryLineOpacity: PropTypes.number.isRequired,
  entryLineSize: PropTypes.number.isRequired,
  alwaysShowStats: PropTypes.bool.isRequired,

  getHoverInteractive: PropTypes.func,
  onEdge1Drag: PropTypes.func.isRequired,
  onEdge2Drag: PropTypes.func.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDragComplete: PropTypes.func.isRequired,
  onHover: PropTypes.func,
  onUnHover: PropTypes.func,
  onDoubleClick: PropTypes.func,

  selected: PropTypes.bool.isRequired,
};

DrawShortPosition.defaultProps = {
  onEdge1Drag: noop,
  onEdge2Drag: noop,
  onDragStart: noop,
  onDrag: noop,
  onDragComplete: noop,
  onDoubleClick: noop,

  fontFamily: "Roboto, Helvetica Neue, Helvetica, Arial, sans-serif",
  fontSize: 12,
  fontStyle: "normal",
  fontWeight: "normal",
  strokeOpacity: 1,
  strokeWidth: 1,
  strokeDasharray: "Solid",
  selected: false,
};

export default DrawShortPosition;
