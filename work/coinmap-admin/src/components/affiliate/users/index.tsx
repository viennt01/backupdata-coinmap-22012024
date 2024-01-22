import CustomCard from '@/components/commons/custom-card';
import PageTitle from '@/components/commons/page-title';
import { DEFAULT_PAGINATION, ERROR_CODE } from '@/constants/code-constants';
import { TablePaginationConfig, PaginationProps, Form } from 'antd';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import UserTable from './components/user-table';
import { getMerchantUserList } from './fetcher';
import { MerchantUser, MerchantUserList } from './interface';
import UserFilter from './components/user-filter';
import { STRING_TO_BOOLEAN } from '@/constants/merchants';
import dayjs from 'dayjs';
import { ROUTERS } from '@/constants/router';

export default function MerchantTab() {
  const router = useRouter();
  const [tableData, setTableData] = useState<MerchantUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] =
    useState<TablePaginationConfig>(DEFAULT_PAGINATION);
  const [form] = Form.useForm();

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

    getMerchantUserList(queryString)
      .then((res: MerchantUserList) => {
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

  const setInitialFormValues = () => {
    const {
      keyword,
      email_confirmed,
      merchant_code,
      tbots,
      tbot_status,
      from,
      to,
    } = router.query;
    form.setFieldsValue({
      keyword: (keyword as string) || undefined,
      merchant_code: (merchant_code as string) || undefined,
      tbots: (tbots as string) || undefined,
      tbot_status: (tbot_status as string) || undefined,
      email_confirmed: (email_confirmed as string)
        ? STRING_TO_BOOLEAN[email_confirmed as keyof typeof STRING_TO_BOOLEAN]
        : undefined,
      from: from ? dayjs(Number(from)) : undefined,
      to: to ? dayjs(Number(to)) : undefined,
    });
  };

  const handleTableChange: PaginationProps['onChange'] = (page, size) => {
    router.replace({
      pathname: ROUTERS.AFFILIATE_USER,
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

  const handleSearch = () => {
    const formValues = form.getFieldsValue();
    router.replace({
      pathname: ROUTERS.AFFILIATE_USER,
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

  return (
    <>
      <PageTitle title="User" />
      <UserFilter form={form} handleSearch={handleSearch} />
      <CustomCard style={{ marginTop: '24px' }}>
        <UserTable
          dataSource={tableData}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </CustomCard>
    </>
  );
}
