import { intervalToSeconds } from '@/utils/calculator';

export const getShowablehorizontalRay = ({
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
    if (!item.openTime) {
      return;
    }

    const startOpenTime = Math.min(item.openTime, lastCandle.opentime);
    let startTime = startOpenTime - (startOpenTime % interv);
    const addIndexOpen = Math.floor(
      Math.max(item.openTime - lastCandle.opentime, 0) / interv
    );
    const addIndexOpenBegin = Math.floor(
      Math.min(startTime - firstCandle.opentime, 0) / interv
    );

    startTime =
      timeIndexMap[startTime] === undefined ? firstCandle.opentime : startTime;
    const startX = timeIndexMap[startTime] + addIndexOpen + addIndexOpenBegin;

    result.push({
      ...item,
      start: [startX, item.start[1]],
    });
  });

  return result;
};
