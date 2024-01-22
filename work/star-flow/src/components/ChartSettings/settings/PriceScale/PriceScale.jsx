import { useState } from 'react';
import { setPriceScaleSettings } from '@/redux/actions/setting';
import { useDispatch, useSelector } from 'react-redux';

import Content from './Content';
import fpStyles from './../components/styles.module.scss';
import PRICE_SCALE_SETTINGS from '@/config/consts/settings/pricescale';
import { updateChart } from '@/utils/chart';

const PriceScaleSettings = ({ chartId, handleClose }) => {
  const dispatch = useDispatch();

  const priceScaleSettings = useSelector(
    (state) =>
      state.chartSettings.charts[chartId]?.priceScaleSettings ||
      PRICE_SCALE_SETTINGS
  );
  const [settings] = useState(JSON.parse(JSON.stringify(priceScaleSettings)));

  const chart = useSelector((state) => state.chartSettings.charts[chartId]);

  const handleUpdateChart = (priceScaleSettings) => {
    if (chart.id) {
      const chartUpdate = {
        ...chart,
        priceScaleSettings,
      };
      updateChart({
        chart: chartUpdate,
        dispatch,
      });
    }
  };

  const handleSavePriceScaleSettings = () => {
    handleUpdateChart(settings);
    handleClose(true);
  };

  const handleRSaveAsDefaultPriceScaleSettings = () => {
    handleUpdateChart(PRICE_SCALE_SETTINGS);
    dispatch(setPriceScaleSettings(chartId, PRICE_SCALE_SETTINGS));
    handleClose(true);
  };

  const handleResetPriceScaleSettings = () => {
    dispatch(setPriceScaleSettings(chartId, settings));
  };

  const handleUpdateSettings = (settings) => {
    dispatch(setPriceScaleSettings(chartId, settings));
  };

  return (
    <div>
      <Content
        chartId={chartId}
        setSettings={handleUpdateSettings}
        settings={JSON.parse(JSON.stringify(priceScaleSettings))} //unmutate
      />
      <div className={fpStyles.buttonContainer}>
        <button
          onClick={handleSavePriceScaleSettings}
          className={[
            fpStyles.buttonSettings,
            fpStyles.buttonSettings_Blue,
          ].join(' ')}
        >
          Save
        </button>
        <button
          onClick={handleRSaveAsDefaultPriceScaleSettings}
          className={[fpStyles.buttonSettings].join(' ')}
        >
          Save as Default
        </button>
        <button
          onClick={handleResetPriceScaleSettings}
          className={[fpStyles.buttonSettings].join(' ')}
        >
          Reset settings
        </button>
      </div>
    </div>
  );
};

export default PriceScaleSettings;
