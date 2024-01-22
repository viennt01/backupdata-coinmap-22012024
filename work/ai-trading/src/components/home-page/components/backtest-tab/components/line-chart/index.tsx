import COLORS from '@/constants/color';
import dynamic from 'next/dynamic';
import { LineConfig } from '@ant-design/plots/es';
import { useContext } from 'react';
import { AppContext } from '@/app-context';

const Line = dynamic(
  () => import('@ant-design/plots').then(({ Line }) => Line),
  { ssr: false }
);

interface Props {
  data: LineConfig['data'];
}

export default function LineChart({ data }: Props) {
  const { appTheme } = useContext(AppContext);

  const config: LineConfig = {
    data,
    padding: 'auto',
    xField: 'label',
    yField: 'value',
    color: COLORS.ALGAE,
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
          fill: appTheme.colors.on_secondary_darken_1,
        },
      },
    },

    yAxis: {
      label: {
        style: {
          fill: appTheme.colors.on_secondary_darken_1,
        },
      },
    },
  };
  return <Line {...config} />;
}
