export const DELTA_DIVERGENCE = {
  DELTAL: 'delta',
  CANDLESTICK: 'candlestick',
};

export const POC_TYPE = {
  COMBINED: 'combined',
  SEPERATOR: 'seperator',
};

export const APPLY_SETTINGS_FOR = {
  ALL: 'ALL',
  CURRENT: 'CURRENT',
};
const RED_COLOR = '#E96D38';
const BLUE_COLOR = '#2BDBEA';
const DARK_BLUE_COLOR = '#327ABC';
const YELLOW_COLOR = '#FFFF00';
const BG_VOLUME = '#01566c';
const GREEN = '#00FF00';
const WHITE = '#FFFFFF';

const FOOTPRINT_SETTINGS = {
  type: 'imbalance',
  clusterVisualization: 'histogram',
  volume: {
    display: true,
    color: BG_VOLUME,
  },
  delta: true,
  ratioHigh: true,
  ratioLow: true,
  stackImbalance: true,
  imbalance: {
    display: true,
    ratio: 3,
    zoneCount: 3,
    filterVolume: 10,
    sellColor: RED_COLOR,
    buyColor: BLUE_COLOR,
    noSellColor: RED_COLOR,
    noBuyColor: BLUE_COLOR,
  },
  // point of control
  poc: {
    display: true,
    color: YELLOW_COLOR,
    textColor: DARK_BLUE_COLOR,
    type: POC_TYPE.SEPERATOR,
  },
  // value area
  va: {
    display: true,
    value: 70,
    color: '#01566c',
  },
  highlightZero: {
    display: true,
    color: BLUE_COLOR,
    textColor: WHITE,
  },
  unFinishedAuction: {
    display: true,
    color: GREEN,
    textColor: DARK_BLUE_COLOR,
  },
  // arrow direction
  deltaDivergence: {
    display: true,
    type: DELTA_DIVERGENCE.CANDLESTICK,
  },
  exhaustionAirow: {
    display: true,
    value: 4,
  },
  totalBidAsk: true,
  applySettingsFor: APPLY_SETTINGS_FOR.ALL,
};

export default FOOTPRINT_SETTINGS;
