import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  ascending,
  descending,
  sum,
  max,
  merge,
  zip,
  // histogram as d3Histogram,
} from "d3-array";
import d3Histogram from "../utils/histogram";
import { nest } from "d3-collection";
import { scaleLinear } from "d3-scale";

import GenericChartComponent from "../GenericChartComponent";
import { getBackgroundCanvas } from "../GenericComponent";

import {
  head,
  last,
  hexToRGBA,
  accumulatingWindow,
  identity,
  functor,
  getStrokeDasharray,
} from "../utils";

const POCCaches = {};

const getCacheKey = (session) => {
  const lastCancle = session[session.length - 1];
  const key = `${session.length}_${session[0].opentime}_${lastCancle.closetime}`;
  return key;
};

class VolumeProfileSessionSeries extends Component {
  constructor(props) {
    super(props);
    this.renderSVG = this.renderSVG.bind(this);
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
  }
  drawOnCanvas(ctx, moreProps) {
    const { xAccessor, width, plotData } = moreProps;
    if (!plotData || plotData.length < 6) {
      return;
    }
    const { rects, sessionBg, pocs, vahs, vals, dx } = helper(
      this.props,
      moreProps,
      xAccessor,
      width
    );

    drawOnCanvas(ctx, this.props, rects, sessionBg, { pocs, vahs, vals, dx });
  }
  render() {
    const { groupId } = this.props;
    return (
      <GenericChartComponent
        groupId={groupId}
        svgDraw={this.renderSVG}
        canvasDraw={this.drawOnCanvas}
        canvasToDraw={getBackgroundCanvas}
        drawOn={["pan"]}
      />
    );
  }
  renderSVG(moreProps) {
    const { className } = this.props;
    const {
      showSessionBackground,
      sessionBackGround,
      sessionBackGroundOpacity,
    } = this.props;

    const { xAccessor, width } = moreProps;
    const { rects, sessionBg } = helper(
      this.props,
      moreProps,
      xAccessor,
      width
    );

    const sessionBgSvg = showSessionBackground
      ? sessionBg.map((d, idx) => (
          <rect
            key={idx}
            {...d}
            opacity={sessionBackGroundOpacity}
            fill={sessionBackGround}
          />
        ))
      : null;

    return (
      <g className={className}>
        {sessionBgSvg}
        {rects.map((d, i) => (
          <g key={i}>
            <rect
              x={d.x}
              y={d.y}
              width={d.w1}
              height={d.height}
              fill={d.fill1}
              stroke={d.stroke1}
              fillOpacity={d.opacity1}
            />
            <rect
              x={d.x + d.w1}
              y={d.y}
              width={d.w2}
              height={d.height}
              fill={d.fill2}
              stroke={d.stroke2}
              fillOpacity={d.opacity2}
            />
          </g>
        ))}
      </g>
    );
  }
}

VolumeProfileSessionSeries.propTypes = {
	groupId: PropTypes.shape({
    drawingType: PropTypes.string,
    id: PropTypes.string,
    groupIndex: PropTypes.number,
    itemIndex: PropTypes.number,
  }),
  className: PropTypes.string,
  opacity: PropTypes.func,
  showSessionBackground: PropTypes.bool,
  sessionBackGround: PropTypes.string,
  sessionBackGroundOpacity: PropTypes.number,
  customToBins: PropTypes.func,
  showVolumeArea: PropTypes.bool,
  VAWidthPercent: PropTypes.number,
  identity: PropTypes.func,
  settings: PropTypes.object,
};

export const LINE_TYPE = {
  LINE: "Solid",
  DASH_LINE: "Dash",
  DOT_LINE: "Dot",
};

