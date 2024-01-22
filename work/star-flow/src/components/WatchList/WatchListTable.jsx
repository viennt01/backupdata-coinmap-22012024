import style from './WatchListTable.module.scss';
import {
  SvgChervletUpFilled,
  SvgChervletDownFilled,
  SvgTrashLight,
} from '@/assets/images/svg';
import PropTypes from 'prop-types';
import { useMemo, memo, useState, useCallback, useEffect, useRef } from 'react';
import { format } from 'd3-format';
import { useDispatch, useSelector } from 'react-redux';
import {
  createFootprintSettings,
  getChartTypeFromLayers,
  updateChart,
  createDraws,
} from '@/utils/chart';
import { updateReduxChart } from '@/redux/actions/setting';
import { getSymbolSearchList } from './fetcher';
import ability, { symbolToFeatureId } from '@/utils/authorize/ability';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { setShowNeedUpgradePlan } from '@/redux/actions/common';
import { LAYERS_MAP } from '@/config/consts/layer';

export const SORT_DIRECTION = {
  NO_SORT: 0,
  INCREASE: 1,
  DECREASE: -1,
};

const SORT_FLOW = {
  [SORT_DIRECTION.NO_SORT]: SORT_DIRECTION.INCREASE,
  [SORT_DIRECTION.INCREASE]: SORT_DIRECTION.DECREASE,
  [SORT_DIRECTION.DECREASE]: SORT_DIRECTION.NO_SORT,
};

/**
 * handle update symbol data
 * @param {number | undefined} value value will be format
 * @returns {string} number with command
 */
const formatNumber = (value) => {
  if (typeof value !== 'number') return '';
  return Math.abs(value) > 1000
    ? value.toLocaleString('en-US')
    : value.toString();
};

