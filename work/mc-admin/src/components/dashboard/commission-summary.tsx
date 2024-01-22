import { memo } from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import CountUp from 'react-countup';

const { Title } = Typography;

interface CommissionSummaryProps {
  visits: number;
  transactions: number;
  commission_cash: number;
}

const CommissionSummary = ({
  visits,
  transactions,
  commission_cash,
}: CommissionSummaryProps) => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24} md={12} lg={6}>
        <Card
          bordered={false}
          style={{ textAlign: 'center', background: 'rgba(58, 192, 201, 0.3)' }}
        >
          <Title level={5}>PURCHASES</Title>
          <Statistic
            value={transactions}
            valueStyle={{ fontWeight: 'bold', fontSize: '32px' }}
            formatter={(value) => (
              <>
                <CountUp end={Number(value)} duration={0.5} separator="," />
                <span style={{ marginLeft: 8 }}>orders</span>
              </>
            )}
          />
        </Card>
      </Col>
      <Col span={24} md={12} lg={6}>
        <Card
          bordered={false}
          style={{ textAlign: 'center', background: 'rgba(116, 194, 4, 0.3)' }}
        >
          <Title level={5}>PROFIT</Title>
          <Statistic
            value={commission_cash}
            valueStyle={{ fontWeight: 'bold', fontSize: '32px' }}
            formatter={(value) => (
              <>
                $
                <CountUp
                  decimals={2}
                  end={Number(value)}
                  duration={0.5}
                  separator=","
                />
              </>
            )}
          />
        </Card>
      </Col>
      <Col span={24} md={12} lg={6}>
        <Card
          bordered={false}
          style={{
            textAlign: 'center',
            background: 'rgba(249, 74, 41, 0.3)',
          }}
        >
          <Title level={5}>VISITS</Title>
          <Statistic
            value={visits}
            valueStyle={{
              fontWeight: 'bold',
              fontSize: '32px',
            }}
            formatter={(value) => (
              <>
                <CountUp end={Number(value)} duration={0.5} separator="," />
                <span style={{ marginLeft: 8 }}>total</span>
              </>
            )}
          />
        </Card>
      </Col>
      <Col span={24} md={12} lg={6}>
        <Card
          bordered={false}
          style={{
            textAlign: 'center',
            background: 'rgba(244, 157, 26, 0.3)',
          }}
        >
          <Title level={5}>CONVERSION RATE</Title>
          <Statistic
            value={!!visits ? (100 * transactions) / visits : 0}
            valueStyle={{
              fontWeight: 'bold',
              fontSize: '32px',
            }}
            formatter={(value) => (
              <>
                <CountUp
                  decimals={2}
                  end={Number(value)}
                  duration={0.5}
                  separator=","
                />
                %
              </>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default memo(CommissionSummary);
