import { intervalToSeconds } from '@/utils/calculator';

export const getShowableArrow = ({
  items,
  timeIndexMap,
  currentItems = [],
  interval,
  lastCandle,
  firstCandle,
}) => {
  if (!Array.isArray(items)) {
    return [];
  }
  if (lastCandle === undefined) {
    return;
  }
  const interv = intervalToSeconds(interval) * 1000;
  const itemIdsMap = {};
  currentItems.forEach((item) => {
    itemIdsMap[item.id] = item;
  });

  const result = [];
  items.forEach((item) => {
    if (!item.openTime || !item.closeTime) {
      return;
    }

    const startOpenTime = Math.min(item.openTime, lastCandle.opentime);
    let startTime = startOpenTime - (startOpenTime % interv);
    const addIndexOpenBegin = Math.floor(
      Math.min(startTime - firstCandle.opentime, 0) / interv
    );
    const addIndexOpen = Math.floor(
      Math.max(item.openTime - lastCandle.opentime, 0) / interv
    );
    startTime =
      timeIndexMap[startTime] === undefined ? firstCandle.opentime : startTime;

    const closeOpenTime = Math.min(item.closeTime, lastCandle.opentime);
    let endTime = closeOpenTime - (closeOpenTime % interv);
    const addIndexEndBegin = Math.floor(
      Math.min(endTime - firstCandle.opentime, 0) / interv
    );
    const addIndexClose = Math.floor(
      Math.max(item.closeTime - lastCandle.opentime, 0) / interv
    );
    endTime =
      timeIndexMap[endTime] === undefined ? firstCandle.opentime : endTime;

    const startX = timeIndexMap[startTime] + addIndexOpen + addIndexOpenBegin;
    const endX = timeIndexMap[endTime] + addIndexClose + addIndexEndBegin;

    result.push({
      ...item,
      start: [startX, item.start[1]],
      end: [endX, item.end[1]],
    });
  });

  return result;
};
