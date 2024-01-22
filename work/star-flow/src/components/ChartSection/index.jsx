import { getChartConfig } from '@/utils/chart';
import { checkIsHeatmap } from '@/utils/common';
import {
  createContext,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import reactDom from 'react-dom';
import { shallowEqual, useSelector } from 'react-redux';
import { SaveChartAsImage } from '@coinmap/react-stockcharts/lib/helper';
import ChartHeatmapWrapper from '../Chart/ChartHeatmapWrapper';
import ChartWrapper from '../Chart/ChartWrapper';
import LeftToolBar from './LeftToolBar';
import SectionHeader from './SectionHeader';
import style from './style.module.scss';
import Timer from './components/Timer';
import { hexToRGBA } from '@coinmap/react-stockcharts/lib/utils';
import { candleIntervalsMap } from '@/config/consts/interval';
import { APP_NAME } from '@/config';
import SymbolSearchWithData from '@/pages/index/SymbolSearchWithData';
import { LayerSettingModalWithData } from '../LayerSettings/LayerSettingModalWithData';
import { useEffect } from 'react';

const defaultContextValue = {
  sectionRef: null,
  chartRef: null,
  chartCanvasRef: null,
  isFullScreen: false,
};
export const ChartSectionContext = createContext(defaultContextValue);

const MAIN_CHART_ID = 1;
const CHART_HEADER_HEIGHT = 52;
const CHART_FOOTER_HEIGHT = 30;
const CHART_LEFT_TOOLBAR_WIDTH = 56;

const ChartSection = memo(({ onBodyRef, dimension, chartId, widerToggle }) => {
  const sectionRef = useRef(null);
  const chartCanvas = useRef(null);
  const currentWsRef = useRef(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showTopRatio, setShowTopRatio] = useState(0.35);
  const [heatmapColor, setHeatmapColor] = useState('heatmap');
  const [isAutoCenter, setIsAutoCenter] = useState(true);
  const pairs = useSelector((state) => state.common.pairs);
  const contextValue = useRef({ ...defaultContextValue });
  const [reloadChart, setReloadChart] = useState(1);

  const { chartType, symbol } = useSelector(
    (state) => ({
      chartType: state.chartSettings.charts[chartId]?.chartType || '',
      symbol: state.chartSettings.charts[chartId]?.symbolInfo.symbol,
    }),
    shallowEqual
  );

  const isHeatmapChart = checkIsHeatmap(chartType);

  const onRequestFullscreen = useCallback(() => {
    if (!sectionRef.current) {
      return;
    }

    // Enter full screen
    if (!document.fullscreenElement) {
      sectionRef.current.requestFullscreen().then(() => {
        setTimeout(() => {
          setIsFullScreen(true);
        }, 200);
        const handleExit = () => {
          if (document.fullscreenElement) {
            return;
          }
          setIsFullScreen(false);
          document.removeEventListener('fullscreenchange', handleExit);
        };
        document.addEventListener('fullscreenchange', handleExit);
      });
      return;
    }

    document.exitFullscreen().then(() => {
      setIsFullScreen(false);
    });
  }, []);

  const chartDemension = useMemo(() => {
    return !isFullScreen
      ? {
          width: dimension.width,
          height: dimension.height,
        }
      : {
          width: sectionRef.current.clientWidth - CHART_LEFT_TOOLBAR_WIDTH,
          height:
            sectionRef.current.clientHeight -
            (CHART_HEADER_HEIGHT + CHART_FOOTER_HEIGHT),
        };
  }, [isFullScreen, dimension.width, dimension.height]);

  const saveCanvasNode = useCallback(
    (node) => {
      chartCanvas.current = node;
    },
    [chartCanvas]
  );

  const saveChartAsImage = useCallback(
    ({ symbol, symbolInfo: inputSymbolInfo, interval }) => {
      const intervalStr = candleIntervalsMap[interval];
      let symbolInfo = inputSymbolInfo;
      if (
        (!symbolInfo?.description || !symbolInfo?.exchange) &&
        Array.isArray(pairs)
      ) {
        symbolInfo = pairs.find((item) => item.symbol === symbol);
      }

      const container = reactDom.findDOMNode(chartCanvas.current); // eslint-disable-line react/no-find-dom-node
      SaveChartAsImage.saveChartAsImage(container, {
        filename: `${APP_NAME}_${symbol}_${intervalStr}.png`,
        drawOnTop: ({ context, canvas }) => {
          context.font = 'bold 36px Open Sans';
          context.textAlign = 'center';
          context.fillStyle = hexToRGBA('#FFFFFF', 0.3);
          context.fillText(APP_NAME, canvas.width / 2 || 100, 100);
          context.fillText(
            `${symbol} - ${intervalStr}`,
            canvas.width / 2 || 100,
            150
          );

          if (symbolInfo?.description && symbolInfo?.exchange) {
            context.font = 'bold 36px Open Sans';
            context.fillText(
              `${symbolInfo.description} - ${symbolInfo.exchange}`,
              canvas.width / 2 || 100,
              200
            );
          }
          context.stroke();
        },
      });
    },
    [chartCanvas, pairs]
  );

  const toggleAutoCenter = useCallback(
    (flag) => {
      if (!chartCanvas.current) {
        return;
      }
      if (!flag) {
        const newChartConfig = chartCanvas.current.state.chartConfig.map(
          (config) => {
            if (config.id !== MAIN_CHART_ID) {
              return config;
            }

            return {
              ...config,
              yPanEnabled: true,
            };
          }
        );
        chartCanvas.current.setState({ chartConfig: newChartConfig });
      } else {
        console.log('reset y domain', flag);
        chartCanvas.current.resetYDomain();
      }
      setIsAutoCenter(flag);
    },
    [setIsAutoCenter]
  );

  // console.log('chartCanvas.current', chartCanvas.current);
  // const chartConfig = getChartConfig(chartCanvas.current?.state || {}, 1);
  // useEffect(() => {
  //   setIsAutoCenter(!chartConfig?.yPanEnabled);
  // }, [chartConfig?.yPanEnabled]);

  const onZoomY = useCallback(
    (props, state) => {
      const chartConfig = getChartConfig(state || {}, MAIN_CHART_ID);
      setIsAutoCenter(!chartConfig?.yPanEnabled);
    },
    [setIsAutoCenter]
  );

  const modalContainer = useMemo(() => {
    if (isFullScreen) {
      return sectionRef.current;
    }

    return null;
  }, [isFullScreen]);

  useEffect(() => {
    contextValue.current.isFullScreen = isFullScreen;
  }, [isFullScreen]);

  useEffect(() => {
    contextValue.current.sectionRef = sectionRef;
  }, [sectionRef]);

  return (
    <div key={chartId} ref={sectionRef} className={style.sectionWrapper}>
      <ChartSectionContext.Provider value={contextValue.current}>
        <SectionHeader
          chartId={chartId}
          onRequestFullscreen={onRequestFullscreen}
          widerToggle={widerToggle}
          showTopRatio={showTopRatio}
          setShowTopRatio={setShowTopRatio}
          heatmapColor={heatmapColor}
          setHeatmapColor={setHeatmapColor}
          saveChartAsImage={saveChartAsImage}
          isAutoCenter={isAutoCenter}
          toggleAutoCenter={toggleAutoCenter}
          isFullScreen={isFullScreen}
          sectionRef={sectionRef}
          currentWsRef={currentWsRef}
        />
        <div className={style.sectionBody}>
          <LeftToolBar
            symbol={symbol}
            chartId={chartId}
            isHeatmapChart={isHeatmapChart}
            chartDemension={chartDemension}
          />
          <div id={chartId} className={style.chartWrapper} ref={onBodyRef}>
            {dimension.width > 1 && !isHeatmapChart && (
              <ChartWrapper
                {...chartDemension}
                key={reloadChart}
                chartId={chartId}
                sectionRef={sectionRef}
                showTopRatio={showTopRatio}
                heatmapColor={heatmapColor}
                saveCanvasNode={saveCanvasNode}
                onZoomY={onZoomY}
                setReloadChart={setReloadChart}
                isFullScreen={isFullScreen}
                currentWsRef={currentWsRef}
              />
            )}
            {dimension.width > 1 && isHeatmapChart && (
              <ChartHeatmapWrapper
                {...chartDemension}
                chartId={chartId}
                sectionRef={sectionRef}
                showTopRatio={showTopRatio}
                heatmapColor={heatmapColor}
                saveCanvasNode={saveCanvasNode}
                onZoomY={onZoomY}
                isFullScreen={isFullScreen}
              />
            )}
          </div>
        </div>
        <Timer chartId={chartId} />
        <SymbolSearchWithData
          chartId={chartId}
          modalContainer={modalContainer}
        />
        <LayerSettingModalWithData
          chartId={chartId}
          modalContainer={sectionRef.current}
        />
      </ChartSectionContext.Provider>
    </div>
  );
});

ChartSection.displayName = 'ChartSection';

export default ChartSection;
