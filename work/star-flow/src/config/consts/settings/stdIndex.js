import { LINE_TYPE } from '../settings/view';
import { stdIndex } from '@coinmap/react-stockcharts/lib/indicator';
import { stdIndex as stdIndexCalculator } from '@coinmap/react-stockcharts/lib/calculator';

export const STD_INDEX_SOURCE_FUNCS = {
  open: ({ open }) => open,
  high: ({ high }) => high,
  low: ({ low }) => low,
  close: ({ close }) => close,
  hl2: ({ high, low }) => (high + low) / 2,
  hlc3: ({ high, low, close }) => (high + low + close) / 3,
  ohlc4: ({ open, high, low, close }) => (open + high + low + close) / 4,
  hlcc4: ({ high, low, close }) => (high + low + close + close) / 4,
};

export const STD_INDEX_SETTINGS = {
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
        options: Object.keys(STD_INDEX_SOURCE_FUNCS),
        isSearchable: false,
      },
    },
    {
      type: 'number',
      name: 'Multiplier',
      valueField: 'input.multiplier',
      props: {
        min: 0.001,
        max: 50,
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
        name: 'STD Index',
        valueField: 'style.stdIndex.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line',
        valueField: 'style.stdIndex.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.stdIndex.lineSize',
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
        valueField: 'style.stdIndex.lineColor',
        opacityField: 'style.stdIndex.lineOpacity',
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
        name: 'Buy/Sell Level',
        valueField: 'style.buySellLevel.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line Type',
        valueField: 'style.buySellLevel.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.buySellLevel.lineSize',
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
        valueField: 'style.buySellLevel.lineColor',
        opacityField: 'style.buySellLevel.lineOpacity',
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
      {
        type: 'number',
        name: 'Line Value',
        valueField: 'style.buySellLevel.value',
        inline: true,
        showLabel: false,
        props: {
          min: -999999999,
          max: 999999999,
          step: 1,
        },
      },
    ],
  ],
};

export const STD_INDEX_DEFAULT_SETTINGS = {
  input: {
    length: 20,
    source: 'close',
    multiplier: 2,
  },
  style: {
    stdIndex: {
      show: true,
      lineType: LINE_TYPE.LINE,
      lineSize: 1,
      lineColor: '#ff6d00',
      lineOpacity: 1,
    },
    buySellLevel: {
      show: true,
      lineType: LINE_TYPE.DASH_LINE,
      lineSize: 1,
      lineColor: '#787b86',
      lineOpacity: 0.5,
      value: 15,
    },
  },
};

export const GET_STD_INDEX_YACCESSORS = (layerId) => ({
  stdIndex: (d) => d?.[layerId]?.stdIndex,
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
const mapAllSTDIndex = (layerId, data, windowSize, source, multiplier) =>
  stdIndex()
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
const mapPrependSTDIndex = (layerId, data, windowSize, source, multiplier) => {
  let stopIndex = data.findIndex(
    (item) => item[layerId]?.stdIndex !== undefined
  );
  if (stopIndex === -1) {
    stopIndex = data.length - 1;
  } else {
    stopIndex += windowSize;
  }
  const slicedData = data.slice(0, stopIndex + 1);
  mapAllSTDIndex(layerId, slicedData, windowSize, source, multiplier);
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
const mapOneSTDIndex = (
  layerId,
  data,
  windowSize,
  source,
  multiplier,
  index
) => {
  const endIndex = index + 1;
  const startIndex = endIndex - windowSize - windowSize - 1;

  if (!data[startIndex] || !data[endIndex - 1] || !data[index]) return;
  const slicedData = data.slice(startIndex, endIndex);

  const results = stdIndexCalculator().options({
    windowSize,
    source,
    multiplier,
  })(slicedData);

  data[index][layerId] = {
    ...results.pop(),
  };
};

// This procedure will mutate the input candles
export const calcSTDIndex = (layerId, data, settings) => {
  const { length, source, multiplier } = settings.input;
  if (data.length < length) return;

  const firstStdIndex = data[length + length - 1]?.[layerId]?.stdIndex;
  const sourceFunc = STD_INDEX_SOURCE_FUNCS[source];

  if (stdIndexSettings.difference(layerId, settings)) {
    mapAllSTDIndex(layerId, data, length, sourceFunc, multiplier);
    stdIndexSettings.set(layerId, settings);
  } else if (firstStdIndex === undefined) {
    mapPrependSTDIndex(layerId, data, length, sourceFunc, multiplier);
  } else {
    mapOneSTDIndex(
      layerId,
      data,
      length,
      sourceFunc,
      multiplier,
      data.length - 1
    );
  }
};

class STDIndexSettings {
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

const stdIndexSettings = new STDIndexSettings();