const VOLUME_SESSION_SETTINGS = {
  bins: 20,
  orient: "right",
  period: "Day",
  dataType: "buysell",
  widthOfHistogram: 20,
  valueAreaPercent: 68.2,

  developingVAH: {
    display: true,
    color: "#FFFF00",
    type: LINE_TYPE.LINE,
    opacity: 1,
    width: 1,
  },

  developingVAL: {
    display: true,
    color: "#FFFF00",
    type: LINE_TYPE.LINE,
    opacity: 1,
    width: 1,
  },
  developingPOC: {
    display: true,
    color: "#FFFF00",
    type: LINE_TYPE.LINE,
    opacity: 1,
    width: 1,
  },

  poc: {
    display: true,
    color: "#FFFF00",
    type: LINE_TYPE.LINE,
    opacity: 1,
    width: 1,
  },

  devVah: "#FFFF00",
  devVal: "#FF00FF",
  devPoc: "#64FFFF",
};

VolumeProfileSessionSeries.defaultProps = {
  className: "line ",
  opacity: ({ type }) => (type === "up" ? 0.7 : 0.7),
  fill: ({ type }) => (type === "up" ? "#6BA583" : "#FF0000"),
  stroke: "#FFFFFF",
  showSessionBackground: false,
  sessionBackGround: "#4682B4",
  sessionBackGroundOpacity: 0.3,

  source: (d) => d.close,
  volume: (d) => d.volume,
  absoluteChange: (d) => d.absoluteChange,
  bySession: false,
  /* eslint-disable no-unused-vars */
  sessionStart: ({ d, i, plotData }) =>
    i > 0 && plotData[i - 1].date.getMonth() !== d.date.getMonth(),
  /* eslint-enable no-unused-vars */
  // // fill: ({ type }) => { var c = type === "up" ? "#6BA583" : "#FF0000"; console.log(type, c); return c },
  // stroke: ({ type }) =>  type === "up" ? "#6BA583" : "#FF0000",
  // stroke: "none",
  partialStartOK: true,
  partialEndOK: true,
  customToBins: null,
  showVolumeArea: true,
  VAWidthPercent: 40,
  identity: identity,
  settings: VOLUME_SESSION_SETTINGS,
};

const findPOC = (
  items,
  candle,
  {
    globalMinY: y0,
    globalMaxY: y1,
    chartConfig: { yScale },
    source,
    volume,
    xAccessor,
    showVolumeArea,
    settings,
  },
  { minPrice, maxPrice }
) => {
  let binCount = 0;
  // * Calc binCount by tick price
  if (items[0] && items[0].tick) {
    binCount = (maxPrice - minPrice) / items[0].tick + 1;
  } else {
    // * Calc binCount by chart height + bins props
    binCount = Math.floor(
      ((yScale(maxPrice) - yScale(minPrice)) / (yScale(y1) - yScale(y0))) *
        settings.bins
    );
  }

  const histogram2 = d3Histogram()
    .domain([minPrice, maxPrice])
    .value(source)
    .thresholds(binCount);
  const values = histogram2(items);

  if (values.length === 0) {
    return null;
  }

  let maxVolume = 0;
  let POCindex = 0;
  let totalSumVolume = 0;
  for (let i = 0; i < values.length; i++) {
    const bins = values[i];
    const totalVolume = sum(bins, volume);
    bins.totalVolume = totalVolume;
    totalSumVolume += totalVolume;
    if (maxVolume <= totalVolume) {
      maxVolume = totalVolume;
      POCindex = i;
    }
  }

  const POC = values[POCindex];
  POC.candleX = xAccessor(candle);

  const result = { poc: POC, vah: null, val: null };

  if (showVolumeArea) {
    let currentSum = 0;
    let VAHIndex = POCindex;
    let VALIndex = POCindex;
    const valueAreaVolume =
      (totalSumVolume * Number(settings.valueAreaPercent)) / 100;
    let nextBinVolume;
    let nVAHIndex = VAHIndex + 1;
    let nVALIndex = VALIndex - 1;
    let currentLoop = 0;

    while (currentSum < valueAreaVolume && currentLoop < values.length - 1) {
      currentLoop++;
      const hBinVolume = values[nVAHIndex];
      const lBinVolume = values[nVALIndex];

      if (!hBinVolume || !lBinVolume) {
        if (hBinVolume) {
          nextBinVolume = hBinVolume;
          VAHIndex = nVAHIndex;
          nVAHIndex = nVAHIndex + 1;
        } else {
          nextBinVolume = lBinVolume;
          VALIndex = nVALIndex;
          nVALIndex = nVALIndex - 1;
        }
      } else if (hBinVolume.totalVolume === 0) {
        nextBinVolume = hBinVolume;
        VAHIndex = nVAHIndex;
        nVAHIndex = nVAHIndex + 1;
      } else if (lBinVolume.totalVolume === 0) {
        nextBinVolume = lBinVolume;
        VALIndex = nVALIndex;
        nVALIndex = nVALIndex - 1;
      } else {
        if (hBinVolume.totalVolume >= lBinVolume.totalVolume) {
          nextBinVolume = hBinVolume;
          VAHIndex = nVAHIndex;
          nVAHIndex = nVAHIndex + 1;
        } else {
          nextBinVolume = lBinVolume;
          VALIndex = nVALIndex;
          nVALIndex = nVALIndex - 1;
        }
      }

      if (nextBinVolume) {
        currentSum = currentSum + nextBinVolume.totalVolume;
      }
    }

    const VAH = values[VAHIndex];
    if (VAH) {
      result.vah = VAH;
    }
    const VAL = values[VALIndex];
    if (VAL) {
      result.val = VAL;
    }
  }

  return result;
};

