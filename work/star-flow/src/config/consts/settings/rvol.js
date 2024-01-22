import { LINE_TYPE } from '../settings/view';
import { rvol } from '@coinmap/react-stockcharts/lib/indicator';
import { rvol as rvolCalculator } from '@coinmap/react-stockcharts/lib/calculator';

export const RVOL_SETTINGS = {
  input: [
    {
      type: 'section',
      name: 'Inputs',
    },
    {
      type: 'number',
      name: 'Length',
      valueField: 'input.rvolLength',
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
        name: 'RVol',
        valueField: 'style.rvol.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line',
        valueField: 'style.rvol.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.rvol.lineSize',
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
        valueField: 'style.rvol.lineColor',
        opacityField: 'style.rvol.lineOpacity',
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
    ],
  ],
};

export const RVOL_DEFAULT_SETTINGS = {
  input: {
    rvolLength: 14,
  },
  style: {
    rvol: {
      show: true,
      lineType: LINE_TYPE.LINE,
      lineSize: 1,
      lineColor: '#E62525',
      lineOpacity: 1,
    },
  },
};

export const GET_RVOL_YACCESSORS = (layerId) => ({
  rvol: (d) => d?.[layerId]?.rvol,
});

/**
 * calculate all value of indicator based on candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @returns {void}
 */
const mapAllRVOL = (layerId, data, windowSize) => {
  rvol()
    .options({ windowSize })
    .skipUndefined(false)
    .merge((d, c) => {
      d[layerId] = { rvol: c };
    })(data);
};

/**
 * calculate value of indicator for prepend candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @returns {void}
 */
const mapPrependRVOL = (layerId, data, windowSize) => {
  let stopIndex = data.findIndex((item) => item[layerId]?.rvol !== undefined);
  if (stopIndex === -1) stopIndex = data.length - 1;
  const slicedData = data.slice(0, stopIndex + windowSize + 1);
  mapAllRVOL(layerId, slicedData, windowSize);
};

/**
 * calculate one value of indicator based on candles and special index
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @param {number} index position will be used to calculate value of indicator
 * @returns {void}
 */
const mapOneRVOL = (layerId, data, windowSize, index) => {
  const endIndex = index + 1;
  const startIndex = endIndex - windowSize;

  if (!data[startIndex] || !data[endIndex - 1]) return;
  const slicedData = data.slice(0, endIndex);

  const results = rvolCalculator().options({
    windowSize,
  })(slicedData);

  data[index][layerId] = {
    rvol: results.pop(),
  };
};

// This procedure will mutate the input candles
export const calcRVOL = (layerId, data, settings) => {
  const { rvolLength } = settings.input;
  if (data.length < rvolLength) return;

  const firstRVOL = data[rvolLength]?.[layerId]?.rvol;
  const sharedProps = [layerId, data, rvolLength];

  if (rvolSettings.difference(layerId, settings)) {
    mapAllRVOL(...sharedProps);
    rvolSettings.set(layerId, settings);
  }
  if (firstRVOL === undefined) {
    mapPrependRVOL(...sharedProps);
  } else {
    mapOneRVOL(...sharedProps, data.length - 1);
  }
};

class RVOLSettings {
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

const rvolSettings = new RVOLSettings();
