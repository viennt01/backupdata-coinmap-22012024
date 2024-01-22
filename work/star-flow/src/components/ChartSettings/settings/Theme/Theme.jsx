import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '@/redux/actions/setting';

import Content from './Content';
import fpStyles from './../components/styles.module.scss';
import THEME_SETTINGS from '@/config/consts/settings/theme';
import { updateChart } from '@/utils/chart';

const ThemeSettings = ({ chartId, handleClose }) => {
  const dispatch = useDispatch();

  const themeSettings = useSelector(
    (state) =>
      state.chartSettings.charts[chartId]?.themeSettings || THEME_SETTINGS
  );
  const [settings] = useState(JSON.parse(JSON.stringify(themeSettings)));

  const chart = useSelector((state) => state.chartSettings.charts[chartId]);

  const handleUpdateChart = (themeSettings) => {
    if (chart.id) {
      const chartUpdate = {
        ...chart,
        themeSettings,
      };
      updateChart({
        chart: chartUpdate,
        dispatch,
      });
    }
  };

  const handleSaveThemeSettings = () => {
    handleUpdateChart(themeSettings);
    handleClose(true);
  };

  const handleRSaveAsDefaultThemeSettings = () => {
    handleUpdateChart(THEME_SETTINGS);
    dispatch(setTheme(chartId, THEME_SETTINGS));
    handleClose(true);
  };

  const handleResetThemeSettings = () => {
    dispatch(setTheme(chartId, settings));
  };

  const handleUpdateSettings = (settings) => {
    dispatch(setTheme(chartId, settings));
  };

  return (
    <div>
      <Content
        chartId={chartId}
        setSettings={handleUpdateSettings}
        settings={JSON.parse(JSON.stringify(themeSettings))}
      />
      <div className={fpStyles.buttonContainer}>
        <button
          onClick={handleSaveThemeSettings}
          className={[
            fpStyles.buttonSettings,
            fpStyles.buttonSettings_Blue,
          ].join(' ')}
        >
          Save
        </button>
        <button
          onClick={handleRSaveAsDefaultThemeSettings}
          className={[fpStyles.buttonSettings].join(' ')}
        >
          Save as Default
        </button>
        <button
          onClick={handleResetThemeSettings}
          className={[fpStyles.buttonSettings].join(' ')}
        >
          Reset settings
        </button>
      </div>
    </div>
  );
};

export default ThemeSettings;
