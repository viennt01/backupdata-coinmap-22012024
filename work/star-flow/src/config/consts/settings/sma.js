import { LINE_TYPE } from '../settings/view';
import { sma } from '@coinmap/react-stockcharts/lib/indicator';
import { sma as smaCalculator } from '@coinmap/react-stockcharts/lib/calculator';

export const SMA_SOURCE_FUNCS = {
  open: ({ open }) => open,
  high: ({ high }) => high,
  low: ({ low }) => low,
  close: ({ close }) => close,
  hl2: ({ high, low }) => (high + low) / 2,
  hlc3: ({ high, low, close }) => (high + low + close) / 3,
  ohlc4: ({ open, high, low, close }) => (open + high + low + close) / 4,
  hlcc4: ({ high, low, close }) => (high + low + close + close) / 4,
};

export const SMA_SETTINGS = {
  input: [
    {
      type: 'section',
      name: 'Inputs',
    },
    {
      type: 'number',
      name: 'Length',
      default: 9,
      valueField: 'input.length',
      props: {
        min: 1,
        max: 2000,
        step: 1,
      },
    },
    {
      type: 'select',
      name: 'Source',
      valueField: 'input.source',
      props: {
        options: Object.keys(SMA_SOURCE_FUNCS),
        isSearchable: false,
      },
    },
    {
      type: 'number',
      name: 'Offset',
      default: 0,
      valueField: 'input.offset',
      props: {
        min: -2000,
        max: 2000,
        step: 1,
      },
    },
    {
      type: 'divider',
    },
  ],
  style: [
    {
      type: 'section',
      name: 'Styles',
    },
    [
      {
        type: 'line',
        name: 'Line',
        valueField: 'style.lineType',
        inline: true,
        col: 4,
        labelCol: 5,
      },
      {
        type: 'number',
        name: 'Line size',
        valueField: 'style.lineSize',
        inline: true,
        showLabel: false,
        col: 2,
        props: {
          min: 1,
          max: 10,
        },
      },
      {
        type: 'color',
        name: 'Line color',
        valueField: 'style.lineColor',
        opacityField: 'style.lineOpacity',
        inline: true,
        showLabel: false,
        col: 1,
        props: {
          label: '',
        },
      },
    ],
  ],
};

export const SMA_DEFAULT_SETTINGS = {
  input: {
    source: 'close',
    length: 9,
    offset: 0,
  },
  style: {
    lineType: LINE_TYPE.LINE,
    lineSize: 1,
    lineColor: '#2196F3',
    lineOpacity: 1,
  },
};

/**
 * calculate all sma based on candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of sma
 * @param {function} source callback using to calculate sma input
 * @returns {void}
 */
const mapAllSMA = (layerId, data, windowSize, source) =>
  sma()
    .options({ windowSize, source })
    .skipUndefined(false)
    .merge((d, c) => {
      d[layerId] = { sma: c };
    })(data);

/**
 * calculate sma for prepend candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of sma
 * @param {function} source callback using to calculate sma input
 * @returns {void}
 */
const mapPrependSMA = (layerId, data, windowSize, source) => {
  let stopIndex = data.findIndex((item) => item[layerId]?.sma !== undefined);
  if (stopIndex === -1) stopIndex = data.length - 1;
  const slicedData = data.slice(0, stopIndex + 1);
  mapAllSMA(layerId, slicedData, windowSize, source);
};

/**
 * calculate one sma based on candles and special index
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of sma
 * @param {function} source callback using to calculate sma input
 * @param {number} index index position will be used to calculate sma
 * @returns {void}
 */
const mapOneSMA = (layerId, data, windowSize, source, index) => {
  const endIndex = index + 1;
  const startIndex = endIndex - windowSize;

  if (!data[startIndex] || !data[endIndex - 1] || !data[index]) return;
  const slicedData = data.slice(startIndex, endIndex);

  const results = smaCalculator().options({
    windowSize,
    source,
  })(slicedData);

  data[index][layerId] = { sma: results.pop() };
};

// This procedure will mutate the input candle
export const calcSMA = (layerId, data, settings) => {
  const { length, source } = settings.input;
  if (data.length < length) return;

  const firstSMA = data[length - 1]?.[layerId]?.sma;
  const sourceFunc = SMA_SOURCE_FUNCS[source];

  if (smaSettings.difference(layerId, settings)) {
    mapAllSMA(layerId, data, length, sourceFunc);
    smaSettings.set(layerId, settings);
  } else if (firstSMA === undefined) {
    mapPrependSMA(layerId, data, length, sourceFunc);
  } else {
    mapOneSMA(layerId, data, length, sourceFunc, data.length - 1);
  }
};

class SMASettings {
  _settings = {};

  difference = (layerId, newSettings) => {
    return (
      JSON.stringify(newSettings.input) !==
      JSON.stringify(this._settings[layerId]?.input)
    );
  };

  set = (layerId, newSettings) => {
    this._settings[layerId] = { ...newSettings };
  };
}

const smaSettings = new SMASettings();
