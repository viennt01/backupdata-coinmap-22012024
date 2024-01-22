import { DRAW_TOOLS } from '@/config/consts/drawTool';
import { actEndDraw, actUpdateChartToSever } from '@/redux/actions/setting';
import { genSimpleID } from '@/utils/generator';
import { getShowableTriangle } from '@/utils/triangle';
import { intervalToSeconds } from '@/utils/calculator';

export function triangle_onComplete(items, { fullData }) {
  const { chartId, dispatch, draws, interval } = this.props;
  const drawData = draws?.[DRAW_TOOLS.triangle.type]?.data || {};
  const firstItem = fullData[0];
  const interv = intervalToSeconds(interval) * 1000;

  items.forEach((item) => {
    if (!item.id) {
      item.id = genSimpleID();
    }
    let x1ItemIndex = item.start[0] - firstItem.idx.index;
    const lastIndex = fullData.length - 1;
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

    let x2ItemIndex = item.middle[0] - firstItem.idx.index;
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

    let x3ItemIndex = item.end[0] - firstItem.idx.index;
    item.x3Extend = 0;
    if (x3ItemIndex > lastIndex) {
      item.x3Extend = x3ItemIndex - lastIndex;
      x3ItemIndex = lastIndex;
    }
    const x3Item = fullData[x3ItemIndex];
    if (!x3Item) {
      console.log('no x3Item', fullData, x3ItemIndex);
      return;
    }
    item.openTime = x1Item.opentime + Math.round(item.x1Extend) * interv;
    item.middleTime = x2Item.opentime + Math.round(item.x2Extend) * interv;
    item.closeTime = x3Item.opentime + Math.round(item.x3Extend) * interv;
  });
  this.setState({
    draws: {
      ...this.state.draws,
      [DRAW_TOOLS.triangle.type]: items,
    },
  });

  dispatch(
    actEndDraw(DRAW_TOOLS.triangle.type, chartId, {
      ...drawData,
      items,
    })
  );
  dispatch(actUpdateChartToSever(chartId));
}

export function triangle_getShowables(
  timeIndexMap,
  interval,
  lastCandle,
  firstCandle
) {
  const { draws } = this.props;
  const drawType = DRAW_TOOLS.triangle.type;
  const { draws: { [drawType]: currentItems = [] } = {} } = this.state || {};
  const triangle = getShowableTriangle({
    timeIndexMap,
    items: draws?.[drawType]?.data?.items,
    currentItems,
    interval,
    lastCandle,
    firstCandle,
  });

  return triangle;
}
