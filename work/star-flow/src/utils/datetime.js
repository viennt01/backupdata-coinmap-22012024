import { DateTime } from 'luxon';

export const toUTCDate = (date, timezone) => {
  const a = DateTime.fromJSDate(date).setZone(timezone || 'utc');
  return a;
};

export const getDate = (date = DateTime.now()) => date.day;

export const toTimeIndexMap = (candles) => {
  const indexMap = {};
  candles.forEach((candle) => {
    indexMap[candle.opentime] = candle.idx.index;
  });
  return indexMap;
};

const milisecondsOfDay = 24 * 60 * 60 * 1000;
export const skipOfflineDays = (time, dayCount = 2) => {
  return time - milisecondsOfDay * dayCount;
};

/**
 * get new date start at 00h00 UTC
 * @param {Date | Integer} iDate input date
 * @returns {Date} new Date
 */
export const getDateUTCStart = (iDate) => {
  const utcDate = new Date(iDate);
  utcDate.setHours(0, -utcDate.getTimezoneOffset(), 0, 0);

  return utcDate;
};
