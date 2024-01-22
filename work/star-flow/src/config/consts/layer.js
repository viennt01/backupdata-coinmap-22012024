import { FEATURE_IDS } from './features';
import { HEATMAP_VWAP_DEFAULT_SETTINGS } from './settings/heatmap-vwap';
import { VWAP_DEFAULT_SETTINGS, VWAP_CUSTOM_IDENTITY } from './settings/vwap';
import { SMA_DEFAULT_SETTINGS } from './settings/sma';
import { WMA_DEFAULT_SETTINGS } from './settings/wma';
import { VWMA_DEFAULT_SETTINGS } from './settings/vwma';
import { SWMA_DEFAULT_SETTINGS } from './settings/swma';
import { VOLUME_SESSION_DEFAULT_SETTINGS } from './settings/volume-session';
import { BOLLINGER_DEFAULT_SETTINGS } from './settings/bollinger';
import { RSI_DEFAULT_SETTINGS } from './settings/rsi';
import { ATR_DEFAULT_SETTINGS } from './settings/atr';
import { DONCHIAN_DEFAULT_SETTINGS } from './settings/donchian';
import { RVOL_DEFAULT_SETTINGS } from './settings/rvol';
import { CE_DEFAULT_SETTINGS } from './settings/chandelierExit';
import { DMI_DEFAULT_SETTINGS } from './settings/dmi';
import { STD_INDEX_DEFAULT_SETTINGS } from './settings/stdIndex';
import { HPR_DEFAULT_SETTINGS } from './settings/hpr';

export const LAYER_DISPLAY_TYPES = {
  PANE: 'pane',
  PANE_OVERLAY: 'pane_overlay',
  INDICATOR: 'indicator',
};

export const CUSTOM_DATA_IDENTITY = {
  vwap: VWAP_CUSTOM_IDENTITY,
};

