import { memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
const Line = dynamic(
  () => import('@ant-design/plots').then(({ Line }) => Line),
  { ssr: false }
);
import { TransactionChart } from './fetcher';
import { Card, Typography } from 'antd';

const { Title } = Typography;

interface PurchaseChartProps {
  data: TransactionChart[];
}

const PurchaseChart = ({ data }: PurchaseChartProps) => {
  const purchaseChart = useMemo(
    () => (
      <Line
        data={data}
        color="rgba(58, 192, 201)"
        padding="auto"
        xField="time"
        yField="count_complete"
        tooltip={{
          formatter: (datum) => {
            return {
              name: 'Purchases',
              value: `${datum.count_complete} ${
                datum.count_complete > 1 ? 'orders' : 'order'
              }`,
            };
          },
        }}
      />
    ),
    [data]
  );

  return (
    <Card
      title={
        <Title level={5} style={{ margin: 0 }}>
          Purchases - Last 30 days
        </Title>
      }
      bordered={false}
    >
      {purchaseChart}
    </Card>
  );
};

export default memo(PurchaseChart);
