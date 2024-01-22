import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import style from './index.module.scss';
import { ColumnConfig } from '@ant-design/plots/es';
import COLORS from '@/constants/color';
import { AppContext } from '@/app-context';

const Column = dynamic(
  () => import('@ant-design/plots').then(({ Column }) => Column),
  {
    ssr: false,
  }
);

interface Props {
  title: string;
  data: ColumnConfig['data'];
  tooltip?: ColumnConfig['tooltip'];
  label?: ColumnConfig['label'];
}

export default function ColumnChart({ title, data, tooltip, label }: Props) {
  const { appTheme } = useContext(AppContext);

  const config: ColumnConfig = {
    data,
    isGroup: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'name',
    padding: 'auto',
    color: [COLORS.MEDIUM_AQUAMARINE, COLORS.CORNFLOWER_BLUE],
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
  if (tooltip) {
    config.tooltip = tooltip;
  }
  if (label) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config.label = label;
  }
  return (
    <div className={style.columnChart}>
      <div className={style.title}>{title}</div>
      <Column {...config} />
    </div>
  );
}
