import style from './index.module.scss';
import { ERROR_CODE } from '@/constants/error-code';
import { ConfigProvider, Table, PaginationProps, Tag } from 'antd';
import { useContext, useEffect, useMemo, useState } from 'react';
import { getPaymentList } from '@/components/profile-page/fetcher';
import { useRouter } from 'next/router';
import { formatLocaleDate } from '@/utils/format-date';
import { Payment, PAYMENT_STATUS } from '@/components/profile-page/interface';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import ROUTERS from '@/constants/router';
import { AppContext } from '@/app-context';
import { getThemeTable } from '@/utils/theme';
import useI18n from '@/i18n/useI18N';
import { calculateAmount } from '@/utils/payment';

const DEFAULT_PAGINATION = {
  current: 1,
  pageSize: 10,
};

enum TAG_STATUS_COLOR {
  PROCESSING = 'processing',
  FAILED = 'error',
  ACTIVE = 'success',
  NOT_CONNECT = 'success',
}

enum TAG_STATUS_LABEL {
  PROCESSING = 'Processing',
  FAILED = 'Failed',
  ACTIVE = 'Success',
  NOT_CONNECT = 'Success',
}

export default function MyPayments() {
  const [paymentList, setPaymentList] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { translate: translatePayment } = useI18n('payment');
  const [pagination, setPagination] =
    useState<TablePaginationConfig>(DEFAULT_PAGINATION);
  const { appTheme } = useContext(AppContext);

  const columns: ColumnsType<Payment> = useMemo(
    () => [
      {
        title: translatePayment('bot'),
        dataIndex: 'name',
        render: (text) => <span className={style.botName}>{text}</span>,
      },
      {
        title: translatePayment('payment_id'),
        dataIndex: 'order_id',
      },
      {
        title: translatePayment('payment_date'),
        dataIndex: 'created_at',
        render: (value) => (
          <span className={style.botPaymentDate}>
            {!!value && formatLocaleDate(Number(value))}
          </span>
        ),
        sorter: (a, b) => Number(a.created_at) - Number(b.created_at),
      },
      {
        title: translatePayment('expired_date'),
        dataIndex: 'expires_at',
        render: (value, record) => {
          const expired = Number(record.expires_at) < new Date().getTime();
          return (
            <span className={style.botExpiredDate}>
              {!!value && formatLocaleDate(Number(value))}
              {expired && (
                <span className={style.expiredTag}>
                  {translatePayment('expired')}
                </span>
              )}
            </span>
          );
        },
        sorter: (a, b) => Number(a.expires_at) - Number(b.expires_at),
      },
      {
        title: translatePayment('amount'),
        dataIndex: 'price',
        align: 'right',
        render: (_, record) => (
          <span>
            $
            {calculateAmount(
              record.price,
              record.quantity,
              record.discount_rate,
              record.discount_amount
            )}
          </span>
        ),
        sorter: (a, b) =>
          Number(
            calculateAmount(
              a.price,
              a.quantity,
              a.discount_rate,
              a.discount_amount
            )
          ) -
          Number(
            calculateAmount(
              b.price,
              b.quantity,
              b.discount_rate,
              b.discount_amount
            )
          ),
      },
      {
        title: translatePayment('status'),
        dataIndex: 'status',
        align: 'center',
        render: (value) => (
          <Tag
            style={{ margin: 0 }}
            color={TAG_STATUS_COLOR[value as keyof typeof TAG_STATUS_COLOR]}
          >
            {TAG_STATUS_LABEL[value as keyof typeof TAG_STATUS_LABEL]}
          </Tag>
        ),
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
                {translatePayment('renewal')}
              </span>
            );
          }
          return null;
        },
      },
    ],
    [router, translatePayment]
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
      <h1 className={style.title}>{translatePayment('payment')}</h1>
      <div>
        <ConfigProvider theme={getThemeTable(appTheme)}>
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
