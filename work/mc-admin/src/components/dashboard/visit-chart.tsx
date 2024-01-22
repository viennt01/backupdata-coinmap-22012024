import { memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
const Line = dynamic(
  () => import('@ant-design/plots').then(({ Line }) => Line),
  { ssr: false }
);
import { UserChart } from './fetcher';
import { Card, Typography } from 'antd';

const { Title } = Typography;

interface VisitChartProps {
  data: UserChart[];
}

const VisitChart = ({ data }: VisitChartProps) => {
  const visitChart = useMemo(
    () => (
      <Line
        data={data}
        color="rgba(249, 74, 41)"
        padding="auto"
        xField="time"
        yField="visitor"
        tooltip={{
          formatter: (datum) => {
            return {
              name: 'Visits',
              value: `${datum.visitor ?? 0} total`,
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
          Visits - last 30 days
        </Title>
      }
      bordered={false}
    >
      {visitChart}
    </Card>
  );
};

export default memo(VisitChart);
