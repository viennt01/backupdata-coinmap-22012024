import { LINE_TYPE } from '../settings/view';
import { dmi } from '@coinmap/react-stockcharts/lib/indicator';

export const DMI_SETTINGS = {
  input: [
    {
      type: 'section',
      name: 'Inputs',
    },
    {
      type: 'number',
      name: 'ADX Smoothing',
      valueField: 'input.adxLength',
      props: {
        min: 1,
        max: 2000,
        step: 1,
      },
    },
    {
      type: 'number',
      name: 'DI Length',
      valueField: 'input.diLength',
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
        name: 'ADX',
        valueField: 'style.adx.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line',
        valueField: 'style.adx.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.adx.lineSize',
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
        valueField: 'style.adx.lineColor',
        opacityField: 'style.adx.lineOpacity',
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
        name: '+DI',
        valueField: 'style.diP.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line',
        valueField: 'style.diP.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.diP.lineSize',
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
        valueField: 'style.diP.lineColor',
        opacityField: 'style.diP.lineOpacity',
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
        name: '-DI',
        valueField: 'style.diM.show',
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line',
        valueField: 'style.diM.lineType',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line Size',
        valueField: 'style.diM.lineSize',
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
        valueField: 'style.diM.lineColor',
        opacityField: 'style.diM.lineOpacity',
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
    ],
  ],
};

export const DMI_DEFAULT_SETTINGS = {
  input: {
    adxLength: 14,
    diLength: 14,
  },
  style: {
    adx: {
      show: true,
      lineType: LINE_TYPE.LINE,
      lineSize: 1,
      lineColor: '#F50057',
      lineOpacity: 1,
    },
    diP: {
      show: true,
      lineType: LINE_TYPE.LINE,
      lineSize: 1,
      lineColor: '#2196F3',
      lineOpacity: 1,
    },
    diM: {
      show: true,
      lineType: LINE_TYPE.LINE,
      lineSize: 1,
      lineColor: '#FF6D00',
      lineOpacity: 1,
    },
  },
};

export const GET_DMI_YACCESSORS = (layerId) => ({
  adx: (d) => d?.[layerId]?.adx,
  diP: (d) => d?.[layerId]?.diP,
  diM: (d) => d?.[layerId]?.diM,
});

/**
 * calculate all value of indicator based on candles data
 * @param {string} layerId id of layer
 * @param {object[]} data candles data
 * @param {number} windowSize length of indicator window
 * @returns {void}
 */
const mapAllDMI = (layerId, data, windowSize, diWindowSize) => {
  dmi()
    .options({ windowSize, diWindowSize })
    .skipUndefined(false)
    .merge((d, c) => {
      d[layerId] = { ...c };
    })(data);
};

// This procedure will mutate the input candles
export const calcDMI = (layerId, data, settings) => {
  const { adxLength, diLength } = settings.input;
  if (data.length < adxLength) return;

  const sharedProps = [layerId, data, adxLength, diLength];
  mapAllDMI(...sharedProps);
};
