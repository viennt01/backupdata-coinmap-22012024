import { DRAW_TOOLS } from '@/config/consts/drawTool';
import { actEndDraw, actUpdateChartToSever } from '@/redux/actions/setting';
import { genSimpleID } from '@/utils/generator';
import { intervalToSeconds } from '@/utils/calculator';

const DRAW_TYPE = DRAW_TOOLS.path.type;

const indexToTime = (index, fullData, interval) => {
  const firstItem = fullData[0];
  const lastIndex = fullData.length - 1;
  const interv = intervalToSeconds(interval) * 1000;
  let realIndex = index - firstItem.idx.index;
  let extendX = 0;
  if (realIndex > lastIndex) {
    extendX = realIndex - lastIndex;
    realIndex = lastIndex;
  }

  const candle = fullData[realIndex];
  const openTime = candle.opentime + Math.round(extendX) * interv;
  if (!candle) {
    console.log('no x1Item', fullData, realIndex);
    return null;
  }

  return [openTime, extendX];
};

const getShowableItems = ({
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
  const currentItemsMap = {};
  currentItems.forEach((item) => {
    currentItemsMap[item.id] = item;
  });

  const result = [];
  items.forEach((item) => {
    const points = [];
    for (let i = 0; i < item.timePricePoints.length; i++) {
      const timePoint = item.timePricePoints[i];
      const openTime = Math.min(timePoint.openTime, lastCandle.opentime);
      let time = openTime - (openTime % interv);
      const addIndexOpenBegin = Math.floor(
        Math.min(time - firstCandle.opentime, 0) / interv
      );
      const addIndex = Math.floor(
        Math.max(timePoint.openTime - lastCandle.opentime, 0) / interv
      );
      time = timeIndexMap[time] === undefined ? firstCandle.opentime : time;
      const x = timeIndexMap[time] + addIndex + addIndexOpenBegin;
      points.push([x, timePoint.price]);
    }

    result.push({
      ...item,
      points,
    });
  });

  return result;
};

export function path_getShowables(
  timeIndexMap,
  interval,
  lastCandle,
  firstCandle
) {
  const { draws } = this.props;
  const { draws: { [DRAW_TYPE]: currentItems = [] } = {} } = this.state || {};
  const items = getShowableItems({
    timeIndexMap,
    items: draws?.[DRAW_TYPE]?.data?.items,
    currentItems,
    interval,
    lastCandle,
    firstCandle,
  });

  return items;
}

export function path_onComplete(items, { fullData }) {
  const { chartId, dispatch, draws, interval } = this.props;
  const currentDrawData = draws?.[DRAW_TYPE]?.data || {};
  items.forEach((item) => {
    if (!item.id || item.id === 'tmp') {
      item.id = genSimpleID();
    }

    item.timePricePoints = item.points.map((point) => {
      const [openTime, extendX] = indexToTime(point[0], fullData, interval);
      return {
        openTime,
        extendX,
        price: point[1],
      };
    });
  });
  this.setState({
    draws: {
      ...this.state.draws,
      [DRAW_TYPE]: items,
    },
  });

  dispatch(
    actEndDraw(DRAW_TYPE, chartId, {
      ...currentDrawData,
      items,
    })
  );
  dispatch(actUpdateChartToSever(chartId));
}
