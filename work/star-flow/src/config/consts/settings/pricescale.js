export const FONT_FAMILY = {
  IONICONS: 'Ionicons',
  ROBOTO: 'Roboto',
};
export const LINE_TYPE = {
  LINE: 'Solid',
  DASH_LINE: 'Dash',
  DOT_LINE: 'Dot',
};

export const PRECISION = {
  DEFAULT: '',
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
};

export const MIN_PRECISION = 2;

export const FONT_SIZE = {
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
};
export const BACKGROUND_COLOR = '#0F1A30';
export const BLUE_COLOR = '#3E6990';
export const GRAY_COLOR = '#AEAEAE';

export const PURPLE_COLOR = '#5F5E96';

const PRICE_SCALE_SETTINGS = {
  countdown: true,
  precision: PRECISION.DEFAULT,

  font: {
    fontFamily: FONT_FAMILY.ROBOTO,
    fontSize: FONT_SIZE[10],
    bold: true,
  },
  fontColor: GRAY_COLOR,
  axis: BLUE_COLOR,
  axisBackground: BACKGROUND_COLOR,

  askMarker: {
    display: true,
    type: LINE_TYPE.LINE,
    width: 1,
    color: PURPLE_COLOR,
  },
  lastPriceMarker: {
    display: true,
    type: LINE_TYPE.LINE,
    width: 1,
    color: PURPLE_COLOR,
  },

  previousDayClose: {
    display: true,
    type: LINE_TYPE.LINE,
    width: 1,
    color: PURPLE_COLOR,
  },

  dayHighLow: {
    display: true,
    type: LINE_TYPE.LINE,
    width: 1,
    color: PURPLE_COLOR,
  },
};

export default PRICE_SCALE_SETTINGS;
