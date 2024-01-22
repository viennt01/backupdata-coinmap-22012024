import React, { Component } from "react";
import PropTypes from "prop-types";

import GenericChartComponent from "../../GenericChartComponent";
import { getMouseCanvas, getDrawCanvas } from "../../GenericComponent";

import { isDefined, noop, hexToRGBA } from "../../utils";

class DrawCallout extends Component {
  constructor(props) {
    super(props);

    this.calculateTextWidth = true;

    this.renderSVG = this.renderSVG.bind(this);
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
    this.isHover = this.isHover.bind(this);
  }
  isHover(moreProps) {
    const { onHover, r } = this.props;

    if (
      isDefined(onHover) &&
      isDefined(this.textWidth) &&
      !this.calculateTextWidth
    ) {
      const { rect } = helper(this.props, moreProps, this.textWidth);
      const {
        mouseXY: [x, y],
      } = moreProps;

      const { x1, y1 } = helper(this.props, moreProps, this.textWidth);
      const hover = x1 - r < x && x < x1 + r && y1 - r < y && y < y1 + r;

      if (
        x >= rect.x &&
        y >= rect.y &&
        x <= rect.x + rect.width &&
        y <= rect.y + rect.height
      ) {
        return true;
      }
      if (hover) {
        return true;
      }
    }
    return false;
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.calculateTextWidth ||=
      nextProps.text !== this.props.text ||
      nextProps.fontStyle !== this.props.fontStyle ||
      nextProps.fontWeight !== this.props.fontWeight ||
      nextProps.fontSize !== this.props.fontSize ||
      nextProps.fontFamily !== this.props.fontFamily;
  }
  drawOnCanvas(ctx, moreProps) {
    const {
      bgFill,
      bgFillOpacity,
      bgStrokeOpacity,
      bgTextOpacity,
      bgStrokeWidth,
      bgStroke,
      textFill,
      fontFamily,
      fontSize,
      fontStyle,
      fontWeight,
      text,
    } = this.props;

    if (this.calculateTextWidth) {
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
      const { width } = ctx.measureText(text);
      this.textWidth = width;
      this.calculateTextWidth = false;
    }

    const { x1, y1, x2, y2, rect } = helper(
      this.props,
      moreProps,
      this.textWidth
    );
    const reactWidth = Math.max(rect.width, 36);
    const reactHight = Math.max(rect.height, 36);

    const a = [rect.x, rect.y];
    const d = [reactWidth + rect.x, reactHight + rect.y];
    const b = [d[0], rect.y];
    const c = [rect.x, d[1]];

    const e = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const f = [(b[0] + d[0]) / 2, (b[1] + d[1]) / 2];
    const g = [(d[0] + c[0]) / 2, (d[1] + c[1]) / 2];
    const h = [(c[0] + a[0]) / 2, (c[1] + a[1]) / 2];
    const add = 8;

    ctx.strokeStyle = hexToRGBA(bgStroke, bgStrokeOpacity);
    ctx.fillStyle = hexToRGBA(bgFill, bgFillOpacity);
    ctx.lineWidth = bgStrokeWidth;

    ctx.beginPath();

    if (c[0] < x1 && x1 < d[0] && y1 > d[1]) {
      ctx.lineTo(a[0], a[1] + add);
      ctx.quadraticCurveTo(a[0], a[1], a[0] + add, a[1]);
      ctx.lineTo(b[0] - add, b[1]);
      ctx.quadraticCurveTo(b[0], b[1], b[0], b[1] + add);
      ctx.lineTo(d[0], d[1] - add);
      ctx.quadraticCurveTo(d[0], d[1], d[0] - add, d[1]);
      ctx.lineTo(g[0] + add, g[1]);
      ctx.lineTo(x1, y1);
      ctx.lineTo(g[0] - add, g[1]);
      ctx.lineTo(c[0] + add, c[1]);
      ctx.quadraticCurveTo(c[0], c[1], c[0], c[1] - add);
    } else if (a[0] < x1 && x1 < b[0] && y1 < a[1]) {
      ctx.lineTo(a[0], a[1] + add);
      ctx.quadraticCurveTo(a[0], a[1], a[0] + add, a[1]);
      ctx.lineTo(e[0] - add, e[1]);
      ctx.lineTo(x1, y1);
      ctx.lineTo(e[0] + add, e[1]);
      ctx.lineTo(b[0] - add, b[1]);
      ctx.quadraticCurveTo(b[0], b[1], b[0], b[1] + add);
      ctx.lineTo(d[0], d[1] - add);
      ctx.quadraticCurveTo(d[0], d[1], d[0] - add, d[1]);
      ctx.lineTo(c[0] + add, c[1]);
      ctx.quadraticCurveTo(c[0], c[1], c[0], c[1] - add);
      ctx.lineTo(c[0], c[1] - add);
    } else if (c[0] >= x1 && y1 > c[1]) {
      ctx.lineTo(a[0], a[1] + add);
      ctx.quadraticCurveTo(a[0], a[1], a[0] + add, a[1]);
      ctx.lineTo(b[0] - add, b[1]);
      ctx.quadraticCurveTo(b[0], b[1], b[0], b[1] + add);
      ctx.lineTo(d[0], d[1] - add);
      ctx.quadraticCurveTo(d[0], d[1], d[0] - add, d[1]);
      ctx.lineTo(c[0] + add, c[1]);
      ctx.lineTo(x1, y1);
      ctx.lineTo(c[0], c[1] - add);
    } else if (c[0] >= x1 && a[1] < y1 && y1 < c[1]) {
      ctx.lineTo(a[0], a[1] + add);
      ctx.quadraticCurveTo(a[0], a[1], a[0] + add, a[1]);
      ctx.lineTo(b[0] - add, b[1]);
      ctx.quadraticCurveTo(b[0], b[1], b[0], b[1] + add);
      ctx.lineTo(d[0], d[1] - add);
      ctx.quadraticCurveTo(d[0], d[1], d[0] - add, d[1]);
      ctx.lineTo(c[0] + add, c[1]);
      ctx.quadraticCurveTo(c[0], c[1], c[0], c[1] - add);
      ctx.lineTo(h[0], h[1] + add);
      ctx.lineTo(x1, y1);
      ctx.lineTo(h[0], h[1] - add);
    } else if (a[0] >= x1 && y1 < a[1]) {
      ctx.lineTo(a[0], a[1] + add);
      ctx.lineTo(x1, y1);
      ctx.lineTo(a[0] + add, a[1]);
      ctx.lineTo(b[0] - add, b[1]);
      ctx.quadraticCurveTo(b[0], b[1], b[0], b[1] + add);
      ctx.lineTo(d[0], d[1] - add);
      ctx.quadraticCurveTo(d[0], d[1], d[0] - add, d[1]);
      ctx.lineTo(c[0] + add, c[1]);
      ctx.quadraticCurveTo(c[0], c[1], c[0], c[1] - add);
    } else if (b[0] <= x1 && y1 < b[1]) {
      ctx.lineTo(a[0], a[1] + add);
      ctx.quadraticCurveTo(a[0], a[1], a[0] + add, a[1]);
      ctx.lineTo(b[0] - add, b[1]);
      ctx.lineTo(x1, y1);
      ctx.lineTo(b[0], a[1] + add);
      ctx.lineTo(d[0], d[1] - add);
      ctx.quadraticCurveTo(d[0], d[1], d[0] - add, d[1]);
      ctx.lineTo(c[0] + add, c[1]);
      ctx.quadraticCurveTo(c[0], c[1], c[0], c[1] - add);
    } else if (b[0] <= x1 && b[1] < y1 && y1 < d[1]) {
      ctx.lineTo(a[0], a[1] + add);
      ctx.quadraticCurveTo(a[0], a[1], a[0] + add, a[1]);
      ctx.lineTo(b[0] - add, b[1]);
      ctx.quadraticCurveTo(b[0], b[1], b[0], b[1] + add);
      ctx.lineTo(f[0], f[1] - add);
      ctx.lineTo(x1, y1);
      ctx.lineTo(f[0], f[1] + add);
      ctx.lineTo(d[0], d[1] - add);
      ctx.quadraticCurveTo(d[0], d[1], d[0] - add, d[1]);
      ctx.lineTo(c[0] + add, c[1]);
      ctx.quadraticCurveTo(c[0], c[1], c[0], c[1] - add);
      ctx.lineTo(c[0], c[1] - add);
    } else if (d[0] <= x1 && y1 > d[1]) {
      ctx.lineTo(a[0], a[1] + add);
      ctx.quadraticCurveTo(a[0], a[1], a[0] + add, a[1]);
      ctx.lineTo(b[0] - add, b[1]);
      ctx.quadraticCurveTo(b[0], b[1], b[0], b[1] + add);
      ctx.lineTo(d[0], d[1] - add);
      ctx.lineTo(x1, y1);
      ctx.lineTo(d[0] - add, d[1]);
      ctx.lineTo(c[0] + add, c[1]);
      ctx.quadraticCurveTo(c[0], c[1], c[0], c[1] - add);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (
      x1 >= rect.x &&
      y1 >= rect.y &&
      x1 <= rect.x + reactWidth &&
      y1 <= rect.y + reactHight
    ) {
      ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
      ctx.beginPath();
      ctx.roundRect(a[0], a[1], reactWidth, reactHight, [add]);
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = hexToRGBA(textFill, bgTextOpacity);
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.beginPath();
    ctx.fillText(text, (f[0] + h[0]) / 2, (f[1] + h[1]) / 2);
  }
  renderSVG() {
    throw new Error("svg not implemented");
  }
  render() {
    const { selected, interactiveCursorClass } = this.props;
    const { onHover, onUnHover } = this.props;
    const { onDragStart, onDrag, onDragComplete } = this.props;

    return (
      <GenericChartComponent
        isHover={this.isHover}
        svgDraw={this.renderSVG}
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
      />
    );
  }
}

function helper(props, moreProps, textWidth) {
  const { x1Value, x2Value, y1Value, y2Value, fontSize } = props;

  const {
    xScale,
    chartConfig: { yScale },
  } = moreProps;

  const x1 = xScale(x1Value);
  const y1 = yScale(y1Value);
  const x2 = xScale(x2Value);
  const y2 = yScale(y2Value);

  const rect = {
    x: x2 - textWidth / 2 - fontSize,
    y: y2 - fontSize,
    width: textWidth + fontSize * 2,
    height: fontSize * 2,
  };
  return {
    x1,
    y1,
    x2,
    y2,
    rect,
  };
}

DrawCallout.propTypes = {
  bgFill: PropTypes.string.isRequired,
  bgOpacity: PropTypes.number.isRequired,
  bgStrokeWidth: PropTypes.number.isRequired,
  bgStroke: PropTypes.string.isRequired,

  textFill: PropTypes.string.isRequired,
  fontFamily: PropTypes.string.isRequired,
  fontSize: PropTypes.number.isRequired,
  fontWeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  fontStyle: PropTypes.string.isRequired,

  text: PropTypes.string.isRequired,

  onDragStart: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDragComplete: PropTypes.func.isRequired,
  onHover: PropTypes.func,
  onUnHover: PropTypes.func,

  defaultClassName: PropTypes.string,
  interactiveCursorClass: PropTypes.string,

  tolerance: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
};

DrawCallout.defaultProps = {
  onDragStart: noop,
  onDrag: noop,
  onDragComplete: noop,

  type: "SD", // standard dev
  fontWeight: "normal", // standard dev

  tolerance: 4,
  selected: false,
};

export default DrawCallout;
