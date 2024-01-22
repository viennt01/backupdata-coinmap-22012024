import { DRAW_TOOLS } from '@/config/consts/drawTool';
import { actEndDraw, actUpdateChartToSever } from '@/redux/actions/setting';
import { genSimpleID } from '@/utils/generator';
import { getShowablehorizontalRay } from '@/utils/horizontalRay';
import { intervalToSeconds } from '@/utils/calculator';

export function horizontalRay_onComplete(items, { fullData, ...moreProps }) {
  const { chartId, dispatch, draws, interval } = this.props;
  const drawData = draws?.[DRAW_TOOLS.horizontal_ray.type]?.data || {};
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
      [DRAW_TOOLS.horizontal_ray.type]: items,
    },
  });

  dispatch(
    actEndDraw(DRAW_TOOLS.horizontal_ray.type, chartId, {
      ...drawData,
      items,
    })
  );
  dispatch(actUpdateChartToSever(chartId));
}

export function horizontalRay_getShowables(
  timeIndexMap,
  interval,
  lastCandle,
  firstCandle
) {
  const { draws } = this.props;
  const drawType = DRAW_TOOLS.horizontal_ray.type;
  const { draws: { [drawType]: currentItems = [] } = {} } = this.state || {};
  const horizontalRays = getShowablehorizontalRay({
    timeIndexMap,
    items: draws?.[drawType]?.data?.items,
    currentItems,
    interval,
    lastCandle,
    firstCandle,
  });

  return horizontalRays;
}
