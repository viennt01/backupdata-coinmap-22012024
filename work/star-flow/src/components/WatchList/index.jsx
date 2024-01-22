import style from './style.module.scss';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import Dropdown from 'react-bootstrap/Dropdown';
import { SvgAdd, SVGClose } from '@/assets/images/svg';
import WatchListTable from './WatchListTable';
import PaneSettings from './PaneSettings';
import SymbolSearch from '@/components/WatchList/SymbolSearch';
import { deleteChart } from '@/utils/chart';
import { actCloseChartById } from '@/redux/actions';
import {
  getWatchList,
  createWatchList,
  deleteWatchList,
  deleteAllWatchList,
} from './fetcher';
import { ERROR_CODE } from '@/fetcher/utils';
import Loading from '@/components/Loading';
import { initSocketWorker } from '@/wokers/socketWithWorker';
import { URLS } from '@/config';
import useSyncBrowserTabs from '@/hook/sync-browser-tabs';
import { getListChart } from '@/hook/fetcher';
import { updateWatchListFromServer } from '@/redux/actions/setting';
import { SECTION_TYPES } from '@/config/consts/section';
import { EVENT_SOCKET, getTypeOfData, METHOD_SOCKET } from '../Chart/hook';

const DEFAULT_WS_CLOSE = 1000;
const THROTTLE_TIME = 1000;

const KEY_SYNC_BROWSER_TABS = 'SYNC_WATCH_LIST';
const SYNC_SETTINGS_WATCH_LIST = 'SYNC_SETTINGS_WATCH_LIST';

