import { LINE_TYPE } from '../settings/view';
import { hpr } from '@coinmap/react-stockcharts/lib/indicator';
import { hpr as hprCalculator } from '@coinmap/react-stockcharts/lib/calculator';

export const HPR_SOURCE_FUNCS = {
  open: ({ open }) => open,
  high: ({ high }) => high,
  low: ({ low }) => low,
  close: ({ close }) => close,
  hl2: ({ high, low }) => (high + low) / 2,
  hlc3: ({ high, low, close }) => (high + low + close) / 3,
  ohlc4: ({ open, high, low, close }) => (open + high + low + close) / 4,
  hlcc4: ({ high, low, close }) => (high + low + close + close) / 4,
};

export const HPR_SETTINGS = {
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
        min: 2,
        max: 2000,
        step: 1,
      },
    },
    {
      type: 'select',
      name: 'Source',
      valueField: 'input.source',
      props: {
        options: Object.keys(HPR_SOURCE_FUNCS),
        isSearchable: false,
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
        name: 'HPR',
        valueField: 'style.hpr.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line',
        valueField: 'style.hpr.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.hpr.lineSize',
        inline: true,
        showLabel: false,
        props: {
          min: 1,
          max: 10,
        },
      },
      {
        type: 'color',
        name: 'Line Color',
        valueField: 'style.hpr.lineColor',
        opacityField: 'style.hpr.lineOpacity',
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
    ],
  ],
};

export const HPR_DEFAULT_SETTINGS = {
  input: {
    length: 14,
    source: 'close',
  },
  style: {
    hpr: {
      show: true,
      lineType: LINE_TYPE.LINE,
      lineSize: 1,
      lineColor: '#a271f7',
      lineOpacity: 1,
    },
  },
};

export const GET_HPR_YACCESSORS = (layerId) => ({
  hpr: (d) => d?.[layerId]?.hpr,
});

/**
 * calculate all value of indicator based on candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @param {function} source callback using to calculate source input
 * @returns {void}
 */
const mapAllHPR = (layerId, data, windowSize, source) => {
  hpr()
    .options({ windowSize, source })
    .skipUndefined(false)
    .merge((d, c) => {
      d[layerId] = { hpr: c };
    })(data);
};

/**
 * calculate value of indicator for prepend candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @param {function} source callback using to calculate source input
 * @returns {void}
 */
const mapPrependHPR = (layerId, data, windowSize, source) => {
  let stopIndex = data.findIndex((item) => item[layerId]?.hpr !== undefined);
  if (stopIndex === -1) stopIndex = data.length - 1;
  const slicedData = data.slice(0, stopIndex + 1);
  mapAllHPR(layerId, slicedData, windowSize, source);
};

/**
 * calculate one value of indicator based on candles and special index
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @param {function} source callback using to calculate source input
 * @param {number} index position will be used to calculate value of indicator
 * @returns {void}
 */
const mapOneHPR = (layerId, data, windowSize, source, index) => {
  const endIndex = index + 1;
  const startIndex = endIndex - windowSize - 1;

  if (!data[startIndex] || !data[endIndex - 1]) return;
  const windowData = data.slice(startIndex, endIndex);

  const hprData = hprCalculator().options({
    windowSize,
    source,
  })(windowData);

  data[index][layerId] = {
    hpr: hprData.pop(),
  };
};

// This procedure will mutate the input candles
export const calcHPR = (layerId, data, settings) => {
  const { length, source } = settings.input;
  if (data.length < length) return;

  const firstHPR = data[length + 1]?.[layerId]?.hpr;
  const sourceFunc = HPR_SOURCE_FUNCS[source];
  const sharedProps = [layerId, data, length, sourceFunc];

  if (hprSettings.difference(layerId, settings)) {
    mapAllHPR(...sharedProps);
    hprSettings.set(layerId, settings);
  } else if (firstHPR === undefined) {
    mapPrependHPR(...sharedProps);
  } else {
    mapOneHPR(...sharedProps, data.length - 1);
  }
};

class HPRSettings {
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

const hprSettings = new HPRSettings();
