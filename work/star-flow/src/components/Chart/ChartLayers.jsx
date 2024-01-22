import {
  VolumeProfileSessionSeries,
  CandlestickSeries,
  CandlestickSeriesOrderflow,
  StackImbalance,
  AreaSeries,
  HeatMap,
  VWAPSeries,
  LineSeries,
  BollingerSeries,
  DonchianSeries,
} from '@coinmap/react-stockcharts/lib/series';

import { LAYERS_MAP, LAYER_DISPLAY_TYPES } from '@/config/consts/layer';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { HEATMAP_GRADIENTS } from '@/config/consts/colors';
import {
  VOLUME_SESSION_TYPES,
  VOLUME_SESSION_PERIODS,
} from '@/config/consts/volume';
import ability, { symbolToFeatureId } from '@/utils/authorize/ability';
import { useSelector, useDispatch } from 'react-redux';
import { GET_VWAP_BANDS_YACCESSORS } from '@/config/consts/settings/vwap';
import { getCurrentFootprintSetting } from '@/utils/chart';
import { actSetLayerIdSetting } from '@/redux/actions/setting';
import { GET_BOLLINGER_YACCESSORS } from '@/config/consts/settings/bollinger';
import { GET_DONCHIAN_YACCESSORS } from '@/config/consts/settings/donchian';
import { DASHBOARD_CONFIG } from '@/config';
import { DEFAULT_TIMEZONE } from '../ChartSection/components/Timer';
import { DRAWING_TYPE } from '@/utils/drawingPriority';
import { generateGroupId } from '@coinmap/react-stockcharts/lib/utils';
import { GET_CE_YACCESSORS } from '@/config/consts/settings/chandelierExit';

const extendLastX = 1000;

