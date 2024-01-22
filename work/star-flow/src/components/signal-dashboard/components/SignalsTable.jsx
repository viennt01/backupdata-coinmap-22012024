import { SVGStarFill, SVGStarOutline } from '@/assets/images/svg';
import { Button, Spin, Table } from 'antd';
import { useContext, useEffect, useState } from 'react';
import SignalPreview, { useSignalPreviewModal } from './SignalPreview';
import InfiniteScroll from 'react-infinite-scroll-component';

import style from './SignalsTable.module.scss';
import { useCallback } from 'react';
import { timeFormat } from 'd3-time-format';
import BotService from '@/fetcher/services/bot.service';
import { defaultContextValues, FilterContext, TAB_MAP } from './SignalTabs';
import { useRef } from 'react';
import { getDateUTCStart } from '@/utils/datetime';
import { useMemo } from 'react';
import { ERROR_CODE } from '@/fetcher/utils';
import { checkFilterActive } from './TabActions';

const dateTimeFormat = timeFormat('%d-%b-%Y %H:%M:%S');
const defaultData = {
  rows: [],
  total: 0,
  loaded: false,
};

/**
 * Convert form values to params bot filter api
 */
const formValuesToFilterParams = (values) => {
  if (typeof values !== 'object' || Object.keys(values).length === 0) {
    return {};
  }

  const params = {
    resolutions: values.resolutions?.length
      ? values.resolutions.join(',')
      : undefined,
    bot_ids: values.botTypes?.length ? values.botTypes.join(',') : undefined,
    types: values.signal?.length ? values.signal.join(',') : undefined,
  };

  if (values?.period?.length) {
    params.from = getDateUTCStart(values.period[0].unix() * 1000).getTime();
    params.to =
      getDateUTCStart(
        new Date(values.period[0].unix() * 1000).setHours(24)
      ).getTime() - 1;
  }

  if (values?.symbols?.length) {
    const exchanges = [];
    params.symbols = values.symbols
      .map((symbolExchange) => {
        const [symbol, exchange] = symbolExchange.split('_');
        exchanges.push(exchange);

        return symbol;
      })
      .join(',');
    params.exchanges = [...new Set(exchanges)].join(',');
  }

  Object.keys(params).map((key) => {
    if (params[key] === undefined) {
      delete params[key];
    }
  });

  return params;
};

