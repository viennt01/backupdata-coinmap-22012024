import { ERROR_CODE } from '@/fetcher/utils';
import {
  Button,
  ConfigProvider,
  Table,
  Typography,
  Pagination,
  Tag,
} from 'antd';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getPaymentList } from '../fetcher';
import style from './my-payments.module.scss';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

const { Text } = Typography;

const FORMAT_DATE_STRING = 'hh:mm dd/MM/yyyy';
const TAG_STATUS_COLOR = {
  PROCESSING: 'cyan',
  INACTIVE: 'red',
  ACTIVE: 'green',
};

const initialFilter = {
  page: 1,
  size: 10,
  keyword: '',
  category: '',
};

const renderPriceRow = (value, record) => {
  return value ? (
    <>
      {record.discount_rate ? (
        <>
          <Text
            style={{
              textDecoration: 'line-through',
            }}
          >
            (${(value * record.quantity).toFixed(2)})
          </Text>{' '}
          <Text type="success">
            $
            {(
              (value - value * record.discount_rate - record.discount_amount) *
              record.quantity
            ).toFixed(2)}
          </Text>
        </>
      ) : (
        <>
          <Text>${value * record.quantity}</Text>
        </>
      )}
    </>
  ) : (
    ''
  );
};

export default function MyPayments() {
  const [paymentList, setPaymentList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState(initialFilter);
  const [totalPage, setTotalPage] = useState(0);
  const router = useRouter();

  const fetchData = (filter) => {
    setLoading(true);
    getPaymentList(filter)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setPaymentList(res.payload.rows);
          setTotalPage(res.payload.total);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  const changeFilter = (key, value) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const columns = useMemo(
    () => [
      {
        title: 'Product',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <Text type="secondary">{text}</Text>,
      },
      {
        title: 'Payment ID',
        dataIndex: 'order_id',
        key: 'order_id',
      },
      {
        title: 'Payment date',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'right',
        render: (value) => (
          <Text>{value && format(Number(value), FORMAT_DATE_STRING)}</Text>
        ),
        sorter: (a, b) => a.created_at.length - b.created_at.length,
      },
      {
        title: 'Expired date',
        dataIndex: 'expires_at',
        key: 'expires_at',
        align: 'right',
        render: (value) => (
          <Text>{value && format(Number(value), FORMAT_DATE_STRING)}</Text>
        ),
        sorter: (a, b) => a.expires_at.length - b.expires_at.length,
      },
      {
        title: 'Amount',
        dataIndex: 'price',
        key: 'price',
        align: 'right',
        render: renderPriceRow,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (value) => (
          <Tag color={TAG_STATUS_COLOR[value] || 'blue'}>{value}</Tag>
        ),
      },
      {
        title: '',
        key: 'action',
        render: (_, record) => {
          let showButton = false;
          if (record.status === 'INACTIVE') {
            showButton = true;
          }
          if (record.expires_at < new Date().getTime()) {
            showButton = true;
          }
          if (showButton) {
            return (
              <Button
                onClick={() => {
                  if (record.category === 'BOT') {
                    router.push('/marketplace');
                  } else {
                    router.push('/pricing');
                  }
                }}
                className={style.renewalButton}
                ghost
                type="ghost"
              >
                Renewal
              </Button>
            );
          }
          return null;
        },
      },
    ],
    [router]
  );

  return (
    <div>
      <h1>My Payment</h1>
      <div>
        <ConfigProvider
          theme={{
            token: {
              colorBgContainer: '#17192D',
              colorBorder: '#111024',
            },
          }}
        >
          <Table
            className={style.tableContainer}
            rowClassName={style.rowClassName}
            columns={columns}
            dataSource={paymentList}
            pagination={false}
            showSorterTooltip={false}
            scroll={{ y: 400, x: true }}
            loading={loading}
          />
          <Pagination
            showSizeChanger
            pageSize={filter.size}
            onShowSizeChange={(_, value) => changeFilter('size', value)}
            onChange={(value) => changeFilter('page', value)}
            current={filter.page}
            total={totalPage}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
