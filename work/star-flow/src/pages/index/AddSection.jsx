import { EXTERNAL_URLS, DASHBOARD_CONFIG } from '@/config';
import { SECTION_TYPES } from '@/config/consts/section';
import { ERROR_CODE } from '@/fetcher/utils';
import { getListChart } from '@/hook/fetcher';
import {
  actAddSection,
  updateReduxChart,
  actSetLayout,
} from '@/redux/actions/setting';
import {
  addToggleIndicatorList,
  createChart,
  updateChart,
} from '@/utils/chart';
import { genSimpleID } from '@/utils/generator';
import { useCallback, useMemo } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import style from './AddSection.module.scss';

const AddSection = () => {
  const charts = useSelector((state) => state.chartSettings.charts);
  const dispatch = useDispatch();

  const isContainWatchList = useMemo(
    () =>
      Object.keys(charts).some(
        (chartId) => charts[chartId].type === SECTION_TYPES.WATCH_LIST.type
      ),
    [charts]
  );

  // ASC sort chart based on distance with origin
  const sortedChart = useMemo(() => {
    const mapCharts = Object.keys(charts).map((chartId) => ({
      ...charts[chartId],
      chartId,
    }));
    mapCharts.sort((chartA, chartB) => {
      const { x: ax, y: ay, w: aw, h: ah } = chartA.layout;
      const { x: bx, y: by, w: bw, h: bh } = chartB.layout;
      return (
        Math.sqrt((ax + aw) * (ax + aw) + (ay + ah) * (ay + ah)) -
        Math.sqrt((bx + bw) * (bx + bw) + (by + bh) * (by + bh))
      );
    });
    return mapCharts;
  }, [charts]);

  // calculate next layout based on current layout
  const calculateNextLayout = useCallback(() => {
    // Find max Y
    const minWidth = 4;
    let y = 0,
      x = 0,
      w = 12,
      h = 24;

    for (const chartId in sortedChart) {
      const section = sortedChart[chartId].layout;

      const sectionEndY = section.y + section.h;
      if (sectionEndY >= y) {
        y = sectionEndY;
        x = section.x + section.w;
      }
    }

    if (x > 5) {
      if (x <= 24 - minWidth) {
        w = 24 - x;
      } else {
        x = 0;
      }
    }
    y = 999999 + Object.keys(sortedChart).length; // do not use Infinity, it will be set null in database

    return {
      x,
      y,
      w,
      h,
    };
  }, [sortedChart]);

  // auto layout and resize sections which are overlap with watch list section
  const relocationSection = useCallback(() => {
    // check overlap, do not relocation if watch list is not overlap by other sections
    const isOverlap = Object.keys(sortedChart).some((chartId) => {
      const { x, y, w } = sortedChart[chartId].layout;
      return y < 24 && x + w > 8;
    });
    if (!isOverlap) return;

    // update layout for sections
    let dynamicLayout = { x: 0, y: 0, w: 18, h: 24 };
    let isFirstSectionOverlap = true;
    for (const chart of sortedChart) {
      if (chart.layout.y < 24) {
        const newLayout = isFirstSectionOverlap
          ? {
              ...chart.layout,
              ...dynamicLayout,
            }
          : {
              ...chart.layout,
              y: 24,
            };
        chart.layout = newLayout;
        if (chart.id) {
          updateChart({ chart, dispatch });
        }
        dispatch(actSetLayout(newLayout, chart.chartId));
        isFirstSectionOverlap = false;
      }
    }
  }, [sortedChart, dispatch]);

  const LIMIT_SECTION = DASHBOARD_CONFIG.LIMIT_SECTION;
  const isReachMaxChartCount = useMemo(() => {
    const totalChart = Object.keys(charts || {}).length;

    return totalChart >= LIMIT_SECTION;
  }, [charts, LIMIT_SECTION]);

  const getExistedWatchList = async () => {
    try {
      const res = await getListChart();
      if (res.status !== ERROR_CODE.OK) {
        return null;
      }

      const watchList = res.data.find(
        (chart) => chart.content.type === SECTION_TYPES.WATCH_LIST.type
      );
      return watchList;
    } catch {
      return null;
    }
  };

  // handle add section
  const handleAddSection = useCallback(
    async (sectionType) => {
      if (isReachMaxChartCount) {
        return;
      }

      let layout = {};
      let existedWatchList = null;
      if (sectionType === SECTION_TYPES.WATCH_LIST.type) {
        existedWatchList = await getExistedWatchList();
        relocationSection();
        layout = {
          x: 18,
          y: 0,
          w: 6,
          h: 24,
          minW: 4,
        };
      } else {
        layout = calculateNextLayout();
      }

      const chartId = genSimpleID();

      if (sectionType === SECTION_TYPES.CHART.type) {
        addToggleIndicatorList(chartId);
      }

      const selected =
        Object.keys(charts).every((chartId) => {
          return charts[chartId].type !== SECTION_TYPES.CHART.type;
        }) && sectionType === SECTION_TYPES.CHART.type;

      dispatch(actAddSection(sectionType, layout, chartId, selected));

      if (!existedWatchList) {
        const res = await createChart({
          chartId,
          sectionType,
          layout: {
            ...layout,
            i: chartId,
          },
          selected,
        });
        // update id to chart in redux
        if (res.status === ERROR_CODE.OK) {
          dispatch(updateReduxChart(chartId, { id: res.id }));
        }
      } else {
        dispatch(updateReduxChart(chartId, { id: existedWatchList.id }));
      }
    },
    [
      calculateNextLayout,
      relocationSection,
      dispatch,
      charts,
      isReachMaxChartCount,
    ]
  );

  return (
    <div className={style.container}>
      <DropdownButton
        align="end"
        variant="outline-info"
        title="+ Add section"
        drop="up"
        menuVariant="dark"
        className={style.box}
      >
        {isReachMaxChartCount && (
          <Dropdown.Item as="label" className={style.group}>
            <small>You have reached setions limit (Max: {LIMIT_SECTION})</small>
          </Dropdown.Item>
        )}
        {Object.values(SECTION_TYPES).map((sectionType) => (
          <Dropdown.Item
            key={sectionType.type}
            onClick={() => handleAddSection(sectionType.type)}
            as="button"
            disabled={
              (sectionType.type === SECTION_TYPES.WATCH_LIST.type &&
                isContainWatchList) ||
              isReachMaxChartCount
            }
          >
            {sectionType.name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      <a
        href={EXTERNAL_URLS.FEEDBACK_FORM}
        target="_blank"
        title="Feedback"
        rel="noreferrer"
      >
        Feedback
      </a>
    </div>
  );
};

export default AddSection;