const findDevelopingPOCs = (session, moreProps) => {
  const { fullData } = moreProps;
  const cacheKey = getCacheKey(session);
  if (POCCaches[cacheKey]) {
    const currentEndLength =
      session[session.length - 1] && session[session.length - 1].orderFlow
        ? session[session.length - 1].orderFlow.length
        : 0;
    const currentStartLength =
      session[0] && session[0].orderFlow ? session[0].orderFlow.length : 0;
    if (
      POCCaches[cacheKey].startLength === currentStartLength &&
      POCCaches[cacheKey].endLength === currentEndLength &&
      POCCaches[cacheKey].fullLength === fullData.length
    ) {
      return POCCaches[cacheKey].pocs;
    } else {
      delete POCCaches[cacheKey];
    }
  }

  let items = [];
  let minPrice = session[0].low;
  let maxPrice = session[0].high;
  const pocs = [];
  session.forEach((d) => {
    if (minPrice > d.low) {
      minPrice = d.low;
    }
    if (maxPrice < d.high) {
      maxPrice = d.high;
    }
    if (Array.isArray(d.orderFlow)) {
      items = [...items, ...d.orderFlow];
    } else {
      return [];
    }
    if (items.length > 0) {
      const poc = findPOC(
        items,
        d,
        {
          ...moreProps,
        },
        { minPrice, maxPrice }
      );
      pocs.push(poc);
    }
  });

  POCCaches[cacheKey] = {
    pocs,
    fullLength: fullData.length,
    startLength:
      session[0] && session[0].orderFlow ? session[0].orderFlow.length : 0,
    endLength:
      session[session.length - 1] && session[session.length - 1].orderFlow
        ? session[session.length - 1].orderFlow.length
        : 0,
  };

  return pocs;
};

const pocToRects = (items, moreProps) => {
  const {
    xScale,
    chartConfig: { yScale },
  } = moreProps;
  const pocs = [];
  const vahs = [];
  const vals = [];
  for (let index = 0; index < items.length; index++) {
    const { poc: POC, vah: VAH, val: VAL } = items[index];
    const { candleX } = POC;
    const x = Math.round(xScale(candleX - 0.5));
    // console.log('fullData', fullData.find(x => x === candle));
    // const endX = Math.round(xScale(xAccessor(candle) + 1));
    // const width = endX - x;
    const y = yScale(POC.x0);
    // const height = yScale(POC.x1) - yScale(POC.x0);
    pocs.push({
      x,
      y,
    });

    if (VAH) {
      const y = yScale(VAH.x1);
      vahs.push({
        x,
        y,
      });
    }
    if (VAL) {
      const y = yScale(VAL.x0);
      vals.push({
        x,
        y,
      });
    }
  }

  return { pocs, vahs, vals };
};

