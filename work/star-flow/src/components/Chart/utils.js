import { tsvParse } from 'd3-dsv';
import { timeParse } from 'd3-time-format';
import { utcToZonedTime } from 'date-fns-tz';

import { SYMBOL } from '@/config/consts/settings/statusline';

export const INTERVAL_TO_MS = {
  1: 1 * 60 * 1000,
  3: 3 * 60 * 1000,
  5: 5 * 60 * 1000,
  15: 15 * 60 * 1000,
  30: 30 * 60 * 1000,
  60: 1 * 60 * 60 * 1000,
  120: 2 * 60 * 60 * 1000,
  240: 4 * 60 * 60 * 1000,
  480: 8 * 60 * 60 * 1000,
  720: 12 * 60 * 60 * 1000,
  '1D': 24 * 60 * 60 * 1000,
};

const FUTURE_DATA_NUMBER = 2800;

function parseData(parse) {
  return function (d) {
    d.date = parse(d.date);
    d.open = +d.open;
    d.high = +d.high;
    d.low = +d.low;
    d.close = +d.close;
    d.volume = +d.volume;
    return d;
  };
}
const parseDate = timeParse('%Y-%m-%d');

export function getData() {
  const promiseMSFT = fetch(
    'https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv'
  )
    .then((response) => response.text())
    .then((data) => tsvParse(data, parseData(parseDate)));
  return promiseMSFT;
}

export const indexToIndexMap = (index) => {
  const result = {};
  if (Array.isArray(index)) {
    return result;
  }

  index.forEach((idx, i) => {
    result[idx.index] = i;
  });

  return result;
};

const intervalSecondsMap = {
  '1m': 60,
  '3m': 5 * 60,
  '5m': 5 * 60,
  '30m': 30 * 60,
  '1h': 60 * 60,
  '4h': 60 * 60 * 4,
  '12h': 60 * 60 * 12,
  '1d': 60 * 60 * 24,
  '1w': 60 * 60 * 24 * 7,
  '1M': 60 * 60 * 24 * 30,
};

export const intervalToTime = (interval) => {
  return intervalSecondsMap[interval];
};

const DOT_COLOR = '#66676D';

export const getSymbolInStatusLine = (symbol, interval, type, resolutions) => {
  const intervalLabel = (resolutions || []).find(
    (r) => r.resolutions_name === interval
  );
  switch (type) {
    case SYMBOL.DESCRIPTION: {
      return (
        <>
          {symbol.description} <span style={{ color: DOT_COLOR }}>•</span>{' '}
          {intervalLabel && intervalLabel.display_name} <span>•</span>{' '}
          {symbol.exchange}
        </>
      );
    }
    case SYMBOL.TICKER: {
      return (
        <>
          {symbol.ticker} <span style={{ color: DOT_COLOR }}>•</span>{' '}
          {intervalLabel && intervalLabel.display_name}{' '}
          <span style={{ color: DOT_COLOR }}>•</span> {symbol.exchange}
        </>
      );
    }
    case SYMBOL.TICKER_AND_DESCRIPTION: {
      return (
        <>
          {symbol.ticker} <span style={{ color: DOT_COLOR }}>•</span>{' '}
          {symbol.description} <span style={{ color: DOT_COLOR }}>•</span>{' '}
          {intervalLabel && intervalLabel.display_name}{' '}
          <span style={{ color: DOT_COLOR }}>•</span> {symbol.exchange}
        </>
      );
    }
    default:
      '';
  }
};

// generate future data using to calculate index
// new future data by timezone
export const generateFutureData = (
  oldFutureData,
  lastDatum,
  interval,
  timezone
) => {
  let futureData = [];
  if (!lastDatum) return futureData;

  const intervalMS = INTERVAL_TO_MS[interval];
  const firstFutureDatum = oldFutureData[0];
  const lastFutureDatum = oldFutureData[oldFutureData.length - 1];

  // update future data, do not need to generate all
  if (lastDatum.opentime - firstFutureDatum?.opentime === 0) {
    const nextDate = utcToZonedTime(
      new Date(lastFutureDatum.opentime + intervalMS),
      timezone
    );
    futureData = [...oldFutureData];
    futureData.shift();
    futureData.push({ date: nextDate, opentime: nextDate.valueOf() });
    return futureData;
  }

  // generate all future data
  for (let i = -1; ++i < FUTURE_DATA_NUMBER; ) {
    const nextDate = utcToZonedTime(
      new Date(lastDatum.opentime + intervalMS * (i + 1)),
      timezone
    );
    futureData.push({ date: nextDate, opentime: nextDate.valueOf() });
  }
  return futureData;
};
