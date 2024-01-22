import { LINE_TYPE } from '../settings/view';
import { donchian } from '@coinmap/react-stockcharts/lib/indicator';
import { donchian as donchianCalculator } from '@coinmap/react-stockcharts/lib/calculator';

export const DONCHIAN_SETTINGS = {
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

export const DONCHIAN_DEFAULT_SETTINGS = {
  input: {
    length: 20,
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

export const GET_DONCHIAN_YACCESSORS = (layerId) => ({
  middle: (d) => d?.[layerId]?.middle,
  top: (d) => d?.[layerId]?.top,
  bottom: (d) => d?.[layerId]?.bottom,
});

/**
 * calculate all value of indicator based on candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @returns {void}
 */
const mapAllDonchian = (layerId, data, windowSize) =>
  donchian()
    .options({ windowSize })
    .skipUndefined(false)
    .merge((d, c) => {
      d[layerId] = { ...c };
    })(data);

/**
 * calculate value of indicator for prepend candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @returns {void}
 */
const mapPrependDonchian = (layerId, data, windowSize) => {
  let stopIndex = data.findIndex((item) => item[layerId]?.middle !== undefined);
  if (stopIndex === -1) stopIndex = data.length - 1;
  const slicedData = data.slice(0, stopIndex + 1);
  mapAllDonchian(layerId, slicedData, windowSize);
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
const mapOneDonchian = (layerId, data, windowSize, index) => {
  const endIndex = index + 1;
  const startIndex = endIndex - windowSize;

  if (!data[startIndex] || !data[endIndex - 1] || !data[index]) return;
  const slicedData = data.slice(startIndex, endIndex);

  const results = donchianCalculator().options({
    windowSize,
  })(slicedData);

  data[index][layerId] = {
    ...results.pop(),
  };
};

// This procedure will mutate the input candles
export const calcDonchian = (layerId, data, settings) => {
  const { length } = settings.input;
  if (data.length < length) return;

  const firstDonchian = data[length - 1]?.[layerId]?.middle;

  if (donchianSettings.difference(layerId, settings)) {
    mapAllDonchian(layerId, data, length);
    donchianSettings.set(layerId, settings);
  } else if (firstDonchian === undefined) {
    mapPrependDonchian(layerId, data, length);
  } else {
    mapOneDonchian(layerId, data, length, data.length - 1);
  }
};

class DonchianSettings {
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

const donchianSettings = new DonchianSettings();
