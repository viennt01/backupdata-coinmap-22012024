import { LAYERS_MAP } from '@/config/consts/layer';
import {
  actSetLayerIdSetting,
  actSetLayerSetting,
  actUpdateChartToSever,
} from '@/redux/actions/setting';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import LayerSettingModal from './LayerSettingModal';

export const LayerSettingModalWithData = ({ chartId, ...props }) => {
  const dispatch = useDispatch();
  const originLayer = useRef(null); // save layer setting for reset to
  const selectedLayer = useSelector((state) => {
    const chart = state.chartSettings.charts[chartId] || {};
    if (!chart || !chart.layerIdSetting) {
      return null;
    }

    const { layers = [], layerIdSetting } = chart;
    return layers.find((item) => item.i === layerIdSetting);
  }, shallowEqual);

  // tmp settings
  const [values, setValues] = useState(selectedLayer?.settings);

  // check show only when layer changed
  const show = useMemo(() => {
    return !!selectedLayer;
  }, [selectedLayer]);

  // set or unset origin layer settings when show status change only (=on show/hide modal)
  useEffect(() => {
    if (!show) {
      originLayer.current = null;
    } else {
      originLayer.current = selectedLayer;
      setValues(selectedLayer?.settings);
    }
  }, [show]); // WARNING: do not add selectedLayer

  // reset to origin settings
  const onReset = useCallback(() => {
    dispatch(
      actSetLayerSetting(
        chartId,
        originLayer.current.i,
        originLayer.current.settings
      )
    );
    setValues(originLayer.current.settings);
  }, [chartId, dispatch]);

  // reset and close
  const onClose = useCallback(
    (needReset = true) => {
      if (needReset) {
        onReset();
      }
      dispatch(actSetLayerIdSetting(chartId, null));
    },
    [chartId, dispatch, onReset]
  );

  // save settings -> close modal -> update settings to server
  const onSave = useCallback(() => {
    dispatch(actSetLayerSetting(chartId, selectedLayer.i, values));
    onClose(false);
    dispatch(actUpdateChartToSever(chartId));
  }, [chartId, dispatch, selectedLayer, onClose, values]);

  // set tmp settings, save layer settings to preview, need reset if user close before save
  const onChange = useCallback(
    (settings) => {
      setValues(settings);
      dispatch(actSetLayerSetting(chartId, selectedLayer.i, settings));
    },
    [chartId, dispatch, selectedLayer]
  );

  // reset to default settings of layer and close modal
  const onResetDefault = useCallback(() => {
    const layerType = originLayer.current.type;
    const layerTypeInfo = LAYERS_MAP[layerType];
    if (!layerTypeInfo.settings) {
      return;
    }
    dispatch(
      actSetLayerSetting(chartId, originLayer.current.i, layerTypeInfo.settings)
    );
    // close but don't reset
    onClose(false);
    dispatch(actUpdateChartToSever(chartId));
  }, [chartId, dispatch, onClose]);

  return (
    <LayerSettingModal
      show={show}
      layer={selectedLayer}
      onClose={onClose}
      onSave={onSave}
      onReset={onReset}
      onResetDefault={onResetDefault}
      onChange={onChange}
      values={values}
      {...props}
    />
  );
};
