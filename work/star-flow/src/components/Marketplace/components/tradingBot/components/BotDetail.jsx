import style from './BotDetail.module.scss';
import { ERROR_CODE } from '@/fetcher/utils';
import {
  Row,
  Col,
  Typography,
  Table,
  Tag,
  ConfigProvider,
  Card,
  Space,
} from 'antd';
import { useState, useEffect } from 'react';
import { getTradeHistory, getPnlData } from '../fetcher';
import { format as formatFns } from 'date-fns';
import BotCard from './BotCard';
import dynamic from 'next/dynamic';
import { format as formatD3 } from 'd3-format';

const Line = dynamic(
  () => import('@ant-design/plots').then(({ Line }) => Line),
  { ssr: false }
);

const { Title } = Typography;

const COLOR_GREEN = '#52B16F';
const COLOR_RED = '#FF5757';

const STATUS_COLORS = {
  OPEN: '#31AFFE',
  CLOSED: '#616887',
};

const DEFAULT_PAGINATION = {
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50', '100'],
};

const formatNumber = formatD3('.2f');
const formatDate = (value) => formatFns(value, 'dd/MM/yyyy');
const formatDateTime = (value) => formatFns(value, 'hh:mm dd/MM/yyyy');
const invalidValue = (value) => [null, undefined, ''].includes(value);

const CHART_CONFIGS = {
  smooth: true,
  xField: 'xValue',
  yField: 'pnl_day_percent',
  color: COLOR_GREEN,
  yAxis: {
    grid: null,
    label: {
      style: { fill: 'white' },
      formatter: (value) => formatNumber(value) + '%',
    },
  },
  xAxis: {
    label: {
      style: { fill: 'white' },
    },
  },
  tooltip: {
    formatter: (datum) => {
      return {
        name: 'Cumulative PNL',
        value: (formatNumber(datum.pnl_day_percent) || 0) + '%',
      };
    },
    customItems: (originalItems) => {
      const { pnl_day_percent } = originalItems[0].data;
      originalItems[0].color =
        Number(pnl_day_percent) < 0 ? COLOR_RED : COLOR_GREEN;
      return originalItems;
    },
  },
  annotations: [
    {
      type: 'regionFilter',
      start: ['min', 'min'],
      end: ['max', '0'],
      color: COLOR_RED,
    },
  ],
};

const compare = (a, b, key) => {
  if (a[key] === b[key]) return 0;
  if (a[key] === undefined) return -1;
  if (b[key] === undefined) return 1;
  return Number(a[key]) - Number(b[key]);
};

