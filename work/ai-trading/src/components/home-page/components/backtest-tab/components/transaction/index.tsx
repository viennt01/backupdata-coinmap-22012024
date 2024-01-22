import { BACK_TEST } from '@/components/home-page/interface';
import { formatCurrency, formatNumberNormal } from '@/utils/format-number';
import style from './index.module.scss';
import useI18n from '@/i18n/useI18N';
import { useMemo } from 'react';

type Transaction = BACK_TEST['transaction'];

interface ItemProps {
  title: string;
  access: keyof Transaction;
  color: boolean;
  formater: (value: number) => number | string;
  transaction: Transaction;
}

const Item = ({ title, color, formater, access, transaction }: ItemProps) => {
  return (
    <div className={style.itemContainer}>
      <div className={style.leftContent}>{title}</div>
      <div
        className={[
          style.rightContent,
          color &&
            (transaction[access] > 0
              ? style.up
              : transaction[access] < 0
              ? style.down
              : ''),
        ].join(' ')}
      >
        {formater(transaction[access])}
      </div>
    </div>
  );
};

interface BoxProps {
  box: Omit<ItemProps, 'transaction'>[];
  transaction: Transaction;
}

const Box = ({ box, transaction }: BoxProps) => {
  return (
    <div className={style.boxContainer}>
      {box.map((item, index) => (
        <Item key={index} {...item} transaction={transaction} />
      ))}
    </div>
  );
};

interface Props {
  transaction: Transaction;
}

export default function Transaction({ transaction }: Props) {
  const { translate: translateBacktest } = useI18n('backtest');

  const DEFAULT_DATA: Omit<ItemProps, 'transaction'>[][] = useMemo(
    () => [
      [
        {
          title: translateBacktest('gross_profit'),
          access: 'gross_profit',
          color: false,
          formater: formatCurrency,
        },
        {
          title: translateBacktest('largest_win'),
          access: 'largest_win',
          color: false,
          formater: formatCurrency,
        },
        {
          title: translateBacktest('of_wins'),
          access: 'of_wins',
          color: false,
          formater: formatNumberNormal,
        },
        {
          title: translateBacktest('gross_loss'),
          access: 'gross_loss',
          color: false,
          formater: formatCurrency,
        },
      ],

      [
        {
          title: translateBacktest('largest_loss'),
          access: 'largest_loss',
          color: false,
          formater: formatCurrency,
        },
        {
          title: translateBacktest('of_losses'),
          access: 'of_losses',
          color: false,
          formater: formatNumberNormal,
        },
        {
          title: translateBacktest('average_win'),
          access: 'average_win',
          color: false,
          formater: formatCurrency,
        },
        {
          title: translateBacktest('max_consec_win'),
          access: 'max_consec_win',
          color: false,
          formater: formatNumberNormal,
        },
      ],

      [
        {
          title: translateBacktest('of_cancelled_expired'),
          access: 'of_cancelled_expired',
          color: false,
          formater: formatNumberNormal,
        },
        {
          title: translateBacktest('average_loss'),
          access: 'average_loss',
          color: false,
          formater: formatCurrency,
        },
        {
          title: translateBacktest('max_consec_loss'),
          access: 'max_consec_loss',
          color: false,
          formater: formatNumberNormal,
        },
      ],
    ],
    [translateBacktest]
  );

  return (
    <div className={style.transactionContainer}>
      <div className={style.title}>{translateBacktest('transaction')}</div>
      <div className={style.transactionContent}>
        {DEFAULT_DATA.map((box, index) => (
          <Box box={box} key={index} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
