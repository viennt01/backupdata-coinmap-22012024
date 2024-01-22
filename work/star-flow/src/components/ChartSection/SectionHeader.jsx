import {
  SVGMore,
  SvgAdd,
  SVGBars,
  SVGCamera,
  SvgExpandH,
  SVGFullScreen,
  SVGFullScreenExit,
  SVGQuestionCircle,
  SvgVerticalCenter,
} from '@/assets/images/svg';
import { HEATMAP_GRADIENTS } from '@/config/consts/colors';
import { candleIntervalsMap } from '@/config/consts/interval';
import {
  CHART_TYPES,
  LAYERS_MAP,
  CHART_TYPE_KEYS,
  HEATMAP_INDICATOR_TYPES,
} from '@/config/consts/layer';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import {
  actChangeChartType,
  toggleAddLayerModal,
  toggleSymbolSearch,
  updateInterval,
} from '@/redux/actions/setting';
import { setShowNeedUpgradePlan } from '@/redux/actions/common';
import { showInfoIncomming } from '@/utils/alert';
import ability, { symbolToFeatureId } from '@/utils/authorize/ability';
import { createFootprintSettings, updateChart } from '@/utils/chart';
import { memo, useCallback, useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import ChartSettings from '../ChartSettings';
import style from './style.module.scss';
import { checkIsHeatmap as isHeatMap } from '@/utils/common';
import { formatDeepCopy } from '@/utils/format';
import { genSimpleID } from '@/utils/generator';
import { initTimeGroup } from '@/redux/reducers/utils/chart-settings';
import Loading from '../Loading';

import CustomSelect from '../FormControls/CustomSelect';
import CloseChartButton from './CloseChartButton';
import { EVENT_SOCKET, METHOD_SOCKET, getTypeOfData } from '../Chart/hook';

const selectCustomStyle = {
  control: (provided) => ({
    ...provided,
    borderRadius: 0,
    minHeight: 21.5,
    border: 'none',
    cursor: 'pointer',
    background: '#0F1A30',
    boxShadow: 'none',
    borderRadius: 3,
  }),
};

const CHART_TYPE_OPTIONS = CHART_TYPES.map((item) => ({
  value: item.id,
  label: item.name,
}));

const HEATMAP_COLOR_OPTIONS = Object.keys(HEATMAP_GRADIENTS).map((key) => {
  const item = HEATMAP_GRADIENTS[key];
  return { value: key, label: item.name };
});

const SectionHeader = memo(
  ({
    chartId,
    onRequestFullscreen,
    saveChartAsImage,
    widerToggle,
    setShowTopRatio,
    showTopRatio,
    heatmapColor,
    setHeatmapColor,
    isAutoCenter,
    toggleAutoCenter,
    isFullScreen,
    sectionRef,
    currentWsRef,
  }) => {
    const {
      symbolInfo,
      chartType,
      layers: layerTimeGroup,
      chart,
      loadingCommon,
    } = useSelector(
      (state) => ({
        symbolInfo: state.chartSettings.charts[chartId]?.symbolInfo || {},
        chartType: state.chartSettings.charts[chartId]?.chartType || '',
        layers: state.chartSettings.charts[chartId]?.layers || [],
        chart: state.chartSettings.charts[chartId],
        loadingCommon: state.common.loading,
      }),
      shallowEqual
    );

    const { symbol, interval, intervals } = symbolInfo;

    const dispatch = useDispatch();

    const handleChangeInterval = (selectedOption) => {
      const selectedTime = selectedOption.value;
      const layers = layerTimeGroup.map((layer) => {
        if (!layer.show) return layer;
        const status = layer.timeGroup.some((item) => {
          let numberMin = item.valueMin;
          let numberMax = item.valueMax;
          if (item.name === 'Hours') {
            numberMin = item.valueMin * 60;
            numberMax = item.valueMax * 60;
          }
          if (
            selectedTime >= numberMin &&
            selectedTime <= numberMax &&
            item.enable === true &&
            item.name === 'Days'
          ) {
            return false;
          }
          return (
            (selectedTime >= numberMin &&
              selectedTime <= numberMax &&
              item.enable === true) ||
            (selectedTime === '1D' && item.enable === true)
          );
        });
        return {
          ...layer,
          show: status,
        };
      });

      const footprintSettings = createFootprintSettings({
        ...chart,
      });

      if (currentWsRef.current) {
        const unSubcribeMessage = JSON.stringify({
          method: METHOD_SOCKET.UNSUBSCRIBE,
          event: EVENT_SOCKET.CANDLESTICK,
          params: [
            `${symbolInfo.exchange.toLowerCase()}.${symbolInfo.symbol.toLowerCase()}.${interval}.${getTypeOfData()}`,
          ],
        });
        currentWsRef.current.ws.send(unSubcribeMessage);

        const message = JSON.stringify({
          method: METHOD_SOCKET.SUBSCRIBE,
          event: EVENT_SOCKET.CANDLESTICK,
          params: [
            `${symbolInfo.exchange.toLowerCase()}.${symbolInfo.symbol.toLowerCase()}.${selectedTime}.${getTypeOfData()}`,
          ],
        });
        currentWsRef.current.ws.send(message);
      }

      const chartUpdate = {
        ...chart,
        layers,
        interval: selectedTime,
        footprintSettings,
        symbolInfo: {
          ...symbolInfo,
          interval: selectedTime,
        },
      };
      if (chart.id) {
        updateChart({ chart: chartUpdate, dispatch });
      }
      dispatch(updateInterval(chartId, chartUpdate));
    };

    const showSymbolSearch = useCallback(() => {
      dispatch(toggleSymbolSearch(chartId));
    }, [dispatch, chartId]);

    const showAddLayerModal = useCallback(() => {
      dispatch(toggleAddLayerModal(chartId));
    }, [dispatch, chartId]);

    const changeChartType = useCallback(
      (selectedOption) => {
        const selectedType = selectedOption.value;
        const layerType = LAYERS_MAP[selectedType];
        if (!layerType) {
          return false;
        }

        const disabled = ability.cannot(
          PERMISSION_ACTIONS.VIEW,
          symbolToFeatureId(symbol),
          layerType.featureId
        );
        if (disabled) {
          dispatch(setShowNeedUpgradePlan(true));
          return false;
        }

        let oldLayers = [];
        if (!isHeatMap(selectedType)) {
          oldLayers = chart.layers.filter((layer) => {
            const layerType = LAYERS_MAP[layer.type];

            return (
              !CHART_TYPE_KEYS.includes(layer.type) &&
              !HEATMAP_INDICATOR_TYPES.includes(layerType)
            );
          });
        }

        const layers = [
          {
            i: genSimpleID(),
            type: selectedType,
            show: true,
            timeGroup: formatDeepCopy(initTimeGroup),
          },
          ...oldLayers,
        ];

        const chartUpdate = {
          ...chart,
          layers,
          chartType: selectedType,
        };

        if (chart.id) {
          updateChart({ chart: chartUpdate, dispatch });
        }

        dispatch(actChangeChartType(chartId, chartUpdate));
      },
      [dispatch, chartId, chart]
    );

    const handleToggleAutoCenter = useCallback(() => {
      toggleAutoCenter(!isAutoCenter);
    }, [toggleAutoCenter, isAutoCenter]);

    const INTERVAL_OPTIONS = useMemo(
      () =>
        Object.keys(candleIntervalsMap).reduce((options, key) => {
          if (intervals.includes(key)) {
            options.push({
              value: key,
              label: candleIntervalsMap[key],
            });
          }
          return options;
        }, []),
      [intervals]
    );

    const isHeatmap = chartType === LAYERS_MAP.heatmap.id;

    const selectMenuTarget = isFullScreen ? sectionRef?.current : document.body;

    return (
      <div className={style.header}>
        <div
          className={`${style.leftControls} ${
            isHeatmap ? style.heatmapLeftControl : ''
          }`}
        >
          <div className={style.basicSettings}>
            <div className={style.customDragHandler}>
              <SVGBars className="customDragHandler" />
            </div>
            <button
              onClick={showSymbolSearch}
              className={`form-control-sm ${style.btnSetting} ${style.symbolContainer}`}
            >
              <span className={style.symbol}>{symbol}</span>{' '}
              <span className={style.exchange}>{symbolInfo.exchange}</span>
              <SVGMore width="20px" height="20px" />
            </button>

            <CustomSelect
              withBackdrop
              className={` ${style.btnSetting}`}
              customStyle={selectCustomStyle}
              value={INTERVAL_OPTIONS.find(
                (option) => option.value === interval
              )}
              options={INTERVAL_OPTIONS}
              onChange={handleChangeInterval}
              menuPortalTarget={selectMenuTarget}
              menuPosition="fixed"
              menuPlacement="auto"
            />

            <CustomSelect
              withBackdrop
              className={` ${style.btnSetting}`}
              customStyle={selectCustomStyle}
              value={CHART_TYPE_OPTIONS.find(
                (item) => item.value === chartType
              )}
              options={CHART_TYPE_OPTIONS}
              onChange={changeChartType}
              menuPortalTarget={selectMenuTarget}
              menuPosition="fixed"
              menuPlacement="auto"
            />

            <button
              onClick={showAddLayerModal}
              className={`form-control-sm ${style.btnSetting}`}
            >
              <SvgAdd width="19px" height="19px" className={style.addIcon} />
              <span>Add indicators</span>
            </button>
            {isHeatmap && (
              <CustomSelect
                withBackdrop
                className={`${style.btnSetting} p-0`}
                customStyle={selectCustomStyle}
                value={HEATMAP_COLOR_OPTIONS.find(
                  (item) => item.value === heatmapColor
                )}
                options={HEATMAP_COLOR_OPTIONS}
                onChange={(selectedItem) => setHeatmapColor(selectedItem.value)}
                menuPortalTarget={selectMenuTarget}
                menuPosition="fixed"
                menuPlacement="auto"
              />
            )}
            {isHeatmap && (
              <input
                className={style.slider}
                type="range"
                step={0.01}
                min={0.1}
                max={0.5}
                value={showTopRatio}
                onChange={(e) => setShowTopRatio(+e.target.value)}
              />
            )}
            {isHeatmap && (
              <button
                style={{
                  minWidth: 32,
                }}
                onClick={handleToggleAutoCenter}
                className={`btn-small btn-default px-2 ${style.btnSetting} ${
                  isAutoCenter ? style.active : ''
                }`}
              >
                <SvgVerticalCenter width={20} height={20} />
              </button>
            )}
          </div>
        </div>
        <div className={['customDragHandler', style.midControls].join(' ')}>
          {loadingCommon && (
            <div className={style.loading}>
              <Loading
                iconProps={{
                  width: '20px',
                  height: '20px',
                }}
              />
            </div>
          )}
        </div>
        <div className={style.rightControls}>
          <button
            className="btn btn-sm btn-link disabled"
            onClick={showInfoIncomming}
          >
            <SVGQuestionCircle />
          </button>
          <button
            className="btn btn-sm btn-link"
            onClick={() =>
              saveChartAsImage({ symbol, symbolInfo, interval, isHeatmap })
            }
          >
            <SVGCamera />
          </button>
          <button className="btn btn-sm btn-link" onClick={onRequestFullscreen}>
            {isFullScreen && <SVGFullScreenExit />}
            {!isFullScreen && <SVGFullScreen />}
          </button>
          {!isFullScreen && (
            <button className="btn btn-sm btn-link" onClick={widerToggle}>
              <SvgExpandH />
            </button>
          )}
          {!isFullScreen && (
            <ChartSettings className="btn btn-sm btn-link" chartId={chartId} />
          )}
          {!isFullScreen && <CloseChartButton chartId={chartId} />}
        </div>
      </div>
    );
  }
);

SectionHeader.displayName = SectionHeader;

export default SectionHeader;
