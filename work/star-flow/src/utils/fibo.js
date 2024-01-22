import { intervalToSeconds } from '@/utils/calculator';

export const getShowableFibos = ({
  items,
  timeIndexMap,
  currentItems = [],
  interval,
  lastCandle,
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
    const startTime = startOpenTime - (startOpenTime % interv);
    const addIndexOpen = Math.floor(
      Math.max(item.openTime - lastCandle.opentime, 0) / interv
    );

    const closeOpenTime = Math.min(item.closeTime, lastCandle.opentime);
    const endTime = closeOpenTime - (closeOpenTime % interv);
    const addIndexClose = Math.floor(
      Math.max(item.closeTime - lastCandle.opentime, 0) / interv
    );

    const startX = timeIndexMap[startTime] + addIndexOpen;
    const endX = timeIndexMap[endTime] + addIndexClose;
    result.push({
      ...item,
      x1: [startX],
      x2: [endX],
    });
  });

  return result;
};
