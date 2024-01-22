import { fetchCandles } from '@/redux/actions';
import {
  convertCandlestickV3,
  formatTimezoneForDataOfChart,
} from '@/utils/format';
import { NOTIFICATION_TYPE } from '@/hook/notification';
import { path } from '@coinmap/react-stockcharts/lib/utils';

import { calcSMA } from '@/config/consts/settings/sma';
import { calcWMA } from '@/config/consts/settings/wma';
import { calcVWMA } from '@/config/consts/settings/vwma';
import { calcSWMA } from '@/config/consts/settings/swma';
import { calcBollinger } from '@/config/consts/settings/bollinger';
import { calcRSI } from '@/config/consts/settings/rsi';
import { calcATR } from '@/config/consts/settings/atr';
import { calcDonchian } from '@/config/consts/settings/donchian';
import { calcRVOL } from '@/config/consts/settings/rvol';
import { calcCE } from '@/config/consts/settings/chandelierExit';
import { calcDMI } from '@/config/consts/settings/dmi';
import { calcSTDIndex } from '@/config/consts/settings/stdIndex';
import { calcHPR } from '@/config/consts/settings/hpr';

const INDICATOR_HANDLERS = {
  sma: calcSMA,
  wma: calcWMA,
  vwma: calcVWMA,
  swma: calcSWMA,
  bollinger: calcBollinger,
  rsi: calcRSI,
  atr: calcATR,
  donchian: calcDonchian,
  rvol: calcRVOL,
  ce: calcCE,
  dmi: calcDMI,
  stdIndex: calcSTDIndex,
  hpr: calcHPR,
};

const HANDLER_KEYS = Object.keys(INDICATOR_HANDLERS);

// calculate indicators and mapping based on current candle data
export const mapIndicators = (data, layers) => {
  layers.forEach((layer) => {
    if (HANDLER_KEYS.includes(layer.type)) {
      INDICATOR_HANDLERS[layer.type](layer.i, data, layer.settings);
    }
  });
};

// get timezone of client +/-00:00
const getTimezone = (date) => {
  const offset = date.getTimezoneOffset();
  const sign = offset < 0 ? '+' : '-';
  const hours = ('00' + Math.floor(Math.abs(offset) / 60)).slice(-2);
  const minutes = ('00' + (Math.abs(offset) % 60)).slice(-2);
  return sign + hours + ':' + minutes;
};

// generate string based on system date
const getSystemDate = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  const MM = ('00' + (date.getMonth() + 1)).slice(-2);
  const dd = ('00' + date.getDate()).slice(-2);
  const hh = ('00' + date.getHours()).slice(-2);
  const mm = ('00' + date.getMinutes()).slice(-2);
  const ss = ('00' + date.getSeconds()).slice(-2);
  const SSS = ('000' + date.getMilliseconds()).slice(-3);
  return yyyy + MM + dd + hh + mm + ss + SSS;
};

// get all paths of nested object
const getAllPaths = (obj, prev = '') => {
  const result = [];
  for (const k in obj) {
    const path = prev + (prev ? '.' : '') + k;
    if (typeof obj[k] == 'object') {
      result.push(...getAllPaths(obj[k], path));
    } else {
      result.push(path);
    }
  }
  return result;
};

// export data to csv and auto download
const exportCsv = (data, layers) => {
  // default headers
  const headers = [
    {
      name: 'time',
      value: 'date',
      converter: (value) => {
        const date = new Date(value);
        const timezone = getTimezone(date);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return new Date(date).toISOString().slice(0, 19) + timezone;
      },
    },
    {
      name: 'open',
      value: 'open',
    },
    {
      name: 'high',
      value: 'high',
    },
    {
      name: 'low',
      value: 'low',
    },
    {
      name: 'close',
      value: 'close',
    },
  ];

  // append headers based on last candle
  const lastDatum = data[data.length - 1];
  layers.forEach((layer) => {
    if (lastDatum[layer.i]) {
      getAllPaths(lastDatum[layer.i]).forEach((path) => {
        headers.push({
          name: layer.type.toUpperCase() + '_' + path,
          value: layer.i + '.' + path,
        });
      });
    }
  });

  // create content
  const exportData = data.map((datum) =>
    headers.map((header) => {
      const source = path(header.value.split('.'));
      let value = source(datum);
      if (header.converter) value = header.converter(value);
      return `${value ?? ''}`;
    })
  );
  exportData.unshift(headers.map((header) => header.name));

  const csvContent =
    'data:text/csv;charset=UTF-8,' +
    '\uFEFF' +
    exportData.map((row) => row.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.href = encodedUri;
  link.download = getSystemDate() + '_indicators';
  link.click();
};

// export candle and indicators to csv
export const exportIndicators = async ({
  layers,
  symbol,
  interval,
  timezone,
  startTime,
  endTime,
  limit,
  openNotification,
  asset,
  symbolType,
  exchange,
}) => {
  try {
    const res = await fetchCandles({
      symbol,
      interval,
      startTime,
      endTime,
      limit,
      asset,
      type: symbolType,
      exchange,
    });

    if (!Array.isArray(res.data) || res.data[0].s === 'no_data') {
      openNotification({
        type: NOTIFICATION_TYPE.ERROR,
        message: '',
        description: 'No data to export',
      });
      return;
    }

    // convert data
    const candlestickV3 = convertCandlestickV3(res.data);
    const candles = formatTimezoneForDataOfChart(candlestickV3, timezone);

    // calculate indicators
    mapIndicators(candles, layers);

    // export to csv
    exportCsv(candles, layers);

    openNotification({
      type: NOTIFICATION_TYPE.SUCCESS,
      message: '',
      description: 'Data was exported successfully',
    });
  } catch (e) {
    openNotification({
      type: NOTIFICATION_TYPE.ERROR,
      message: '',
      description: 'Export failed',
    });
  }
};
