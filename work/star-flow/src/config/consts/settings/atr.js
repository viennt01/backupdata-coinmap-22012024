import { LINE_TYPE } from '../settings/view';
import { atr, sma, wma } from '@coinmap/react-stockcharts/lib/indicator';
import {
  atr as atrCalculator,
  sma as smaCalculator,
  wma as wmaCalculator,
} from '@coinmap/react-stockcharts/lib/calculator';

export const ATR_MA_TYPES = {
  NONE: 'NONE',
  SMA: 'SMA',
  WMA: 'WMA',
};

export const ATR_SETTINGS = {
  input: [
    {
      type: 'section',
      name: 'Inputs',
    },
    {
      type: 'number',
      name: 'Length',
      valueField: 'input.atrLength',
      props: {
        min: 1,
        max: 2000,
        step: 1,
      },
    },
    {
      type: 'select',
      name: 'Smoothing',
      valueField: 'input.maType',
      props: {
        options: Object.values(ATR_MA_TYPES),
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
        name: 'ATR',
        valueField: 'style.atr.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line',
        valueField: 'style.atr.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.atr.lineSize',
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
        valueField: 'style.atr.lineColor',
        opacityField: 'style.atr.lineOpacity',
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
    ],
  ],
};

export const ATR_DEFAULT_SETTINGS = {
  input: {
    atrLength: 14,
    maType: ATR_MA_TYPES.NONE,
  },
  style: {
    atr: {
      show: true,
      lineType: LINE_TYPE.LINE,
      lineSize: 1,
      lineColor: '#E62525',
      lineOpacity: 1,
    },
  },
};

export const GET_ATR_YACCESSORS = (layerId, maType) => ({
  atr:
    maType === ATR_MA_TYPES.NONE
      ? (d) => d?.[layerId]?.atr
      : (d) => d?.[layerId]?.atrMA,
});

/**
 * calculate all value of indicator based on candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @param {string} maType tye of moving average
 * @returns {void}
 */
const mapAllATR = (layerId, data, windowSize, maType) => {
  // calculate ATR data
  atr()
    .options({ windowSize })
    .skipUndefined(false)
    .merge((d, c) => {
      d[layerId] = { atr: c };
    })(data);

  // calculate MA data
  const maOptions = {
    skipInitial: windowSize - 1,
    windowSize,
    source: (d) => d[layerId].atr,
  };

  switch (maType) {
    case ATR_MA_TYPES.SMA:
      sma()
        .options(maOptions)
        .skipUndefined(false)
        .merge((d, c) => {
          d[layerId].atrMA = c;
        })(data);
      break;
    case ATR_MA_TYPES.WMA:
      wma()
        .options(maOptions)
        .skipUndefined(false)
        .merge((d, c) => {
          d[layerId].atrMA = c;
        })(data);
      break;
    default:
      break;
  }
};

/**
 * calculate value of indicator for prepend candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @param {string} maType tye of moving average
 * @returns {void}
 */
const mapPrependATR = (layerId, data, windowSize, maType) => {
  let stopIndex = data.findIndex((item) => item[layerId]?.atr !== undefined);
  if (stopIndex === -1) stopIndex = data.length - 1;
  const slicedData = data.slice(0, stopIndex + windowSize + 1);
  mapAllATR(layerId, slicedData, windowSize, maType);
};

/**
 * calculate one value of indicator based on candles and special index
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @param {string} maType tye of moving average
 * @param {number} index position will be used to calculate value of indicator
 * @returns {void}
 */
const mapOneATR = (layerId, data, windowSize, maType, index) => {
  // calculate atr data
  const endIndex = index + 1;
  const startIndex = endIndex - windowSize;

  if (!data[startIndex] || !data[endIndex - 1]) return;
  const atrWindowData = data.slice(0, endIndex);

  const atrData = atrCalculator().options({
    windowSize,
  })(atrWindowData);

  data[index][layerId] = {
    atr: atrData.pop(),
  };

  // calculate MA data
  const maEndIndex = index + 1;
  const maStartIndex = maEndIndex - windowSize;

  if (!data[maStartIndex] || !data[maEndIndex - 1]) return;
  const maWindowData = data.slice(maStartIndex, maEndIndex);
  const maOptions = {
    windowSize,
    source: (d) => d[layerId].atr,
  };

  switch (maType) {
    case ATR_MA_TYPES.SMA: {
      const maData = smaCalculator().options(maOptions)(maWindowData);
      data[index][layerId].atrMA = maData.pop();
      break;
    }
    case ATR_MA_TYPES.WMA: {
      const maData = wmaCalculator().options(maOptions)(maWindowData);
      data[index][layerId].atrMA = maData.pop();
      break;
    }
    default:
      break;
  }
};

// This procedure will mutate the input candles
export const calcATR = (layerId, data, settings) => {
  const { atrLength } = settings.input;
  const { maType } = settings.input;
  if (data.length < atrLength) return;

  const firstATR = data[atrLength]?.[layerId]?.atr;
  const sharedProps = [layerId, data, atrLength, maType];

  if (atrSettings.difference(layerId, settings)) {
    mapAllATR(...sharedProps);
    atrSettings.set(layerId, settings);
  }
  if (firstATR === undefined) {
    mapPrependATR(...sharedProps);
  } else {
    mapOneATR(...sharedProps, data.length - 1);
  }
};

class ATRSettings {
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

const atrSettings = new ATRSettings();
