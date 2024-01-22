import { LINE_TYPE } from '../settings/view';
import { atrChandelier } from '@coinmap/react-stockcharts/lib/indicator';

export const CE_SETTINGS = {
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
        type: 'line',
        name: 'Line',
        valueField: 'style.lineType',
        inline: true,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.lineSize',
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
        valueField: 'style.lineColor',
        opacityField: 'style.lineOpacity',
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
    ],
  ],
};

export const CE_DEFAULT_SETTINGS = {
  input: {
    length: 10,
    multiplier: 2,
  },
  style: {
    lineType: LINE_TYPE.LINE,
    lineSize: 1,
    lineColor: '#2196F3',
    lineOpacity: 1,
  },
};

export const GET_CE_YACCESSORS = (layerId) => ({
  ce: (d) => d?.[layerId]?.ce,
});

/**
 * calculate all value of indicator based on candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @param {number} multiplier multiplier number
 * @returns {void}
 */
const mapAllCE = (layerId, data, windowSize, multiplier) => {
  atrChandelier()
    .options({ windowSize, multiplier })
    .skipUndefined(false)
    .merge((d, c) => {
      d[layerId] = { ce: c };
    })(data);
};

// This procedure will mutate the input candles
export const calcCE = (layerId, data, settings) => {
  const { length, multiplier } = settings.input;
  if (data.length < length) return;

  const sharedProps = [layerId, data, length, multiplier];

  mapAllCE(...sharedProps);
};
