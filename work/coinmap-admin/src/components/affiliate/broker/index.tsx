import CustomCard from '@/components/commons/custom-card';
import PageTitle from '@/components/commons/page-title';
import { ERROR_CODE } from '@/constants/code-constants';
import { useState, useEffect } from 'react';

import Filter from './filter';
import Table from './table';
import { getBrokerSettings } from './fetcher';
import { Broker } from '../merchants/interface';

export interface TableData extends Broker {
  id: string;
  created_at: string;
  updated_at: string;
}

export default function BrokerList() {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getBrokerSettings()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS && res.payload[0]) {
          const brokerSetting = JSON.parse(res.payload[0].value);
          const brokers: Broker[] = Object.values(brokerSetting);
          const { id, created_at, updated_at } = res.payload[0];
          setTableData(
            brokers.map((broker) => ({ ...broker, id, created_at, updated_at }))
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // sync table data
  const syncTableData = () => {
    fetchData();
  };

  return (
    <>
      <PageTitle title="Broker" />
      <Filter syncTableData={syncTableData} />
      <CustomCard style={{ marginTop: '24px' }}>
        <Table dataSource={tableData} loading={loading} />
      </CustomCard>
    </>
  );
}
