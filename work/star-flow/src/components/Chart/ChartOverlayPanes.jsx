import renderVolumePane from './components/PaneVolume';
import { DASHBOARD_CONFIG } from '@/config';

export default function useChartOverlayPanes({
  chartOverlayLayers,
  mainChartHeight,
  layersMap,
  theme,
  fontWeight,
  fontSize,
  gridWidth,
  tickFormat,
  numberFormat,
  showXAxisMainChart,
}) {
  const chartOverlayPanes = chartOverlayLayers.reverse().map((layer) => {
    if (layer.position > DASHBOARD_CONFIG.LIMIT_INDICATOR) return null;

    switch (layer.type) {
      case layersMap.volume.id: {
        const chartProps = {
          key: layer.i,
          id: layer.i,
          height: 100,
          hPosition: mainChartHeight - 100,
          theme,
          fontWeight,
          fontSize,
          gridWidth,
          tickFormat,
          numberFormat,
          showXAxisMainChart,
        };

        return renderVolumePane(chartProps);
      }

      default:
        return null;
    }
  });
  return chartOverlayPanes;
}