export default function ChartLayers({
  chartId,
  layers,
  fontWeight,
  theme,
  tickFormat,
  heatmapColor,
  showTopRatio,
  ticks,
  ticksOfSymbol,
  symbol,
  timezone,
  symbolType,
}) {
  const footprintSettings = useSelector((state) => {
    const footprints =
      state.chartSettings.charts[chartId]?.footprintSettings || [];
    const currentFootprintSettings = getCurrentFootprintSetting(footprints, {
      symbol: state.chartSettings.charts[chartId].symbolInfo.symbol,
      interval: state.chartSettings.charts[chartId].symbolInfo.interval,
    });

    return currentFootprintSettings;
  });

  const dispatch = useDispatch();

  const showLayerSettingModal = (chartId, layerId) => {
    dispatch(actSetLayerIdSetting(chartId, layerId));
  };

  return layers.map((layer) => {
    if (layer.position > DASHBOARD_CONFIG.LIMIT_INDICATOR) return null;

    if (!layer.show || layer.displayType === LAYER_DISPLAY_TYPES.PANE) {
      return null;
    }

    const layerTypeInfo = LAYERS_MAP[layer.type];
    if (
      !layerTypeInfo ||
      ability.cannot(
        PERMISSION_ACTIONS.VIEW,
        symbolToFeatureId(symbol),
        layerTypeInfo.featureId
      )
    ) {
      return null;
    }

    switch (layer.type) {
      case 'candle':
        return (
          <CandlestickSeries
            groupId={generateGroupId(
              DRAWING_TYPE.CHART,
              layer.i,
              layer.position
            )}
            key={layer.i}
            stroke="none"
            wickStroke={(d) =>
              d.close > d.open ? theme.borderUpColor : theme.borderDwColor
            }
            fill={(d) => (d.close > d.open ? theme.upColor : theme.dwColor)}
            opacity={1}
            fontWeight={fontWeight}
          />
        );
      case 'area':
        return (
          <AreaSeries
            groupId={generateGroupId(
              DRAWING_TYPE.CHART,
              layer.i,
              layer.position
            )}
            key={layer.i}
            stroke={theme.upColor}
            fill={theme.dwColor}
            yAccessor={(d) => d.close}
          />
        );
      case 'vwap':
        const bandYAccessors = GET_VWAP_BANDS_YACCESSORS(
          layer.i,
          layer.settings || {}
        );

        // Fill band when show line only
        const settings = { ...(layer.settings || {}) };
        settings.band1 = {
          ...settings.band1,
          fill: settings.band1?.show && settings.band1?.fill,
        };
        settings.band2 = {
          ...settings.band2,
          fill: settings.band2?.show && settings.band2?.fill,
        };
        settings.band3 = {
          ...settings.band3,
          fill: settings.band3?.show && settings.band3?.fill,
        };

        return (
          <VWAPSeries
            groupId={generateGroupId(
              DRAWING_TYPE.INDICATOR,
              layer.i,
              layer.position
            )}
            key={layer.i}
            yAccessor={(d) => d?.[layer.i]?.vwap}
            offset={layer.settings.offset}
            bandsOptions={settings}
            bandsYAccessors={bandYAccessors}
            highlightOnHover
            onDoubleClick={() => showLayerSettingModal(chartId, layer.i)}
          />
        );
      case 'heatmap_vwap': {
        const settings = { ...(layer.settings || {}) };

        return (
          <>
            <LineSeries
              groupId={generateGroupId(
                DRAWING_TYPE.INDICATOR,
                layer.i,
                layer.position
              )}
              key={`${layer.i}-line1`}
              yAccessor={(d) => d.vwap}
              stroke={settings?.vwap?.borderColor}
              strokeWidth={settings?.vwap?.lineSize + 2}
              strokeDasharray={settings.vwap.lineType}
              fill="none"
            />
            <LineSeries
              groupId={generateGroupId(
                DRAWING_TYPE.INDICATOR,
                layer.i,
                layer.position
              )}
              key={`${layer.i}-line2`}
              yAccessor={(d) => d.vwap}
              stroke={settings?.vwap?.lineColor}
              strokeWidth={settings?.vwap?.lineSize}
              strokeDasharray={settings.vwap.lineType}
              fill="none"
            />
          </>
        );
      }
      case 'orderflow':
        return (
          <>
            <CandlestickSeriesOrderflow
              groupId={generateGroupId(
                DRAWING_TYPE.CHART,
                layer.i,
                layer.position,
                1
              )}
              wickStroke={(d) =>
                d.close > d.open ? theme.upColor : theme.dwColor
              }
              key={layer.i}
              stroke={(d) =>
                d.close > d.open ? theme.borderUpColor : theme.borderDwColor
              }
              ticks={ticks}
              minTicks={ticksOfSymbol.tickvalue}
              settings={footprintSettings}
            />
            {footprintSettings.stackImbalance && (
              <StackImbalance
                groupId={generateGroupId(
                  DRAWING_TYPE.CHART,
                  layer.i,
                  layer.position,
                  2
                )}
                key={`${layer.i}-footprints`}
                stroke="none"
                wickStroke={(d) =>
                  d.close > d.open ? theme.borderUpColor : theme.borderDwColor
                }
                fill={(d) =>
                  d.close > d.open
                    ? footprintSettings.imbalance.noBuyColor
                    : footprintSettings.imbalance.noSellColor
                }
                opacity={1}
                fontWeight={fontWeight}
              />
            )}
          </>
        );
      case 'heatmap':
        return (
          <HeatMap
            groupId={generateGroupId(
              DRAWING_TYPE.CHART,
              layer.i,
              layer.position
            )}
            sameMaxVol
            showTooltip={false}
            key={layer.i}
            extendLastX={extendLastX}
            tickFormat={tickFormat}
            buyGradient={HEATMAP_GRADIENTS[heatmapColor].buy}
            sellGradient={HEATMAP_GRADIENTS[heatmapColor].sell}
            showTopRatio={showTopRatio}
            useSameSideVol
          />
        );

      case 'volumeSession': {
        const settings = layer.settings ?? {};
        const sessionProfileSumFunc = VOLUME_SESSION_TYPES[settings.dataType];
        return (
          <VolumeProfileSessionSeries
            groupId={generateGroupId(
              DRAWING_TYPE.INDICATOR,
              layer.i,
              layer.position
            )}
            key={layer.i}
            stroke="none"
            bySession
            showSessionBackground
            opacity={({ type }) =>
              type === 'up' ? settings.vpBidOpacity : settings.vpAskOpacity
            }
            sessionBackGround={settings.vpBackground}
            sessionBackGroundOpacity={settings.vpBackgroundOpacity}
            sessionStart={VOLUME_SESSION_PERIODS[settings.period](
              timezone,
              symbolType
            )}
            source={(t) => t.p}
            customToBins={(arr) => {
              const bins = [];
              arr.forEach((d) => sessionProfileSumFunc(d, bins));
              return bins;
            }}
            partialStartOK
            partialEndOK
            fill={({ type }) =>
              type === 'up' ? settings.vpBidColor : settings.vpAskColor
            }
            settings={settings}
          />
        );
      }

      case 'sma': {
        const settings = { ...(layer.settings || {}) };

        return (
          <LineSeries
            groupId={generateGroupId(
              DRAWING_TYPE.INDICATOR,
              layer.i,
              layer.position
            )}
            key={layer.i}
            offset={settings.input.offset}
            yAccessor={(d) => d?.[layer.i]?.sma}
            strokeDasharray={settings.style.lineType}
            strokeWidth={settings.style.lineSize}
            stroke={settings.style.lineColor}
            strokeOpacity={settings.style.lineOpacity}
            highlightOnHover
            disableDrag
            showCursorWhenHovering
            hoverStrokeWidth={settings.style.lineSize + 1}
            onDoubleClick={() => showLayerSettingModal(chartId, layer.i)}
          />
        );
      }

      case 'wma': {
        const settings = { ...(layer.settings || {}) };

        return (
          <LineSeries
            groupId={generateGroupId(
              DRAWING_TYPE.INDICATOR,
              layer.i,
              layer.position
            )}
            key={layer.i}
            yAccessor={(d) => d?.[layer.i]?.wma}
            offset={settings.input.offset}
            strokeDasharray={settings.style.lineType}
            strokeWidth={settings.style.lineSize}
            stroke={settings.style.lineColor}
            strokeOpacity={settings.style.lineOpacity}
            highlightOnHover
            disableDrag
            showCursorWhenHovering
            hoverStrokeWidth={settings.style.lineSize + 1}
            onDoubleClick={() => showLayerSettingModal(chartId, layer.i)}
          />
        );
      }

      case 'vwma': {
        const settings = { ...(layer.settings || {}) };

        return (
          <LineSeries
            groupId={generateGroupId(
              DRAWING_TYPE.INDICATOR,
              layer.i,
              layer.position
            )}
            key={layer.i}
            yAccessor={(d) => d?.[layer.i]?.vwma}
            offset={settings.input.offset}
            strokeDasharray={settings.style.lineType}
            strokeWidth={settings.style.lineSize}
            stroke={settings.style.lineColor}
            strokeOpacity={settings.style.lineOpacity}
            highlightOnHover
            disableDrag
            showCursorWhenHovering
            hoverStrokeWidth={settings.style.lineSize + 1}
            onDoubleClick={() => showLayerSettingModal(chartId, layer.i)}
          />
        );
      }

      case 'swma': {
        const settings = { ...(layer.settings || {}) };

        return (
          <LineSeries
            groupId={generateGroupId(
              DRAWING_TYPE.INDICATOR,
              layer.i,
              layer.position
            )}
            key={layer.i}
            yAccessor={(d) => d?.[layer.i]?.swma}
            offset={settings.input.offset}
            strokeDasharray={settings.style.lineType}
            strokeWidth={settings.style.lineSize}
            stroke={settings.style.lineColor}
            strokeOpacity={settings.style.lineOpacity}
            highlightOnHover
            disableDrag
            showCursorWhenHovering
            hoverStrokeWidth={settings.style.lineSize + 1}
            onDoubleClick={() => showLayerSettingModal(chartId, layer.i)}
          />
        );
      }

      case 'bollinger': {
        const settings = { ...(layer.settings || {}) };
        const bandYAccessors = GET_BOLLINGER_YACCESSORS(layer.i);

        return (
          <BollingerSeries
            groupId={generateGroupId(
              DRAWING_TYPE.INDICATOR,
              layer.i,
              layer.position
            )}
            key={layer.i}
            offset={settings.input.offset}
            bandsOptions={settings.style}
            bandsYAccessors={bandYAccessors}
            highlightOnHover
            onDoubleClick={() => showLayerSettingModal(chartId, layer.i)}
          />
        );
      }

      case 'donchian': {
        const settings = { ...(layer.settings || {}) };
        const bandYAccessors = GET_DONCHIAN_YACCESSORS(layer.i);

        return (
          <DonchianSeries
            groupId={generateGroupId(
              DRAWING_TYPE.INDICATOR,
              layer.i,
              layer.position
            )}
            key={layer.i}
            offset={settings.input.offset}
            bandsOptions={settings.style}
            bandsYAccessors={bandYAccessors}
            highlightOnHover
            onDoubleClick={() => showLayerSettingModal(chartId, layer.i)}
          />
        );
      }

      case 'ce': {
        const settings = { ...(layer.settings || {}) };
        const yAccessors = GET_CE_YACCESSORS(layer.i);

        return (
          <LineSeries
            groupId={generateGroupId(
              DRAWING_TYPE.INDICATOR,
              layer.i,
              layer.position
            )}
            key={layer.i}
            offset={settings.input.offset}
            yAccessor={yAccessors.ce}
            strokeDasharray={settings.style.lineType}
            strokeWidth={settings.style.lineSize}
            stroke={settings.style.lineColor}
            strokeOpacity={settings.style.lineOpacity}
            highlightOnHover
            disableDrag
            showCursorWhenHovering
            hoverStrokeWidth={settings.style.lineSize + 1}
            onDoubleClick={() => showLayerSettingModal(chartId, layer.i)}
          />
        );
      }

      default:
        return null;
    }
  });
}

ChartLayers.defaultProps = {
  ticks: 10,
  timezone: DEFAULT_TIMEZONE.timezone,
};