const WatchListTable = ({
  data,
  filteredColumns,
  onDelete,
  chartId,
  triggerSyncSettingsWatchListChart,
}) => {
  const charts = useSelector((state) => state.chartSettings.charts);
  const dispatch = useDispatch();
  const debounceTimerRef = useRef(null);

  const sortInfo = charts[chartId].sortInfo || {
    value: '',
    direction: SORT_DIRECTION.NO_SORT,
  };

  const headers = useMemo(
    () => [
      { name: 'Symbol', value: 'symbol', className: 'symbol' },
      { name: 'Exchange', value: 'exchange', className: 'exchange' },
      {
        name: 'Last',
        value: 'last',
        align: 'right',
        className: 'last',
        cellFormat: (value, item) => (
          <span
            className={
              item['change'] >= 0 ? style.increaseColor : style.decreaseColor
            }
          >
            {formatNumber(value)}
          </span>
        ),
      },
      {
        name: 'Chg',
        value: 'change',
        align: 'right',
        className: 'change',
        cellFormat: (value, item) => (
          <span
            className={
              item['change'] >= 0 ? style.increaseColor : style.decreaseColor
            }
          >
            {formatNumber(value)}
          </span>
        ),
      },
      {
        name: 'Chg%',
        value: 'changePercentage',
        align: 'right',
        className: 'changePercentage',
        cellFormat: (value, item) => (
          <span
            className={
              item['change'] >= 0 ? style.increaseColor : style.decreaseColor
            }
          >
            {typeof value === 'number' ? `${value.toFixed(2)}%` : ''}
          </span>
        ),
      },
      {
        name: 'Vol',
        value: 'volume',
        align: 'right',
        className: 'volume',
        cellFormat: (value) => <span>{value ? format('~s')(value) : ''}</span>,
      },
      {
        name: '',
        value: '',
        align: 'right',
        className: 'action',
        sortable: false,
        cellFormat: (_, item) => (
          <SvgTrashLight
            className={style.deleteIcon}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
          />
        ),
      },
    ],
    [onDelete]
  );

  const [dataTable, setDataTable] = useState([]);

  const [symbolSearchList, setSymbolSearchList] = useState([]);

  // get symbol search list
  useEffect(() => {
    const query = {
      limit: 100,
      offset: 0,
      query: '',
      type: '',
      exchange: '',
    };
    getSymbolSearchList(query).then((res) => {
      setSymbolSearchList(res ?? []);
    });
  }, []);

  /**
   * compare a value and b value
   * @param {string | number} a value a
   * @param {string | number} b value b
   * @param {number} direction increase: 1, decrease: -1
   * @returns {number} [-1,0,1]
   */
  const handleCompare = (a, b, direction) => {
    // compare numbers
    if (typeof a === 'number' && typeof b === 'number') {
      return a >= b ? direction : direction * -1;
    }

    // compare strings
    if (typeof a === 'string' && typeof b === 'string') {
      const stringA = a.toUpperCase(); // ignore upper and lowercase
      const stringB = b.toUpperCase(); // ignore upper and lowercase
      if (stringA === stringB) return 0; // string equals
      return stringA > stringB ? direction : direction * -1;
    }

    // other cases
    return !!a ? direction : direction * -1;
  };

  /**
   * sort and update dataTable state
   * @param {string} value value key
   * @returns {void}
   */
  const sortTable = useCallback(
    (value) => {
      // get sort direction
      const direction =
        sortInfo.value !== value
          ? SORT_DIRECTION.INCREASE
          : SORT_FLOW[sortInfo.direction];

      // update state
      const chartUpdate = {
        ...charts[chartId],
        sortInfo: { value, direction },
      };
      dispatch(updateReduxChart(chartId, chartUpdate));

      debounce(
        () => handleUpdateWatchListToServer({ sortInfo: { value, direction } }),
        200
      );
    },
    [sortInfo, handleUpdateWatchListToServer, chartId, charts, dispatch]
  );

  /**
   * handle update data for table based on data and sort info
   * @returns {void}
   */
  const updateTableData = useCallback(() => {
    // update data table based on sort direction
    const newDataTable =
      sortInfo.direction === SORT_DIRECTION.NO_SORT
        ? [...data]
        : [...data].sort((a, b) =>
            handleCompare(
              a[sortInfo.value],
              b[sortInfo.value],
              sortInfo.direction
            )
          );
    // update state
    setDataTable(newDataTable);
  }, [data, sortInfo]);

  // update dataTable state when prop changes
  useEffect(() => {
    updateTableData();
  }, [updateTableData]);

  /**
   * implement debounce function
   * @param {object} callback callback function will be produce after debounce time
   * @param {number} time time ms
   * @returns {void}
   */
  const debounce = (callback, time) => {
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(callback, time);
  };

  const handleUpdateWatchListToServer = useCallback(
    ({ sortInfo }) => {
      if (chartId) {
        const watchListChart = charts[chartId];

        const updateWatchList = {
          ...watchListChart,
          sortInfo,
        };
        updateChart({ chart: updateWatchList, dispatch }).then(() => {
          triggerSyncSettingsWatchListChart();
        });
        dispatch(updateReduxChart(chartId, updateWatchList));
      }
    },
    [dispatch, chartId, charts, triggerSyncSettingsWatchListChart]
  );

  /**
   * handle change symbol for active chart
   * @param {string} symbol symbol
   * @returns {void}
   */
  const addSymbolToActiveChart = useCallback(
    (symbol) => {
      // Check permission
      const selectedChartId = Object.keys(charts).find(
        (key) => charts[key]?.selected
      );

      if (!selectedChartId) return;

      const selectedChart = charts[selectedChartId];

      const chartType = getChartTypeFromLayers(selectedChart.layers);
      const layerType = LAYERS_MAP[chartType];
      if (
        ability.cannot(
          PERMISSION_ACTIONS.VIEW,
          symbolToFeatureId(symbol),
          layerType.featureId
        )
      ) {
        dispatch(setShowNeedUpgradePlan(true));
        return;
      }

      const symbolData = symbolSearchList.find(
        (item) => item.symbol === symbol
      );

      if (
        !selectedChart ||
        selectedChart.symbolInfo.symbol === symbol ||
        !symbolData
      )
        return;
      // check footprint is existed => create new or not
      const footprintSettings = createFootprintSettings({
        ...selectedChart,
        symbolInfo: {
          ...selectedChart.symbolInfo,
          symbol: symbolData.symbol,
        },
      });
      // check draws is existed => create new or not
      const draws = createDraws({
        ...selectedChart,
        symbolInfo: {
          ...selectedChart.symbolInfo,
          symbol: symbolData.symbol,
        },
      });
      // update symbol
      const chartUpdate = {
        ...selectedChart,
        symbolInfo: {
          full_name: symbolData.full_name,
          description: symbolData.description,
          exchange: symbolData.exchange,
          symbol: symbolData.symbol,
          ticker: symbolData.ticker,
          ticksOfSymbol: symbolData.ticks,
          intervals: symbolData.supported_resolutions,
          symbolType: symbolData.type,
          interval: selectedChart.symbolInfo.interval,
          asset: symbolData.asset,
        },
        draws: draws,
        footprintSettings,
      };
      updateChart({ chart: chartUpdate, dispatch });
      dispatch(updateReduxChart(selectedChart.chartId, chartUpdate));
    },
    [charts, dispatch, symbolSearchList]
  );

  /**
   * list of header information which will be displayed
   * @type {Array<object>}
   */
  const filteredHeaders = useMemo(
    () =>
      headers.filter(
        (header) =>
          filteredColumns[header.value] === undefined ||
          filteredColumns[header.value] === true
      ),
    [headers, filteredColumns]
  );

  /**
   * list of header columns
   * @type {Array<JSX.Element>}
   */
  const renderHeaders = useMemo(
    () =>
      filteredHeaders.map((header, index) => (
        <th
          className={style[header.className]}
          key={index}
          style={{ textAlign: header.align ?? 'left' }}
        >
          <div
            className={style.dataTableHeaderItem}
            onClick={
              header.sortable !== false
                ? () => sortTable(header.value)
                : () => undefined
            }
          >
            {header.name}
            {header.sortable !== false && (
              <div className={style.dataTableHeaderSortGroup}>
                <SvgChervletUpFilled
                  width={8}
                  height={4}
                  className={
                    sortInfo.value === header.value &&
                    sortInfo.direction === SORT_DIRECTION.INCREASE
                      ? style.colorSorted
                      : undefined
                  }
                />
                <SvgChervletDownFilled
                  width={8}
                  height={6}
                  className={
                    sortInfo.value === header.value &&
                    sortInfo.direction === SORT_DIRECTION.DECREASE
                      ? style.colorSorted
                      : undefined
                  }
                />
              </div>
            )}
          </div>
        </th>
      )),
    [filteredHeaders, sortTable, sortInfo]
  );

  /**
   * list of row data
   * @type {Array<JSX.Element>}
   */
  const renderRows = useMemo(
    () =>
      dataTable.map((item, index) => (
        <tr
          key={index}
          onClick={() =>
            debounce(() => addSymbolToActiveChart(item.symbol), 300)
          }
        >
          {filteredHeaders.map((header, headerIndex) => (
            <td
              className={style[header.className]}
              key={headerIndex}
              style={{ textAlign: header.align ?? 'left' }}
            >
              {header.cellFormat
                ? header.cellFormat(item[header.value], item)
                : item[header.value]}
            </td>
          ))}
        </tr>
      )),
    [filteredHeaders, dataTable, addSymbolToActiveChart]
  );

  return (
    <table className={style.watchListTable}>
      <thead>
        <tr>{renderHeaders}</tr>
      </thead>
      <tbody>{renderRows}</tbody>
    </table>
  );
};

WatchListTable.propTypes = {
  data: PropTypes.array,
};

WatchListTable.defaultProps = {
  data: [],
};

export default memo(WatchListTable);
