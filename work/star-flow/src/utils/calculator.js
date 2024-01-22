import { BUY_SELL } from '@/config/consts/data';
import { candleIntervalsMap } from '@/config/consts/interval';
import { DELTA_DIVERGENCE } from '@/config/consts/settings/footprint';
import {
  checkFlowDirect,
  checkStackImbalance,
} from '@/redux/actions/caculator';
import { getDateUTCStart } from './datetime';
import { heatmapToFlatArray } from './format';

export const unitSecondsMap = {
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
  D: 60 * 60 * 24,
  W: 60 * 60 * 24 * 7,
};

export const intervalToSeconds = (rawInterval) => {
  const interval = candleIntervalsMap[rawInterval] || rawInterval;
  const unit = interval.slice(-1);
  const num = +interval.substr(0, interval.length - 1);

  return unitSecondsMap[unit] * num;
};

export const invetervalToNanoSeconds = (interval) =>
  intervalToSeconds(interval) * 1000;

export const calcStartTime = (exactStartTime, interval) => {
  const intervalSeconds = intervalToSeconds(interval);
  const redundant = exactStartTime % (intervalSeconds * 1000);
  const shouldRequestTime = exactStartTime - redundant;

  return shouldRequestTime;
};

export const calcExpectedCandleCount = ({ startTime, endTime, interval }) => {
  const intervalSeconds = intervalToSeconds(interval);

  return Math.floor((endTime - startTime) / (intervalSeconds * 1000));
};

export const checkDeltaDirection = ({ open, close, delta }, settings) => {
  const isBlueCandle = open < close;
  const isRedCandle = open > close;

  const hasDelta = (isBlueCandle && delta < 0) || (isRedCandle && delta > 0);

  // delta xuất hiện khi giá trị của delta và cây nến ngược chiều nhau.
  // chiều mũi tên và màu nến theo delta hoặc cây nến

  if (settings) {
    if (settings.deltaDivergence.type === DELTA_DIVERGENCE.DELTAL) {
      return {
        up: hasDelta && delta > 0,
        down: hasDelta && delta < 0,
      };
    }
    if (settings.deltaDivergence.type === DELTA_DIVERGENCE.CANDLESTICK) {
      return {
        up: hasDelta && isBlueCandle,
        down: hasDelta && isRedCandle,
      };
    }
  }
  return {
    up: hasDelta && delta > 0,
    down: hasDelta && delta < 0,
  };
};

export const calcCandleWithOrderFlow = (candle, settings) => {
  let ratioLow = 0;
  let ratioHigh = 0;

  const priceArray = candle.orderFlow;
  if (priceArray?.length > 1) {
    if (priceArray[0].buy !== 0) {
      ratioHigh = (priceArray[1].buy / priceArray[0].buy).toFixed(2);
    }

    const lastIndex = priceArray.length - 1;
    if (priceArray[lastIndex].sell !== 0) {
      ratioLow = (
        priceArray[lastIndex - 1].sell / priceArray[lastIndex].sell
      ).toFixed(2);
    }
  }
  candle.ratioLow = ratioLow;
  candle.ratioHigh = ratioHigh;

  candle.stackImbalance = checkStackImbalance(candle.orderFlow, settings);
  candle.flowDirection = checkFlowDirect(candle, settings);
  candle.deltaDirection = checkDeltaDirection(candle, settings);

  return candle;
};

export const getNextSessionStart = (currentTime) => {
  const currentDate = new Date(currentTime);
  currentDate.setHours(0, 0, 0, 0);
  return currentDate.getTime();
};

export const sliceToSmallPeriods = (start, end, maxPerItem) => {
  const result = [];
  for (let current = start; current < end; current += maxPerItem) {
    result.push([current, Math.min(current + maxPerItem, end + 1)]);
  }

  return result;
};

