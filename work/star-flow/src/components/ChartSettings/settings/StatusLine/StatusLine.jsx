import { useState } from 'react';
import { setStatusLineSettings } from '@/redux/actions/setting';
import STATUS_LINE_SETTINGS from '@/config/consts/settings/statusline';
import { useDispatch, useSelector } from 'react-redux';

import Content from './Content';
import fpStyles from './../components/styles.module.scss';
import { updateChart } from '@/utils/chart';

const StatusLineSettings = ({ chartId, handleClose }) => {
  const dispatch = useDispatch();

  const statusLineSettings = useSelector(
    (state) =>
      state.chartSettings.charts[chartId]?.statusLineSettings ||
      STATUS_LINE_SETTINGS
  );

  const [settings] = useState(JSON.parse(JSON.stringify(statusLineSettings)));

  const chart = useSelector((state) => state.chartSettings.charts[chartId]);

  const handleUpdateChart = (statusLineSettings) => {
    if (chart.id) {
      const chartUpdate = {
        ...chart,
        statusLineSettings,
      };
      updateChart({
        chart: chartUpdate,
        dispatch,
      });
    }
  };

  const handleSaveStatusLineSettings = () => {
    handleUpdateChart(statusLineSettings);
    handleClose(true);
  };

  const handleRSaveAsDefaultStatusLineSettings = () => {
    handleUpdateChart(STATUS_LINE_SETTINGS);
    dispatch(setStatusLineSettings(chartId, STATUS_LINE_SETTINGS));
    handleClose(true);
  };

  const handleResetStatusLineSettings = () => {
    dispatch(setStatusLineSettings(chartId, settings));
  };

  const handleUpdateSettings = (settings) => {
    dispatch(setStatusLineSettings(chartId, settings));
  };

  return (
    <div>
      <Content
        chartId={chartId}
        setSettings={handleUpdateSettings}
        settings={JSON.parse(JSON.stringify(statusLineSettings))} // unmutable
      />
      <div className={fpStyles.buttonContainer}>
        <button
          onClick={handleSaveStatusLineSettings}
          className={[
            fpStyles.buttonSettings,
            fpStyles.buttonSettings_Blue,
          ].join(' ')}
        >
          Save
        </button>
        <button
          onClick={handleRSaveAsDefaultStatusLineSettings}
          className={[fpStyles.buttonSettings].join(' ')}
        >
          Save as Default
        </button>
        <button
          onClick={handleResetStatusLineSettings}
          className={[fpStyles.buttonSettings].join(' ')}
        >
          Reset settings
        </button>
      </div>
    </div>
  );
};

export default StatusLineSettings;
