import { LINE_TYPE } from '../settings/view';
import { bollingerBand } from '@coinmap/react-stockcharts/lib/indicator';
import { bollingerband as bollingerCalculator } from '@coinmap/react-stockcharts/lib/calculator';

export const BOLLINGER_SOURCE_FUNCS = {
  open: ({ open }) => open,
  high: ({ high }) => high,
  low: ({ low }) => low,
  close: ({ close }) => close,
  hl2: ({ high, low }) => (high + low) / 2,
  hlc3: ({ high, low, close }) => (high + low + close) / 3,
  ohlc4: ({ open, high, low, close }) => (open + high + low + close) / 4,
  hlcc4: ({ high, low, close }) => (high + low + close + close) / 4,
};

export const BOLLINGER_SETTINGS = {
  input: [
    {
      type: 'section',
      name: 'Inputs',
    },
    {
      type: 'number',
      name: 'Length',
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
        options: Object.keys(BOLLINGER_SOURCE_FUNCS),
        isSearchable: false,
      },
    },
    {
      type: 'number',
      name: 'StdDev',
      valueField: 'input.multiplier',
      props: {
        min: 0.001,
        max: 50,
        step: 1,
      },
    },
    {
      type: 'number',
      name: 'Offset',
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
        type: 'checkbox',
        name: 'Basis',
        valueField: 'style.middle.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line',
        valueField: 'style.middle.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line size',
        valueField: 'style.middle.lineSize',
        inline: true,
        showLabel: false,
        props: {
          min: 1,
          max: 10,
        },
      },
      {
        type: 'color',
        name: 'Line color',
        valueField: 'style.middle.lineColor',
        opacityField: 'style.middle.lineOpacity',
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
    ],
    [
      {
        type: 'checkbox',
        name: 'Upper',
        valueField: 'style.top.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line type',
        valueField: 'style.top.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line size',
        valueField: 'style.top.lineSize',
        inline: true,
        showLabel: false,
        props: {
          min: 1,
          max: 10,
        },
      },
      {
        type: 'color',
        name: 'Line color',
        valueField: 'style.top.lineColor',
        opacityField: 'style.top.lineOpacity',
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
    ],
    [
      {
        type: 'checkbox',
        name: 'Lower',
        valueField: 'style.bottom.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line type',
        valueField: 'style.bottom.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line size',
        valueField: 'style.bottom.lineSize',
        inline: true,
        showLabel: false,
        props: {
          min: 1,
          max: 10,
        },
      },
      {
        type: 'color',
        name: 'Line color',
        valueField: 'style.bottom.lineColor',
        opacityField: 'style.bottom.lineOpacity',
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
    ],
    [
      {
        type: 'checkbox',
        name: 'Background',
        valueField: 'style.background.fill',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'color',
        name: 'Line color',
        valueField: 'style.background.fillColor',
        opacityField: 'style.background.fillOpacity',
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
    ],
  ],
};

export const BOLLINGER_DEFAULT_SETTINGS = {
  input: {
    source: 'close',
    length: 20,
    multiplier: 2,
    offset: 0,
  },
  style: {
    middle: {
      show: true,
      lineType: LINE_TYPE.LINE,
      lineSize: 1,
      lineColor: '#ff6d00',
      lineOpacity: 1,
    },
    top: {
      show: true,
      lineType: LINE_TYPE.LINE,
      lineSize: 1,
      lineColor: '#2196F3',
      lineOpacity: 1,
    },
    bottom: {
      show: true,
      lineType: LINE_TYPE.LINE,
      lineSize: 1,
      lineColor: '#2196F3',
      lineOpacity: 1,
    },
    background: {
      fill: true,
      fillColor: '#2196F3',
      fillOpacity: 0.05,
    },
  },
};

export const GET_BOLLINGER_YACCESSORS = (layerId) => ({
  middle: (d) => d?.[layerId]?.middle,
  top: (d) => d?.[layerId]?.top,
  bottom: (d) => d?.[layerId]?.bottom,
});

/**
 * calculate all value of indicator based on candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @param {function} source callback using to calculate source input
 * @param {number} multiplier multiplier number
 * @returns {void}
 */
const mapAllBollinger = (layerId, data, windowSize, source, multiplier) =>
  bollingerBand()
    .options({ windowSize, source, multiplier })
    .skipUndefined(false)
    .merge((d, c) => {
      d[layerId] = { ...c };
    })(data);

/**
 * calculate value of indicator for prepend candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @param {function} source callback using to calculate source input
 * @param {number} multiplier multiplier number
 * @returns {void}
 */
const mapPrependBollinger = (layerId, data, windowSize, source, multiplier) => {
  let stopIndex = data.findIndex((item) => item[layerId]?.middle !== undefined);
  if (stopIndex === -1) stopIndex = data.length - 1;
  const slicedData = data.slice(0, stopIndex + 1);
  mapAllBollinger(layerId, slicedData, windowSize, source, multiplier);
};

/**
 * calculate one value of indicator based on candles and special index
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @param {function} source callback using to calculate source input
 * @param {number} multiplier multiplier number
 * @param {number} index position will be used to calculate value of indicator
 * @returns {void}
 */
const mapOneBollinger = (
  layerId,
  data,
  windowSize,
  source,
  multiplier,
  index
) => {
  const endIndex = index + 1;
  const startIndex = endIndex - windowSize;

  if (!data[startIndex] || !data[endIndex - 1] || !data[index]) return;
  const slicedData = data.slice(startIndex, endIndex);

  const results = bollingerCalculator().options({
    windowSize,
    source,
    multiplier,
  })(slicedData);

  data[index][layerId] = {
    ...results.pop(),
  };
};

// This procedure will mutate the input candles
export const calcBollinger = (layerId, data, settings) => {
  const { length, source, multiplier } = settings.input;
  if (data.length < length) return;

  const firstBollinger = data[length - 1]?.[layerId]?.middle;
  const sourceFunc = BOLLINGER_SOURCE_FUNCS[source];

  if (bollingerSettings.difference(layerId, settings)) {
    mapAllBollinger(layerId, data, length, sourceFunc, multiplier);
    bollingerSettings.set(layerId, settings);
  } else if (firstBollinger === undefined) {
    mapPrependBollinger(layerId, data, length, sourceFunc, multiplier);
  } else {
    mapOneBollinger(
      layerId,
      data,
      length,
      sourceFunc,
      multiplier,
      data.length - 1
    );
  }
};

class BollingerSettings {
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

const bollingerSettings = new BollingerSettings();
