import { ConfigProvider, Table } from 'antd';
import style from './index.module.scss';
import type { ColumnsType } from 'antd/es/table';
import { formatNumberNormal } from '@/utils/format-number';
import { BACK_TEST } from '@/components/home-page/interface';
import { useContext } from 'react';
import { AppContext } from '@/app-context';
import { getThemeTable } from '@/utils/theme';
import useI18n from '@/i18n/useI18N';

type DataType = BACK_TEST['performance'][0];
const renderHeader = (title: string) => (
  <div style={{ textAlign: 'center', fontWeight: 500 }}>{title}</div>
);
const renderCell = (value: number) => (
  <div className={value < 0 ? style.down : style.up}>
    {formatNumberNormal(value)}
  </div>
);

const columns: ColumnsType<DataType> = [
  {
    title: renderHeader('Year'),
    dataIndex: 'year',
    key: 'year',
    align: 'center',
  },
  {
    title: renderHeader('Jan'),
    dataIndex: 'jan',
    key: 'jan',
    align: 'right',
    render: renderCell,
  },
  {
    title: renderHeader('Feb'),
    dataIndex: 'feb',
    key: 'feb',
    align: 'right',
    render: renderCell,
  },
  {
    title: renderHeader('Mar'),
    dataIndex: 'mar',
    key: 'mar',
    align: 'right',
    render: renderCell,
  },
  {
    title: renderHeader('Apr'),
    dataIndex: 'apr',
    key: 'apr',
    align: 'right',
    render: renderCell,
  },
  {
    title: renderHeader('May'),
    dataIndex: 'may',
    key: 'may',
    align: 'right',
    render: renderCell,
  },
  {
    title: renderHeader('Jun'),
    dataIndex: 'jun',
    key: 'jun',
    align: 'right',
    render: renderCell,
  },
  {
    title: renderHeader('Jul'),
    dataIndex: 'jul',
    key: 'jul',
    align: 'right',
    render: renderCell,
  },
  {
    title: renderHeader('Aug'),
    dataIndex: 'aug',
    key: 'aug',
    align: 'right',
    render: renderCell,
  },
  {
    title: renderHeader('Sep'),
    dataIndex: 'sep',
    key: 'sep',
    align: 'right',
    render: renderCell,
  },
  {
    title: renderHeader('Oct'),
    dataIndex: 'oct',
    key: 'oct',
    align: 'right',
    render: renderCell,
  },
  {
    title: renderHeader('Nov'),
    dataIndex: 'nov',
    key: 'nov',
    align: 'right',
    render: renderCell,
  },
  {
    title: renderHeader('Dec'),
    dataIndex: 'dec',
    key: 'dec',
    align: 'right',
    render: renderCell,
  },
  {
    title: renderHeader('YTD'),
    dataIndex: 'ytd',
    key: 'ytd',
    align: 'right',
    render: renderCell,
  },
];

interface Props {
  performance: DataType[];
}

export default function PerformanceMonth({ performance }: Props) {
  const { appTheme } = useContext(AppContext);
  const { translate: translateBacktest } = useI18n('backtest');

  return (
    <div className={style.performanceContainer}>
      <div className={style.title}>
        {translateBacktest('performance_month')}
      </div>
      <div className={style.performanceContent}>
        <ConfigProvider theme={getThemeTable(appTheme)}>
          <Table
            scroll={{ x: 'auto' }}
            columns={columns}
            dataSource={performance}
            pagination={false}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
