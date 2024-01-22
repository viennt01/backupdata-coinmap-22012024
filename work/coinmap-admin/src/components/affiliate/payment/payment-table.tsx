import type { ColumnsType } from 'antd/es/table';
import React, { memo, useMemo } from 'react';
import { Button, Table, Tag, Tooltip, Image } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { formatDate } from '@/utils/format';
import { PAYMENTS_STATUS_COLOR } from '@/constants/merchants';
import {
  ICON_NETWORK,
  NETWORK,
  Payment,
} from '@/components/affiliate/payment/interface';
import { formatCurrency } from '@/utils/format-currency';

interface GuestsTableProps {
  dataSource: Payment[];
  loading: boolean;
  handleOpenDrawer: (merchant: Payment) => void;
}

const GuestsTable: React.FC<GuestsTableProps> = (props) => {
  const { dataSource, loading, handleOpenDrawer } = props;

  const columns: ColumnsType<Payment> = useMemo(
    () => [
      {
        title: '#',
        dataIndex: 'index',
        align: 'right',
        width: '5%',
        render: (_, record, index) => {
          return index + 1;
        },
      },
      {
        title: 'Merchant Name',
        dataIndex: 'merchant_name',
        width: '10%',
      },
      {
        title: 'Network',
        dataIndex: 'wallet_network',
        width: '10%',
        render: (network: NETWORK) => {
          return (
            <>
              <Image
                src={ICON_NETWORK[network] || ICON_NETWORK.TRC20}
                alt="logo network"
                width={24}
                height={24}
                style={{ paddingRight: '4px' }}
                preview={false}
              />
              {network || NETWORK.TRC20}
            </>
          );
        },
      },
      {
        title: 'Email',
        dataIndex: 'merchant_email',
        width: '10%',
      },
      {
        title: 'Amount',
        dataIndex: 'amount_commission_complete',
        width: '10%',
        align: 'right',
        render: (value) => formatCurrency(value),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        align: 'center',
        width: '10%',

        render: (value) => (
          <Tag
            color={
              PAYMENTS_STATUS_COLOR[value as keyof typeof PAYMENTS_STATUS_COLOR]
            }
          >
            {value}
          </Tag>
        ),
      },
      {
        title: 'Merchant Code',
        dataIndex: 'merchant_code',
        width: '10%',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        width: '10%',
      },
      {
        title: 'Created at',
        dataIndex: 'created_at',
        align: 'right',
        width: '10%',
        render: (value) => formatDate(Number(value)),
      },
      {
        title: 'Updated at',
        dataIndex: 'updated_at',
        align: 'right',
        width: '10%',
        render: (value) => formatDate(Number(value)),
      },
      {
        title: '',
        dataIndex: 'action',
        fixed: 'right',
        align: 'right',
        width: '5%',
        render: (_, record) => (
          <Tooltip title="Update payment">
            <Button
              icon={
                <EditOutlined style={{ cursor: 'pointer', fontSize: '18px' }} />
              }
              onClick={() => handleOpenDrawer(record)}
            ></Button>
          </Tooltip>
        ),
      },
    ],
    [handleOpenDrawer]
  );
  return (
    <>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        loading={loading}
        scroll={{ x: 2000, y: '60vh' }}
        tableLayout="auto"
      />
    </>
  );
};
export default memo(GuestsTable);