export const isStartOfPeriod = (timestamp, period = 'day') => {
  switch (period) {
    case 'day': {
      const startOfDay = getDateUTCStart(timestamp).getTime();
      return timestamp === startOfDay;
    }
    case 'week': {
      const currentDate = new Date(timestamp);
      const startOfDay = getDateUTCStart(timestamp).getTime();
      const dayStartOfWeek = currentDate.getDay() === 1;
      return timestamp === startOfDay && dayStartOfWeek;
    }
    case 'month': {
      const currentDate = new Date(timestamp);
      const startOfDay = getDateUTCStart(timestamp).getTime();
      const dayStartOfMonth = currentDate.getDate() === 1;
      return timestamp === startOfDay && dayStartOfMonth;
    }

    default:
      return false;
  }
};

const defaultPriceAccessor = (item) => +item[1];

export const fixLikeTickValue = (num, tickValue) => {
  const result = num;
  const tickValueStr = `${tickValue}`;
  const pointIndex = tickValueStr.indexOf('.');
  let decimalLength = 0;
  if (pointIndex >= 0) {
    const arr = tickValueStr.split('.');
    decimalLength = arr[1].length;
  }

  if (isNaN(+result.toFixed(decimalLength))) {
    console.log('isNAN', num, tickValue);
  }
  return +result.toFixed(decimalLength);
};

export const ticksCombine = (
  heatmap,
  priceAccessor = defaultPriceAccessor,
  tickValue = 10
) => {
  const dataArr = [];

  if (tickValue <= 0) {
    return { resultArr: dataArr, result: {} };
  }

  heatmap.priceArr.forEach((price, index) => {
    const vol = heatmap.volArr[index];
    const orderType =
      price >= heatmap.minSellPrice ? BUY_SELL.SELL : BUY_SELL.BUY;
    dataArr[index] = [orderType, price, vol];
  });

  let price = 0;
  let tmpArr = [];
  let tmpSumVol = {};
  let isStarted = false;
  let maxVol = 0;
  const result = {};
  const resultArr = [];
  for (let i = 0; i < dataArr.length; i++) {
    const item = dataArr[i];
    const itemPrice = priceAccessor(item);
    if (!tmpSumVol[item[0]]) {
      tmpSumVol[item[0]] = 0;
    }
    if (!isStarted) {
      tmpArr.push(item);
      tmpSumVol[item[0]] += item[2];
      price = +fixLikeTickValue(itemPrice - (itemPrice % tickValue), tickValue);
      isStarted = true;
      continue;
    }

    if (price <= itemPrice && price + tickValue > itemPrice) {
      tmpArr.push(item);
      tmpSumVol[item[0]] += item[2];
    } else {
      if (tmpArr.length > 0) {
        tmpArr.vol = tmpSumVol;
        result[`${price}`] = tmpArr;

        if (tmpSumVol[BUY_SELL.BUY]) {
          if (maxVol < tmpSumVol[BUY_SELL.BUY]) {
            maxVol = tmpSumVol[BUY_SELL.BUY];
          }
          resultArr.push(
            new Float32Array([BUY_SELL.BUY, price, tmpSumVol[BUY_SELL.BUY]])
          );
        }
        if (tmpSumVol[BUY_SELL.SELL]) {
          if (maxVol < tmpSumVol[BUY_SELL.SELL]) {
            maxVol = tmpSumVol[BUY_SELL.SELL];
          }
          resultArr.push(
            new Float32Array([BUY_SELL.SELL, price, tmpSumVol[BUY_SELL.SELL]])
          );
        }

        // reset tmp
        tmpArr = [];
        tmpSumVol = {};
      }
      price = fixLikeTickValue(itemPrice - (itemPrice % tickValue), tickValue);
      tmpArr.push(item);
      tmpSumVol[item[0]] = (tmpSumVol[item[0]] ?? 0) + item[2];
    }
  }

  if (tmpArr.length > 0) {
    tmpArr.vol = tmpSumVol;
    result[`${price}`] = tmpArr;
    if (tmpSumVol[BUY_SELL.BUY]) {
      if (maxVol < tmpSumVol[BUY_SELL.BUY]) {
        maxVol = tmpSumVol[BUY_SELL.BUY];
      }
      resultArr.push(
        new Float32Array([BUY_SELL.BUY, price, tmpSumVol[BUY_SELL.BUY]])
      );
    }
    if (tmpSumVol[BUY_SELL.SELL]) {
      if (maxVol < tmpSumVol[BUY_SELL.SELL]) {
        maxVol = tmpSumVol[BUY_SELL.SELL];
      }
      resultArr.push(
        new Float32Array([BUY_SELL.SELL, price, tmpSumVol[BUY_SELL.SELL]])
      );
    }
  }

  // flatten to float32 array
  const { priceArr, volArr } = heatmapToFlatArray(resultArr);

  return {
    priceArr,
    volArr,
    resultArr,
    maxVol,
  };
};

