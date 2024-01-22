import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Table, Breadcrumb, Card, Form, Tag } from 'antd';
import { PaginationProps } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import dayjs from 'dayjs';
import { formatDateTime, formatCurrency } from '@/utils/format';
import { ERROR_CODE } from '@/constant/error-code';
import { DEFAULT_PAGINATION } from '@/constant/pagination';
import { ROUTERS } from '@/constant/router';
import FilterForm, { FormValues } from './filter-form';
import {
  getTransactionList,
  getBotList,
  getRoleList,
  getBotTradingList,
  Transaction,
  PackageList,
} from './fetcher';
import { STATUS_TAG_COLOR, ORDER_CATEGORY } from '@/constant/transaction';

export default function AffiliateList() {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();
  const [tableData, setTableData] = useState<Transaction[]>([]);
  const [packages, setPackages] = useState<PackageList>({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] =
    useState<TablePaginationConfig>(DEFAULT_PAGINATION);

  // get table data based on pagination and search form
  const getTableData = () => {
    setLoading(true);
    const page = router.query.page ?? DEFAULT_PAGINATION.current;
    const size = router.query.size ?? DEFAULT_PAGINATION.pageSize;
    let queryString = `?page=${page}&size=${size}`;
    Object.keys(router.query).forEach((key) => {
      if (!['page', 'size'].includes(key) && router.query[key]) {
        queryString += `&${key}=${router.query[key]}`;
      }
    });

    getTransactionList(queryString)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setTableData(res.payload.rows);
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
      .finally(() => setLoading(false));
  };

  // get option select for filter form
  const fetchOptionSelect = () => {
    Promise.all([getBotList(), getRoleList(), getBotTradingList()])
      .then(([botListRes, roleListRes, botTradingRes]) => {
        if (
          botListRes.error_code !== ERROR_CODE.SUCCESS ||
          roleListRes.error_code !== ERROR_CODE.SUCCESS ||
          botTradingRes.error_code !== ERROR_CODE.SUCCESS
        )
          return;

        setPackages({
          [ORDER_CATEGORY.SBOT]: botListRes.payload,
          [ORDER_CATEGORY.PKG]: roleListRes.payload,
          [ORDER_CATEGORY.TBOT]: botTradingRes.payload,
        });
      })
      .catch((e) => console.log(e));
  };

  // set initial value for filter form
  const setInitialFormValues = () => {
    const { keyword, category, name, status, from, to } = router.query;
    form.setFieldsValue({
      keyword: (keyword as string) || undefined,
      category: (category as string) || undefined,
      name: (name as string) || undefined,
      status: (status as string) || undefined,
      from: from ? dayjs(Number(from)) : undefined,
      to: to ? dayjs(Number(to)) : undefined,
    });
  };

  // update pagination and router query
  const handlePaginationChange: PaginationProps['onChange'] = (page, size) => {
    router.replace({
      pathname: ROUTERS.TRANSACTION_LIST,
      query: {
        ...router.query,
        page,
        size,
      },
    });
    setPagination((state) => ({
      ...state,
      current: page,
      pageSize: size,
    }));
  };

  // update router query
  const handleSearch = () => {
    const formValues = form.getFieldsValue();
    router.replace({
      pathname: ROUTERS.TRANSACTION_LIST,
      query: {
        ...router.query,
        ...formValues,
        from: formValues.from ? formValues.from.valueOf() : '',
        to: formValues.to ? formValues.to.valueOf() : '',
        page: 1,
        pageSize: router.query.pageSize ?? DEFAULT_PAGINATION.pageSize,
      },
    });
  };

  useEffect(() => {
    fetchOptionSelect();
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    getTableData();
    setInitialFormValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const columns: ColumnsType<Transaction> = useMemo(
    () => [
      {
        title: 'Order Id',
        dataIndex: 'order_id',
      },
      {
        title: 'Order Type',
        dataIndex: 'order_type',
        align: 'center',
      },
      {
        title: 'Full Name',
        dataIndex: 'fullname',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        render: (value) =>
          value?.replace(value.slice(2, value.indexOf('@')), '*****'),
      },
      {
        title: 'Package',
        dataIndex: 'package',
        render: (_, record) => record.items[0].name,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        align: 'center',
        render: (value) => (
          <Tag
            style={{ margin: 0 }}
            color={STATUS_TAG_COLOR[value as keyof typeof STATUS_TAG_COLOR]}
          >
            {value}
          </Tag>
        ),
      },
      {
        title: 'Total',
        dataIndex: 'amount',
        align: 'right',
        render: (value) => formatCurrency(value),
      },
      {
        title: 'Profit',
        dataIndex: 'commission_cash',
        align: 'right',
        render: (value) => formatCurrency(value),
      },
      {
        title: 'Created At',
        dataIndex: 'created_at',
        align: 'right',
        render: (value) => formatDateTime(new Date(Number(value))),
      },
    ],
    []
  );

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Orders</Breadcrumb.Item>
      </Breadcrumb>
      <Card style={{ marginBottom: 24 }} bordered={false}>
        <FilterForm
          form={form}
          loading={loading}
          packages={packages}
          handleSearch={handleSearch}
        />
      </Card>
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="id"
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
    </>
  );
}
