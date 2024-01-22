import { format } from 'd3-format';

import {
  checkFlowDirect,
  checkStackImbalance,
} from '@/redux/actions/caculator';
import { MIN_PRECISION, PRECISION } from '@/config/consts/settings/pricescale';
import { checkDeltaDirection } from './calculator';
import { utcToZonedTime } from 'date-fns-tz';

export const defaultFormatters = {
  yearFormat: '%Y',
  quarterFormat: '%m %Y',
  monthFormat: '%b',
  weekFormat: '%d/%m',
  dayFormat: '%d',
  hourFormat: '%-Hh',
  minuteFormat: '%-H:%M',
  secondFormat: '%H:%M:%S',
  milliSecondFormat: '%L',
};

// format date by timezone
export const formatDateUtcCandle = (dateUtc, timezone) => {
  return utcToZonedTime(dateUtc, timezone);
};

export const formatTimezoneForDataOfChart = (data, timezone) => {
  const formatedData = (data || []).map((d) => ({
    ...d,
    date: formatDateUtcCandle(d.opentime, 'Europe/London'),
    closeDate: formatDateUtcCandle(d.closetime, 'Europe/London'),
  }));
  return (formatedData || []).map((d) => ({
    ...d,
    date: formatDateUtcCandle(d.opentime, timezone),
    closeDate: formatDateUtcCandle(d.closetime, timezone),
  }));
};

export const formatCandleFromSocketDataV3 = (dataStr, footprintSettings) => {
  let data = dataStr;

  const { aggs } = data;
  data.aggs = [];

  const candle = formatCandleV3(data);
  candle.orderFlow = formatAggTradesV3(aggs, data.tv);
  let ratioLow = 0;
  let ratioHigh = 0;
  const priceArray = candle.orderFlow;
  const lastIndex = priceArray.length - 1;
  if (priceArray.length > 1) {
    if (priceArray[lastIndex].sell !== 0) {
      ratioLow = (
        priceArray[lastIndex - 1].sell / priceArray[lastIndex].sell
      ).toFixed(2);
    }

    if (priceArray[0].buy !== 0) {
      ratioHigh = (priceArray[1].buy / priceArray[0].buy).toFixed(0);
    }
  }
  candle.ratioLow = ratioLow;
  candle.ratioHigh = ratioHigh;
  candle.stackImbalance = checkStackImbalance(
    candle.orderFlow,
    footprintSettings
  );
  candle.flowDirection = checkFlowDirect(candle, footprintSettings);
  candle.deltaDirection = checkDeltaDirection(candle, footprintSettings);

  return candle;
};

export const formatAggTradesV3 = (trades, tick) => {
  if (!Array.isArray(trades) || trades.length === 0) {
    return [];
  }

  return trades
    .map((trade) => ({
      volume: trade.v,
      quotevol: trade.q,
      takerbuybasevol: trade.bv,
      takerbuyquotevol: trade.bq,
      buy: trade.bv,
      sell: trade.v - trade.bv,
      p: trade.tp,
      tick,
    }))
    .sort((a, b) => b.p - a.p);
};

export const formatCandleV3 = (source, timezone = 'Europe/London') => {
  let obj = source;
  if (obj._source) {
    obj = obj._source;
  }
  return {
    open: obj.o,
    high: obj.h,
    low: obj.l,
    close: obj.c,
    volume: obj.v,
    opentime: obj.t,
    closetime: obj.ct,
    quoteVolume: obj.q,
    not: obj.n,
    askvol: obj.bv,
    bidvol: obj.v - obj.bv,
    delta: 2 * obj.bv - obj.v,
    interval: obj.i,
    symbol: obj.s,
    date: utcToZonedTime(obj.t, timezone),
    closeDate: utcToZonedTime(obj.ct, timezone),
  };
};

export const convertCandlestickV3 = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  return data.reverse().map((item) => formatCandleV3(item));
};

/********************************************************
 * Converts Exponential (e-Notation) Numbers to Decimals
 ********************************************************
 * @function numberExponentToLarge()
 * @version  1.00
 * @param   {string | number}  Number in exponent format.
 *                   (other formats returned as is).
 * @return  {string}  Returns a decimal number string.
 * @author  Mohsen Alyafei
 * @date    12 Jan 2020
 * @origin  https://stackoverflow.com/a/62124842
 * @codeReview  https://codereview.stackexchange.com/questions/243164/convert-exponential-e-notation-numbers-to-decimals
 *
 * Notes: No check is made for NaN or undefined inputs
 *
 *******************************************************/
export const numberExponentToLarge = (numIn) => {
  let num = `${numIn}`;

  // remove - sign & remember it
  let sign = '';
  if (num.charAt(0) === '-') {
    num = num.substring(1);
    sign = '-';
  }

  // Not an Exponent Number?
  let str = num.split(/[eE]/g); // Split numberic string at e or E
  if (str.length < 2) return `${sign}${num}`;

  const power = str[1]; // Get Exponent (Power) (could be + or -)

  let deciSp = (1.1).toLocaleString().substring(1, 2); // Get Deciaml Separator
  str = str[0].split(deciSp); // Split the Base Number into LH and RH at the decimal point
  let baseRH = str[1] || ''; // RH Base part. Make sure we have a RH fraction else ""
  let baseLH = str[0]; // LH base part.

  if (power >= 0) {
    // ------- Positive Exponents (Process the RH Base Part)
    if (power > baseRH.length) baseRH += '0'.repeat(power - baseRH.length); // Pad with "0" at RH
    baseRH = baseRH.slice(0, power) + deciSp + baseRH.slice(power); // Insert decSep at the correct place into RH base
    if (baseRH.charAt(baseRH.length - 1) == deciSp)
      baseRH = baseRH.slice(0, -1); // If decSep at RH end? => remove it
  } else {
    // ------- Negative exponents (Process the LH Base Part)
    num = Math.abs(power) - baseLH.length; // Delta necessary 0's
    if (num > 0) baseLH = '0'.repeat(num) + baseLH; // Pad with "0" at LH
    baseLH = baseLH.slice(0, power) + deciSp + baseLH.slice(power); // Insert "." at the correct place into LH base
    if (baseLH.charAt(0) == deciSp) baseLH = '0' + baseLH; // If decSep at LH most? => add "0"
  }

  // Rremove leading and trailing 0's and Return the long number (with sign)
  return sign + (baseLH + baseRH).replace(/^0*(\d+|\d+\.\d+?)\.?0*$/, '$1');
};

