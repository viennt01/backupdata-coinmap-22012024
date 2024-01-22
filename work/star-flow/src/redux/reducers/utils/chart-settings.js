import FOOTPRINT_SETTINGS, {
  APPLY_SETTINGS_FOR,
} from '@/config/consts/settings/footprint';
import STATUS_LINE_SETTINGS from '@/config/consts/settings/statusline';
import VIEW_SETTINGS from '@/config/consts/settings/view';
import TIME_SCALE_SETTINGS from '@/config/consts/settings/timescale';
import THEME_SETTINGS from '@/config/consts/settings/theme';
import PRICE_SCALE_SETTINGS from '@/config/consts/settings/pricescale';
import { formatDeepCopy } from '@/utils/format';
import { URLS } from '@/config';
import { LAYERS_MAP } from '@/config/consts/layer';
import { SORT_DIRECTION } from '@/components/WatchList/WatchListTable';

const layout = {
  chart1: { i: 'chart1', x: 0, y: 0, w: 12, h: 24, minW: 4 },
  tradingview1: { i: 'tradingview1', x: 12, y: 0, w: 12, h: 24, minW: 4 },
};

export const initTimeGroup = [
  {
    name: 'Minutes',
    enable: true,
    timeMin: 1,
    timeMax: 59,
    valueMin: 1,
    valueMax: 59,
  },
  {
    name: 'Hours',
    enable: true,
    timeMin: 1,
    timeMax: 23,
    valueMin: 1,
    valueMax: 23,
  },
  {
    name: 'Days',
    enable: true,
    timeMin: 1,
    timeMax: 1,
    valueMin: 1,
    valueMax: 1,
  },
];

const DEFAULT_SETTINGS = {
  chart: {
    chartId: 'chart1',
    type: 'chart',
    position: 0,
    chartType: LAYERS_MAP.candle.id,
    symbolInfo: {
      full_name: 'BTCUSDT',
      description: 'Bitcoin / TetherUS PERPETUAL FUTURES',
      exchange: 'BINANCE',
      symbol: 'BTCUSDT',
      ticker: 'CVCUSDT',
      ticksOfSymbol: {
        muldecimal: 0,
        numdecimal: 1,
        stepbase: 3,
        stepquote: 5,
        tick: 10,
        ticksizemin: 0.000001,
        tickvalue: 10,
      },
      interval: '5',
      intervals: [
        '1',
        '3',
        '5',
        '15',
        '30',
        '60',
        '120',
        '240',
        '480',
        '720',
        '1D',
      ],
      symbolType: 'crypto',
      asset: 'BINANCE',
    },
    showLayers: false,
    layers: [
      {
        i: 1,
        type: 'candle',
        show: true,
        position: 0,
        timeGroup: formatDeepCopy(initTimeGroup),
      },
    ],
    themeSettings: THEME_SETTINGS,
    footprintSettings: [
      {
        symbol: 'BTCUSDT',
        settings: [
          {
            symbol: 'BTCUSDT',
            interval: '5',
            ...FOOTPRINT_SETTINGS,
          },
        ],
        applySettingsFor: APPLY_SETTINGS_FOR.CURRENT,
      },
    ],
    viewSettings: VIEW_SETTINGS,
    statusLineSettings: STATUS_LINE_SETTINGS,
    timeScaleSettings: TIME_SCALE_SETTINGS,
    priceScaleSettings: PRICE_SCALE_SETTINGS,
    draws: {
      BTCUSDT: {
        enable: '',
      },
    },
    layout: layout.chart1,
    selected: true,
    timezone: 'Asia/Ho_Chi_Minh',
  },
  tradingview: {
    chartId: 'tradingview1',
    symbolInfo: {
      symbol: 'BTCUSDT',
      interval: '5',
    },
    type: 'iframe',
    src: URLS.TRADINGVIEW_URL,
    layout: layout.tradingview1,
  },
  watchlist: {
    chartId: 'watchlist1',
    type: 'watchlist',
    symbolInfo: {
      symbol: 'BTCUSDT',
      interval: '5',
    },
    layout: layout.watchlist1,
    sortInfo: {
      value: '',
      direction: SORT_DIRECTION.NO_SORT,
    },
  },
};

class DefaultSettings {
  value = DEFAULT_SETTINGS;

  updateIntervalsSettings(intervals) {
    this.value = {
      ...this.value,
      chart: {
        ...this.value.chart,
        intervals: intervals, // TODO: use?
        footprintSettings: [
          {
            symbol: 'BTCUSDT',
            ...FOOTPRINT_SETTINGS,
          },
        ],
      },
    };
  }
}
export const defaultSettings = new DefaultSettings();
