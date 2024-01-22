import {
  Row,
  Col,
  Card,
  Space,
  Statistic,
  Typography,
  Grid,
  Button,
  StatisticProps,
} from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
import { useContext, useEffect, useState } from 'react';
import { getTransactionReport } from '@/components/payment/fetcher';
import { ERROR_CODE } from '@/constant/error-code';
import RequestPayout from './components/request-payout';
import { PaymentContext } from '@/components/payment/payment';

const { Title } = Typography;
const { useBreakpoint } = Grid;

const ProfitSummary = () => {
  const { pageLoading } = useContext(PaymentContext);
  const [loading, setLoading] = useState(false);
  const [profit, setProfit] = useState({
    available: 0,
    allTime: 0,
    payoutComplete: 0,
    payoutPending: 0,
  });
  const screens = useBreakpoint();
  const isMobile = screens.xs;

  const fetchProfitReport = (loadingDelay = 0) => {
    setLoading(true);

    getTransactionReport()
      .then((allTimeProfitRes) => {
        if (allTimeProfitRes.error_code === ERROR_CODE.SUCCESS) {
          const { commission_cash, payout_pending, payout_complete } =
            allTimeProfitRes.payload;

          setProfit({
            available: commission_cash - (payout_complete + payout_pending),
            allTime: commission_cash,
            payoutComplete: payout_complete,
            payoutPending: payout_pending,
          });
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setTimeout(() => setLoading(false), loadingDelay));
  };

  useEffect(() => {
    fetchProfitReport();
  }, [pageLoading]);

  const renderCountUp: StatisticProps['formatter'] = (value) => {
    return (
      <>
        $
        <CountUp
          decimals={2}
          end={Number(value)}
          duration={1}
          separator=","
          redraw
          start={loading ? Number(value) : 0}
        />
      </>
    );
  };

  return (
    <Row gutter={[24, 24]}>
      <Col span={24} lg={12}>
        <Card
          bordered={false}
          title={
            <Space
              wrap
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <Title
                level={4}
                style={{
                  margin: 2,
                  maxWidth: isMobile ? '168px' : '300px',
                  whiteSpace: 'normal',
                }}
              >
                AVAILABLE TO WITHDRAW
              </Title>
              <Button
                type="text"
                shape="circle"
                disabled={loading}
                onClick={() => fetchProfitReport(1000)}
              >
                <SyncOutlined
                  style={{ display: 'block', fontSize: 18 }}
                  spin={loading}
                />
              </Button>
            </Space>
          }
          style={{ height: '100%' }}
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <div style={{ textAlign: 'center' }}>
                <Statistic
                  value={profit.available}
                  valueStyle={{ fontSize: isMobile ? 32 : 56, fontWeight: 600 }}
                  formatter={renderCountUp}
                />
              </div>
            </Col>
            <Col span={24}>
              <div style={{ textAlign: 'center' }}>
                <RequestPayout availableProfit={profit.available} />
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24} lg={12}>
        <Card
          bordered={false}
          title={
            <Space
              style={{ width: '100%', justifyContent: 'space-between' }}
              align="center"
            >
              <Space>
                <Title level={4} style={{ margin: 2 }}>
                  ALL TIME PROFIT
                </Title>
              </Space>
            </Space>
          }
        >
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <div style={{ textAlign: 'center' }}>
                <Statistic
                  value={profit.allTime}
                  valueStyle={{ fontSize: isMobile ? 32 : 56, fontWeight: 600 }}
                  formatter={renderCountUp}
                />
              </div>
            </Col>
            <Col span={24}>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <Statistic
                    title={
                      <div style={{ textAlign: 'center' }}>Payout Pending</div>
                    }
                    value={profit.payoutPending}
                    valueStyle={{ textAlign: 'center' }}
                    formatter={renderCountUp}
                  />
                </Col>
                <Col xs={24} md={12}>
                  <Statistic
                    title={<div style={{ textAlign: 'center' }}>Withdrawn</div>}
                    value={profit.payoutComplete}
                    valueStyle={{ textAlign: 'center' }}
                    formatter={renderCountUp}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfitSummary;
