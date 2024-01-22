import { isStartOfPeriod } from '@/utils/calculator';
import { LOADER_PERIOD_SEPARATOR } from '../data';
import { LINE_TYPE } from '../settings/view';

export const VWAP_CUSTOM_IDENTITY = {
  toIdentity: (layer) => {
    const { i, settings } = layer;
    const bandsmultiplier = `${settings.band1.ratio},${settings.band2.ratio},${settings.band3.ratio}`;
    return `${i}-${settings.period}-${settings.source}-${bandsmultiplier}`;
  },
  identityToProps: (identifier) => {
    const [layerId, period, source, bandsmultiplier] = identifier.split('-');

    return {
      layerId,
      period: period.toLowerCase(),
      source,
      bandsmultiplier,
    };
  },
};

export const VWAP_SOURCE_FUNCS = {
  open: ({ open }) => open,
  high: ({ high }) => high,
  low: ({ low }) => low,
  close: ({ close }) => close,
  hl2: ({ high, low }) => (high + low) / 2,
  hlc3: ({ high, low, close }) => (high + low + close) / 3,
  ohlc4: ({ open, high, low, close }) => (open + high + low + close) / 4,
  hlcc4: ({ high, low, close }) => (high + low + close + close) / 4,
};

export const getCurrentVwapSettings = (vwapDataKey) => {
  if (!vwapDataKey) {
    return null;
  }

  const identity = vwapDataKey.replace(`vwap${LOADER_PERIOD_SEPARATOR}`, '');
  const props = VWAP_CUSTOM_IDENTITY.identityToProps(identity);

  return props;
};

// NOTICE: This is procedure, it will mutate the input candle
export const calcVwap = ({ candle, previousCandle, currentDataKey }) => {
  const vwapSettings = getCurrentVwapSettings(currentDataKey);
  const { layerId } = vwapSettings;

  if (!vwapSettings) {
    return;
  }

  const isVwapStartOfPeriod = isStartOfPeriod(
    candle.opentime,
    vwapSettings.period
  );
  const vwapSource = VWAP_SOURCE_FUNCS[vwapSettings.source];
  if (!vwapSource) {
    return;
  }
  const vwapP = vwapSource(candle);

  // last candle
  if (!isVwapStartOfPeriod) {
    // Calculate vwap
    const { vwapData: prevVwapData } = previousCandle?.[layerId] ?? {};
    const sumScrScrVol =
      prevVwapData?.sumScrScrVol + candle.volume * vwapP * vwapP;
    const sumVol = prevVwapData?.sumVol + candle.volume;
    const sumScrVol = prevVwapData?.sumScrVol + candle.volume * vwapP;
    const vwap = sumScrVol / sumVol;
    const diffPerStep = Math.sqrt(
      Math.abs(sumScrScrVol / sumVol - vwap * vwap)
    );

    const vwapData = {
      sumScrVol,
      sumScrScrVol,
      sumVol,
      vwap,
      sd: diffPerStep,
    };
    candle[layerId] = {};
    Object.assign(candle[layerId], { vwapData, vwap });
  } else {
    const sumScrVol = candle.volume * vwapP;
    const sumScrScrVol = candle.volume * vwapP * vwapP;
    const sumVol = candle.volume;
    const vwap = vwapP;
    const diffPerStep = Math.sqrt(
      Math.abs(sumScrScrVol / sumVol - vwap * vwap)
    );

    const vwapData = {
      sumScrVol,
      sumScrScrVol,
      sumVol,
      sd: diffPerStep,
    };
    candle[layerId] = {};
    Object.assign(candle[layerId], { vwapData, vwap });
  }
};

export const calcVwapIndicators = ({
  candle,
  previousCandle,
  currentDataKeys,
}) => {
  currentDataKeys.forEach((currentDataKey) => {
    if (currentDataKey.indexOf('vwap') === 0)
      calcVwap({ candle, previousCandle, currentDataKey });
  });
};

export const VWAP_VALUES = {
  SOURCES: Object.keys(VWAP_SOURCE_FUNCS),
  VWAP_PERIODS: ['Day', 'Week', 'Month'],
};