export const combineToOneDot = (dots, dotMode = 'delta') => {
  const result = [];
  let dot = null;
  if (!Array.isArray(dots) || dots.length === 0) {
    return result;
  }

  dot = { ...dots[0] };
  if (dots.length === 1) {
    result.push(dot);
    return result;
  }
  for (let i = 1; i < dots.length; i++) {
    const tmpDot = dots[i];
    dot.bv += tmpDot.bv;
    dot.sv += tmpDot.sv;
    dot.uv += tmpDot.uv;
    dot.n += tmpDot.n;
    dot.t = (tmpDot.t + dot.t) / 2;
    dot.p = (tmpDot.p + dot.p) / 2;
  }

  if (dotMode === 'delta') {
    const delta = dot.bv - dot.sv;
    dot.bv = delta > 0 ? delta : 0;
    dot.sv = delta < 0 ? -delta : 0;
  }

  result.push(dot);

  return result;
};

export const combineHeatmapTicks = (
  data,
  dataOrigin,
  dataOriginOpentimeMap,
  opentimeMapOffset,
  tickValue
) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  data.forEach((candle, index) => {
    const currentHeatmap = candle.heatmap;
    const originCandleIndex =
      dataOriginOpentimeMap[candle.opentime] + opentimeMapOffset;
    if (typeof originCandleIndex !== 'number') {
      return;
    }
    const originCandle = dataOrigin[originCandleIndex];
    const originHeatmap = originCandle?.heatmap;
    if (!originHeatmap.priceArr || originHeatmap.priceArr.length === 0) {
      console.log('invalid originHeatmap', originHeatmap, data, index);
      return;
    }

    const { priceArr, volArr } = ticksCombine(
      originHeatmap,
      defaultPriceAccessor,
      tickValue
    );
    const combinedHeatmap = {
      priceArr,
      volArr,
      tv: tickValue,
      dotVol: currentHeatmap.dotVol,
      bestask: currentHeatmap.bestask,
      bestbid: currentHeatmap.bestbid,
    };
    candle.heatmap = combinedHeatmap;
  });

  return data;
};

/**
 * Combine heatmap candles base on ratio for X axis
 * Support combine tick value for Y axis
 * @param {array} data current original data
 * @param {array} fullData current combined data from chart
 * @param {number} timeFrame time in ms
 * @param {array} currentDomain current chart X scale domain
 * @param {number} ratio > 2 => combine, < 1 => split
 * @param {number} tickValue tick value to combine heatmap data for new candle
 * @returns {{newData: array, newDataMap: Object.<number, number>, newDomain: [number, number]}}
 * - newData: combined data array,
 * - newDataMap: <opentime, candle_index>,
 * - newDomain: new X scale domain to keep chart position
 */
