import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GridLayout from '@coinmap/react-grid-layout';
import Head from 'next/head';
import NoSleep from 'nosleep.js';

import { sectionTypes } from '@/components/Sections';
import {
  actDeleteDraws,
  actSetLayout,
  actSetSelectedChart,
  actUpdateChartToSever,
} from '@/redux/actions/setting';
import AddSection from '../index/AddSection';
import { withAuthSync } from '@/utils/auth';
import { fetchListPairs } from '@/redux/actions';
import { checkHasSelectedDraw, updateChart } from '@/utils/chart';
import style from './style.module.scss';
import { DASHBOARD_CONFIG } from '@/config';
import { isSingleKey } from '@/utils/keyboard';

const customRefs = {};

const Index = () => {
  const [sectionDimensions, setSectionDimensions] = useState({});
  const [windowSize, setWindowSize] = useState({ width: 0, rowHeight: 0 });

  const charts = useSelector((state) => state.chartSettings.charts);
  const loadingCommon = useSelector((state) => state.common.loading);
  const deleteDrawTimeoutRef = useRef(0);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchListPairs());
  }, []);

  const deleteDraw = useCallback(() => {
    const selectedChartId = Object.keys(charts).find(
      (key) => charts[key]?.selected
    );

    if (!selectedChartId || !charts[selectedChartId]?.draws) {
      return;
    }

    const hasSelectedDraw = checkHasSelectedDraw(charts[selectedChartId]);
    if (!hasSelectedDraw) {
      return;
    }

    dispatch(actDeleteDraws(selectedChartId));
    dispatch(actUpdateChartToSever(selectedChartId));
  }, [charts, dispatch]);

  // listen hotkey delete draw
  useEffect(() => {
    const handleHotkey = (event) => {
      if (isSingleKey(event, ['Backspace', 'Delete'])) {
        if (deleteDrawTimeoutRef.current) {
          return;
        }

        deleteDrawTimeoutRef.current = setTimeout(() => {
          deleteDraw();
          deleteDrawTimeoutRef.current = 0;
        }, 200);
      } else if (deleteDrawTimeoutRef.current) {
        clearTimeout(deleteDrawTimeoutRef.current);
        deleteDrawTimeoutRef.current = 0;
      }
    };

    window.addEventListener('keyup', handleHotkey);

    return () => {
      window.removeEventListener('keyup', handleHotkey);
    };
  }, [charts, deleteDraw]);

  const calcGridSize = useCallback(() => {
    const newWindowSize = {
      rowHeight: Math.max(Math.floor((window.innerHeight - 100) / 35), 1),
      width: window.innerWidth - 5,
    };
    setWindowSize(newWindowSize);
  }, []);

  useEffect(() => {
    calcGridSize();
    window.addEventListener('resize', calcGridSize);

    // Prevent device from sleep, screen saver on first page click
    const noSleep = new NoSleep();
    const disableSleep = () => {
      noSleep.enable();
      document.removeEventListener('click', disableSleep);
    };
    document.addEventListener('click', disableSleep);

    return () => {
      window.removeEventListener('resize', calcGridSize);

      if (noSleep.isEnabled) {
        noSleep.disable();
      }
    };
  }, [calcGridSize]);

  const saveLayout = useCallback(
    (newLayout, chartId) => {
      const chart = charts[chartId];
      chart.layout = newLayout;
      if (chart.id) {
        updateChart({ chart, dispatch });
      }
      dispatch(actSetLayout(newLayout, chartId));
    },
    [dispatch, charts]
  );

  const handleUpdateDemensions = useCallback(() => {
    setSectionDimensions((sectionDimensions) => {
      const dimensions = {
        ...sectionDimensions,
      };

      Object.keys(customRefs).forEach((key) => {
        if (!customRefs[key]) {
          delete customRefs[key];
          return;
        }
        const ref = customRefs[key];
        dimensions[key] = {
          width: ref.clientWidth,
          height: Math.max(ref.clientHeight, 1),
        };
      });

      return dimensions;
    });
  }, []);

  useEffect(() => {
    handleUpdateDemensions();
  }, [windowSize, handleUpdateDemensions]);

  const layouts = Object.keys(charts).map((key) => {
    return charts[key]?.layout;
  });

  const widerToggle = useCallback(
    (chartId) => {
      const layout = charts[chartId].layout;
      const newLayout = {
        ...layout,
        oldW: layout.w,
        oldH: layout.h,
        w: layout.w === 24 ? layout.oldW || 12 : 24,
        h: layout.w === 24 ? layout.oldH || 12 : 24,
      };

      saveLayout(newLayout, chartId);
    },
    [charts, saveLayout]
  );

  const handleLayoutChange = (layoutsUpdate) => {
    handleUpdateDemensions();
    for (const layoutUpdate of layoutsUpdate) {
      const layout = layouts.find((l) => l.i === layoutUpdate.i);
      if (JSON.stringify(layout) !== JSON.stringify(layoutUpdate)) {
        saveLayout(layoutUpdate, layoutUpdate.i);
      }
    }
  };

  const handleSelectChart = (chart) => {
    if (loadingCommon) return;

    const preSelectedChartId = Object.keys(charts).find((key) => {
      return charts[key]?.selected;
    });

    if (chart.type !== 'chart' || chart.chartId === preSelectedChartId) return;

    // remove old selected chart
    if (preSelectedChartId) {
      const preChart = charts[preSelectedChartId];
      preChart.selected = false;
      if (preChart.id) {
        updateChart({ chart: preChart, dispatch });
      }
      dispatch(actSetSelectedChart(false, preChart.chartId));
    }

    // update new selected chart
    chart.selected = true;
    if (chart.id) {
      updateChart({ chart, dispatch });
    }
    dispatch(actSetSelectedChart(true, chart.chartId));
  };

  const renderedSections = Object.keys(charts)
    .sort((keyA, keyB) => {
      const layoutA = charts[keyA].layout;
      const layoutB = charts[keyB].layout;

      return layoutA.x + layoutA.y - (layoutB.x + layoutB.y);
    })
    .map((key, index) => {
      const dimension = sectionDimensions[key] || { width: 0, height: 1 };
      const chart = charts[key];
      const chartType =
        index < DASHBOARD_CONFIG.LIMIT_SECTION ? chart.type : 'upgradeAlert';
      const Component = sectionTypes[chartType];

      const props = {
        chartId: key,
        dimension,
        onBodyRef: (ref) => {
          customRefs[key] = ref;
        },
        symbol: chart.symbolInfo.symbol,
        interval: chart.symbolInfo.interval,
        widerToggle: () => widerToggle(key),
      };
      if (chartType === 'iframe') {
        props.src = chart.src;
      }

      return (
        <div
          className={`${chart.selected ? style.selectedChart : ''}`}
          key={key}
          onClick={() => handleSelectChart(chart)}
        >
          <Component {...props} />
        </div>
      );
    });

  return (
    <>
      <Head>
        <title>CEX Trading - Coinmap</title>
      </Head>
      {windowSize.rowHeight > 0 && (
        <GridLayout
          // autoSize
          resizeHandles={['e', 'n', 's', 'w', 'se']}
          className="layout"
          layout={layouts}
          cols={24}
          rowHeight={windowSize.rowHeight}
          width={windowSize.width}
          draggableHandle=".customDragHandler"
          onLayoutChange={handleLayoutChange}
          compactType={'vertical'}
        >
          {renderedSections}
        </GridLayout>
      )}
      <AddSection />
    </>
  );
};

export default withAuthSync(Index);