/** @type {{[listFieldName: String]: Array<FieldConfig>}} */
export const VWAP_SETTINGS = {
  input: [
    {
      type: 'section',
      name: 'Inputs',
    },
    {
      type: 'select',
      name: 'VWAP Period',
      valueField: 'period',
      props: {
        options: VWAP_VALUES.VWAP_PERIODS,
        isSearchable: false,
      },
    },
    {
      type: 'select',
      name: 'Source',
      valueField: 'source',
      props: {
        options: VWAP_VALUES.SOURCES,
        isSearchable: false,
      },
    },
    {
      type: 'number',
      name: 'Offset',
      default: 0,
      valueField: 'offset',
      props: {
        min: -2000,
        max: 2000,
        step: 1,
      },
    },
    {
      type: 'label',
      name: 'Standard Deviation Bands Settings',
      props: {
        className: 'ms-4 my-4',
      },
    },
    [
      {
        type: 'checkbox',
        name: 'Bands Multiplier 1',
        inline: true,
        default: true,
        valueField: 'band1.show',
        labelCol: 5,
      },
      {
        type: 'number',
        name: 'Bands Multiplier 1',
        showLabel: false,
        inline: true,
        col: 2,
        valueField: 'band1.ratio',
        props: {
          min: 1,
          max: 20,
        },
      },
    ],
    [
      {
        type: 'checkbox',
        name: 'Bands Multiplier 2',
        inline: true,
        default: true,
        valueField: 'band2.show',
        labelCol: 5,
      },
      {
        type: 'number',
        name: 'Bands Multiplier 2',
        valueField: 'band2.ratio',
        showLabel: false,
        inline: true,
        col: 2,
        props: {
          min: 1,
          max: 20,
        },
      },
    ],
    [
      {
        type: 'checkbox',
        name: 'Bands Multiplier 3',
        valueField: 'band3.show',
        inline: true,
        default: true,
        labelCol: 5,
      },
      {
        type: 'number',
        name: 'Bands Multiplier 3',
        valueField: 'band3.ratio',
        showLabel: false,
        inline: true,
        col: 2,
        props: {
          min: 1,
          max: 20,
        },
      },
    ],
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
        name: 'VWAP',
        valueField: 'vwap.lineType',
        inline: true,
        col: 4,
        labelCol: 5,
      },
      {
        type: 'number',
        name: 'Band 1 line size',
        valueField: 'vwap.lineSize',
        inline: true,
        showLabel: false,
        col: 2,
        props: {
          min: 1,
          max: 10,
        },
      },
      {
        type: 'color',
        name: 'vwapColor',
        valueField: 'vwap.lineColor',
        opacityField: 'vwap.lineOpacity',
        inline: true,
        showLabel: false,
        col: 1,
        props: {
          label: '',
        },
      },
    ],
    [
      {
        type: 'line',
        name: 'Band 1',
        valueField: 'band1.lineType',
        inline: true,
        col: 4,
        labelCol: 5,
      },
      {
        type: 'number',
        name: 'Band 1 line size',
        valueField: 'band1.lineSize',
        inline: true,
        showLabel: false,
        col: 2,
        props: {
          min: 1,
          max: 10,
        },
      },
      {
        type: 'color',
        name: 'band1.lineColor',
        valueField: 'band1.lineColor',
        opacityField: 'band1.lineOpacity',
        showLabel: false,
        inline: true,
        col: 1,
        props: {
          label: '',
        },
      },
    ],
    [
      {
        type: 'line',
        name: 'Band 2',
        valueField: 'band2.lineType',
        inline: true,
        col: 4,
        labelCol: 5,
      },
      {
        type: 'number',
        name: 'Band 2 line size',
        valueField: 'band2.lineSize',
        inline: true,
        showLabel: false,
        col: 2,
        props: {
          min: 1,
          max: 10,
        },
      },
      {
        type: 'color',
        name: 'band2.lineColor',
        valueField: 'band2.lineColor',
        opacityField: 'band2.lineOpacity',
        showLabel: false,
        inline: true,
        col: 1,
        props: {
          label: '',
        },
      },
    ],
    [
      {
        type: 'line',
        name: 'Band 3',
        valueField: 'band3.lineType',
        inline: true,
        col: 4,
        labelCol: 5,
      },
      {
        type: 'number',
        name: 'Band 3 line size',
        valueField: 'band3.lineSize',
        inline: true,
        showLabel: false,
        col: 2,
        props: {
          min: 1,
          max: 10,
        },
      },
      {
        type: 'color',
        name: 'band3.lineColor',
        valueField: 'band3.lineColor',
        opacityField: 'band3.lineOpacity',
        showLabel: false,
        inline: true,
        col: 1,
        props: {
          label: '',
        },
      },
    ],
    [
      {
        type: 'checkbox',
        name: 'Bands Fill 1',
        valueField: 'band1.fill',
        col: 1,
        labelCol: 5,
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'color',
        name: 'Bands fill 1 color',
        valueField: 'band1.fillColor',
        opacityField: 'band1.fillOpacity',
        col: 1,
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
        name: 'Bands Fill 2',
        valueField: 'band2.fill',
        col: 1,
        labelCol: 5,
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'color',
        name: 'Bands fill 2 color',
        valueField: 'band2.fillColor',
        opacityField: 'band2.fillOpacity',
        col: 1,
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
        name: 'Bands Fill 3',
        valueField: 'band3.fill',
        col: 1,
        labelCol: 5,
        inline: true,
        props: {
          label: '',
        },
      },
      {
        type: 'color',
        name: 'Bands fill 3 color',
        valueField: 'band3.fillColor',
        opacityField: 'band3.fillOpacity',
        col: 1,
        inline: true,
        showLabel: false,
        props: {
          label: '',
        },
      },
    ],
  ],
};