const PAGE_SIZE = 10;
const SignalsTable = ({ isFavorite = false }) => {
  const currentFilter = useContext(FilterContext);
  const [data, setData] = useState({ ...defaultData });
  const [isLoading, setIsLoading] = useState(true);
  const [favoritingIds, setFavoritingIds] = useState({});
  const [previewModal, openPreviewModal] = useSignalPreviewModal();

  const loadingRef = useRef(true);

  // favorite or unfavorite a signal handler
  const handleFavorite = useCallback(
    async (id, favorite) => {
      setFavoritingIds((idsMap) => ({ ...idsMap, [id]: true }));

      // request change status
      const requestMethod = favorite
        ? BotService.favoriteSignal
        : BotService.unFavoriteSignal;
      try {
        const res = await requestMethod(id);

        if (res?.error_code !== ERROR_CODE.SUCCESS) {
          return;
        }
      } catch (error) {
        console.log('error favorite', error);
      }

      let newDataRows;
      let total = data.total;
      if (isFavorite) {
        newDataRows = data.rows.filter((item) => item.id !== id);
        total--;
      } else {
        newDataRows = data.rows.map((item) => {
          if (item.id !== id) {
            return item;
          }

          return {
            ...item,
            favorite,
          };
        });
      }

      setTimeout(() => {
        setData({
          ...data,
          rows: newDataRows,
          total,
        });
        setFavoritingIds((idsMap) => {
          delete idsMap[id];

          return { ...idsMap };
        });
      }, 350);
    },
    [data]
  );

  /** @type {import('antd/es/table').ColumnsType} */
  const columns = [
    {
      title: <SVGStarFill />,
      dataIndex: 'favorite',
      key: 'favorite',
      align: 'center',
      render: (favorite, { id: key }) =>
        favorite ? (
          <Spin spinning={!!favoritingIds[key]}>
            <SVGStarFill
              className={style.favorited}
              onClick={() => handleFavorite(key, !favorite)}
            />
          </Spin>
        ) : (
          <Spin spinning={!!favoritingIds[key]}>
            <SVGStarOutline
              className={style.favorite}
              onClick={() => handleFavorite(key, !favorite)}
            />
          </Spin>
        ),
    },
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      align: 'center',
      render: (_, __, index) => <span className={style.no}>{index + 1}</span>,
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
    },
    {
      title: 'Timeframe',
      dataIndex: 'resolution',
      key: 'resolution',
      align: 'center',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time) => dateTimeFormat(new Date(+time ?? time)),
    },
    {
      title: 'Bot type',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Signal',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (signal) => (
        <span className={style[signal?.toLowerCase()]}>{signal}</span>
      ),
    },
    {
      title: 'Preview',
      dataIndex: 'image_url',
      key: 'image_url',
      render: (src) => (
        <SignalPreview imageSrc={src} onClick={openPreviewModal} />
      ),
    },
  ];

  // fetch signals and append to data list
  const fetchMore = useCallback(async (values, oldData) => {
    try {
      const page = Math.floor(oldData.rows.length / PAGE_SIZE) + 1;

      const filterParams = formValuesToFilterParams(values);
      if (isFavorite) {
        filterParams.favorite = true;
      }
      const res = await BotService.getSignals({
        page,
        size: PAGE_SIZE,
        ...filterParams,
      });

      if (res.error_code !== ERROR_CODE.SUCCESS) {
        return;
      }

      setData((data) => ({
        ...data,
        rows: data.rows.concat(res.payload?.rows ?? []),
        total: res.payload.total,
        loaded: true,
      }));
    } catch (error) {
      throw error;
    }
  }, []);

  // get filter condition base on actived tab key
  const filterValues = useMemo(() => {
    const values =
      currentFilter.activeTabKey === 'all'
        ? currentFilter.allFilter
        : currentFilter.favoriteFilter;

    return values;
  }, [
    currentFilter.activeTabKey,
    currentFilter.allFilter,
    currentFilter.favoriteFilter,
  ]);

  // reset and load data
  const loadInitData = useCallback(async () => {
    loadingRef.current = true;
    setIsLoading(true);

    // reset data
    const newData = { ...defaultData };
    setData(newData);

    await fetchMore(filterValues, newData);

    setIsLoading(false);
    loadingRef.current = false;
  }, [fetchMore, filterValues]);

  // Init and reinit data on filter values change
  useEffect(() => {
    loadInitData();
  }, [filterValues]);

  const handleClearFilter = useCallback(() => {
    currentFilter.setValues((data) => {
      const filterValueKey =
        data.activeTabKey === TAB_MAP.all.key ? 'allFilter' : 'favoriteFilter';

      const newFilter = {
        ...data,
        [filterValueKey]: defaultContextValues[filterValueKey],
      };

      return newFilter;
    });
  }, [currentFilter.setValues]);

  return (
    <>
      {checkFilterActive(filterValues) && (
        <div className={style.filterResultInfo}>
          <span>Results ({isLoading ? <Spin /> : data.total})</span>
          <Button type="ghost" htmlType="button" onClick={handleClearFilter}>
            Clear all filter
          </Button>
        </div>
      )}
      <div className={style.tableContainer}>
        <InfiniteScroll
          dataLength={data.rows.length}
          next={() => {
            if (loadingRef.current) {
              return;
            }
            fetchMore(filterValues, data);
          }}
          hasMore={!data.loaded || data.rows.length < data.total}
          loader={
            <Spin size="small">
              <div className={style.loadingHolder} />
            </Spin>
          }
          endMessage={null}
          scrollThreshold="300px"
        >
          <Table
            loading={isLoading}
            className={style.table}
            columns={columns}
            dataSource={data.rows}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1200 }}
          />
        </InfiniteScroll>
      </div>
      {previewModal}
    </>
  );
};

export default SignalsTable;
