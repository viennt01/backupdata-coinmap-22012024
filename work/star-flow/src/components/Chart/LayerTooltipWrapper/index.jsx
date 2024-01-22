import { useCallback, useState, memo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  actAddLayer,
  actDelLayer,
  actLayerMoveDown,
  actLayerMoveUp,
  actToggleLayer,
  toggleAddLayerModal,
  actSetLayerIdSetting,
  actUpdateChartToSever,
} from '@/redux/actions/setting';
import { LAYERS_MAP } from '@/config/consts/layer';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { LOCAL_CACHE_KEYS, DASHBOARD_CONFIG } from '@/config';
import { LAYER_SETTINGS } from '@/components/LayerSettings/settings';
import { formatDeepCopy } from '@/utils/format';
import { sortLayers } from '@/utils/mapping';
import { genSimpleID } from '@/utils/generator';
import { updateChart, updateToggleIndicatorList } from '@/utils/chart';
import { checkIsHeatmap } from '@/utils/common';
import { localStore } from '@/utils/localStorage';
import ability, { symbolToFeatureId } from '@/utils/authorize/ability';
import { actAddError, setShowNeedUpgradePlan } from '@/redux/actions/common';
import { initTimeGroup } from '@/redux/reducers/utils/chart-settings';
import { LayerTooltip } from '@coinmap/react-stockcharts/lib/tooltip';
import AddLayerModal from '@/components/Layers/AddLayerModal';
import TooltipContent from './TooltipContent';
import VisibilityModal from './VisibilityModal';

