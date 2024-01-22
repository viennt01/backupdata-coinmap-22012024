import { LINE_TYPE } from '../settings/view';

/** @type {{[listFieldName: String]: Array<FieldConfig>}} */
export const HEATMAP_VWAP_SETTINGS = {
  style: [
    {
      type: 'section',
      name: 'Styles',
    },
    [
      {
        type: 'line',
        name: 'Line',
        valueField: 'vwap.lineType',
        inline: true,
        col: 4,
        labelCol: 5,
      },
      {
        type: 'number',
        name: 'VWAP line size',
        valueField: 'vwap.lineSize',
        inline: true,
        showLabel: false,
        col: 2,
        props: {
          min: 1,
          max: 10,
        },
      },
    ],
    {
      type: 'color',
      name: 'Color',
      valueField: 'vwap.lineColor',
      col: 1,
      props: {
        label: '',
      },
    },
    {
      type: 'color',
      name: 'Border color',
      valueField: 'vwap.borderColor',
      col: 4,
      props: {
        label: '',
      },
    },
  ],
};

export const HEATMAP_VWAP_DEFAULT_SETTINGS = {
  vwap: {
    show: true,
    lineType: LINE_TYPE.LINE,
    lineSize: 2,
    lineColor: '#00FF00',
    borderColor: '#FFFFFF',
  },
};
