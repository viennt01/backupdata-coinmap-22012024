import { DRAW_TOOLS } from '@/config/consts/drawTool';
import { actEndDraw, actUpdateChartToSever } from '@/redux/actions/setting';
import { genSimpleID } from '@/utils/generator';
import { getShowableLongPosition } from '@/utils/longPosition';
import { intervalToSeconds } from '@/utils/calculator';

export function longPosition_onComplete(items, { fullData }) {
  const { chartId, dispatch, draws, interval } = this.props;
  const drawData = draws?.[DRAW_TOOLS.long_position.type]?.data || {};
  const lastIndex = fullData.length - 1;
  const firstItem = fullData[0];
  const intervalSecond = intervalToSeconds(interval) * 1000;

  items.forEach((item) => {
    if (!item.id) {
      item.id = genSimpleID();
    }

    let entry1Index = item.entryStart[0] - firstItem.idx.index;
    item.xEntry1Extend = 0;
    if (entry1Index > lastIndex) {
      item.xEntry1Extend = entry1Index - lastIndex;
      entry1Index = lastIndex;
    }
    const entry1 = fullData[entry1Index];
    if (!entry1) {
      console.log('no entry1', fullData, entry1Index);
      return;
    }

    let entry2Index = item.entryEnd[0] - firstItem.idx.index;
    item.xEntry2Extend = 0;
    if (entry2Index > lastIndex) {
      item.xEntry2Extend = entry2Index - lastIndex;
      entry2Index = lastIndex;
    }
    const entry2 = fullData[entry2Index];
    if (!entry2) {
      console.log('no entry2', fullData, entry2Index);
      return;
    }

    item.entryOpenTime1 =
      entry1.opentime + Math.round(item.xEntry1Extend) * intervalSecond;
    item.entryOpenTime2 =
      entry2.opentime + Math.round(item.xEntry2Extend) * intervalSecond;
  });
  this.setState({
    draws: {
      ...this.state.draws,
      [DRAW_TOOLS.long_position.type]: items,
    },
  });

  dispatch(
    actEndDraw(DRAW_TOOLS.long_position.type, chartId, {
      ...drawData,
      items,
    })
  );
  dispatch(actUpdateChartToSever(chartId));
}

export function longPosition_getShowables(
  timeIndexMap,
  interval,
  lastCandle,
  firstCandle
) {
  const { draws } = this.props;
  const drawType = DRAW_TOOLS.long_position.type;
  const { draws: { [drawType]: currentItems = [] } = {} } = this.state || {};
  const longPositions = getShowableLongPosition({
    timeIndexMap,
    items: draws?.[drawType]?.data?.items,
    currentItems,
    interval,
    lastCandle,
    firstCandle,
  });

  return longPositions;
}