const LayerTooltipWrapper = ({
  layers,
  chartId,
  showAddLayerModal,
  sectionRef,
  symbol,
}) => {
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [toggleIndicatorList, setToggleIndicatorList] = useState(() => {
    return (
      localStore.get(LOCAL_CACHE_KEYS.TOGGLE_INDICATOR_LIST) || {
        [chartId]: false,
      }
    );
  });
  const dispatch = useDispatch();

  const { id, chart } = useSelector(
    (state) => ({
      id: state.chartSettings.charts[chartId]?.id || '',
      chart: state.chartSettings.charts[chartId],
    }),
    shallowEqual
  );

  const isHeatmap = checkIsHeatmap(chart.chartType);

  const toggleLayer = useCallback(
    (layerId) => () => {
      dispatch(actToggleLayer(chartId, layerId));
      dispatch(actUpdateChartToSever(chartId));
    },
    [dispatch, chartId]
  );

  const moveUp = useCallback(
    (layerId, layerIndex) => () => {
      if (layerIndex === layers.length - 1) return;
      dispatch(actLayerMoveUp({ chartId, layerIndex, layerId }));
      dispatch(actUpdateChartToSever(chartId));
    },
    [dispatch, chartId, layers]
  );

  const moveDown = useCallback(
    (layerId, layerIndex) => () => {
      if (layerIndex === 0) return;
      dispatch(actLayerMoveDown({ chartId, layerIndex, layerId }));
      dispatch(actUpdateChartToSever(chartId));
    },
    [dispatch, chartId]
  );

  const deleteLayer = useCallback(
    (layerId) => () => {
      const layersNew = chart.layers.filter((l) => l.i !== layerId);
      const chartUpdate = {
        ...chart,
        layers: sortLayers(layersNew),
      };
      dispatch(actDelLayer(chartId, chartUpdate));
      dispatch(actUpdateChartToSever(chartId));
    },
    [dispatch, chartId, chart]
  );

  const showIndicatorSearch = useCallback(() => {
    dispatch(toggleAddLayerModal(chartId));
  }, [dispatch, chartId]);

  const showLayerSettingModal = useCallback(
    (layerId) => () => {
      dispatch(actSetLayerIdSetting(chartId, layerId));
    },
    [dispatch, chartId]
  );

  const addLayer = useCallback(
    (layerType) => {
      if (layers.length >= DASHBOARD_CONFIG.LIMIT_INDICATOR)
        return dispatch(setShowNeedUpgradePlan(true));

      const layerTypeInfo = LAYERS_MAP[layerType];
      if (!layerTypeInfo) {
        return;
      }

      // check permission
      const canNotView = ability.cannot(
        PERMISSION_ACTIONS.VIEW,
        symbolToFeatureId(symbol),
        layerTypeInfo.featureId
      );
      if (canNotView) {
        dispatch(setShowNeedUpgradePlan(true));
        return;
      }

      // count layer having same type
      const layerCount = layers.reduce(
        (count, layer) => (layer.type === layerType ? ++count : count),
        0
      );
      if (layerCount === layerTypeInfo.limit) {
        dispatch(
          actAddError({
            message: 'You have reached the indicator limit',
            showType: 'info',
            delay: 1500,
          })
        );
        return;
      }

      let layersNew = [...chart.layers];

      if (layerType === LAYERS_MAP.heatmap.id) {
        layersNew = [];
      }

      const newLayer = {
        i: genSimpleID(),
        type: layerType,
        show: true,
        timeGroup: formatDeepCopy(initTimeGroup),
        settings: layerTypeInfo.settings
          ? formatDeepCopy(layerTypeInfo.settings)
          : undefined,
      };
      layersNew = sortLayers([...layersNew, newLayer]);

      const chartUpdate = {
        ...chart,
        layers: layersNew,
        showAddLayerModal: false,
      };
      if (id) {
        updateChart({ chart: chartUpdate, dispatch });
      }
      dispatch(toggleAddLayerModal(chartId));
      dispatch(actAddLayer(chartId, chartUpdate));
    },
    [dispatch, chartId, layers, chart, id, symbol]
  );

  const handleOnHide = () => {
    if (id) {
      updateChart({
        chart: {
          ...chart,
          showAddLayerModal: false,
        },
        dispatch,
      });
    }
    dispatch(toggleAddLayerModal(chartId));
  };

  const handleToggleIndicatorList = () => {
    updateToggleIndicatorList(chartId);
    setToggleIndicatorList((prev) => ({ ...prev, [chartId]: !prev[chartId] }));
  };

  const layerList = layers
    .map((layer, index) => {
      const cannotSetting = !LAYER_SETTINGS[layer.type];
      const layerTypeInfo = LAYERS_MAP[layer.type];
      const cannotView = ability.cannot(
        PERMISSION_ACTIONS.VIEW,
        symbolToFeatureId(symbol),
        layerTypeInfo.featureId
      );
      const offset =
        layer.settings?.offset ?? layer.settings?.input?.offset ?? 0;
      const disabled =
        cannotView || layer.position > DASHBOARD_CONFIG.LIMIT_INDICATOR;

      return {
        key: layer.i,
        show: layer.show,
        offset,
        disabled,
        disabledSetting: cannotSetting,
        onClickView: toggleLayer(layer.i),
        onClickSetting: showLayerSettingModal(layer.i),
        onClickMoveDown: moveDown(layer.i, index),
        onClickMoveUp: moveUp(layer.i, index),
        onClickDelete: deleteLayer(layer.i),
        getContent: (currentItem) => (
          <TooltipContent
            layer={layer}
            currentItem={currentItem}
            disabled={disabled}
          />
        ),
      };
    })
    .reverse();

  return (
    <>
      <LayerTooltip
        origin={[6, 44]}
        layers={layerList}
        collapsedIndicators={toggleIndicatorList?.[chartId]}
        onCollapseIndicators={handleToggleIndicatorList}
        onAddIndicator={showIndicatorSearch}
      />

      <AddLayerModal
        show={showAddLayerModal}
        onHide={handleOnHide}
        onSelect={addLayer}
        container={sectionRef.current}
        isHeatmap={isHeatmap}
      />

      <VisibilityModal
        show={showVisibilityModal}
        setShow={setShowVisibilityModal}
        layer={{}}
        chartId={chartId}
      />
    </>
  );
};

export default memo(LayerTooltipWrapper);
