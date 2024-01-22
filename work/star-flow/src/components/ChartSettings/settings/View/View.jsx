import { useState } from 'react';
import { setViewSettings } from '@/redux/actions/setting';
import VIEW_SETTINGS from '@/config/consts/settings/view';
import { useDispatch, useSelector } from 'react-redux';

import Content from './Content';
import fpStyles from './../components/styles.module.scss';
import { updateChart } from '@/utils/chart';

const ViewSettings = ({ chartId, handleClose }) => {
  const dispatch = useDispatch();

  const viewSettings = useSelector(
    (state) =>
      state.chartSettings.charts[chartId]?.viewSettings || VIEW_SETTINGS
  );
  const chart = useSelector((state) => state.chartSettings.charts[chartId]);

  const [settings] = useState(JSON.parse(JSON.stringify(viewSettings)));

  const handleUpdateChart = (viewSettings) => {
    if (chart.id) {
      const chartUpdate = {
        ...chart,
        viewSettings,
      };
      updateChart({
        chart: chartUpdate,
        dispatch,
      });
    }
  };
  const handleSaveViewSettings = () => {
    handleUpdateChart(viewSettings);
    handleClose(true);
  };

  const handleRSaveAsDefaultViewSettings = () => {
    handleUpdateChart(VIEW_SETTINGS);
    dispatch(setViewSettings(chartId, VIEW_SETTINGS));
    handleClose(true);
  };

  const handleResetViewSettings = () => {
    dispatch(setViewSettings(chartId, settings));
  };

  const handleUpdateSettings = (settings) => {
    dispatch(setViewSettings(chartId, settings));
  };

  return (
    <div>
      <Content
        chartId={chartId}
        setSettings={handleUpdateSettings}
        settings={JSON.parse(JSON.stringify(viewSettings))}
      />
      <div className={fpStyles.buttonContainer}>
        <button
          onClick={handleSaveViewSettings}
          className={[
            fpStyles.buttonSettings,
            fpStyles.buttonSettings_Blue,
          ].join(' ')}
        >
          Save
        </button>
        <button
          onClick={handleRSaveAsDefaultViewSettings}
          className={[fpStyles.buttonSettings].join(' ')}
        >
          Save as Default
        </button>
        <button
          onClick={handleResetViewSettings}
          className={[fpStyles.buttonSettings].join(' ')}
        >
          Reset settings
        </button>
      </div>
    </div>
  );
};

export default ViewSettings;
