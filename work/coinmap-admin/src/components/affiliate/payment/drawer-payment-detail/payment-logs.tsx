import { useMemo } from 'react';
import { Table, Tag, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import ButtonCopy from '@/components/commons/button-copy';
import { NETWORK, PaymentHistory } from '../interface';
import { PAYMENTS_STATUS_COLOR } from '@/constants/merchants';
import { formatDate } from '@/utils/format';

interface Props {
  paymentHistories: PaymentHistory[];
}

const TRANSACTION_SCAN = {
  TRC20: 'https://tronscan.org/#/transaction/',
  BSC20: 'https://bscscan.com/tx/',
};

const generateTransactionDetailsRef = (
  transactionHash: string,
  walletNetwork: NETWORK
) => {
  return TRANSACTION_SCAN[walletNetwork] + transactionHash;
};

const columns: ColumnsType<PaymentHistory> = [
  {
    title: 'Transaction Id',
    dataIndex: 'transaction_id',
    width: 120,
    render: (value, record) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {value && <ButtonCopy copyValue={value} />}
        <Tooltip overlayInnerStyle={{ width: 'fit-content' }} title={value}>
          <a
            style={{
              display: 'block',
              maxWidth: 120,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            href={generateTransactionDetailsRef(
              value,
              record.wallet_network ?? NETWORK.TRC20
            )}
            target="_blank"
            rel="noreferrer"
          >
            {value}
          </a>
        </Tooltip>
      </div>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    align: 'center',
    render: (value) => (
      <Tag
        style={{ margin: 0 }}
        color={
          PAYMENTS_STATUS_COLOR[value as keyof typeof PAYMENTS_STATUS_COLOR]
        }
      >
        {value}
      </Tag>
    ),
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
  {
    title: 'Updated At',
    dataIndex: 'created_at',
    align: 'right',
    render: (value) => formatDate(Number(value)),
  },
];

const PaymentLogs = ({ paymentHistories }: Props) => {
  // format data to display in table data
  const formatTableData = (payments: PaymentHistory[]) => {
    const tableData = payments
      .sort((a, b) => Number(b.created_at) - Number(a.created_at))
      .map((payment, index) => {
        return {
          ...payment,
          row_key: index,
        };
      });
    return tableData;
  };

  const tableData = useMemo(() => {
    return formatTableData(paymentHistories);
  }, [paymentHistories]);

  return (
    <Table
      size="small"
      columns={columns}
      dataSource={tableData}
      rowKey="row_key"
      scroll={{ x: 'max-content' }}
      pagination={false}
    />
  );
};

export default PaymentLogs;
