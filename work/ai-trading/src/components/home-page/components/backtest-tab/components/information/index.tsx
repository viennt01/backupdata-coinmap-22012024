import { BACK_TEST } from '@/components/home-page/interface';
import {
  formatCurrency,
  formatNumberNormal,
  formatNumberPercent,
} from '@/utils/format-number';
import style from './index.module.scss';
import { useMemo } from 'react';
import useI18n from '@/i18n/useI18N';

type Information = BACK_TEST['banner']['information'];

interface ItemProps {
  title: string;
  access: keyof Information;
  color: boolean;
  formater: (value: number) => number | string;
  information: Information;
}

const Item = ({ title, color, formater, information, access }: ItemProps) => {
  return (
    <div className={style.itemContainer}>
      <div className={style.leftContent}>{title}</div>
      <div
        className={[
          style.rightContent,
          color &&
            (information[access] > 0
              ? style.up
              : information[access] < 0
              ? style.down
              : ''),
        ].join(' ')}
      >
        {formater(information[access])}
      </div>
    </div>
  );
};

interface Props {
  information: Information;
}
export default function Information({ information }: Props) {
  const { translate: translateBacktest } = useI18n('backtest');
  const DEFAULT_DATA: Omit<ItemProps, 'information'>[] = useMemo(
    () => [
      {
        title: translateBacktest('initial_balance'),
        access: 'initial_balance',
        color: false,
        formater: formatCurrency,
      },
      {
        title: translateBacktest('#_of_trades'),
        access: 'of_trades',
        color: false,
        formater: formatNumberNormal,
      },
      {
        title: translateBacktest('drawdown'),
        access: 'drawdown',
        color: false,
        formater: formatCurrency,
      },
      {
        title: translateBacktest('sharpe_ratio'),
        access: 'sharpe_ratio',
        color: false,
        formater: formatNumberNormal,
      },
      {
        title: translateBacktest('percent_drawdown'),
        access: 'percent_drawdown',
        color: false,
        formater: formatNumberPercent,
      },
      {
        title: translateBacktest('profit_fator'),
        access: 'profit_fator',
        color: false,
        formater: formatNumberNormal,
      },
      {
        title: translateBacktest('daily_avg_profit'),
        access: 'daily_avg_profit',
        color: false,
        formater: formatCurrency,
      },
      {
        title: translateBacktest('return_do_ratio'),
        access: 'return_do_ratio',
        color: false,
        formater: formatNumberNormal,
      },
      {
        title: translateBacktest('monthly_avg_profit'),
        access: 'monthly_avg_profit',
        color: false,
        formater: formatCurrency,
      },
      {
        title: translateBacktest('winning_percent'),
        access: 'winning_percent',
        color: false,
        formater: formatNumberPercent,
      },
      {
        title: translateBacktest('average_trade'),
        access: 'average_trade',
        color: false,
        formater: formatCurrency,
      },
    ],
    [translateBacktest]
  );
  return (
    <>
      {DEFAULT_DATA.map((item) => (
        <Item
          information={information}
          key={item.title}
          title={item.title}
          color={item.color}
          access={item.access}
          formater={item.formater}
        />
      ))}
    </>
  );
}
