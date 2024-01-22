import { intervalToSeconds } from '@/utils/calculator';

export const getShowableLongPosition = ({
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
  const intervalSecond = intervalToSeconds(interval) * 1000;
  const itemIdsMap = {};
  currentItems.forEach((item) => {
    itemIdsMap[item.id] = item;
  });

  const result = [];
  items.forEach((item) => {
    if (!item.entryOpenTime1) {
      return;
    }

    //startOpenTime
    const entryOpenTime1 = Math.min(item.entryOpenTime1, lastCandle.opentime);
    let entryStartTime1 = entryOpenTime1 - (entryOpenTime1 % intervalSecond);
    const addIndexOpen = Math.floor(
      Math.max(item.entryOpenTime1 - lastCandle.opentime, 0) / intervalSecond
    );
    const addIndexOpenBegin = Math.floor(
      Math.min(entryStartTime1 - firstCandle.opentime, 0) / intervalSecond
    );
    entryStartTime1 =
      timeIndexMap[entryStartTime1] === undefined
        ? firstCandle.opentime
        : entryStartTime1;

    //closeOpenTime
    const entryOpenTime2 = Math.min(item.entryOpenTime2, lastCandle.opentime);
    let entryEndTime1 = entryOpenTime2 - (entryOpenTime2 % intervalSecond);
    const addIndexEndBegin = Math.floor(
      Math.min(entryEndTime1 - firstCandle.opentime, 0) / intervalSecond
    );
    const addIndexClose = Math.floor(
      Math.max(item.entryOpenTime2 - lastCandle.opentime, 0) / intervalSecond
    );
    entryEndTime1 =
      timeIndexMap[entryEndTime1] === undefined
        ? firstCandle.opentime
        : entryEndTime1;

    const startX =
      timeIndexMap[entryStartTime1] + addIndexOpen + addIndexOpenBegin;
    const endX = timeIndexMap[entryEndTime1] + addIndexClose + addIndexEndBegin;

    result.push({
      ...item,
      entryStart: [startX, item.entryStart[1]],
      stopLoss: [startX, item.stopLoss[1]],
      takeProfit: [startX, item.takeProfit[1]],
      entryEnd: [endX, item.entryEnd[1]],
    });
  });

  return result;
};