export const VWAP_DEFAULT_SETTINGS = {
  period: VWAP_VALUES.VWAP_PERIODS[0],
  source: 'hlc3',
  offset: 0,
  vwap: {
    show: true,
    lineType: LINE_TYPE.LINE,
    lineSize: 1,
    lineOpacity: 1,
    lineColor: '#2962ff',
    fillColor: '#2962ff',
  },
  band1: {
    show: true,
    ratio: 1,
    lineType: LINE_TYPE.LINE,
    lineSize: 1,
    lineColor: '#4caf50',
    lineOpacity: 1,
    fill: true,
    fillColor: '#4caf50',
    fillOpacity: 0.05,
  },
  band2: {
    show: false,
    ratio: 2,
    lineType: LINE_TYPE.LINE,
    lineSize: 1,
    lineColor: '#808000',
    lineOpacity: 1,
    fill: true,
    fillColor: '#808000',
    fillOpacity: 0.05,
  },
  band3: {
    show: false,
    ratio: 3,
    lineType: LINE_TYPE.LINE,
    lineSize: 1,
    lineColor: '#00897b',
    lineOpacity: 1,
    fill: true,
    fillColor: '#00897b',
    fillOpacity: 0.05,
  },
};

export const GET_VWAP_BANDS_YACCESSORS = (layerId, settings) => ({
  topBand1: (d) => {
    const { topBand1, vwap, sd } = d?.[layerId]?.vwapData ?? {};
    return topBand1 || vwap + sd * settings.band1?.ratio;
  },
  topBand2: (d) => {
    const { topBand2, vwap, sd } = d?.[layerId]?.vwapData ?? {};
    return topBand2 || vwap + sd * settings.band2?.ratio;
  },
  topBand3: (d) => {
    const { topBand3, vwap, sd } = d?.[layerId]?.vwapData ?? {};
    return topBand3 || vwap + sd * settings.band3?.ratio;
  },
  botBand1: (d) => {
    const { botBand1, vwap, sd } = d?.[layerId]?.vwapData ?? {};
    return botBand1 || vwap - sd * settings.band1?.ratio;
  },
  botBand2: (d) => {
    const { botBand2, vwap, sd } = d?.[layerId]?.vwapData ?? {};
    return botBand2 || vwap - sd * settings.band2?.ratio;
  },
  botBand3: (d) => {
    const { botBand3, vwap, sd } = d?.[layerId]?.vwapData ?? {};
    return botBand3 || vwap - sd * settings.band3?.ratio;
  },
});