function helper(props, moreProps, xAccessor, width) {
  const {
    xScale: realXScale,
    chartConfig: { yScale },
    plotData,
    fullData,
  } = moreProps;

  const { sessionStart, bySession, partialStartOK, partialEndOK } = props;
  const {
    source,
    volume,
    absoluteChange,
    fill,
    opacity,
    stroke,
    customToBins,
    showVolumeArea,
    VAWidthPercent,
    // sessionStart,
    identity,
    settings,
  } = props;

  const sessionData = [...plotData];

  const realStart = sessionData[0].idx.index - fullData[0].idx.index;
  const realEnd =
    sessionData[sessionData.length - 1].idx.index - fullData[0].idx.index;

  // Get missing data for the last session
  if (realEnd !== null) {
    for (let i = realEnd + 1; i < fullData.length; i++) {
      const item = fullData[i];
      if (!item) {
        break;
      }
      const isStartSession = sessionStart({
        d: item,
        i,
        sessionData: fullData,
      });

      // Loop until new seesion start
      if (isStartSession) {
        break;
      }
      sessionData.push(item);
    }
  }

  // Get missing data for the first session
  if (realStart !== null) {
    // Check current realStart is start session
    fullData[realStart];
    const item = fullData[realStart];
    const isStartRealStart =
      !item || sessionStart({ d: item, i: realStart, sessionData: fullData });

    if (!isStartRealStart) {
      for (let i = realStart - 1; i > -1; i--) {
        const item = fullData[i];
        if (!item) {
          break;
        }
        const isStartSession = sessionStart({
          d: item,
          i,
          sessionData: fullData,
        });

        sessionData.unshift(item);
        // Loop until current session start
        if (isStartSession) {
          break;
        }
      }
    }
  }

  const sessionBuilder = accumulatingWindow()
    .discardTillStart(!partialStartOK)
    .discardTillEnd(!partialEndOK)
    .accumulateTill((d, i) => {
      return sessionStart({ d, i, sessionData, ...moreProps });
    })
    .accumulator(identity);

  let sessions = bySession ? sessionBuilder(sessionData) : [sessionData];
  // Filter first candle of session have orderflow
  sessions = sessions.filter(
    (session) => (session[0]?.orderFlow?.length || 0) > 0
  );

  const rollup = nest()
    .key((d) => d.direction)
    .sortKeys(settings.orient === "right" ? descending : ascending)
    .rollup((leaves) => sum(leaves, (d) => d.volume));

  const defaultToBins = (arr) =>
    arr.map((d) =>
      absoluteChange(d) > 0
        ? { direction: "up", volume: volume(d) }
        : { direction: "down", volume: volume(d) }
    );

  const [y0, y1] = yScale.domain();

  const dx =
    sessionData.length > 1
      ? realXScale(xAccessor(sessionData[1])) -
        realXScale(xAccessor(head(sessionData)))
      : 0;
  const allRects = sessions.map((session) => {
    const begin = bySession ? realXScale(xAccessor(head(session))) : 0;
    const finish = bySession ? realXScale(xAccessor(last(session))) : width;
    const sessionWidth = finish - begin + dx;

    let items = [];
    let minPrice = session[0].low;
    let maxPrice = session[0].high;
    session.forEach((d) => {
      if (minPrice > d.low) {
        minPrice = d.low;
      }
      if (maxPrice < d.high) {
        maxPrice = d.high;
      }
      if (Array.isArray(d.orderFlow)) {
        items = [...items, ...d.orderFlow];
      }
    });

    let binCount = 0;
    // * Calc binCount by tick price
    if (items[0] && items[0].tick) {
      binCount = (maxPrice - minPrice) / items[0].tick + 1;
    } else {
      // * Calc binCount by chart height + bins props
      binCount = Math.floor(
        ((yScale(maxPrice) - yScale(minPrice)) / (yScale(y1) - yScale(y0))) *
          settings.bins
      );
    }

    const histogram2 = d3Histogram()
      .domain([minPrice - items[0].tick, maxPrice])
      .value(source)
      .thresholds(binCount);
    const values = histogram2(items);

    const toBins = customToBins ? customToBins : defaultToBins;
    const volumeInBins = values
      .map((arr) => toBins(arr))
      .map((arr) => rollup.entries(arr));

    const volumeValues = volumeInBins.map((each) =>
      sum(each.map((d) => d.value))
    );

    // console.log("volumeValues", volumeValues)
    const base = (xScale) => head(xScale.range());

    const [start, end] =
      settings.orient === "right"
        ? [begin, begin + (sessionWidth * settings.widthOfHistogram) / 100]
        : [finish, finish - (sessionWidth * settings.widthOfHistogram) / 100];

    const xScale = scaleLinear()
      .domain([0, max(volumeValues)])
      .range([start, end]);

    // console.log(xScale.domain())

    let POCindex = 0;
    let maxVolume = 0;
    const totalVolumes = volumeInBins.map((volumes, index) => {
      const totalVolume = sum(volumes, (d) => d.value);
      if (maxVolume <= totalVolume) {
        maxVolume = totalVolume;
        POCindex = index;
      }
      const totalVolumeX = xScale(totalVolume);
      const width = base(xScale) - totalVolumeX;
      const x = width < 0 ? totalVolumeX + width : totalVolumeX + dx;

      const ws = volumes.map((d) => {
        return {
          type: d.key,
          width: (d.value * Math.abs(width)) / totalVolume,
        };
      });

      return { x, ws, totalVolumeX, totalVolume };
    });

    if (showVolumeArea) {
      // console.log("totalVolumes", totalVolumes);
      const totalVolume = sum(totalVolumes, (d) => d.totalVolume);
      let currentSum = 0;
      let VAHIndex = POCindex;
      let VALIndex = POCindex;
      const valueAreaVolume =
        (totalVolume * Number(settings.valueAreaPercent)) / 100;
      let nextBinVolume;
      let nVAHIndex = VAHIndex - 1;
      let nVALIndex = VALIndex + 1;
      let currentLoop = 0;
      while (
        currentSum < valueAreaVolume &&
        currentLoop < totalVolumes.length
      ) {
        currentLoop++;
        const hBinVolume = totalVolumes[nVAHIndex];
        const lBinVolume = totalVolumes[nVALIndex];

        if (!hBinVolume || !lBinVolume) {
          if (hBinVolume) {
            nextBinVolume = hBinVolume;
            VAHIndex = nVAHIndex;
            nVAHIndex = nVAHIndex - 1;
          } else {
            nextBinVolume = lBinVolume;
            VALIndex = nVALIndex;
            nVALIndex = nVALIndex + 1;
          }
        } else if (hBinVolume.totalVolume === 0) {
          nextBinVolume = hBinVolume;
          VAHIndex = nVAHIndex;
          nVAHIndex = nVAHIndex - 1;
        } else if (lBinVolume.totalVolume === 0) {
          nextBinVolume = lBinVolume;
          VALIndex = nVALIndex;
          nVALIndex = nVALIndex + 1;
        } else {
          if (hBinVolume.totalVolume >= lBinVolume.totalVolume) {
            nextBinVolume = hBinVolume;
            VAHIndex = nVAHIndex;
            nVAHIndex = nVAHIndex - 1;
          } else {
            nextBinVolume = lBinVolume;
            VALIndex = nVALIndex;
            nVALIndex = nVALIndex + 1;
          }
        }

        if (nextBinVolume) {
          nextBinVolume.inVA = true;
          currentSum = currentSum + nextBinVolume.totalVolume;
        }
      }

      const maxVAWidth = sessionWidth - dx / 2;
      const VAWidth = (maxVAWidth * VAWidthPercent) / 100;
      if (totalVolumes[VAHIndex]) {
        totalVolumes[VAHIndex].isVAH = true;
        totalVolumes[VAHIndex].VAWidth = VAWidth;
      }
      if (totalVolumes[VALIndex]) {
        totalVolumes[VALIndex].isVAL = true;
        totalVolumes[VALIndex].VAWidth = VAWidth;
      }
      if (totalVolumes[POCindex]) {
        totalVolumes[POCindex].isPOC = true;
        totalVolumes[POCindex].VAWidth = maxVAWidth;
      }
      // console.log({ POCindex, VAHIndex, VALIndex, currentSum, currentLoop, length: totalVolumes.length });
    }

    const rects = zip(values, totalVolumes).map(
      ([d, { x, ws, inVA, isVAH, isVAL, VAWidth, isPOC }], index) => {
        const w1 = ws[0] || { type: "up", width: 0 };
        const w2 = ws[1] || { type: "down", width: 0 };
        const nextD = values[index + 1];
        const nextX0 = nextD ? nextD.x0 : d.x1;

        return {
          // y: yScale(d.x + d.dx),
          y: yScale(d.x0),
          yUp: yScale(d.x1),
          // height: yScale(d.x - d.dx) - yScale(d.x),
          height: yScale(nextX0) - yScale(d.x0),
          x,
          width,
          w1: w1.width,
          w2: w2.width,
          stroke1: functor(stroke)(w1),
          stroke2: functor(stroke)(w2),
          fill1: functor(fill)(w1),
          fill2: functor(fill)(w2),
          opacity1: functor(opacity)(w1),
          opacity2: functor(opacity)(w2),
          inVA,
          isVAH,
          isVAL,
          VAWidth,
          isPOC,
        };
      }
    );

    const heightRectSessions = head(values).length === 0 ? head(rects).yUp - last(rects).yUp : head(rects).y - last(rects).yUp;

    const sessionBg = {
      x: begin,
      y: yScale(maxPrice),
      height: rects.length === 0 ? 0 : heightRectSessions,
      width: sessionWidth,
    };

    const pocItems = findDevelopingPOCs(session, {
      ...props,
      ...moreProps,
      globalMinY: y0,
      globalMaxY: y1,
      rollup,
      defaultToBins,
    });

    const { pocs, vahs, vals } = pocToRects(pocItems, {
      ...props,
      ...moreProps,
    });

    return {
      rects,
      sessionBg,
      pocs,
      vahs,
      vals,
    };
  });

  return {
    rects: merge(allRects.map((d) => d.rects)),
    sessionBg: allRects.map((d) => d.sessionBg),
    pocs: merge(allRects.map((d) => d.pocs)),
    vahs: merge(allRects.map((d) => d.vahs)),
    vals: merge(allRects.map((d) => d.vals)),
    dx,
  };
}

