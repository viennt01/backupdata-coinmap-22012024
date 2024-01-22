export const LINE_TYPE = {
  LINE: 'Solid',
  DASH_LINE: 'Dash',
  DOT_LINE: 'Dot',
};

export const DRAWING_DEFAULT = {
  CURRENT_CHART: 'CURRENT_CHART',
  ALL_CHARTS: 'ALL_CHARTS',
};

export const FPS_VALUES = [undefined, 15, 30, 60, 120, 240];

export const BACKGROUND_TYPE = {
  SOLID: 'SOLID',
  GRADIENT: 'GRADIENT',
};

export const FONT_FAMILY = {
  IONICONS: 'Ionicons',
  ROBOTO: 'Roboto',
};

export const BACKGROUND_COLOR = '#0c122a';
const LINE_COLOR = '#5F5E96';

const VIEW_SETTINGS = {
  customTickSize: {
    display: true,
    value: 0,
  },
  drawingDefault: {
    display: true,
    value: DRAWING_DEFAULT.CURRENT_CHART,
  },
  fps: undefined,
  background: {
    display: true,
    type: BACKGROUND_TYPE.SOLID,
    'color[0]': BACKGROUND_COLOR,
    'color[1]': BACKGROUND_COLOR,
  },
  waterMark: {
    display: true,
    text: 'COINMAP',
    font: FONT_FAMILY.IONICONS,
    fontSize: 50,
    opacity: 0.3,
  },
  crossHair: {
    visible: {
      display: true,
      type: LINE_TYPE.DASH_LINE,
      width: 1,
      color: LINE_COLOR,
    },
  },
  grid: {
    priceHorizontal: {
      display: true,
      type: LINE_TYPE.LINE,
      width: 1,
      color: LINE_COLOR,
    },
    timeVertical: {
      display: true,
      type: LINE_TYPE.LINE,
      width: 1,
      color: LINE_COLOR,
    },
  },
};

export default VIEW_SETTINGS;