export const LAYERS_MAP = {
  candle: {
    id: 'candle',
    name: 'Candle',
    fullName: 'Candle',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    featureId: FEATURE_IDS.CANDLE,
    limit: 1,
  },
  orderflow: {
    id: 'orderflow',
    name: 'Footprint',
    fullName: 'Footprint',
    icon: '',
    type: 'free',
    dataKeys: ['candles', 'orderflow'],
    featureId: FEATURE_IDS.CHART_FOOTPRINT,
    limit: 1,
  },
  volumeSession: {
    id: 'volumeSession',
    name: 'Volume Session',
    fullName: 'Volume Session',
    icon: '',
    type: 'free',
    dataKeys: ['orderflow'],
    featureId: FEATURE_IDS.IND_VOLUMESESSION,
    settings: VOLUME_SESSION_DEFAULT_SETTINGS,
    limit: 1,
  },
  vwap: {
    id: 'vwap',
    name: 'VWAP',
    fullName: 'Volume-Weighted Average Price (VWAP)',
    icon: '',
    type: 'free',
    dataKeys: ['vwap'],
    displayType: LAYER_DISPLAY_TYPES.INDICATOR,
    featureId: FEATURE_IDS.IND_VWAP,
    settings: VWAP_DEFAULT_SETTINGS,
  },
  heatmap_vwap: {
    id: 'heatmap_vwap',
    name: 'Heatmap VWAP',
    fullName: 'Heatmap VWAP',
    icon: '',
    type: 'free',
    dataKeys: ['heatmap_vwap'],
    displayType: LAYER_DISPLAY_TYPES.INDICATOR,
    featureId: FEATURE_IDS.IND_HEATMAP_VWAP,
    settings: HEATMAP_VWAP_DEFAULT_SETTINGS,
    limit: 1,
  },
  heatmap: {
    id: 'heatmap',
    name: 'Heatmap',
    fullName: 'Heatmap',
    icon: '',
    type: 'free',
    dataKeys: ['orderbook'],
    featureId: FEATURE_IDS.CHART_HEATMAP,
    limit: 1,
  },
  area: {
    id: 'area',
    name: 'Area',
    fullName: 'Area',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    featureId: FEATURE_IDS.CHART_AREA,
    limit: 1,
  },
  kagi: {
    id: 'kagi',
    name: 'Kagi',
    fullName: 'Kagi',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    featureId: FEATURE_IDS.CHART_KAGI,
    limit: 1,
  },
  delta: {
    id: 'delta',
    name: 'Delta',
    fullName: 'Delta',
    icon: '',
    type: 'free',
    displayType: LAYER_DISPLAY_TYPES.PANE,
    dataKeys: ['candles'],
    indicatorType: 'delta', // chart will load data on period changed
    featureId: FEATURE_IDS.IND_DELTAVOLUME,
    limit: 1,
  },
  accumulatedDelta: {
    id: 'accumulatedDelta',
    name: 'Cumulative Delta',
    fullName: 'Cumulative Delta',
    icon: '',
    type: 'free',
    displayType: LAYER_DISPLAY_TYPES.PANE,
    dataKeys: ['accumulatedDelta'],
    indicatorType: 'delta',
    featureId: FEATURE_IDS.IND_DELTACVD,
    limit: 1,
  },
  volume: {
    id: 'volume',
    name: 'Volume',
    fullName: 'Volume',
    icon: '',
    type: 'free',
    displayType: LAYER_DISPLAY_TYPES.PANE_OVERLAY,
    dataKeys: ['candles'],
    indicatorType: 'volume',
    featureId: FEATURE_IDS.IND_VOLUME,
    limit: 1,
  },
  sma: {
    id: 'sma',
    name: 'SMA',
    fullName: 'Simple Moving Average (SMA)',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    displayType: LAYER_DISPLAY_TYPES.INDICATOR,
    featureId: FEATURE_IDS.IND_SMA,
    settings: SMA_DEFAULT_SETTINGS,
  },
  wma: {
    id: 'wma',
    name: 'WMA',
    fullName: 'Weighted Moving Average (WMA)',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    displayType: LAYER_DISPLAY_TYPES.INDICATOR,
    featureId: FEATURE_IDS.IND_WMA,
    settings: WMA_DEFAULT_SETTINGS,
  },
  vwma: {
    id: 'vwma',
    name: 'VWMA',
    fullName: 'Volume-Weighted Moving Average (VWMA)',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    displayType: LAYER_DISPLAY_TYPES.INDICATOR,
    featureId: FEATURE_IDS.IND_VWMA,
    settings: VWMA_DEFAULT_SETTINGS,
  },
  swma: {
    id: 'swma',
    name: 'SWMA',
    fullName: 'Symmetrically-Weighted Moving Average (SWMA)',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    displayType: LAYER_DISPLAY_TYPES.INDICATOR,
    featureId: FEATURE_IDS.IND_SWMA,
    settings: SWMA_DEFAULT_SETTINGS,
  },
  bollinger: {
    id: 'bollinger',
    name: 'BB',
    fullName: 'Bollinger Bands (BB)',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    displayType: LAYER_DISPLAY_TYPES.INDICATOR,
    featureId: FEATURE_IDS.IND_BOLLINGER,
    settings: BOLLINGER_DEFAULT_SETTINGS,
  },
  rsi: {
    id: 'rsi',
    name: 'RSI',
    fullName: 'Relative Strength Index (RSI)',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    displayType: LAYER_DISPLAY_TYPES.PANE,
    featureId: FEATURE_IDS.IND_RSI,
    settings: RSI_DEFAULT_SETTINGS,
  },
  atr: {
    id: 'atr',
    name: 'ATR',
    fullName: 'Average True Range (ATR)',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    displayType: LAYER_DISPLAY_TYPES.PANE,
    featureId: FEATURE_IDS.IND_ATR,
    settings: ATR_DEFAULT_SETTINGS,
  },
  donchian: {
    id: 'donchian',
    name: 'DC',
    fullName: 'Donchian Channel (DC)',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    displayType: LAYER_DISPLAY_TYPES.INDICATOR,
    featureId: FEATURE_IDS.IND_DC,
    settings: DONCHIAN_DEFAULT_SETTINGS,
  },
  rvol: {
    id: 'rvol',
    name: 'RVol',
    fullName: 'Relative Volatility (RVol)',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    displayType: LAYER_DISPLAY_TYPES.PANE,
    featureId: FEATURE_IDS.IND_RVOL,
    settings: RVOL_DEFAULT_SETTINGS,
  },
  ce: {
    id: 'ce',
    name: '$ATRChandelier',
    fullName: '$ATRChandelier',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    displayType: LAYER_DISPLAY_TYPES.INDICATOR,
    featureId: FEATURE_IDS.IND_CE,
    settings: CE_DEFAULT_SETTINGS,
  },
  dmi: {
    id: 'dmi',
    name: 'DMI',
    fullName: 'Directional Movement Index (DMI)',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    displayType: LAYER_DISPLAY_TYPES.PANE,
    featureId: FEATURE_IDS.IND_DMI,
    settings: DMI_DEFAULT_SETTINGS,
  },
  stdIndex: {
    id: 'stdIndex',
    name: 'STD Index',
    fullName: 'STD Index',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    displayType: LAYER_DISPLAY_TYPES.PANE,
    featureId: FEATURE_IDS.IND_STDINDEX,
    settings: STD_INDEX_DEFAULT_SETTINGS,
  },
  hpr: {
    id: 'hpr',
    name: 'HPR',
    fullName: 'Highest Price Ratio (HPR)',
    icon: '',
    type: 'free',
    dataKeys: ['candles'],
    displayType: LAYER_DISPLAY_TYPES.PANE,
    featureId: FEATURE_IDS.IND_HPR,
    settings: HPR_DEFAULT_SETTINGS,
  },
};

export const INDICATOR_TYPES = [
  LAYERS_MAP.volumeSession,
  LAYERS_MAP.delta,
  LAYERS_MAP.accumulatedDelta,
  LAYERS_MAP.volume,
  LAYERS_MAP.vwap,
  LAYERS_MAP.sma,
  LAYERS_MAP.wma,
  LAYERS_MAP.vwma,
  LAYERS_MAP.swma,
  LAYERS_MAP.bollinger,
  LAYERS_MAP.rsi,
  LAYERS_MAP.atr,
  LAYERS_MAP.donchian,
  LAYERS_MAP.rvol,
  LAYERS_MAP.ce,
  LAYERS_MAP.dmi,
  LAYERS_MAP.stdIndex,
  LAYERS_MAP.hpr,
];
export const HEATMAP_INDICATOR_TYPES = [
  LAYERS_MAP.accumulatedDelta,
  LAYERS_MAP.heatmap_vwap,
];
export const CHART_TYPES = [
  LAYERS_MAP.candle,
  LAYERS_MAP.orderflow,
  LAYERS_MAP.area,
  // layersMap.kagi,
  LAYERS_MAP.heatmap,
];

export const CHART_TYPE_KEYS = CHART_TYPES.map((item) => item.id);

export const LINE_TYPES = ['Solid', 'Dot', 'Dash'];

export const LINE_SIZES = [1, 2, 3, 4];

export const FONT_SIZES = [10, 11, 12, 14, 16, 20, 24, 28, 32, 40];
