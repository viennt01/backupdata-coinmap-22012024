export const FONT_FAMILY = {
  IONICONS: 'Ionicons',
  ROBOTO: 'Roboto',
};
export const LINE_TYPE = {
  LINE: 'Solid',
  DASH_LINE: 'Dash',
  DOT_LINE: 'Dot',
};

export const DATE_FORMAT = {
  DDMMYYYY: '%e %b %Y', // 01 Aug 2022 00:00
  MMDDYYYY: '%b %e %Y', // Aug 01 2022 00:00
  YYYYMMDD: '%Y %b %e', // 2022 Aug 01 2022 00:00
  'YYYY-MM-DD': '%Y-%m-%d', // 2022-08-01 00:00
  'YY-MM-DD': '%y-%m-%d', // 22-08-01 00:00
  'YY/MM/DD': '%y/%m/%d', // 22/08/01 00:00
  'YYYY/MM/DD': '%Y/%m/%d', // 22/08/01 00:00
  'DD-MM-YYYY': '%d-%m-%Y', // 01-08-2022 00:00
  'DD-MM-YY': '%d-%m-%y', // 01-08-22 00:00
  'DD/MM/YY': '%d/%m/%y', // 01/08/22 00:00
  'DD/MM/YYYY': '%d/%m/%Y', // 01/08/2022 00:00
  'MM/DD/YYYY': '%m/%d/%Y', // 08/01/2022 00:00
  'MM/DD/YY': '%m/%d/%y', // 08/01/22 00:00
};

export const FONT_SIZE = {
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
};

export const BACKGROUND_COLOR = '#0c122a';
export const BLUE_COLOR = '#3E6990';
export const GRAY_COLOR = '#AEAEAE';
export const PURPLE_COLOR = '#5F5E96';

const TIME_SCALE_SETTINGS = {
  dateFormat: DATE_FORMAT.DDMMYYYY,
  font: {
    fontFamily: FONT_FAMILY.ROBOTO,
    fontSize: FONT_SIZE[10],
    bold: true,
  },
  fontColor: GRAY_COLOR,
  axis: BLUE_COLOR,
  axisBackground: BACKGROUND_COLOR,
  daySeparators: {
    display: true,
    type: LINE_TYPE.LINE,
    width: 1,
    color: PURPLE_COLOR,
  },
  weekSeparators: {
    display: true,
    type: LINE_TYPE.LINE,
    width: 1,
    color: PURPLE_COLOR,
  },
  monthSeparators: {
    display: true,
    type: LINE_TYPE.LINE,
    width: 1,
    color: PURPLE_COLOR,
  },
  yearSeparators: {
    display: true,
    type: LINE_TYPE.LINE,
    width: 1,
    color: PURPLE_COLOR,
  },
};

export default TIME_SCALE_SETTINGS;
