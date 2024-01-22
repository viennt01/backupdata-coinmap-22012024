import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import React, { memo } from 'react';
import { PaginationProps, Table, Tag } from 'antd';
import { formatDate } from '@/utils/format';
import { MerchantUser } from '../interface';
import {
  EMAIL_CONFIRMED_LABEL,
  EMAIL_VERIFY_TAG_COLOR,
} from '@/constants/merchants';

interface UserTableProps {
  dataSource: MerchantUser[];
  loading: boolean;
  pagination: TablePaginationConfig | undefined;
  onChange: PaginationProps['onChange'];
}

const UserTable: React.FC<UserTableProps> = (props) => {
  const { dataSource, loading, pagination, onChange } = props;

  const columns: ColumnsType<MerchantUser> = [
    {
      title: '#',
      dataIndex: 'index',
      align: 'right',
      render: (_, record, index) => {
        const { pageSize = 0, current = 0 } = pagination ?? {};
        return index + pageSize * (current - 1) + 1;
      },
    },
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Full Name',
      dataIndex: 'name',
      width: '180px',
      render: (_, record) => {
        return `${record.first_name} ${record.last_name}`;
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Email Verify',
      dataIndex: 'email_confirmed',
      width: '160px',
      align: 'center',
      render: (value) => (
        <Tag
          style={{ margin: 0 }}
          color={
            EMAIL_VERIFY_TAG_COLOR[value as keyof typeof EMAIL_VERIFY_TAG_COLOR]
          }
        >
          {EMAIL_CONFIRMED_LABEL[value as keyof typeof EMAIL_CONFIRMED_LABEL]}
        </Tag>
      ),
    },
    {
      title: 'Merchant Code',
      dataIndex: 'merchant_code',
      width: '160px',
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      align: 'right',
      render: (value) => formatDate(Number(value)),
    },
  ];
  return (
    <>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          responsive: true,
          style: { textAlign: 'right', marginTop: '24px' },
          ...pagination,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange,
        }}
        loading={loading}
        scroll={{ x: 'max-content', y: '45vh' }}
        tableLayout="auto"
      />
    </>
  );
};
export default memo(UserTable);
