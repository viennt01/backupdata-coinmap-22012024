import { useContext } from 'react';
import { setFootprintSettings } from '@/redux/actions/setting';
import FOOTPRINT_SETTINGS, {
  APPLY_SETTINGS_FOR,
} from '@/config/consts/settings/footprint';
import { useDispatch, useSelector } from 'react-redux';

import Content from './Content';
import fpStyles from '../components/styles.module.scss';
import { getCurrentFootprintSetting, updateChart } from '@/utils/chart';
import { ChartSectionContext } from '@/components/ChartSection';

const FootprintSettings = ({ chartId, handleClose, chartStore }) => {
  const contextValue = useContext(ChartSectionContext);
  const chart = useSelector((state) => state.chartSettings.charts[chartId]);

  const footprintSettings = useSelector((state) => {
    const footprints =
      state.chartSettings.charts[chartId]?.footprintSettings || [];

    const fpExisted = getCurrentFootprintSetting(footprints, {
      symbol: state.chartSettings.charts[chartId].symbolInfo.symbol,
    });
    return fpExisted;
  });
  const dispatch = useDispatch();

  const handleResetFootprintSettings = () => {
    const fpSettingsNew = JSON.parse(chartStore).footprintSettings;
    dispatch(setFootprintSettings(chartId, fpSettingsNew));
  };

  const handleRSaveAsDefaultFootprintSettings = () => {
    const FOOTPRINT_SETTINGS_DEFAULT = {
      ...FOOTPRINT_SETTINGS,
      symbol: chart.symbolInfo.symbol,
    };
    const currrentSettings = getCurrentFootprintSetting(
      chart.footprintSettings,
      {
        symbol: chart.symbolInfo.symbol,
      }
    );
    let fpSettingsNew = [];
    if (currrentSettings.applySettingsFor === APPLY_SETTINGS_FOR.ALL) {
      // check symbol and interval to create new or update
      fpSettingsNew = chart.footprintSettings.map(() => {
        return {
          ...FOOTPRINT_SETTINGS_DEFAULT,
          applySettingsFor: APPLY_SETTINGS_FOR.ALL,
        };
      });
    }

    if (currrentSettings.applySettingsFor === APPLY_SETTINGS_FOR.CURRENT) {
      // check symbol and interval to create new or update
      fpSettingsNew = chart.footprintSettings.map((f) => {
        if (f.symbol === chart.symbolInfo.symbol) {
          return {
            ...FOOTPRINT_SETTINGS_DEFAULT,
            applySettingsFor: APPLY_SETTINGS_FOR.CURRENT,
          };
        }
        return {
          ...f,
          applySettingsFor: APPLY_SETTINGS_FOR.CURRENT,
        };
      });
    }

    dispatch(setFootprintSettings(chartId, fpSettingsNew));

    if (chart.id) {
      const chartUpdate = {
        ...chart,
        footprintSettings: fpSettingsNew,
      };

      updateChart({
        chart: chartUpdate,
        dispatch,
      });
    }
    handleClose(true);
  };

  const handleSaveFootprintSettings = () => {
    if (chart.id) {
      const chartUpdate = {
        ...chart,
        footprintSettings: chart.footprintSettings,
      };

      updateChart({
        chart: chartUpdate,
        dispatch,
      });
    }

    handleClose(true);
  };

  const handleUpdateSettings = (footprintSettings) => {
    // check symbol and interval to create new or update
    let fpSettingsNew = [];
    switch (footprintSettings.applySettingsFor) {
      // all symbol have the same setting
      case APPLY_SETTINGS_FOR.ALL: {
        fpSettingsNew = chart.footprintSettings.map((f) => {
          return {
            ...footprintSettings,
            symbol: f.symbol,
          };
        });

        break;
      }
      case APPLY_SETTINGS_FOR.CURRENT: {
        fpSettingsNew = chart.footprintSettings.map((f) => {
          if (f.symbol === footprintSettings.symbol) {
            return footprintSettings;
          }
          return {
            ...f,
            applySettingsFor: APPLY_SETTINGS_FOR.CURRENT,
          };
        });
        break;
      }
    }
    if (contextValue.chartRef) {
      contextValue.chartRef.reDrawChartBySettings(footprintSettings);
    }
    dispatch(setFootprintSettings(chartId, fpSettingsNew));
  };

  return (
    <div>
      <Content
        chartId={chartId}
        setSettings={handleUpdateSettings}
        settings={JSON.parse(JSON.stringify(footprintSettings))} // unmutate
      />
      <div className={fpStyles.buttonContainer}>
        <button
          onClick={handleSaveFootprintSettings}
          className={[
            fpStyles.buttonSettings,
            fpStyles.buttonSettings_Blue,
          ].join(' ')}
        >
          Save
        </button>
        <button
          onClick={handleRSaveAsDefaultFootprintSettings}
          className={[fpStyles.buttonSettings].join(' ')}
        >
          Save as Default
        </button>
        <button
          onClick={handleResetFootprintSettings}
          className={[fpStyles.buttonSettings].join(' ')}
        >
          Reset settings
        </button>
      </div>
    </div>
  );
};

export default FootprintSettings;
