import CustomCard from '@/components/commons/custom-card';
import PageTitle from '@/components/commons/page-title';
import { ERROR_CODE } from '@/constants/code-constants';
import { useState, useEffect } from 'react';

import Filter from './filter';
import Table from './table';
import { Form } from 'antd';
import { BotPeriodFilter, getBotPeriod } from './fetcher';
import { BotPeriod } from './interface';

export default function BotPeriodTab() {
  const [tableData, setTableData] = useState<BotPeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<BotPeriodFilter>({
    keyword: '',
  });

  const [form] = Form.useForm();

  const fetchData = () => {
    setLoading(true);
    getBotPeriod(filter)
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
