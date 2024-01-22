import CustomCard from '@/components/commons/custom-card';
import PageTitle from '@/components/commons/page-title';
import { ERROR_CODE } from '@/constants/code-constants';
import { useState, useEffect } from 'react';

import FaqFilter from './faq-filter';
import FaqTable from './faq-table';
import { Form } from 'antd';
import { FAQFilter, getFAQ } from './fetcher';
import { FAQ } from './interface';

export default function PaymentTab() {
  const [tableData, setTableData] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<FAQFilter>({
    keyword: '',
  });

  const [form] = Form.useForm();

  const fetchData = () => {
    setLoading(true);
    getFAQ(filter)
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
      <PageTitle title="Frequently Asked Questions" />
      <FaqFilter
        form={form}
        handleSearch={handleSearch}
        syncTableData={syncTableData}
      />
      <CustomCard style={{ marginTop: '24px' }}>
        <FaqTable dataSource={tableData} loading={loading} />
      </CustomCard>
    </>
  );
}
