import { LINE_TYPE } from '../settings/view';
import { wma } from '@coinmap/react-stockcharts/lib/indicator';
import { wma as wmaCalculator } from '@coinmap/react-stockcharts/lib/calculator';

export const WMA_SOURCE_FUNCS = {
  open: ({ open }) => open,
  high: ({ high }) => high,
  low: ({ low }) => low,
  close: ({ close }) => close,
  hl2: ({ high, low }) => (high + low) / 2,
  hlc3: ({ high, low, close }) => (high + low + close) / 3,
  ohlc4: ({ open, high, low, close }) => (open + high + low + close) / 4,
  hlcc4: ({ high, low, close }) => (high + low + close + close) / 4,
};

export const WMA_SETTINGS = {
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
        options: Object.keys(WMA_SOURCE_FUNCS),
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

export const WMA_DEFAULT_SETTINGS = {
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
 * calculate all wma based on candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of wma
 * @param {function} source callback using to calculate wma input
 * @returns {void}
 */
const mapAllWMA = (layerId, data, windowSize, source) =>
  wma()
    .options({ windowSize, source })
    .skipUndefined(false)
    .merge((d, c) => {
      d[layerId] = { wma: c };
    })(data);

/**
 * calculate wma for prepend candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of wma
 * @param {function} source callback using to calculate wma input
 * @returns {void}
 */
const mapPrependWMA = (layerId, data, windowSize, source) => {
  let stopIndex = data.findIndex((item) => item[layerId]?.wma !== undefined);
  if (stopIndex === -1) stopIndex = data.length - 1;
  const slicedData = data.slice(0, stopIndex + 1);
  mapAllWMA(layerId, slicedData, windowSize, source);
};

/**
 * calculate one wma based on candles and special index
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of wma
 * @param {function} source callback using to calculate wma input
 * @param {number} index position will be used to calculate wma
 * @returns {void}
 */
const mapOneWMA = (layerId, data, windowSize, source, index) => {
  const endIndex = index + 1;
  const startIndex = endIndex - windowSize;

  if (!data[startIndex] || !data[endIndex - 1] || !data[index]) return;
  const slicedData = data.slice(startIndex, endIndex);

  const results = wmaCalculator().options({
    windowSize,
    source,
  })(slicedData);

  data[index][layerId] = { wma: results.pop() };
};

// This procedure will mutate the input candle
export const calcWMA = (layerId, data, settings) => {
  const { length, source } = settings.input;
  if (data.length < length) return;

  const firstWMA = data[length - 1]?.[layerId]?.wma;
  const sourceFunc = WMA_SOURCE_FUNCS[source];

  if (wmaSettings.difference(layerId, settings)) {
    mapAllWMA(layerId, data, length, sourceFunc);
    wmaSettings.set(layerId, settings);
  } else if (firstWMA === undefined) {
    mapPrependWMA(layerId, data, length, sourceFunc);
  } else {
    mapOneWMA(layerId, data, length, sourceFunc, data.length - 1);
  }
};

class WMASettings {
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

const wmaSettings = new WMASettings();
