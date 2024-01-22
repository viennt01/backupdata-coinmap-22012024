import { LINE_TYPE } from '../settings/view';
import {
  rsi,
  sma,
  wma,
  vwma,
  bollingerBand,
} from '@coinmap/react-stockcharts/lib/indicator';
import {
  rsi as rsiCalculator,
  sma as smaCalculator,
  wma as wmaCalculator,
  vwma as vwmaCalculator,
  bollingerband as bollingerCalculator,
} from '@coinmap/react-stockcharts/lib/calculator';

export const RSI_SOURCE_FUNCS = {
  open: ({ open }) => open,
  high: ({ high }) => high,
  low: ({ low }) => low,
  close: ({ close }) => close,
  hl2: ({ high, low }) => (high + low) / 2,
  hlc3: ({ high, low, close }) => (high + low + close) / 3,
  ohlc4: ({ open, high, low, close }) => (open + high + low + close) / 4,
  hlcc4: ({ high, low, close }) => (high + low + close + close) / 4,
};

export const RSI_MA_TYPES = {
  SMA: 'SMA',
  BOLLINGER: 'Bollinger Bands',
  WMA: 'WMA',
  VWMA: 'VWMA',
};

export const RSI_SETTINGS = {
  input: [
    {
      type: 'section',
      name: 'Inputs',
    },
    {
      type: 'label',
      name: 'RSI Settings',
      props: {
        className: 'ms-4 my-4',
      },
    },
    {
      type: 'number',
      name: 'RSI Length',
      valueField: 'input.rsiLength',
      props: {
        min: 1,
        max: 2000,
        step: 1,
      },
    },
    {
      type: 'select',
      name: 'Source',
      valueField: 'input.rsiSource',
      props: {
        options: Object.keys(RSI_SOURCE_FUNCS),
        isSearchable: false,
      },
    },
    {
      type: 'label',
      name: 'MA Settings',
      props: {
        className: 'ms-4 my-4',
      },
    },
    {
      type: 'select',
      name: 'MA Type',
      valueField: 'input.maType',
      props: {
        options: Object.values(RSI_MA_TYPES),
        isSearchable: false,
      },
    },
    {
      type: 'number',
      name: 'MA Length',
      valueField: 'input.maLength',
      props: {
        min: 1,
        max: 2000,
        step: 1,
      },
    },
    {
      type: 'number',
      name: 'BB StdDev',
      valueField: 'input.bollingerMultiplier',
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
        name: 'RSI',
        valueField: 'style.rsi.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line',
        valueField: 'style.rsi.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.rsi.lineSize',
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
        valueField: 'style.rsi.lineColor',
        opacityField: 'style.rsi.lineOpacity',
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
        name: 'RSI-based MA',
        valueField: 'style.rsiMA.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line Type',
        valueField: 'style.rsiMA.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.rsiMA.lineSize',
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
        valueField: 'style.rsiMA.lineColor',
        opacityField: 'style.rsiMA.lineOpacity',
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
        name: 'Upper BB',
        valueField: 'style.bollingerTop.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line Type',
        valueField: 'style.bollingerTop.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.bollingerTop.lineSize',
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
        valueField: 'style.bollingerTop.lineColor',
        opacityField: 'style.bollingerTop.lineOpacity',
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
        name: 'Lower BB',
        valueField: 'style.bollingerBottom.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line Type',
        valueField: 'style.bollingerBottom.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.bollingerBottom.lineSize',
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
        valueField: 'style.bollingerBottom.lineColor',
        opacityField: 'style.bollingerBottom.lineOpacity',
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
        name: 'RSI Upper Band',
        valueField: 'style.rsiTop.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line Type',
        valueField: 'style.rsiTop.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.rsiTop.lineSize',
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
        valueField: 'style.rsiTop.lineColor',
        opacityField: 'style.rsiTop.lineOpacity',
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
      {
        type: 'number',
        name: 'Line Value',
        valueField: 'style.rsiTop.value',
        inline: true,
        showLabel: false,
        props: {
          min: -999999999,
          max: 999999999,
          step: 1,
        },
      },
    ],
    [
      {
        type: 'checkbox',
        name: 'RSI Middle Band',
        valueField: 'style.rsiMiddle.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line Type',
        valueField: 'style.rsiMiddle.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.rsiMiddle.lineSize',
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
        valueField: 'style.rsiMiddle.lineColor',
        opacityField: 'style.rsiMiddle.lineOpacity',
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
      {
        type: 'number',
        name: 'Line Value',
        valueField: 'style.rsiMiddle.value',
        inline: true,
        showLabel: false,
        props: {
          min: -999999999,
          max: 999999999,
          step: 1,
        },
      },
    ],
    [
      {
        type: 'checkbox',
        name: 'RSI Lower Band',
        valueField: 'style.rsiBottom.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line Type',
        valueField: 'style.rsiBottom.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.rsiBottom.lineSize',
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
        valueField: 'style.rsiBottom.lineColor',
        opacityField: 'style.rsiBottom.lineOpacity',
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
      {
        type: 'number',
        name: 'Line Value',
        valueField: 'style.rsiBottom.value',
        inline: true,
        showLabel: false,
        props: {
          min: -999999999,
          max: 999999999,
          step: 1,
        },
      },
    ],
    [
      {
        type: 'checkbox',
        name: 'RSI Background Fill',
        valueField: 'style.rsiBackground.fill',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'color',
        name: 'Line Color',
        valueField: 'style.rsiBackground.fillColor',
        opacityField: 'style.rsiBackground.fillOpacity',
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
        name: 'BB Background Fill',
        valueField: 'style.bollingerBackground.fill',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'color',
        name: 'Line Color',
        valueField: 'style.bollingerBackground.fillColor',
        opacityField: 'style.bollingerBackground.fillOpacity',
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
    ],
  ],
};

export const RSI_DEFAULT_SETTINGS = {
  input: {
    rsiLength: 14,
    rsiSource: 'close',
    maType: RSI_MA_TYPES.SMA,
    maLength: 14,
    bollingerMultiplier: 2,
  },
  style: {
    rsi: {
      show: true,
      lineType: LINE_TYPE.LINE,
      lineSize: 1,
      lineColor: '#a271f7',
      lineOpacity: 1,
    },
    rsiMA: {
      show: true,
      lineType: LINE_TYPE.LINE,
      lineSize: 1,
      lineColor: '#ffeb3b ',
      lineOpacity: 1,
    },
    bollingerTop: {
      show: true,
      lineType: LINE_TYPE.LINE,
      lineSize: 1,
      lineColor: '#4caf50',
      lineOpacity: 1,
    },
    bollingerBottom: {
      show: true,
      lineType: LINE_TYPE.LINE,
      lineSize: 1,
      lineColor: '#4caf50',
      lineOpacity: 1,
    },
    rsiTop: {
      show: true,
      lineType: LINE_TYPE.DASH_LINE,
      lineSize: 1,
      lineColor: '#787b86',
      lineOpacity: 1,
      value: 70,
    },
    rsiMiddle: {
      show: true,
      lineType: LINE_TYPE.DASH_LINE,
      lineSize: 1,
      lineColor: '#787b86',
      lineOpacity: 0.5,
      value: 50,
    },
    rsiBottom: {
      show: true,
      lineType: LINE_TYPE.DASH_LINE,
      lineSize: 1,
      lineColor: '#787b86',
      lineOpacity: 1,
      value: 30,
    },
    rsiBackground: {
      fill: true,
      fillColor: '#7e57c2',
      fillOpacity: 0.1,
    },
    bollingerBackground: {
      fill: true,
      fillColor: '#4caf50',
      fillOpacity: 0.1,
    },
  },
};

export const GET_RSI_YACCESSORS = (layerId) => ({
  rsi: (d) => d?.[layerId]?.rsi,
  rsiMA: (d) => d?.[layerId]?.rsiMA,
  bollingerTop: (d) => d?.[layerId]?.bollingerTop,
  bollingerBottom: (d) => d?.[layerId]?.bollingerBottom,
});

/**
 * calculate all value of indicator based on candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @param {function} source callback using to calculate source input
 * @param {string} maType tye of moving average
 * @param {function} maWindowSize window size of moving average
 * @param {number} multiplier multiplier number
 * @returns {void}
 */
const mapAllRSI = (
  layerId,
  data,
  windowSize,
  source,
  maType,
  maWindowSize,
  multiplier
) => {
  // calculate RSI data
  rsi()
    .options({ windowSize, source })
    .skipUndefined(false)
    .merge((d, c) => {
      d[layerId] = { rsi: c };
    })(data);

  // calculate MA data
  const maOptions = {
    skipInitial: windowSize - 1,
    windowSize: maWindowSize,
    source: (d) => d[layerId].rsi,
  };

  switch (maType) {
    case RSI_MA_TYPES.SMA:
      sma()
        .options(maOptions)
        .skipUndefined(false)
        .merge((d, c) => {
          d[layerId].rsiMA = c;
        })(data);
      break;
    case RSI_MA_TYPES.BOLLINGER:
      bollingerBand()
        .options({
          ...maOptions,
          multiplier,
        })
        .skipUndefined(false)
        .merge((d, c) => {
          d[layerId].rsiMA = c?.middle;
          d[layerId].bollingerTop = c?.top;
          d[layerId].bollingerBottom = c?.bottom;
        })(data);
      break;
    case RSI_MA_TYPES.WMA:
      wma()
        .options(maOptions)
        .skipUndefined(false)
        .merge((d, c) => {
          d[layerId].rsiMA = c;
        })(data);
      break;
    case RSI_MA_TYPES.VWMA:
      vwma()
        .options(maOptions)
        .skipUndefined(false)
        .merge((d, c) => {
          d[layerId].rsiMA = c;
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
 * @param {function} source callback using to calculate source input
 * @param {string} maType tye of moving average
 * @param {function} maWindowSize window size of moving average
 * @param {number} multiplier multiplier number
 * @returns {void}
 */
const mapPrependRSI = (
  layerId,
  data,
  windowSize,
  source,
  maType,
  maWindowSize,
  multiplier
) => {
  let stopIndex = data.findIndex((item) => item[layerId]?.rsi !== undefined);
  if (stopIndex === -1) stopIndex = data.length - 1;
  const slicedData = data.slice(0, stopIndex + maWindowSize + 1);
  mapAllRSI(
    layerId,
    slicedData,
    windowSize,
    source,
    maType,
    maWindowSize,
    multiplier
  );
};

/**
 * calculate one value of indicator based on candles and special index
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @param {function} source callback using to calculate source input
 * @param {string} maType tye of moving average
 * @param {function} maWindowSize window size of moving average
 * @param {number} multiplier multiplier number
 * @param {number} index position will be used to calculate value of indicator
 * @returns {void}
 */
const mapOneRSI = (
  layerId,
  data,
  windowSize,
  source,
  maType,
  maWindowSize,
  multiplier,
  index
) => {
  // calculate RSI data
  const endIndex = index + 1;
  const startIndex = endIndex - windowSize;

  if (!data[startIndex] || !data[endIndex - 1]) return;
  const rsiWindowData = data.slice(0, endIndex);

  const rsiData = rsiCalculator().options({
    windowSize,
    source,
  })(rsiWindowData);

  data[index][layerId] = {
    rsi: rsiData.pop(),
  };

  // calculate MA data
  const maEndIndex = index + 1;
  const maStartIndex = maEndIndex - maWindowSize;

  if (!data[maStartIndex] || !data[maEndIndex - 1]) return;
  const maWindowData = data.slice(maStartIndex, maEndIndex);
  const maOptions = {
    windowSize: maWindowSize,
    source: (d) => d[layerId].rsi,
  };

  switch (maType) {
    case RSI_MA_TYPES.SMA: {
      const maData = smaCalculator().options(maOptions)(maWindowData);
      data[index][layerId].rsiMA = maData.pop();
      break;
    }
    case RSI_MA_TYPES.BOLLINGER: {
      const maData = bollingerCalculator().options({
        ...maOptions,
        multiplier,
      })(maWindowData);
      const result = maData.pop();
      data[index][layerId].rsiMA = result?.middle;
      data[index][layerId].bollingerTop = result?.top;
      data[index][layerId].bollingerBottom = result?.bottom;
      break;
    }
    case RSI_MA_TYPES.WMA: {
      const maData = wmaCalculator().options(maOptions)(maWindowData);
      data[index][layerId].rsiMA = maData.pop();
      break;
    }
    case RSI_MA_TYPES.VWMA: {
      const maData = vwmaCalculator().options(maOptions)(maWindowData);
      data[index][layerId].rsiMA = maData.pop();
      break;
    }
    default:
      break;
  }
};

// This procedure will mutate the input candles
export const calcRSI = (layerId, data, settings) => {
  const { rsiLength, rsiSource } = settings.input;
  const { maType, maLength, bollingerMultiplier } = settings.input;
  if (data.length < rsiLength) return;

  const firstRSI = data[rsiLength]?.[layerId]?.rsi;
  const sourceFunc = RSI_SOURCE_FUNCS[rsiSource];
  const sharedProps = [
    layerId,
    data,
    rsiLength,
    sourceFunc,
    maType,
    maLength,
    bollingerMultiplier,
  ];

  if (rsiSettings.difference(layerId, settings)) {
    mapAllRSI(...sharedProps);
    rsiSettings.set(layerId, settings);
  }
  if (firstRSI === undefined) {
    mapPrependRSI(...sharedProps);
  } else {
    mapOneRSI(...sharedProps, data.length - 1);
  }
};

class RSISettings {
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

const rsiSettings = new RSISettings();
