import type { ColumnsType } from 'antd/es/table';
import React, { memo, useMemo } from 'react';
import { Button, Table, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { formatDate, formatNumber } from '@/utils/format';
import { BotFee } from './interface';
import { useRouter } from 'next/router';
import { ROUTERS } from '@/constants/router';

interface GuestsTableProps {
  dataSource: BotFee[];
  loading: boolean;
}

interface DataSource extends BotFee {
  children: {
    from: number;
    to: number;
    percent: number;
  }[];
  action: boolean;
}

const GuestsTable: React.FC<GuestsTableProps> = (props) => {
  const { dataSource, loading } = props;
  const router = useRouter();

  const columns: ColumnsType<DataSource> = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Balance From',
        dataIndex: 'from',
        align: 'right',
        render: (value) =>
          Number.isInteger(value) ? `$${formatNumber(value)}` : '',
      },
      {
        title: 'Balance To',
        dataIndex: 'to',
        align: 'right',
        render: (value) =>
          Number.isInteger(value) ? `$${formatNumber(value)}` : '',
      },
      {
        title: 'Fee Rate',
        dataIndex: 'percent',
        align: 'right',
        render: (value) => (!isNaN(value) ? value : ''),
      },
      {
        title: 'Created at',
        dataIndex: 'created_at',
        align: 'right',
        render: (value) => (value ? formatDate(Number(value)) : ''),
      },
      {
        title: '',
        dataIndex: 'action',
        fixed: 'right',
        align: 'center',
        width: '60px',
        render: (value, record) =>
          value && (
            <Tooltip title="Update BOT">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`${ROUTERS.AFFILIATE_TBOT_FEE}/${record.id}`);
                }}
                icon={
                  <EditOutlined
                    style={{ cursor: 'pointer', fontSize: '18px' }}
                  />
                }
              ></Button>
            </Tooltip>
          ),
      },
    ],
    []
  );

  const formattedDataSource = useMemo(() => {
    return dataSource.reduce<DataSource[]>((result, item) => {
      const children = item.data.ranges.map((range, index) => ({
        ...range,
        id: index,
      }));
      return [...result, { ...item, children, action: true }];
    }, []);
  }, [dataSource]);

  return (
    <>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={formattedDataSource}
        pagination={false}
        loading={loading}
        tableLayout="auto"
        scroll={{ x: 'max-content' }}
        expandable={{
          expandRowByClick: true,
        }}
      />
    </>
  );
};

export default memo(GuestsTable);