function drawOnCanvas(ctx, props, rects, sessionBg, { pocs, vahs, vals, dx }) {
  const {
    sessionBackGround,
    sessionBackGroundOpacity,
    showSessionBackground,
    settings,
  } = props;

  // var { rects, sessionBg } = helper(props, xScale, yScale, plotData);

  // backgroup of volume session
  if (showSessionBackground) {
    ctx.fillStyle = hexToRGBA(sessionBackGround, sessionBackGroundOpacity);

    sessionBg.forEach((each) => {
      const { x, y, height, width } = each;

      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.closePath();
      ctx.fill();
    });
  }

  // draw rectagle
  rects.forEach((each) => {
    const {
      x,
      y,
      height,
      w1,
      w2,
      stroke1,
      stroke2,
      fill1,
      fill2,
      opacity1,
      opacity2,
      inVA,
      VAWidth,
      isPOC,
    } = each;

    if (w1 > 0) {
      const fillOpacity =
        inVA || isPOC ? opacity1 : Math.max(opacity1 - 0.3, 0);
      ctx.fillStyle = hexToRGBA(fill1, fillOpacity);
      if (stroke1 !== "none") ctx.strokeStyle = hexToRGBA(stroke1, fillOpacity);

      ctx.beginPath();
      ctx.rect(x, y, w1, height + 1);
      ctx.closePath();
      ctx.fill();

      if (stroke1 !== "none") ctx.stroke();
    }

    if (w2 > 0) {
      const fillOpacity =
        inVA || isPOC ? opacity2 : Math.max(opacity2 - 0.3, 0);
      ctx.fillStyle = hexToRGBA(fill2, fillOpacity);
      if (stroke2 !== "none") ctx.strokeStyle = hexToRGBA(stroke2, fillOpacity);

      ctx.beginPath();
      ctx.rect(x + w1, y, w2, height + 1);
      ctx.closePath();
      ctx.fill();

      if (stroke2 !== "none") ctx.stroke();
    }

    // POC line
    if (settings.poc.display) {
      if (isPOC) {
        const xPocLineFrom = settings.orient === "right" ? x : x + w1 + w2;
        const xPocLineTo =
          settings.orient === "right" ? x + VAWidth : x + w1 + w2 - VAWidth;
        ctx.beginPath();
        ctx.strokeStyle = hexToRGBA(settings.poc.color, settings.poc.opacity);
        ctx.lineWidth = settings.poc.width;
        ctx.setLineDash(getStrokeDasharray(settings.poc.type).split(","));
        ctx.moveTo(xPocLineFrom, y);
        ctx.lineTo(xPocLineTo, y);
        ctx.stroke();
      }
    }
  });

  let previous = null;

  // developing POC
  if (settings.developingPOC.display) {
    ctx.strokeStyle = hexToRGBA(
      settings.developingPOC.color,
      settings.developingPOC.opacity
    );
    ctx.lineWidth = settings.developingPOC.width;
    ctx.setLineDash(getStrokeDasharray(settings.developingPOC.type).split(","));
    ctx.beginPath();
    pocs.forEach((item) => {
      const { x, y } = item;
      if (!previous) {
        ctx.moveTo(x, y);
      } else {
        if (previous.y !== y) {
          ctx.lineTo(x, previous.y);
          ctx.lineTo(x, y);
        }
      }
      previous = item;
    });

    if (previous) {
      ctx.lineTo(previous.x + dx, previous.y);
    }
    ctx.stroke();
  }

  // developing VAH
  if (settings.developingVAH.display) {
    ctx.beginPath();
    ctx.strokeStyle = hexToRGBA(
      settings.developingVAH.color,
      settings.developingVAH.opacity
    );
    ctx.lineWidth = settings.developingVAH.width;
    ctx.setLineDash(getStrokeDasharray(settings.developingVAH.type).split(","));
    previous = null;
    vahs.forEach((item) => {
      const { x, y } = item;
      if (!previous) {
        ctx.moveTo(x, y);
      } else {
        if (previous.y !== y) {
          ctx.lineTo(x, previous.y);
          ctx.lineTo(x, y);
        }
      }
      previous = item;
    });
    if (previous) {
      ctx.lineTo(previous.x + dx, previous.y);
    }
    ctx.stroke();
  }

  if (settings.developingVAL.display) {
    // developing VAL
    ctx.beginPath();
    ctx.strokeStyle = hexToRGBA(
      settings.developingVAL.color,
      settings.developingVAL.opacity
    );
    ctx.lineWidth = settings.developingVAL.width;
    ctx.setLineDash(getStrokeDasharray(settings.developingVAL.type).split(","));
    previous = null;
    vals.forEach((item) => {
      const { x, y } = item;
      if (!previous) {
        ctx.moveTo(x, y);
      } else {
        if (previous.y !== y) {
          ctx.lineTo(x, previous.y);
          ctx.lineTo(x, y);
        }
      }
      previous = item;
    });
    if (previous) {
      ctx.lineTo(previous.x + dx, previous.y);
    }
    ctx.stroke();
  }
  ctx.closePath();
}

export default VolumeProfileSessionSeries;
