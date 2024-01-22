import { useContext, useEffect, useState } from 'react';
import { Button, Card, Space, Table, Tag, Tooltip, Typography } from 'antd';
import { PaginationProps } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { formatDateTime, formatNumber } from '@/utils/format';
import { DEFAULT_PAGINATION } from '@/constant/pagination';
import ButtonCopy from '@/components/common/button-copy';
import { STATUS_COLOR } from '@/constant/payment';
import { SyncOutlined } from '@ant-design/icons';
import {
  getPaymentList,
  NETWORK_TYPE,
  Payment,
  PaymentDetails,
} from '../fetcher';
import { ERROR_CODE } from '@/constant/error-code';
import { PaymentContext } from '@/components/payment/payment';

interface TableData extends Payment {
  children: Payment[];
}

const { Title } = Typography;

const TRANSACTION_SCAN = {
  TRC20: 'https://tronscan.org/#/transaction/',
  BSC20: 'https://bscscan.com/tx/',
};

const generateTransactionDetailsRef = (
  transactionHash: string,
  walletNetwork: NETWORK_TYPE
) => {
  return TRANSACTION_SCAN[walletNetwork] + transactionHash;
};

const columns: ColumnsType<TableData> = [
  {
    title: 'Transaction Id',
    dataIndex: 'transaction_id',
    width: 240,
    render: (value, record) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {value && <ButtonCopy copyValue={value} />}
        <Tooltip overlayInnerStyle={{ width: 'fit-content' }} title={value}>
          <a
            style={{
              display: 'block',
              maxWidth: 240,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            href={generateTransactionDetailsRef(
              value,
              record.wallet_network ?? NETWORK_TYPE.TRC20
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
    title: 'Receiving address',
    dataIndex: 'wallet_address',
    width: 160,
    render: (value) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {value && <ButtonCopy copyValue={value} />}
        <Tooltip overlayInnerStyle={{ width: 'fit-content' }} title={value}>
          <div
            style={{
              display: 'block',
              maxWidth: 160,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {value}
          </div>
        </Tooltip>
      </div>
    ),
  },
  {
    title: 'Network',
    dataIndex: 'wallet_network',
    render: (value) => value ?? NETWORK_TYPE.TRC20,
  },
  {
    title: 'Amount',
    dataIndex: 'amount_commission_complete',
    align: 'right',
    render: (value) => `$${formatNumber(value)}`,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    align: 'center',
    render: (value) => (
      <Tag
        style={{ margin: 0 }}
        color={STATUS_COLOR[value as keyof typeof STATUS_COLOR]}
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
    title: 'Created At',
    dataIndex: 'created_at',
    align: 'right',
    render: (value) => value && formatDateTime(new Date(Number(value))),
  },
  {
    title: 'Updated At',
    dataIndex: 'updated_at',
    align: 'right',
    render: (value) => formatDateTime(new Date(Number(value))),
  },
];

const WithdrawalTable = () => {
  const [pagination, setPagination] =
    useState<TablePaginationConfig>(DEFAULT_PAGINATION);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const { pageLoading } = useContext(PaymentContext);

  // format data to display in table data
  const formatTableData = (payments: PaymentDetails[]) => {
    const tableData = payments.map((payment) => {
      return {
        ...payment,
        row_key: payment.id,
        children: (payment.metadata?.histories ?? [])
          .sort((a, b) => Number(b.created_at) - Number(a.created_at))
          .map((history, index) => ({
            ...history,
            row_key: index,
            created_at: '',
            updated_at: history.created_at,
          })),
      };
    });
    return tableData;
  };

  // get table data based on pagination
  const getTableData = (
    current: number,
    pageSize: number,
    loadingDelay = 0
  ) => {
    setLoading(true);
    const queryString = `?page=${current}&size=${pageSize}`;

    getPaymentList(queryString)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const tableData = formatTableData(res.payload.rows);
          setTableData(tableData);
          const { page, size, total } = res.payload;
          setPagination((state) => ({
            ...state,
            current: page,
            pageSize: size,
            total,
          }));
        }
      })
      .catch((e: Error) => console.log(e))
      .finally(() => setTimeout(() => setLoading(false), loadingDelay));
  };

  // update pagination and router query
  const handlePaginationChange: PaginationProps['onChange'] = (page, size) => {
    getTableData(page, size);
  };

  // reload data of payment table
  const handleReloadTable = () => {
    if (pagination.current && pagination.pageSize) {
      getTableData(pagination.current, pagination.pageSize, 1000);
    }
  };

  useEffect(() => {
    getTableData(DEFAULT_PAGINATION.current, DEFAULT_PAGINATION.pageSize, 1000);
  }, [pageLoading]);

  return (
    <Card
      bordered={false}
      title={
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0 }}>
            PAYMENT HISTORIES
          </Title>
          <Button disabled={loading} type="text" shape="circle">
            <SyncOutlined
              style={{ display: 'block', fontSize: 18 }}
              spin={loading}
              onClick={handleReloadTable}
            />
          </Button>
        </Space>
      }
      bodyStyle={{ padding: 0 }}
    >
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="row_key"
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          position: ['bottomCenter'],
          ...pagination,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: handlePaginationChange,
        }}
      />
    </Card>
  );
};

export default WithdrawalTable;
