import { FONT_SIZES } from '@/config/consts/layer';

const LABEL_WIDTH = '128px';

const COLOR_PICKER_PROPS = {
  label: '',
  rectWidth: 36,
  rectHeight: 36,
  padding: 5,
};

export const SHORT_QUICK_SETTINGS = [
  {
    type: 'text-color',
    name: 'Text Color',
    valueField: 'textFill',
    opacityField: 'textOpacity',
  },
  {
    type: 'paint-color',
    name: 'Profit Background Color',
    valueField: 'takeProfit',
    opacityField: 'opacityTakeProfit',
  },
  {
    type: 'paint-color',
    name: 'Stop Background Color',
    valueField: 'stopLoss',
    opacityField: 'opacityStopLoss',
  },
];

export const SHORT_SETTINGS = {
  style: [
    [
      {
        type: 'lineSize',
        name: 'Lines',
        valueField: 'appearance.entryLineSize',
        labelWidth: LABEL_WIDTH,
        inline: true,
      },
      {
        type: 'color',
        name: 'Line Color',
        valueField: 'appearance.entryLineColor',
        opacityField: 'appearance.entryLineOpacity',
        inline: true,
        showLabel: false,
        props: COLOR_PICKER_PROPS,
      },
    ],
    {
      type: 'color',
      name: 'Stop Color',
      valueField: 'appearance.stopLoss',
      opacityField: 'appearance.opacityStopLoss',
      labelWidth: LABEL_WIDTH,
      props: COLOR_PICKER_PROPS,
    },
    {
      type: 'color',
      name: 'Target Color',
      valueField: 'appearance.takeProfit',
      opacityField: 'appearance.opacityTakeProfit',
      labelWidth: LABEL_WIDTH,
      props: COLOR_PICKER_PROPS,
    },
    [
      {
        type: 'color',
        name: 'Text',
        valueField: 'appearance.textFill',
        opacityField: 'appearance.textOpacity',
        labelWidth: LABEL_WIDTH,
        inline: true,
        props: COLOR_PICKER_PROPS,
      },
      {
        type: 'select',
        name: 'Text Size',
        valueField: 'appearance.textSize',
        inline: true,
        showLabel: false,
        props: {
          options: FONT_SIZES.map((size) => ({
            label: size.toString(),
            value: size,
          })),
          isSearchable: false,
          width: '108px',
        },
      },
    ],
    {
      type: 'toggle',
      name: 'Show price labels',
      valueField: 'appearance.showPriceLabels',
      showLabel: false,
      props: {
        label: 'Show price labels',
      },
    },
    {
      type: 'toggle',
      name: 'Always show stats',
      valueField: 'appearance.alwaysShowStats',
      showLabel: false,
      props: {
        label: 'Always show stats',
      },
    },
  ],
};

export const SHORT_APPEARANCE_DEFAULT = {
  appearance: {
    stopLoss: '#B22B00',
    opacityStopLoss: 0.2,
    takeProfit: '#1FAA99',
    opacityTakeProfit: 0.2,
    textFill: '#ffffff',
    textOpacity: 1,
    textSize: 12,
    entryLineColor: '#D9D9D9',
    entryLineOpacity: 1,
    entryLineSize: 1,
    showPriceLabels: true,
    alwaysShowStats: false,
  },
};
