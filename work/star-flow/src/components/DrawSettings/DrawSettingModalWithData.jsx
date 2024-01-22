import {
  actSetDrawSetting,
  actUpdateDraw,
  actUpdateChartToSever,
} from '@/redux/actions/setting';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import DrawSettingModal from './DrawSettingModal';
import { DEFAULT_SETTINGS } from '@/config/consts/drawSettings/common';

export const DrawSettingModalWithData = ({
  show,
  chartId,
  drawType,
  draws,
  modalContainer,
}) => {
  const dispatch = useDispatch();
  const originDraw = useRef(null); // save draw setting for reset to
  const selectedDraw = draws?.find((draw) => draw.selected);

  // tmp settings
  const [values, setValues] = useState(selectedDraw);

  // set or unset origin draw settings when show status change only (=on show/hide modal)
  useEffect(() => {
    if (!show) {
      originDraw.current = null;
    } else {
      originDraw.current = selectedDraw;
      setValues(selectedDraw);
    }
  }, [show]); // WARNING: do not add selectedDraw

  // reset to origin settings
  const handleReset = useCallback(() => {
    dispatch(
      actSetDrawSetting(chartId, drawType, selectedDraw.id, originDraw.current)
    );
    setValues(originDraw.current);
  }, [chartId, dispatch, drawType, selectedDraw?.id]);

  // reset and close
  const handleClose = useCallback(
    (needReset = true) => {
      if (needReset) {
        handleReset();
      }
      dispatch(actUpdateDraw(drawType, { showModal: false }, chartId));
    },
    [dispatch, handleReset, chartId, drawType]
  );

  // save settings -> close modal -> update settings to server
  const handleSave = useCallback(() => {
    dispatch(actSetDrawSetting(chartId, drawType, selectedDraw.id, values));
    handleClose(false);
    dispatch(actUpdateChartToSever(chartId));
  }, [chartId, dispatch, selectedDraw?.id, handleClose, values, drawType]);

  // set tmp settings, save layer settings to preview, need reset if user close before save
  const handleChange = useCallback(
    (settings) => {
      setValues(settings);
      dispatch(actSetDrawSetting(chartId, drawType, selectedDraw.id, settings));
    },
    [chartId, dispatch, selectedDraw?.id, drawType]
  );

  // reset to default settings of layer and close modal
  const handleResetDefault = useCallback(() => {
    if (!DEFAULT_SETTINGS[drawType]) return;

    dispatch(
      actSetDrawSetting(
        chartId,
        drawType,
        selectedDraw.id,
        DEFAULT_SETTINGS[drawType]
      )
    );
    handleClose(false); // close but don't reset
    dispatch(actUpdateChartToSever(chartId));
  }, [chartId, dispatch, handleClose, drawType, selectedDraw?.id]);

  return (
    <DrawSettingModal
      modalContainer={modalContainer}
      show={show}
      drawType={drawType}
      values={values}
      onClose={handleClose}
      onSave={handleSave}
      onReset={handleReset}
      onResetDefault={handleResetDefault}
      onChange={handleChange}
    />
  );
};