const createColumns = (currencyIcons) => [
  {
    title: 'Pair',
    dataIndex: 'token_first',
    render: (_, datum) => (
      <Space>
        <div>
          <img
            style={{ position: 'relative', zIndex: 1, borderRadius: '50%' }}
            width={24}
            height={24}
            src={currencyIcons[datum.token_first]}
            alt="token_first"
          />
          <img
            style={{ marginLeft: -12, borderRadius: '50%' }}
            width={24}
            height={24}
            src={currencyIcons[datum.token_second]}
            alt="token_second"
          />
        </div>
        <span>
          {datum.token_first}
          {datum.token_second}
        </span>
      </Space>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    align: 'center',
    render: (value) => (
      <Tag
        color={STATUS_COLORS[value]}
        style={{ borderRadius: '12px', margin: 0 }}
      >
        {value}
      </Tag>
    ),
  },
  {
    title: 'Side',
    dataIndex: 'side',
  },
  {
    title: 'Entry Price',
    dataIndex: 'entry_price',
    align: 'right',
    sorter: {
      compare: (a, b) => compare(a, b, 'entry_price'),
    },
    render: (value) => (invalidValue(value) ? '--' : `$${formatNumber(value)}`),
  },
  {
    title: 'Close Price',
    dataIndex: 'close_price',
    align: 'right',
    sorter: {
      compare: (a, b) => compare(a, b, 'close_price'),
    },
    render: (value) => (invalidValue(value) ? '--' : `$${formatNumber(value)}`),
  },
  {
    title: 'Profit/Loss',
    dataIndex: 'profit_cash',
    align: 'right',
    sorter: {
      compare: (a, b) => compare(a, b, 'profit_cash'),
    },
    render: (value) =>
      invalidValue(value) ? (
        '--'
      ) : (
        <span style={{ color: value < 0 ? COLOR_RED : COLOR_GREEN }}>
          {value < 0 ? '-' : '+'}${formatNumber(Math.abs(value))}
        </span>
      ),
  },
  {
    title: 'Started',
    dataIndex: 'day_started',
    align: 'right',
    sorter: {
      compare: (a, b) => compare(a, b, 'day_started'),
    },
    render: (value) =>
      invalidValue(value) ? '--' : <span>{formatDateTime(Number(value))}</span>,
  },
  {
    title: 'Completed',
    dataIndex: 'day_completed',
    align: 'right',
    sorter: {
      compare: (a, b) => compare(a, b, 'day_completed'),
    },
    render: (value) =>
      invalidValue(value) ? '--' : <span>{formatDateTime(Number(value))}</span>,
  },
];

export default function BotDetail({ botInfo, currencyIcons, bestPackage }) {
  const [tableLoading, setTableLoading] = useState(true);
  const [chartAnimation, setChartAnimation] = useState(true);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [pnlData, setPnlData] = useState([]);

  const fetchTradeHistory = (botId, page, size) => {
    let queryString = `?bot_id=${botId}&page=${page}&size=${size}`;
    getTradeHistory(queryString)
      .then(({ error_code, payload }) => {
        if (error_code === ERROR_CODE.SUCCESS) {
          setTradeHistory(payload.rows);
        }
      })
      .catch((err) => {
        console.log('err', err);
      })
      .finally(() => setTableLoading(false));
  };

  const fetchPnlData = (botId) => {
    getPnlData(botId)
      .then(({ error_code, payload }) => {
        if (error_code === ERROR_CODE.SUCCESS) {
          setPnlData(
            payload.map((item) => ({
              ...item,
              xValue: formatDate(Number(item.updated_at)), // must be formatted as dd/MM/yyyy to display tooltip in chart
            }))
          );
        }
      })
      .catch((err) => {
        console.log('err', err);
      })
      .finally(() => setChartAnimation(false));
  };

  const handlePaginationChange = (page, size) => {
    fetchTradeHistory(botInfo.id, page, size);
    setPagination((state) => ({
      ...state,
      current: page,
      pageSize: size,
    }));
  };

  // fetch trade history and pnl data
  useEffect(() => {
    fetchTradeHistory(botInfo.id, pagination.current, pagination.pageSize);
    fetchPnlData(botInfo.id);
  }, []);

  return (
    <div className={style.botDetailWrapper}>
      <Title level={2}>Bot Detail</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
        <Col span={24} lg={8}>
          <BotCard botInfo={botInfo} bestPackage={bestPackage} hideMoreDetail />
        </Col>
        <Col span={24} lg={16}>
          <Card bordered={false} style={{ minHeight: 448 }}>
            <Title level={5} align="center">
              {`Cumulative PNL (%)`}
            </Title>
            <Line
              {...CHART_CONFIGS}
              data={pnlData}
              animation={chartAnimation}
            />
          </Card>
        </Col>
      </Row>

      <Title level={2}>Trade History</Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ConfigProvider
            theme={{
              token: {
                colorBorderSecondary: '#131229',
                colorFillQuaternary: '#21233B',
              },
            }}
          >
            <Table
              rowKey="id"
              className={style.tradeHistoryTable}
              columns={createColumns(currencyIcons)}
              dataSource={tradeHistory}
              loading={tableLoading}
              scroll={{ x: 'max-content' }}
              pagination={{
                ...pagination,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
                onChange: handlePaginationChange,
              }}
            />
          </ConfigProvider>
        </Col>
      </Row>
    </div>
  );
}
