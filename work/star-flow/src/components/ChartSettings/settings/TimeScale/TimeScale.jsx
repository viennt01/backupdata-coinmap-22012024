import { useState } from 'react';
import { setTimeScaleSettings } from '@/redux/actions/setting';
import TIME_SCALE_SETTINGS from '@/config/consts/settings/timescale';
import { useDispatch, useSelector } from 'react-redux';

import Content from './Content';
import fpStyles from './../components/styles.module.scss';
import { updateChart } from '@/utils/chart';

const TimeScaleSettings = ({ chartId, handleClose }) => {
  const dispatch = useDispatch();

  const timeScaleSettings = useSelector(
    (state) =>
      state.chartSettings.charts[chartId]?.timeScaleSettings ||
      TIME_SCALE_SETTINGS
  );

  const [settings] = useState(JSON.parse(JSON.stringify(timeScaleSettings)));

  const chart = useSelector((state) => state.chartSettings.charts[chartId]);

  const handleUpdateChart = (timeScaleSettings) => {
    if (chart.id) {
      const chartUpdate = {
        ...chart,
        timeScaleSettings,
      };
      updateChart({
        chart: chartUpdate,
        dispatch,
      });
    }
  };

  const handleSaveTimeScaleSettings = () => {
    handleUpdateChart(timeScaleSettings);
    handleClose(true);
  };

  const handleRSaveAsDefaultTimeScaleSettings = () => {
    handleUpdateChart(TIME_SCALE_SETTINGS);
    dispatch(setTimeScaleSettings(chartId, TIME_SCALE_SETTINGS));
    handleClose(true);
  };

  const handleResetTimeScaleSettings = () => {
    dispatch(setTimeScaleSettings(chartId, settings));
  };

  const handleUpdateSettings = (settings) => {
    dispatch(setTimeScaleSettings(chartId, settings));
  };

  return (
    <div>
      <Content
        chartId={chartId}
        setSettings={handleUpdateSettings}
        settings={JSON.parse(JSON.stringify(timeScaleSettings))}
      />
      <div className={fpStyles.buttonContainer}>
        <button
          onClick={handleSaveTimeScaleSettings}
          className={[
            fpStyles.buttonSettings,
            fpStyles.buttonSettings_Blue,
          ].join(' ')}
        >
          Save
        </button>
        <button
          onClick={handleRSaveAsDefaultTimeScaleSettings}
          className={[fpStyles.buttonSettings].join(' ')}
        >
          Save as Default
        </button>
        <button
          onClick={handleResetTimeScaleSettings}
          className={[fpStyles.buttonSettings].join(' ')}
        >
          Reset settings
        </button>
      </div>
    </div>
  );
};

export default TimeScaleSettings;
