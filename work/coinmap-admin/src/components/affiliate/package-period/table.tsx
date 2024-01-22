import type { ColumnsType } from 'antd/es/table';
import React, { memo, useMemo } from 'react';
import { Button, Table, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { formatDate } from '@/utils/format';
import { PackagePeriod } from './interface';
import { useRouter } from 'next/router';
import { ROUTERS } from '@/constants/router';

interface GuestsTableProps {
  dataSource: PackagePeriod[];
  loading: boolean;
}

const GuestsTable: React.FC<GuestsTableProps> = (props) => {
  const { dataSource, loading } = props;
  const router = useRouter();

  const columns: ColumnsType<PackagePeriod> = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: ['data', 'translation', 'en', 'name'],
        width: '10%',
      },
      {
        title: 'Name VI',
        dataIndex: ['data', 'translation', 'vi', 'name'],
        width: '10%',
      },
      {
        title: 'Discount amount ($)',
        dataIndex: ['data', 'translation', 'en', 'discount_amount'],
        width: '10%',
      },
      {
        title: 'Discount rate (%)',
        dataIndex: ['data', 'translation', 'en', 'discount_rate'],
        width: '10%',
      },
      {
        title: 'Order',
        dataIndex: ['data', 'translation', 'en', 'order'],
        width: '10%',
        align: 'center',
      },
      {
        title: 'Created at',
        dataIndex: 'created_at',
        align: 'right',
        width: '10%',
        render: (value: PackagePeriod['created_at']) =>
          formatDate(Number(value)),
      },
      {
        title: '',
        dataIndex: 'action',
        fixed: 'right',
        align: 'center',
        width: '1%',
        render: (_: PackagePeriod, record: PackagePeriod) => (
          <Tooltip title="Update FAQ">
            <Button
              onClick={() =>
                router.push(`${ROUTERS.AFFILIATE_PACKAGE_PERIOD}/${record.id}`)
              }
              icon={
                <EditOutlined style={{ cursor: 'pointer', fontSize: '18px' }} />
              }
            ></Button>
          </Tooltip>
        ),
      },
    ],
    []
  );
  return (
    <>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        loading={loading}
        tableLayout="auto"
      />
    </>
  );
};
export default memo(GuestsTable);
