import COLORS from '@/constants/color';
import dynamic from 'next/dynamic';
import { LineConfig } from '@ant-design/plots/es';

const Line = dynamic(
  () => import('@ant-design/plots').then(({ Line }) => Line),
  { ssr: false }
);

interface Props {
  data: LineConfig['data'];
}

export default function LineChart({ data }: Props) {
  const config: LineConfig = {
    data,
    padding: 'auto',
    xField: 'label',
    yField: 'value',
    annotations: [
      {
        type: 'line',
        start: ['min', '0'],
        end: ['max', '0'],
        style: {
          lineWidth: 1,
          stroke: COLORS.SUNSET_ORANGE,
        },
      },
    ],
    xAxis: {
      label: {
        style: {
          fill: COLORS.WHITE,
        },
      },
    },

    yAxis: {
      label: {
        style: {
          fill: COLORS.WHITE,
        },
      },
    },
  };
  return <Line {...config} />;
}
