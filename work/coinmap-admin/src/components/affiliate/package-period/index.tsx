import CustomCard from '@/components/commons/custom-card';
import PageTitle from '@/components/commons/page-title';
import { ERROR_CODE } from '@/constants/code-constants';
import { useState, useEffect } from 'react';

import Filter from './filter';
import Table from './table';
import { Form } from 'antd';
import { PackagePeriodFilter, getPackagePeriod } from './fetcher';
import { PackagePeriod } from './interface';

export default function PackagePeriodTab() {
  const [tableData, setTableData] = useState<PackagePeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<PackagePeriodFilter>({
    keyword: '',
  });

  const [form] = Form.useForm();

  const fetchData = () => {
    setLoading(true);
    getPackagePeriod(filter)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setTableData(res.payload);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [filter.keyword]);

  const handleSearch = (values: { keyword: string }) => {
    setFilter(values);
  };

  // sync table data
  const syncTableData = () => {
    fetchData();
  };

  return (
    <>
      <PageTitle title="Package " />
      <Filter
        form={form}
        handleSearch={handleSearch}
        syncTableData={syncTableData}
      />
      <CustomCard style={{ marginTop: '24px' }}>
        <Table dataSource={tableData} loading={loading} />
      </CustomCard>
    </>
  );
}
