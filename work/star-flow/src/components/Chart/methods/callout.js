import { DRAW_TOOLS } from '@/config/consts/drawTool';
import {
  actEndDraw,
  actUpdateChartToSever,
  actUpdateDraw,
} from '@/redux/actions/setting';
import { genSimpleID } from '@/utils/generator';
import { intervalToSeconds } from '@/utils/calculator';

const drawType = DRAW_TOOLS.callout.type;

export function callout_textCallout() {
  const { chartId, dispatch } = this.props;
  dispatch(actUpdateDraw(drawType, { showModal: true }, chartId));
}
export function callout_onComplete(items, { fullData }) {
  const { chartId, dispatch, draws, interval } = this.props;
  const drawData = draws?.[DRAW_TOOLS.callout.type]?.data || {};
  const lastIndex = fullData.length - 1;
  const firstItem = fullData[0];
  const interv = intervalToSeconds(interval) * 1000;
  items.forEach((item) => {
    if (!item.id) {
      item.id = genSimpleID();
    }

    let x1ItemIndex = item.start[0] - firstItem.idx.index;
    item.x1Extend = 0;
    if (x1ItemIndex > lastIndex) {
      item.x1Extend = x1ItemIndex - lastIndex;
      x1ItemIndex = lastIndex;
    }
    const x1Item = fullData[x1ItemIndex];
    if (!x1Item) {
      console.log('no x1Item', fullData, x1ItemIndex);
      return;
    }
    let x2ItemIndex = item.end[0] - firstItem.idx.index;
    item.x2Extend = 0;
    if (x2ItemIndex > lastIndex) {
      item.x2Extend = x2ItemIndex - lastIndex;
      x2ItemIndex = lastIndex;
    }

    const x2Item = fullData[x2ItemIndex];
    if (!x2Item) {
      console.log('no x2Item', fullData, x2ItemIndex);
      return;
    }
    item.openTime = x1Item.opentime + Math.round(item.x1Extend) * interv;
    item.closeTime = x2Item.opentime + Math.round(item.x2Extend) * interv;
  });
  this.setState({
    draws: {
      ...this.state.draws,
      [DRAW_TOOLS.callout.type]: items,
    },
  });

  dispatch(
    actEndDraw(DRAW_TOOLS.callout.type, chartId, {
      ...drawData,
      items,
    })
  );
  dispatch(actUpdateChartToSever(chartId));
}
export function callout_getShowables(
  timeIndexMap,
  interval,
  lastCandle,
  firstCandle
) {
  const { draws } = this.props;
  const drawType = DRAW_TOOLS.callout.type;
  const { draws: { [drawType]: currentItems = [] } = {} } = this.state || {};
  const callouts = getShowableCallouts({
    timeIndexMap,
    items: draws?.[drawType]?.data?.items,
    currentItems,
    interval,
    lastCandle,
    firstCandle,
  });

  return callouts;
}
const getShowableCallouts = ({
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
export function callout_handleCloseModal() {
  const { dispatch, chartId, draws } = this.props;
  const drawData = draws[drawType].data;
  const reduxItems = draws[drawType].oldItems;
  dispatch(
    actEndDraw(drawType, chartId, {
      ...drawData,
      items: reduxItems,
    })
  );
  dispatch(actUpdateDraw(drawType, { oldItems: null }, chartId));
  dispatch(actUpdateChartToSever(chartId));
}
export function callout_onDoubleClick() {
  const { dispatch, chartId } = this.props;
  const { draws } = this.state;
  const selectedItem = (draws[drawType] || []).find((item) => item.selected);
  if (!selectedItem) {
    return;
  }
  dispatch(actUpdateDraw(drawType, { showModal: true }, chartId));
}
export function callout_onSave() {
  const { dispatch, draws, chartId } = this.props;
  const drawData = draws[drawType].data;
  const stateItem = this.state.draws[drawType];

  this.setState({
    draws: {
      ...this.state.draws,
      [drawType]: stateItem,
    },
  });

  const reduxItems = drawData?.items || [];
  dispatch(
    actEndDraw(drawType, chartId, {
      ...drawData,
      items: reduxItems,
    })
  );
  dispatch(actUpdateDraw(drawType, { oldItems: null }, chartId));

  dispatch(actUpdateChartToSever(chartId));
}
export function callout_updateDrawsState(items) {
  const { draws } = this.state;
  this.setState({
    draws: {
      ...draws,
      [DRAW_TOOLS.callout.type]: items,
    },
  });
}