import { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { SVGClose } from '@/assets/images/svg';
import ConfirmCloseDialog from '@/components/ChartSection/ConfirmCloseDialog';
import { LOCAL_CACHE_KEYS } from '@/config';
import { WARNING_CLOSE_CHART } from '@/config/consts/section';
import { actCloseChartById } from '@/redux/actions';
import { deleteChart, removeToggleIndicatorList } from '@/utils/chart';
import { localStore } from '@/utils/localStorage';
import { actSetWarningCloseChart } from '@/redux/actions/common';

const CloseChartButton = ({ chartId }) => {
  const dispatch = useDispatch();
  const { chartServerId, warningCheckbox } = useSelector(
    (state) => ({
      chartServerId: state.chartSettings.charts[chartId]?.id,
      warningCheckbox: state.common.warningCloseChart,
    }),
    shallowEqual
  );

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const setWarningCheckbox = useCallback(
    (value) => {
      dispatch(actSetWarningCloseChart(value));
    },
    [dispatch]
  );

  useEffect(() => {
    const warning = localStore.get(LOCAL_CACHE_KEYS.WARNING_CLOSE_CHART);
    setWarningCheckbox(warning ?? WARNING_CLOSE_CHART.OPEN);
  }, [setWarningCheckbox]);

  const handleCloseChart = useCallback(() => {
    localStore.set(LOCAL_CACHE_KEYS.WARNING_CLOSE_CHART, warningCheckbox);
    if (chartServerId) {
      deleteChart(chartServerId);
    }
    removeToggleIndicatorList(chartId);
    dispatch(actCloseChartById(chartId));
  }, [warningCheckbox, dispatch, chartId, chartServerId]);

  const handleChangeWarning = useCallback(
    (e) => {
      const value = e.target.checked
        ? WARNING_CLOSE_CHART.HIDDEN
        : WARNING_CLOSE_CHART.OPEN;

      setWarningCheckbox(value);
    },
    [setWarningCheckbox]
  );

  const startCloseChart = useCallback(
    (e) => {
      e.stopPropagation();
      if (warningCheckbox === WARNING_CLOSE_CHART.OPEN) {
        setShowConfirmDialog(true);
      } else {
        handleCloseChart();
      }
    },
    [handleCloseChart, warningCheckbox]
  );

  // hide dialog and reset warning if need
  const handleCancel = useCallback(() => {
    setShowConfirmDialog(false);
    if (warningCheckbox === WARNING_CLOSE_CHART.HIDDEN) {
      setWarningCheckbox(WARNING_CLOSE_CHART.OPEN);
    }
  }, [warningCheckbox, setWarningCheckbox]);

  return (
    <>
      <button className="btn btn-sm btn-link" onClick={startCloseChart}>
        <SVGClose />
      </button>
      <ConfirmCloseDialog
        show={showConfirmDialog}
        handleChangeWarning={handleChangeWarning}
        onConfirm={handleCloseChart}
        onCancel={handleCancel}
        onHide={handleCancel}
      />
    </>
  );
};

export default CloseChartButton;
