import { LINE_TYPE } from '../settings/view';
import { VOLUME_SESSION_PERIODS } from '@/config/consts/volume';

const PERIOD_OPTIONS = Object.keys(VOLUME_SESSION_PERIODS);
const ORIENT_OPTIONS = [
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
];
const DATA_TYPE_OPTIONS = [
  { label: 'Volume', value: 'volume' },
  { label: 'Buy/Sell Volume', value: 'buysell' },
];

const LABEL_WIDTH = '176px';
const CONTENT_WIDTH = '237px';

export const VOLUME_SESSION_SETTINGS = {
  input: [
    {
      type: 'select',
      name: 'Histogram orient',
      valueField: 'orient',
      labelWidth: LABEL_WIDTH,
      props: {
        options: ORIENT_OPTIONS,
        isSearchable: false,
        width: CONTENT_WIDTH,
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'select',
      name: 'Period',
      valueField: 'period',
      labelWidth: LABEL_WIDTH,
      isDisabled: true,
      props: {
        options: PERIOD_OPTIONS,
        isSearchable: false,
        width: CONTENT_WIDTH,
      },
    },
    {
      type: 'select',
      name: 'Data type',
      valueField: 'dataType',
      labelWidth: LABEL_WIDTH,
      props: {
        options: DATA_TYPE_OPTIONS,
        isSearchable: false,
        width: CONTENT_WIDTH,
      },
    },
    {
      type: 'range',
      name: 'Width',
      valueField: 'widthOfHistogram',
      labelWidth: LABEL_WIDTH,
      props: {
        min: 0,
        max: 100,
        step: 1,
        width: CONTENT_WIDTH,
        suffix: '%',
      },
    },
    {
      type: 'range',
      name: 'VA Height',
      valueField: 'valueAreaPercent',
      labelWidth: LABEL_WIDTH,
      props: {
        min: 0,
        max: 100,
        step: 0.1,
        width: CONTENT_WIDTH,
        suffix: '%',
      },
    },
    [
      {
        type: 'color',
        name: 'Volume color',
        valueField: 'vpBidColor',
        opacityField: 'vpBidOpacity',
        labelWidth: LABEL_WIDTH,
        inline: true,
        props: {
          label: 'Buy',
          width: '121px',
        },
      },
      {
        type: 'color',
        name: 'Volume color',
        valueField: 'vpAskColor',
        opacityField: 'vpAskOpacity',
        inline: true,
        showLabel: false,
        props: {
          label: 'Sell',
          width: '121px',
        },
      },
    ],
    {
      type: 'color',
      name: 'Histogram box',
      valueField: 'vpBackground',
      opacityField: 'vpBackgroundOpacity',
      labelWidth: LABEL_WIDTH,
      props: {
        label: '',
      },
    },
    {
      type: 'divider',
    },
  ],
  style: [
    [
      {
        type: 'checkbox',
        name: 'Show POC',
        valueField: 'poc.display',
        labelWidth: LABEL_WIDTH,
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line',
        valueField: 'poc.type',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line size',
        valueField: 'poc.width',
        inline: true,
        showLabel: false,
        props: {
          min: 1,
          max: 4,
          width: '50px',
        },
      },
      {
        type: 'color',
        name: 'Line color',
        valueField: 'poc.color',
        opacityField: 'poc.opacity',
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
        name: 'Show Developing VAH',
        valueField: 'developingVAH.display',
        labelWidth: LABEL_WIDTH,
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line',
        valueField: 'developingVAH.type',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line size',
        valueField: 'developingVAH.width',
        inline: true,
        showLabel: false,
        props: {
          min: 1,
          max: 4,
          width: '50px',
        },
      },
      {
        type: 'color',
        name: 'Line color',
        valueField: 'developingVAH.color',
        opacityField: 'developingVAH.opacity',
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
        name: 'Show Developing VAL',
        valueField: 'developingVAL.display',
        labelWidth: LABEL_WIDTH,
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line',
        valueField: 'developingVAL.type',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line size',
        valueField: 'developingVAL.width',
        inline: true,
        showLabel: false,
        props: {
          min: 1,
          max: 4,
          width: '50px',
        },
      },
      {
        type: 'color',
        name: 'Line color',
        valueField: 'developingVAL.color',
        opacityField: 'developingVAL.opacity',
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
        name: 'Show Developing POC',
        valueField: 'developingPOC.display',
        labelWidth: LABEL_WIDTH,
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'line',
        name: 'Line',
        valueField: 'developingPOC.type',
        inline: true,
        showLabel: false,
      },
      {
        type: 'number',
        name: 'Line size',
        valueField: 'developingPOC.width',
        inline: true,
        showLabel: false,
        props: {
          min: 1,
          max: 4,
          width: '50px',
        },
      },
      {
        type: 'color',
        name: 'Line color',
        valueField: 'developingPOC.color',
        opacityField: 'developingPOC.opacity',
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
    ],
  ],
};

export const VOLUME_SESSION_DEFAULT_SETTINGS = {
  bins: 20,
  orient: 'right',
  period: 'Day',
  dataType: 'buysell',
  widthOfHistogram: 20,
  valueAreaPercent: 68,
  vahFillColor: '#edfaa1',
  valFillColor: '#edfaa1',
  vaFillColor: '#edfaa1',
  vpBackground: '#023a68',
  vpBackgroundOpacity: 0.1,
  vpBidColor: '#64346d',
  vpBidOpacity: 0.7,
  vpAskColor: '#155474',
  vpAskOpacity: 0.7,
  developingVAH: {
    display: true,
    color: '#ffff00ff',
    type: LINE_TYPE.LINE,
    opacity: 1,
    width: 1,
  },
  developingVAL: {
    display: true,
    color: '#ff00FFff',
    type: LINE_TYPE.LINE,
    opacity: 1,
    width: 1,
  },
  developingPOC: {
    display: true,
    color: '#64ffffff',
    type: LINE_TYPE.LINE,
    opacity: 1,
    width: 1,
  },
  poc: {
    display: true,
    color: '#edfaa1ff',
    type: LINE_TYPE.LINE,
    opacity: 1,
    width: 1,
  },
};
