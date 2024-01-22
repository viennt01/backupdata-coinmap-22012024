import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Table, Breadcrumb, Card, Form, Tag, Button } from 'antd';
import { PaginationProps } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import dayjs from 'dayjs';
import { formatDateTime } from '@/utils/format';
import { ERROR_CODE } from '@/constant/error-code';
import { DEFAULT_PAGINATION } from '@/constant/pagination';
import { ROUTERS } from '@/constant/router';
import { getUserList } from './fetcher';
import FilterForm, { FormValues } from './filter-form';
import {
  EMAIL_VERIFY_TAG_COLOR,
  STRING_TO_BOOLEAN,
  EMAIL_CONFIRMED_LABEL,
} from '@/constant/user';
import { EditOutlined } from '@ant-design/icons';
import { User } from '../interface';

export default function CustomerList() {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();
  const [tableData, setTableData] = useState<User[]>([]);
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

    getUserList(queryString)
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

  // set initial value for filter form
  const setInitialFormValues = () => {
    const { keyword, email_confirmed, from, to, tbots } = router.query;
    form.setFieldsValue({
      keyword: (keyword as string) || undefined,
      tbots: (tbots as string) || undefined,
      email_confirmed: (email_confirmed as string)
        ? STRING_TO_BOOLEAN[email_confirmed as keyof typeof STRING_TO_BOOLEAN]
        : undefined,
      from: from ? dayjs(Number(from)) : undefined,
      to: to ? dayjs(Number(to)) : undefined,
    });
  };

  // update pagination and router query
  const handlePaginationChange: PaginationProps['onChange'] = (page, size) => {
    router.replace({
      pathname: ROUTERS.CUSTOMER_LIST,
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
      pathname: ROUTERS.CUSTOMER_LIST,
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
    if (!router.isReady) return;
    getTableData();
    setInitialFormValues();
  }, [router.query]);

  const handleEditCustomer = (user: User) => {
    router.push(ROUTERS.CUSTOMER_EDIT(user.id));
  };

  const columns: ColumnsType<User> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: 'Full Name',
        dataIndex: 'full_name',
        render: (_, record) => `${record.first_name} ${record.last_name}`,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        render: (value) =>
          value.replace(value.slice(2, value.indexOf('@')), '*****'),
      },
      {
        title: 'Email Verify',
        dataIndex: 'email_confirmed',
        align: 'center',
        render: (value) => (
          <Tag
            style={{ margin: 0 }}
            color={
              EMAIL_VERIFY_TAG_COLOR[
                value as keyof typeof EMAIL_VERIFY_TAG_COLOR
              ]
            }
          >
            {EMAIL_CONFIRMED_LABEL[value as keyof typeof EMAIL_CONFIRMED_LABEL]}
          </Tag>
        ),
      },
      {
        title: 'Created At',
        dataIndex: 'created_at',
        align: 'right',
        render: (value) => formatDateTime(new Date(Number(value))),
      },
      {
        title: '',
        dataIndex: '',
        align: 'right',
        render: (_, record) => (
          <Button
            onClick={() => handleEditCustomer(record)}
            icon={<EditOutlined />}
          ></Button>
        ),
      },
    ],
    [handleEditCustomer]
  );

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Customer</Breadcrumb.Item>
      </Breadcrumb>
      <Card style={{ marginBottom: 24 }} bordered={false}>
        <FilterForm form={form} loading={loading} handleSearch={handleSearch} />
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
