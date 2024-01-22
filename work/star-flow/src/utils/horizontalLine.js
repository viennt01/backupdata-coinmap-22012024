import { intervalToSeconds } from '@/utils/calculator';

export const getShowableHorizontalLines = ({
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
    if (!item.openTime) {
      return;
    }

    const keyTimeIndexMap = Object.keys(timeIndexMap);
    const timeFirstIndex = keyTimeIndexMap[0];
    const startOpenTime = Math.min(item.openTime, lastCandle.opentime);
    let startTime = startOpenTime - (startOpenTime % interv);
    const addIndexOpen = Math.floor(
      Math.max(item.openTime - lastCandle.opentime, 0) / interv
    );
    startTime =
      timeIndexMap[startTime] === undefined ? timeFirstIndex : startTime;
    const startX = timeIndexMap[startTime] + addIndexOpen;

    result.push({
      ...item,
      start: [startX, item.start[1]],
    });
  });

  return result;
};
