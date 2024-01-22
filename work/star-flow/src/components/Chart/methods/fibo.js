import { DRAW_TOOLS } from '@/config/consts/drawTool';
import { actEndDraw, actUpdateChartToSever } from '@/redux/actions/setting';
import { getShowableFibos } from '@/utils/fibo';
import { genSimpleID } from '@/utils/generator';
import { intervalToSeconds } from '@/utils/calculator';

const DRAW_TYPE = DRAW_TOOLS.fibonacci_retracement.type;

export function fibo_getShowables(timeIndexMap, interval, lastCandle) {
  const { draws } = this.props;
  const { draws: { [DRAW_TYPE]: currentItems = [] } = {} } = this.state || {};
  const items = getShowableFibos({
    timeIndexMap,
    items: draws?.[DRAW_TYPE]?.data?.items,
    currentItems,
    interval,
    lastCandle,
  });

  return items;
}

export function onFibComplete(items, { fullData }) {
  const { chartId, dispatch, draws, interval } = this.props;
  const fiboData = draws?.fibonacci_retracement?.data || {};
  const firstItem = fullData[0];
  const interv = intervalToSeconds(interval) * 1000;

  items.forEach((item) => {
    if (!item.id) {
      item.id = genSimpleID();
    }

    let x1ItemIndex = item.x1 - firstItem.idx.index;
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
    let x2ItemIndex = item.x2 - firstItem.idx.index;
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
      [DRAW_TYPE]: items,
    },
  });

  dispatch(
    actEndDraw(DRAW_TYPE, chartId, {
      ...fiboData,
      items,
    })
  );
  dispatch(actUpdateChartToSever(chartId));
}
