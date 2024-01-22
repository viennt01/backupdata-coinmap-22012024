/* eslint-disable no-unused-vars */
import { Breadcrumb, Row, Col } from 'antd';
import ProfitSummary from '@/components/payment/components/profit-summary';
import WalletAddress from '@/components/payment/components/wallet-address';
import WithdrawalTable from '@/components/payment/components/withdraws-table';
import { createContext, useEffect, useState } from 'react';

interface PaymentContext {
  pageLoading: boolean;
  togglePageLoading?: () => void;
}

const INITIAL_VALUE_CONTEXT = {
  pageLoading: false,
};

export const PaymentContext = createContext<PaymentContext>(
  INITIAL_VALUE_CONTEXT
);

export default function PaymentPage() {
  const [valueContext, setValueContext] = useState(INITIAL_VALUE_CONTEXT);

  const togglePageLoading = () => {
    setValueContext((prev) => ({ ...prev, pageLoading: !prev.pageLoading }));
  };

  useEffect(() => {
    setValueContext((prev) => ({
      ...prev,
      togglePageLoading,
    }));
  }, []);

  return (
    <PaymentContext.Provider value={valueContext}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Payment</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ marginBottom: 24 }}>
        <ProfitSummary />
      </div>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <WalletAddress />
        </Col>
        <Col span={24}>
          <WithdrawalTable />
        </Col>
      </Row>
    </PaymentContext.Provider>
  );
}
