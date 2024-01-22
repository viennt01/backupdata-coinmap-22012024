import React from 'react';
import dynamic from 'next/dynamic';
import style from './index.module.scss';
import { PieConfig } from '@ant-design/plots/es';
import COLORS from '@/constants/color';

const Pie = dynamic(() => import('@ant-design/plots').then(({ Pie }) => Pie), {
  ssr: false,
});

interface Props {
  title: string;
  data: PieConfig['data'];
}
export default function PieChart({ title, data }: Props) {
  const config: PieConfig = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    color: [COLORS.MEDIUM_AQUAMARINE, COLORS.CORNFLOWER_BLUE],
    label: {
      type: 'inner',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.type,
          value: `${(datum.value * 100).toFixed(0)}%`,
        };
      },
    },
    legend: false,
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };
  return (
    <div className={style.pieChart}>
      <div className={style.title}>{title}</div>
      <Pie {...config} />
    </div>
  );
}