export const combineHeatmapCandles = (
  data,
  fullData,
  timeFrame = 1000,
  currentDomain,
  ratio,
  tickValue
) => {
  const lastDataLength = fullData.length;
  const newData = [];
  const newDataMap = {};
  let [startIndex, endIndex] = currentDomain;
  endIndex = Math.floor(endIndex);
  startIndex = Math.floor(startIndex);

  let startTime = 0;
  if (startIndex > 0 && fullData[startIndex]) {
    startTime = fullData[startIndex].opentime;
  }
  let endTime = 0;
  if (endIndex < fullData.length && fullData[endIndex]) {
    endTime = fullData[endIndex].opentime;
  }

  let newStartIndex = startIndex;
  let newEndIndex = endIndex;
  for (let i = 0; i < data.length; i++) {
    const candle = data[i];
    const newOpentime = candle.opentime - (candle.opentime % timeFrame);
    const closetime = newOpentime + timeFrame - 1;

    if (startTime) {
      const oldStartTimeInNewFrame = startTime - (startTime % timeFrame);
      if (oldStartTimeInNewFrame === newOpentime) {
        newStartIndex = newData.length - 1;
      }
    }
    if (endTime) {
      const oldEndTimeInNewFrame = endTime - (endTime % timeFrame);
      if (oldEndTimeInNewFrame === newOpentime) {
        newEndIndex = newData.length - 1;
      }
    }

    const lastCandle = newData[newData.length - 1];

    // No last candle or this is new candle
    if (newOpentime !== lastCandle?.opentime) {
      let heatmap = [...candle.heatmap];
      if (candle.heatmap.tv !== tickValue) {
        heatmap = ticksCombine(
          [...candle.heatmap],
          defaultPriceAccessor,
          tickValue
        )?.resultArr;
      }
      heatmap.dotVol = combineToOneDot(candle.heatmap.dotVol);
      heatmap.tv = tickValue;
      heatmap.bestask = candle.heatmap.bestask;
      heatmap.bestbid = candle.heatmap.bestbid;
      const length = newData.push({
        ...candle,
        heatmap,
        opentime: newOpentime,
        closetime,
      });
      newDataMap[newOpentime] = length - 1;
      continue;
    }

    // Update last candle
    const lastDots = lastCandle.heatmap.dotVol;
    const currentDots = combineToOneDot(candle.heatmap.dotVol);
    lastCandle.heatmap.dotVol = combineToOneDot([...lastDots, ...currentDots]);
    lastCandle.volume += candle.volume;
    lastCandle.delta += candle.delta;
    lastCandle.close = candle.close;
    if (candle.high > lastCandle.high) {
      lastCandle.high = candle.high;
    }
    if (candle.low < lastCandle.low) {
      lastCandle.low = candle.low;
    }
  }

  newEndIndex = Math.min(newEndIndex, newData.length - 1);
  if (!endTime) {
    newEndIndex = newData.length - 1;
  }
  if (endIndex > lastDataLength) {
    newEndIndex = newEndIndex + (endIndex - lastDataLength) * ratio + 1;
  }
  if (startIndex < 0) {
    newStartIndex = 0 - (0 - startIndex) * ratio;
  }

  return { newData, newDataMap, newDomain: [newStartIndex, newEndIndex] };
};

// Clone heatmap instance
export const cloneHeatmap = (heatmap) => {
  const cloned = {
    ...heatmap,
  };
  cloned.dotVol = [...heatmap.dotVol];
  cloned.priceArr = heatmap.priceArr.copyWithin(0, 0);
  cloned.volArr = heatmap.volArr.copyWithin(0, 0);
  return cloned;
};

/**
 * update, add, delete item from oldData array base on newData object
 * @param {Object<number, number>} newData data update from socket
 * @param {Array<[price: number, vol: number]>} oldData old snapshot side (asks or bids)
 * @param {Object<number, number>} priceIndex price - index map
 */
export const updateOneHeamapSnapshot = (newData, oldData, priceIndex) => {
  Object.keys(newData).forEach((price) => {
    const vol = newData[price];
    const index = priceIndex[price];
    if (vol === 0) {
      if (index > -1) {
        delete oldData[index];
        delete priceIndex[price];
      }
    } else {
      if (index > -1) {
        oldData[index][1] = vol;
      } else {
        const newIndex = oldData.push([price, vol]) - 1;
        priceIndex[price] = newIndex;
      }
    }
  });
};
