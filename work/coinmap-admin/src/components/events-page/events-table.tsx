import type { ColumnsType } from 'antd/es/table';
import React from 'react';
import { Table, Pagination, PaginationProps, Tooltip } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import { EditOutlined } from '@ant-design/icons';
import { blue } from '@ant-design/colors';
import { useRouter } from 'next/router';
import { AdminGetEventDataOutput } from '@/utils/api-getters';
import { formatDate } from '@/utils/format';
import { ROUTERS } from '@/constants/router';

interface EventsTableProps {
  dataSource: AdminGetEventDataOutput[];
  loading: boolean;
  maxHeight: number;
  pagination: TablePaginationConfig | undefined;
  onChange: PaginationProps['onChange'];
}

const EventsTable: React.FC<EventsTableProps> = (props) => {
  const { dataSource, loading, maxHeight, pagination, onChange } = props;
  const router = useRouter();
  const handleClickId = (id: string) => {
    router.push(`${ROUTERS.GUESTS}?event_id=${id}`);
  };

  const columns: ColumnsType<AdminGetEventDataOutput> = [
    {
      title: '#',
      dataIndex: 'index',
      fixed: 'left',
      align: 'right',
      width: '40px',
      render: (value, record, index) => {
        const { pageSize = 0, current = 0 } = pagination ?? {};
        return (
          <Tooltip title={`Guests list`}>
            <span
              style={{
                cursor: 'pointer',
                color: blue.primary,
              }}
              onClick={() => handleClickId(record.id)}
            >
              {index + pageSize * (current - 1) + 1}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '15%',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      width: '15%',
    },
    {
      title: 'Number guest',
      dataIndex: 'attendees_number',
      align: 'center',
      width: '15%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
    },
    {
      title: 'Start at',
      align: 'right',
      dataIndex: 'start_at',
      render: (value) => formatDate(Number(value)),
    },
    {
      title: 'Finish at',
      align: 'right',
      dataIndex: 'finish_at',
      render: (value) => formatDate(Number(value)),
    },
    {
      title: 'Created at',
      align: 'right',
      dataIndex: 'created_at',
      render: (value) => formatDate(Number(value)),
    },
    {
      title: 'Updated at',
      align: 'right',
      dataIndex: 'updated_at',
      render: (value) => formatDate(Number(value)),
    },
    {
      title: '',
      dataIndex: 'action',
      fixed: 'right',
      align: 'right',
      render: (_, record) => (
        <EditOutlined
          style={{ cursor: 'pointer', fontSize: '18px' }}
          onClick={() => router.push(`${ROUTERS.EVENTS}/${record.id}`)}
        />
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        loading={loading}
        scroll={{ x: 1200, y: maxHeight }}
        tableLayout="auto"
      />
      <Pagination
        responsive={true}
        style={{ textAlign: 'right', marginTop: '24px' }}
        {...pagination}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        onChange={onChange}
      />
    </>
  );
};
export default EventsTable;
