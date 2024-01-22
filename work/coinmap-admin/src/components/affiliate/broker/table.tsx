import type { ColumnsType } from 'antd/es/table';
import React, { memo, useMemo } from 'react';
import { Button, Table, Tag, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { formatDate } from '@/utils/format';
import { useRouter } from 'next/router';
import { TableData } from '.';
import { ROUTERS } from '@/constants/router';

interface GuestsTableProps {
  dataSource: TableData[];
  loading: boolean;
}

const GuestsTable: React.FC<GuestsTableProps> = (props) => {
  const { dataSource, loading } = props;
  const router = useRouter();

  const columns: ColumnsType<TableData> = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Code',
        dataIndex: 'code',
      },
      {
        title: 'Required profile',
        dataIndex: 'required_profile',
        render: (value) => Boolean(value).toString().toUpperCase(),
        align: 'center',
      },
      {
        title: 'Servers',
        dataIndex: 'servers',
        render: (value) =>
          value.map((server: string, index: number) => (
            <Tag key={index}>{server}</Tag>
          )),
      },
      {
        title: 'Created at',
        dataIndex: 'created_at',
        align: 'right',
        render: (value) => (value ? formatDate(Number(value)) : ''),
      },
      {
        title: 'Updated at',
        dataIndex: 'updated_at',
        align: 'right',
        render: (value) => (value ? formatDate(Number(value)) : ''),
      },
      {
        title: '',
        dataIndex: 'action',
        fixed: 'right',
        align: 'center',
        width: '60px',
        render: (_, record) => (
          <Tooltip title="Update Broker">
            <Button
              onClick={() =>
                router.push(
                  `${ROUTERS.AFFILIATE_BROKER}/${record.id}?code=${record.code}`
                )
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
        rowKey={(record) => record.code}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        loading={loading}
        tableLayout="auto"
        scroll={{ x: 'max-content' }}
      />
    </>
  );
};

export default memo(GuestsTable);
