import style from './index.module.scss';
import { Typography, Table, ConfigProvider } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import Image from 'next/image';
import AppTag, { TagType } from '@/components/tag';
import { formatCurrency, formatNumber } from '@/utils/format-number';
import { Currency, TradeHistory, TradeHistoryFilter } from '../../interface';
import { formatDate } from '@/utils/format-date';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { FALLBACK_IMG } from '@/constants/common';
import { THEME_TABLE } from '@/constants/theme';

const { Title } = Typography;

const ImagePair = ({
  record,
  currencyList,
}: {
  record: TradeHistory;
  currencyList: Currency[];
}) => {
  const firstImageUrl = currencyList.find(
    (c) => c.currency === record.token_first
  )?.image_url;
  const secondImageUrl = currencyList.find(
    (c) => c.currency === record.token_second
  )?.image_url;
  return (
    <div className={style.imagePairContainer}>
      <Image
        className={style.imagePair1}
        src={firstImageUrl || FALLBACK_IMG}
        alt=""
        width={24}
        height={24}
      />
      <Image
        className={style.imagePair2}
        src={secondImageUrl || FALLBACK_IMG}
        alt=""
        width={24}
        height={24}
      />
    </div>
  );
};

const renderDateTime = (value: string | null) => {
  if (value === null) return '--';
  return <>{formatDate(Number(value))}</>;
};

const renderPair =
  // eslint-disable-next-line react/display-name
  (currencyList: Currency[]) => (value: string, record: TradeHistory) => {
    return (
      <span className={style.pairContainer}>
        <ImagePair record={record} currencyList={currencyList} />
        <span>
          {value}
          {record.token_second}
        </span>
      </span>
    );
  };

enum TradeStatus {
  CLOSE = 'CLOSED',
  OPEN = 'OPEN',
}

const renderStatus = (value: string) => {
  if (value === TradeStatus.OPEN) {
    return <AppTag type={TagType.INFO} content="Open"></AppTag>;
  }
  if (value === TradeStatus.CLOSE) {
    return <AppTag type={TagType.DEFAULT} content="Close"></AppTag>;
  }
};

const renderCurrencyNumber = (value: number) => {
  return formatCurrency(value);
};

const renderProfit = (profit: number | null) => {
  if (profit === null) return '--';
  const absValue = formatNumber(Math.abs(profit), 2);
  if (profit >= 0) {
    return <span className={style.up}>{`+$${absValue}`}</span>;
  } else {
    return <span className={style.down}>{`-$${absValue}`}</span>;
  }
};

const compare = (a: TradeHistory, b: TradeHistory, key: keyof TradeHistory) => {
  if (a[key] === b[key]) return 0;
  if (a[key] === null) return -1;
  if (b[key] === null) return 1;
  return Number(a[key]) - Number(b[key]);
};

interface Props {
  tradeHistory: TradeHistory[] | null;
  currencyList: Currency[] | null;
  tradeHistoryFilter: TradeHistoryFilter;
  setTradeHistoryFilter: Dispatch<SetStateAction<TradeHistoryFilter>>;
}

export default function TradeHistoryTable({
  tradeHistory,
  currencyList,
  tradeHistoryFilter,
  setTradeHistoryFilter,
}: Props) {
  const onChange: TableProps<TradeHistory>['onChange'] = (pagination) => {
    if (pagination.current) {
      const page = pagination.current;
      setTradeHistoryFilter((prev) => ({
        ...prev,
        page,
      }));
    }
  };
  const columns: ColumnsType<TradeHistory> = useMemo(
    () => [
      {
        title: 'Pair',
        dataIndex: 'token_first',
        render: renderPair(currencyList || []),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        align: 'center',

        sorter: {
          compare: (a, b) => a.status.length - b.status.length,
        },
        render: renderStatus,
      },
      {
        title: 'Side',
        dataIndex: 'side',
        align: 'center',
        sorter: {
          compare: (a, b) => a.side.length - b.side.length,
        },
      },
      {
        title: 'Entry Price',
        dataIndex: 'entry_price',
        align: 'right',
        sorter: {
          compare: (a, b) => compare(a, b, 'entry_price'),
        },
        render: renderCurrencyNumber,
      },
      {
        title: 'Close Price',
        dataIndex: 'close_price',
        align: 'right',
        sorter: {
          compare: (a, b) => compare(a, b, 'close_price'),
        },
        render: renderCurrencyNumber,
      },
      {
        title: 'Profit/Loss',
        dataIndex: 'profit_cash',
        align: 'right',
        sorter: {
          compare: (a, b) => compare(a, b, 'profit_cash'),
        },
        render: renderProfit,
      },
      {
        title: 'Started',
        dataIndex: 'day_started',
        align: 'right',
        sorter: {
          compare: (a, b) => compare(a, b, 'day_started'),
        },
        render: renderDateTime,
      },
      {
        title: 'Completed',
        dataIndex: 'day_completed',
        align: 'right',
        sorter: {
          compare: (a, b) => compare(a, b, 'day_completed'),
        },
        render: renderDateTime,
      },
    ],
    [currencyList]
  );
  return (
    <>
      <Title>Trading history</Title>
      <ConfigProvider theme={THEME_TABLE}>
        <Table
          scroll={{
            x: 'max-content',
          }}
          pagination={{
            total: tradeHistoryFilter.total,
            showSizeChanger: false,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            current: tradeHistoryFilter.page,
            pageSize: tradeHistoryFilter.size,
          }}
          showSorterTooltip={false}
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={tradeHistory || []}
          onChange={onChange}
        />
      </ConfigProvider>
    </>
  );
}
