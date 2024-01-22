import { DRAW_TOOLS } from '@/config/consts/drawTool';
import { actEndDraw, actUpdateChartToSever } from '@/redux/actions/setting';
import { genSimpleID } from '@/utils/generator';
import { getShowableVerticalLine } from '@/utils/verticalLine';
import { intervalToSeconds } from '@/utils/calculator';

export function verticalLine_onComplete(items, { fullData }) {
  const { chartId, dispatch, draws, interval } = this.props;
  const drawData = draws?.[DRAW_TOOLS.vertical_line.type]?.data || {};
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

    item.openTime = x1Item.opentime + Math.round(item.x1Extend) * interv;
  });
  this.setState({
    draws: {
      ...this.state.draws,
      [DRAW_TOOLS.vertical_line.type]: items,
    },
  });

  dispatch(
    actEndDraw(DRAW_TOOLS.vertical_line.type, chartId, {
      ...drawData,
      items,
    })
  );
  dispatch(actUpdateChartToSever(chartId));
}

export function verticalLine_getShowables(timeIndexMap, interval, lastCandle) {
  const { draws } = this.props;
  const drawType = DRAW_TOOLS.vertical_line.type;
  const { draws: { [drawType]: currentItems = [] } = {} } = this.state || {};
  const verticalLines = getShowableVerticalLine({
    timeIndexMap,
    items: draws?.[drawType]?.data?.items,
    currentItems,
    interval,
    lastCandle,
  });

  return verticalLines;
}
