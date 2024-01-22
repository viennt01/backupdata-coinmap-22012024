import { SVGSetting } from '@/assets/images/svg';
import { useState, useContext } from 'react';
import ChartSettingsModal from './ChartSettingsModal';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { updateReduxChart } from '@/redux/actions/setting';
import { ChartSectionContext } from '@/components/ChartSection';
import FOOTPRINT_SETTINGS from '@/config/consts/settings/footprint';

const ChartSettings = ({ className, chartId }) => {
  const dispatch = useDispatch();
  const contextValue = useContext(ChartSectionContext);

  const [show, setShow] = useState(false);
  const [chart, setChart] = useState(null);

  const chartRedux = useSelector(
    (state) => state.chartSettings.charts[chartId],
    shallowEqual
  );

  const handleClose = (saved, isFootprintActiveSettingsKey) => {
    setShow(false);
    if (saved) return; // saved and dont restore settings
    if (chart) {
      dispatch(updateReduxChart(chartId, JSON.parse(chart)));
    }
    if (isFootprintActiveSettingsKey) {
      const parseChart = JSON.parse(chart);
      //  redraw chart on footprint
      const footprintSettings = (() => {
        const footprints = parseChart?.footprintSettings || [];
        const fpExisted = footprints.find(
          (f) =>
            f.symbol === parseChart.symbolInfo.symbol &&
            f.interval === parseChart.symbolInfo.interval
        );

        if (fpExisted) {
          return fpExisted;
        } else {
          const FOOTPRINT_SETTINGS_DEFAULT = {
            ...FOOTPRINT_SETTINGS,
            symbol: parseChart.symbolInfo.symbol,
            interval: parseChart.symbolInfo.interval,
          };
          return FOOTPRINT_SETTINGS_DEFAULT;
        }
      })();

      if (contextValue.chartRef) {
        contextValue.chartRef.reDrawChartBySettings(footprintSettings);
      }
    }
  };
  const handleOpenModal = () => {
    setShow(true);
    setChart(JSON.stringify(chartRedux));
  };

  return (
    <>
      <button className={className} onClick={handleOpenModal}>
        <SVGSetting />
      </button>
      {show && (
        <ChartSettingsModal
          show={show}
          chartId={chartId}
          handleClose={handleClose}
          chartStore={chart}
        />
      )}
    </>
  );
};

export default ChartSettings;