const WatchList = ({ chartId }) => {
  const dispatch = useDispatch();
  const charts = useSelector((state) => state.chartSettings.charts);
  const loadingCommon = useSelector((state) => state.common.loading);
  const [filteredColumns, setFilteredColumns] = useState({
    last: true,
    change: true,
    changePercentage: true,
    volume: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showSymbolSearch, setShowSymbolSearch] = useState(false);
  const [watchListSymbols, setWatchListSymbols] = useState([]);
  const [watchListData, setWatchListData] = useState([]);
  const socketRef = useRef(null);
  const watchListDataRef = useRef({});
  const watchListSymbolsRef = useRef([]);
  const throttleRef = useRef({ isPause: false });
  const chartsRef = useRef(null);
  chartsRef.current = charts;

  const triggerSync = useSyncBrowserTabs(KEY_SYNC_BROWSER_TABS, async () => {
    const res = await getWatchList();
    if (res?.status !== ERROR_CODE.OK) return;
    setWatchListSymbols(res.data);
  });

  const triggerSyncSettingsWatchListChart = useSyncBrowserTabs(
    SYNC_SETTINGS_WATCH_LIST,
    () => {
      getListChart().then((res) => {
        if (res.status !== ERROR_CODE.OK || !Array.isArray(res.data)) {
          return;
        }

        const watchListChart = res.data.find(
          (chart) => chart?.content?.type === SECTION_TYPES.WATCH_LIST.type
        );

        // watch list not found, stop update
        if (!watchListChart) {
          return;
        }

        dispatch(updateWatchListFromServer(watchListChart.content));
      });
    }
  );

  /**
   * add symbol to watch list
   * @param {object} symbol symbol data
   * @returns {void}
   */
  const handleAddSymbol = async (symbol) => {
    const res = await createWatchList({
      symbol: symbol.symbol,
      content: '',
      clientid: '',
      type: symbol.type,
      exchange: symbol.exchange,
    });
    if (res?.status !== ERROR_CODE.OK) return;
    setWatchListSymbols((state) => [...state, { ...res }]);
    triggerSync();
  };

  /**
   * delete symbol of watch list
   * @param {object} symbol symbol data
   * @returns {void}
   */
  const handleDeleteSymbol = async (symbol) => {
    setWatchListSymbols((state) =>
      state.filter((item) => item.symbol !== symbol.symbol)
    );
    setWatchListData((state) =>
      state.filter((item) => item.symbol !== symbol.symbol)
    );
    if (socketRef.current) {
      const message = JSON.stringify({
        method: METHOD_SOCKET.UNSUBSCRIBE,
        event: EVENT_SOCKET.WATCHLIST,
        params: [
          `${symbol.exchange.toLowerCase()}.${symbol.symbol.toLowerCase()}`,
        ],
      });
      socketRef.current.ws.send(message);
    }

    delete watchListDataRef.current[symbol.symbol];
    await deleteWatchList(symbol.id, symbol.type);
    triggerSync();
  };

  /**
   * delete all symbols of watch list
   * @param {object} symbol symbol data
   * @returns {void}
   */
  const handleDeleteAllSymbols = async () => {
    if (socketRef.current) {
      const message = JSON.stringify({
        method: METHOD_SOCKET.UNSUBSCRIBE,
        event: EVENT_SOCKET.WATCHLIST,
        params: watchListSymbolsRef.current.map(
          (symbol) =>
            `${symbol.exchange.toLowerCase()}.${symbol.symbol.toLowerCase()}`
        ),
      });
      socketRef.current.ws.send(message);
    }
    setWatchListSymbols([]);
    setWatchListData([]);
    watchListDataRef.current = {};
    await deleteAllWatchList();
    triggerSync();
  };

  /**
   * handle close watch list
   * @returns {void}
   */
  const closeWatchList = () => {
    const chart = charts[chartId];
    if (chart.id) {
      deleteChart(chart.id);
    }
    dispatch(actCloseChartById(chartId));
  };

  /**
   * using data received from socket and update to table
   * @returns {void}
   */
  const handleUpdateSymbolData = () => {
    const newWatchListData = watchListSymbolsRef.current.map((symbol) => {
      const currentSymbol = watchListDataRef.current[symbol.symbol];
      if (!currentSymbol) return { ...symbol };

      const { c, v, p, P, ex } = currentSymbol;
      return {
        ...symbol,
        last: c,
        exchange: ex,
        change: p,
        changePercentage: P,
        volume: v,
      };
    });

    setWatchListData(newWatchListData);
  };

  /**
   * using data received from socket and update to table
   * @param {function} callback it will be called after throttle time
   * @param {number} time throttle time (ms)
   * @returns {void}
   */
  const throttle = (callback, time) => {
    if (throttleRef.current.isPause) return;
    throttleRef.current.isPause = true;
    setTimeout(() => {
      if (!socketRef.current) return;
      callback();
      throttleRef.current.isPause = false;
      setIsLoading(false);
    }, time);
  };

  // send new message based watch list symbols changing
  useEffect(() => {
    watchListSymbolsRef.current = [...watchListSymbols];
    if (!socketRef.current) return;
    const message = JSON.stringify({
      method: METHOD_SOCKET.SUBSCRIBE,
      event: EVENT_SOCKET.WATCHLIST,
      params: watchListSymbols.map(
        (symbol) =>
          `${symbol.exchange.toLowerCase()}.${symbol.symbol.toLowerCase()}.${getTypeOfData()}`
      ),
    });
    socketRef.current.ws.send(message);
  }, [watchListSymbols]);

  // connect websocket and cleanup
  useEffect(() => {
    const onMessage = (e) => {
      const data = JSON.parse(e.data);
      switch (data.e) {
        case EVENT_SOCKET.PING: {
          const message = JSON.stringify({
            res: 'pong',
          });
          socketRef.current.ws.send(message);
          break;
        }
        case EVENT_SOCKET.WATCHLIST: {
          watchListDataRef.current[data.s] = data;
          throttle(handleUpdateSymbolData, THROTTLE_TIME);
          break;
        }
      }
    };

    const onOpen = async () => {
      const res = await getWatchList();
      if (res?.status !== ERROR_CODE.OK) return;
      res.data.length === 0
        ? setIsLoading(false)
        : setWatchListSymbols(res.data);
    };

    socketRef.current = initSocketWorker({
      url: URLS.WS_STREAM_DATA,
      onMessage,
      onOpen,
    });

    return () => {
      socketRef.current.ws.close(DEFAULT_WS_CLOSE);
      watchListSymbolsRef.current = [];
      watchListDataRef.current = {};
      socketRef.current = null;
    };
  }, []);

  // current symbols using to filter in modal search
  const currentSymbols = useMemo(
    () => watchListSymbols.map((data) => data.symbol),
    [watchListSymbols]
  );

  return (
    <div className={style.watchListContainer}>
      <div className={`${style.watchListHeader} customDragHandler`}>
        <div className={style.headerLeft}>
          <div className={style.headerLeftTitle}>WATCH LIST</div>
        </div>
        <div className={style.headerRight}>
          {loadingCommon && (
            <div className={style.loading}>
              <Loading
                iconProps={{
                  width: '20px',
                  height: '20px',
                }}
              ></Loading>
            </div>
          )}
          <SymbolSearch
            isLoading={isLoading}
            show={showSymbolSearch}
            currentSymbols={currentSymbols}
            closeModal={() => setShowSymbolSearch(false)}
            openModal={() => setShowSymbolSearch(true)}
            onSelect={handleAddSymbol}
          />
          <PaneSettings
            isLoading={isLoading}
            filteredColumns={filteredColumns}
            setFilteredColumns={setFilteredColumns}
            handleDeleteAllSymbols={handleDeleteAllSymbols}
          />
          <button
            className={`btn btn-sm btn-link ${style.buttonClose}`}
            onMouseDown={(e) => {
              // prevent drag and move
              e.stopPropagation();
            }}
            onClick={closeWatchList}
          >
            <SVGClose />
          </button>
        </div>
      </div>

      {/* TODO: handle select watch list profile */}
      {/* <Dropdown bsPrefix={style.selectWatchList}>
        <Dropdown.Toggle
          onMouseDown={(e) => {
            // prevent drag and move
            e.stopPropagation();
          }}
          disabled
        >
          Watch list
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item as="button">Watch list 1</Dropdown.Item>
          <Dropdown.Item as="button">Watch list 2</Dropdown.Item>
          <Dropdown.Item as="button">Watch list 3</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown> */}

      <div className={style.watchListBody}>
        <WatchListTable
          chartId={chartId}
          data={watchListData}
          filteredColumns={filteredColumns}
          onDelete={handleDeleteSymbol}
          triggerSyncSettingsWatchListChart={triggerSyncSettingsWatchListChart}
        />
        {watchListData.length === 0 && !isLoading && (
          <div className={style.watchListBodyAddSymbol}>
            <SvgAdd
              className={style.watchListBodyAddSymbolIcon}
              onClick={() => setShowSymbolSearch(true)}
            />
            <div className={style.watchListBodyAddSymbolText}>
              Add new symbol
            </div>
          </div>
        )}
        {isLoading && (
          <div className={style.watchListBodyLoading}>
            <Loading className={style.loading} iconProps={{ width: 50 }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchList;
