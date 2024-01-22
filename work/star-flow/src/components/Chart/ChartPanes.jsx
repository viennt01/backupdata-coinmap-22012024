import PaneDevider from './components/PaneDevider';
import renderDeltaChart from './components/DeltaChart';
import renderAccumulatedDeltaChart from './components/DeltaAccumulatedChart';
import renderRSIChart from './components/RSIChart';
import renderDMIChart from './components/DMIChart';
import renderATRChart from './components/ATRChart';
import renderRVOLChart from './components/RVOLChart';
import renderSTDIndexChart from './components/STDIndexChart';
import renderHPRChart from './components/HPRChart';
import { LAYERS_MAP } from '@/config/consts/layer';
import ability, { symbolToFeatureId } from '@/utils/authorize/ability';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import CumulativeDeltaInfo from './components/DeltaAccumulatedInfo';
import { actSetLayerIdSetting } from '@/redux/actions/setting';
import { X_AXIS_HEIGHT } from './components/XAxis';
import { DASHBOARD_CONFIG } from '@/config';

export default function useChartPanes({
  chartPaneLayers,
  width,
  handleUpdateLayerHeight,
  height,
  theme,
  fontWeight,
  fontSize,
  xGrid,
  gridWidth,
  tickFormat,
  numberFormat,
  timeDisplayFormat,
  resizeHandlers,
  defaultPanelHeight,
  nextYPosition,
  showXAxisMainChart,
  chartId,
  symbol,
  isHeatmap,
  data,
  heatmapData,
  dispatch,
}) {
  const useablePanes = chartPaneLayers.reverse().filter((layer) => {
    const layerTypeInfo = LAYERS_MAP[layer.type];
    if (!layerTypeInfo) {
      return null;
    }

    const useable = ability.can(
      PERMISSION_ACTIONS.VIEW,
      symbolToFeatureId(symbol),
      layerTypeInfo.featureId
    );

    return useable;
  });

  const extraElements = [];

  const showLayerSettingModal = (chartId, layerId) => () => {
    dispatch(actSetLayerIdSetting(chartId, layerId));
  };

  const chartPanes = useablePanes.map((layer, index) => {
    if (layer.position > DASHBOARD_CONFIG.LIMIT_INDICATOR) return null;

    const showXAxis = 0 === index;
    const DIVIDER_HEIGHT = 3;
    let layerHeight = (layer.height || defaultPanelHeight) - DIVIDER_HEIGHT;
    nextYPosition += layerHeight;

    let topDevider = height - nextYPosition - DIVIDER_HEIGHT;
    if (showXAxis) {
      topDevider -= X_AXIS_HEIGHT; // height of XAxis
    }
    if (showXAxis) {
      nextYPosition += X_AXIS_HEIGHT; // height of XAxis
    }
    const devider = (
      <PaneDevider
        key={layer.i}
        layerId={layer.i}
        width={width}
        height={layerHeight}
        onUpdateHeight={handleUpdateLayerHeight}
        top={topDevider}
      />
    );

    switch (layer.type) {
      case 'delta': {
        showXAxisMainChart = false;
        const chartProps = {
          key: layer.i,
          id: layer.i,
          height: layerHeight,
          hPosition: nextYPosition,
          showXAxis,
          theme,
          fontWeight,
          fontSize,
          xGrid,
          gridWidth,
          tickFormat,
          numberFormat,
          chartId,
        };

        resizeHandlers.push(devider);

        return renderDeltaChart(chartProps);
      }

      case 'accumulatedDelta': {
        showXAxisMainChart = false;
        const chartProps = {
          key: layer.i,
          id: layer.i,
          height: layerHeight,
          hPosition: nextYPosition,
          showXAxis,
          theme,
          fontWeight,
          fontSize,
          xGrid,
          gridWidth,
          tickFormat,
          numberFormat,
          chartId,
          topDevider,
          data,
          heatmapData,
        };

        resizeHandlers.push(devider);

        if (isHeatmap) {
          extraElements.push(
            <CumulativeDeltaInfo {...chartProps} key={layer.i} />
          );
        }

        return renderAccumulatedDeltaChart(chartProps);
      }

      case 'rsi': {
        showXAxisMainChart = false;
        const chartProps = {
          chartId,
          height: layerHeight,
          hPosition: nextYPosition,
          fontWeight,
          fontSize,
          xGrid,
          gridWidth,
          showXAxis,
          layer,
          showLayerSettingModal: showLayerSettingModal(chartId, layer.i),
        };

        resizeHandlers.push(devider);

        return renderRSIChart(chartProps);
      }

      case 'atr': {
        showXAxisMainChart = false;
        const chartProps = {
          chartId,
          height: layerHeight,
          hPosition: nextYPosition,
          fontWeight,
          fontSize,
          xGrid,
          gridWidth,
          tickFormat,
          showXAxis,
          layer,
          showLayerSettingModal: showLayerSettingModal(chartId, layer.i),
        };

        resizeHandlers.push(devider);

        return renderATRChart(chartProps);
      }

      case 'rvol': {
        showXAxisMainChart = false;
        const chartProps = {
          chartId,
          height: layerHeight,
          hPosition: nextYPosition,
          fontWeight,
          fontSize,
          xGrid,
          gridWidth,
          tickFormat,
          showXAxis,
          layer,
          showLayerSettingModal: showLayerSettingModal(chartId, layer.i),
        };

        resizeHandlers.push(devider);

        return renderRVOLChart(chartProps);
      }

      case 'dmi': {
        showXAxisMainChart = false;
        const chartProps = {
          chartId,
          height: layerHeight,
          hPosition: nextYPosition,
          timeDisplayFormat,
          fontWeight,
          fontSize,
          xGrid,
          gridWidth,
          showXAxis,
          layer,
          showLayerSettingModal: showLayerSettingModal(chartId, layer.i),
        };

        resizeHandlers.push(devider);

        return renderDMIChart(chartProps);
      }

      case 'stdIndex': {
        showXAxisMainChart = false;
        const chartProps = {
          chartId,
          height: layerHeight,
          hPosition: nextYPosition,
          timeDisplayFormat,
          fontWeight,
          fontSize,
          xGrid,
          gridWidth,
          showXAxis,
          layer,
          showLayerSettingModal: showLayerSettingModal(chartId, layer.i),
        };

        resizeHandlers.push(devider);

        return renderSTDIndexChart(chartProps);
      }

      case 'hpr': {
        showXAxisMainChart = false;
        const chartProps = {
          chartId,
          height: layerHeight,
          hPosition: nextYPosition,
          timeDisplayFormat,
          fontWeight,
          fontSize,
          xGrid,
          gridWidth,
          showXAxis,
          layer,
          showLayerSettingModal: showLayerSettingModal(chartId, layer.i),
        };

        resizeHandlers.push(devider);

        return renderHPRChart(chartProps);
      }

      default:
        return null;
    }
  });

  return [chartPanes, showXAxisMainChart, nextYPosition, extraElements];
}