/**
 * get precision base on price scale setting and tickValue
 * @param {Number} tickValue tick of symbol
 * @param {{ precision: String | Number }} priceScaleSettings setting object
 * @returns {Number} precision
 */
export const getPrecision = (tickValue, priceScaleSettings) => {
  if (
    priceScaleSettings?.precision &&
    priceScaleSettings?.precision !== PRECISION.DEFAULT
  ) {
    return priceScaleSettings.precision;
  }

  let precision = MIN_PRECISION;
  const tickStr = numberExponentToLarge(tickValue);
  const index = tickStr.indexOf('.');

  if (index !== -1) {
    precision = tickStr.length - index - 1;
  }

  // min
  if (precision < MIN_PRECISION) {
    precision = MIN_PRECISION;
  }

  return precision;
};

export const getTickFormat = (tickValue, priceScaleSettings) => {
  const precision = getPrecision(tickValue, priceScaleSettings);
  const d3Formatter = format(`,.${precision}f`);
  return (value) => {
    const formatedStr = d3Formatter(value);

    return formatedStr.replace(/(\.\d*?)[0]+$/g, '$1').replace(/\.$/, '');
  };
};

/**
 * Flatten heatmap
 * @param {Array} heatmapItems
 * @returns {{priceArr: Float32Array, volArr: Float32Array}}
 */
export const heatmapToFlatArray = (heatmapItems) => {
  const priceArr = new Float32Array(heatmapItems.length);
  const volArr = new Float32Array(heatmapItems.length);

  for (let i = 0; i < heatmapItems.length; i++) {
    const item = heatmapItems[i];
    priceArr[i] = item[1];
    volArr[i] = item[2];
  }

  return { priceArr, volArr };
};

export const formatOrderbookHeatmap = (orderbook) => {
  const { bids, asks } = orderbook;
  let minSellPrice = null;
  const priceArr = new Float32Array(bids.length + asks.length);
  const volArr = new Float32Array(bids.length + asks.length);

  const sortedAsks = [...asks].sort((a, b) => b[0] - a[0]);
  const sortedBids = [...bids].sort((a, b) => b[0] - a[0]);
  for (let i = 0; i < sortedAsks.length; i++) {
    const ask = sortedAsks[i];
    if (!ask) {
      continue;
    }
    let [price, vol] = ask;
    price = +price;
    vol = +vol;

    if (!minSellPrice) {
      minSellPrice = price;
    } else if (minSellPrice > price) {
      minSellPrice = price;
    }

    priceArr[i] = price;
    volArr[i] = vol;
  }

  const newStartIndex = sortedAsks.length;
  for (let i = 0; i < sortedBids.length; i++) {
    const bid = sortedBids[i];
    if (!bid) {
      continue;
    }

    const [price, vol] = bid;
    const index = i + newStartIndex;
    priceArr[index] = +price;
    volArr[index] = +vol;
  }

  return { priceArr, volArr, minSellPrice };
};

export const snapshotToHeatmap = (snapshot) => {
  return formatOrderbookHeatmap({
    bids: snapshot.b,
    asks: snapshot.a,
  });
};

export const formatCountDown = (time) => {
  let secondLeft = Math.floor(time / 1000);
  if (secondLeft <= 0) {
    return '00:00';
  }

  const hours = Math.floor(secondLeft / (60 * 60));
  secondLeft = secondLeft % (60 * 60);
  const minutes = Math.floor(secondLeft / 60);
  secondLeft = secondLeft % 60;

  let str = `${secondLeft}`;
  if (str.length === 1) {
    str = `0${str}`;
  }

  str = `${minutes}:${str}`;
  if (str.length < 5) {
    str = `0${str}`;
  }

  if (hours > 0) {
    str = `${hours}:${str}`;
    if (str.length < 8) {
      str = `0${str}`;
    }
  }

  return str;
};
export const formatDeepCopy = (value) => {
  return JSON.parse(JSON.stringify(value));
};

export const formatLargeNumber = (value) => {
  const PREFIXES = [
    'K',
    'M',
    'B',
    't',
    'q',
    'Q',
    's',
    'S',
    'o',
    'n',
    'd',
    'U',
    'D',
    'T',
    'Qt',
    'Qd',
    'Sd',
    'St',
    'O',
    'N',
    'v',
    'c',
  ];

  const d3FormatString = format('~s')(value);
  const magnitude = Math.floor(Math.log10(value) / 3);
  return magnitude >= 1 && magnitude < 1 + PREFIXES.length
    ? d3FormatString.slice(0, -1) + PREFIXES[magnitude - 1]
    : d3FormatString;
};
