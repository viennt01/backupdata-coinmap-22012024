import CustomCard from '@/components/commons/custom-card';
import PageTitle from '@/components/commons/page-title';
import { ERROR_CODE } from '@/constants/code-constants';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import { Row, Col, Space, Tooltip, Button } from 'antd';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Merchant,
  getMerchants,
} from '@/components/affiliate/merchants/fetcher';
import MerchantsTable from './merchant-table';

export default function MerchantTab() {
  const router = useRouter();
  const [tableData, setTableData] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getMerchants()
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
  }, []);

  // sync table data
  const syncTableData = () => {
    fetchData();
  };
  return (
    <>
      <PageTitle title="Merchant" />
      <Row>
        <Col span={24} lg={24} style={{ textAlign: 'right' }}>
          <Space>
            <Tooltip title="Sync data">
              <Button
                icon={<SyncOutlined />}
                size="large"
                onClick={syncTableData}
              />
            </Tooltip>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => router.push('/affiliate/merchants/create')}
            >
              Create
            </Button>
          </Space>
        </Col>
      </Row>
      <CustomCard style={{ marginTop: '24px' }}>
        <MerchantsTable dataSource={tableData} loading={loading} />
      </CustomCard>
    </>
  );
}
