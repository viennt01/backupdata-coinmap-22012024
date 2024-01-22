import style from './index.module.scss';
import { ERROR_CODE } from '@/constants/error-code';
import { ConfigProvider, Table, PaginationProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getPaymentList } from '@/components/profile-page/fetcher';
import { useRouter } from 'next/router';
import { formatLocaleDate } from '@/utils/format-date';
import { Payment, PAYMENT_STATUS } from '@/components/profile-page/interface';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { formatNumber } from '@/utils/format-number';
import ROUTERS from '@/constants/router';
import { THEME_TABLE } from '@/constants/theme';

const DEFAULT_PAGINATION = {
  current: 1,
  pageSize: 10,
};

export default function MyPayments() {
  const [paymentList, setPaymentList] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [pagination, setPagination] =
    useState<TablePaginationConfig>(DEFAULT_PAGINATION);

  const columns: ColumnsType<Payment> = useMemo(
    () => [
      {
        title: 'BOT',
        dataIndex: 'name',
        render: (text) => <span className={style.botName}>{text}</span>,
      },
      {
        title: 'Payment ID',
        dataIndex: 'order_id',
      },
      {
        title: 'Payment date',
        dataIndex: 'created_at',
        render: (value) => (
          <span className={style.botPaymentDate}>
            {!!value && formatLocaleDate(Number(value))}
          </span>
        ),
        sorter: (a, b) => Number(a.created_at) - Number(b.created_at),
      },
      {
        title: 'Expired date',
        dataIndex: 'expires_at',
        render: (value, record) => {
          const expired = Number(record.expires_at) < new Date().getTime();
          return (
            <span className={style.botExpiredDate}>
              {!!value && formatLocaleDate(Number(value))}
              {expired && <span className={style.expiredTag}>Expired</span>}
            </span>
          );
        },
        sorter: (a, b) => Number(a.expires_at) - Number(b.expires_at),
      },
      {
        title: 'Amount',
        dataIndex: 'price',
        align: 'right',
        render: (value) => <span>${formatNumber(Number(value), 2)}</span>,
        sorter: (a, b) => Number(a.price) - Number(b.price),
      },
      {
        title: '',
        key: 'action',
        render: (_, record) => {
          let showButton = false;
          if (record.status === PAYMENT_STATUS.INACTIVE) {
            showButton = true;
          }
          if (Number(record.expires_at) < new Date().getTime()) {
            showButton = true;
          }
          if (showButton) {
            return (
              <span
                className={style.renewalButton}
                onClick={() => router.push(ROUTERS.MARKETPLACE)}
              >
                Renewal
              </span>
            );
          }
          return null;
        },
      },
    ],
    [router]
  );

  const handlePaginationChange: PaginationProps['onChange'] = (page, size) => {
    getTableData(page, size);
  };

  const getTableData = (current: number, pageSize: number) => {
    setLoading(true);
    const queryString = `?page=${current}&size=${pageSize}`;
    getPaymentList(queryString)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setPaymentList(res.payload.rows);
          const { page, size, total } = res.payload;
          setPagination((state) => ({
            ...state,
            current: page,
            pageSize: size,
            total,
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getTableData(DEFAULT_PAGINATION.current, DEFAULT_PAGINATION.pageSize);
  }, []);

  return (
    <div className={style.paymentWrapper}>
      <h1 className={style.title}>My payments</h1>
      <div>
        <ConfigProvider theme={THEME_TABLE}>
          <Table
            className={style.paymentTable}
            columns={columns}
            dataSource={paymentList}
            showSorterTooltip={false}
            scroll={{ x: 'max-content' }}
            loading={loading}
            pagination={{
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
              showSizeChanger: false,
              ...pagination,
              onChange: handlePaginationChange,
            }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
