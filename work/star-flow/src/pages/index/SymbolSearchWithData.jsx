import { memo, useRef } from 'react';
import SymbolSearch from '@/components/SymbolSearch';
import { searchSymbol } from '@/redux/actions';
import {
  setSymbolFilter,
  toggleSymbolSearch,
  updateReduxChart,
} from '@/redux/actions/setting';
import { useCallback, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
  createDraws,
  createFootprintSettings,
  getChartTypeFromLayers,
  updateChart,
} from '@/utils/chart';
import ability, { symbolToFeatureId } from '@/utils/authorize/ability';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { setShowNeedUpgradePlan } from '@/redux/actions/common';
import { LAYERS_MAP } from '@/config/consts/layer';

const LIMIT = 50;

const SymbolSearchWithData = memo(({ chartId, modalContainer }) => {
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutId = useRef(null);
  const dispatch = useDispatch();

  const { symbolSearchChartId, symbolFilter, setting, chart } = useSelector(
    (state) => ({
      symbolSearchChartId: state.chartSettings.symbolSearchChartId,
      symbolFilter: state.chartSettings.symbolFilter,
      chart: state.chartSettings.charts[chartId],
      setting:
        state.chartSettings.charts[state.chartSettings.symbolSearchChartId] ||
        {},
    }),
    shallowEqual
  );

  const pairs = useSelector((state) => state.common.pairs);

  const handleClose = useCallback(() => {
    dispatch(toggleSymbolSearch(''));
  }, [dispatch]);

  const handleSelect = useCallback(
    (selectedItem) => {
      // Check permission
      const symbolFeatureId = symbolToFeatureId(selectedItem.symbol);
      const chartType = getChartTypeFromLayers(chart.layers);
      const layerType = LAYERS_MAP[chartType];
      if (
        ability.cannot(
          PERMISSION_ACTIONS.VIEW,
          symbolFeatureId,
          layerType.featureId
        )
      ) {
        dispatch(setShowNeedUpgradePlan(true));
        return;
      }

      if (selectedItem.symbol !== setting.symbol) {
        // check footprint is existed => create new or not
        const footprintSettings = createFootprintSettings({
          ...chart,
          symbolInfo: {
            ...chart.symbolInfo,
            symbol: selectedItem.symbol,
          },
        });

        // check draws is existed => create new or not
        const draws = createDraws({
          ...chart,
          symbolInfo: {
            ...chart.symbolInfo,
            symbol: selectedItem.symbol,
          },
        });
        // update symbol
        const chartUpdate = {
          ...chart,
          symbolInfo: {
            full_name: selectedItem.full_name,
            description: selectedItem.description,
            exchange: selectedItem.exchange,
            symbol: selectedItem.symbol,
            ticker: selectedItem.ticker,
            ticksOfSymbol: selectedItem.ticks,
            intervals: selectedItem.supported_resolutions,
            symbolType: selectedItem.type,
            interval: chart.symbolInfo.interval, // TODO NOTE
            asset: selectedItem.asset,
          },
          draws: draws,
          footprintSettings,
        };
        updateChart({ chart: chartUpdate, dispatch });

        dispatch(updateReduxChart(symbolSearchChartId, chartUpdate));
      }
      setTimeout(() => {
        dispatch(toggleSymbolSearch(''));
      }, 100);
    },
    [dispatch, symbolSearchChartId, setting, chart]
  );

  const handleChangeFilter = useCallback(
    (inputFilter) => {
      if (searchTimeoutId.current) {
        clearTimeout(searchTimeoutId.current);
      }
      if (!isSearching) {
        setIsSearching(true);
      }

      searchTimeoutId.current = setTimeout(async () => {
        inputFilter.query = (inputFilter.query || '').trim();
        const filter = { ...inputFilter, offset: 0, limit: LIMIT };
        dispatch(setSymbolFilter(inputFilter));
        await dispatch(searchSymbol(filter));
        searchTimeoutId.current = null;
        setIsSearching(false);
      }, 400);
    },
    [dispatch, isSearching, setIsSearching]
  );

  return (
    <SymbolSearch
      show={symbolSearchChartId === chartId}
      handleClose={handleClose}
      onSelect={handleSelect}
      onChange={handleChangeFilter}
      items={pairs}
      currentFilter={symbolFilter}
      isSearching={isSearching}
      modalContainer={modalContainer}
    />
  );
});

SymbolSearchWithData.displayName = 'SymbolSearchWithData';

export default SymbolSearchWithData;
