import { BACK_TEST } from '@/components/marketplace-page/interface';
import { formatCurrency, formatNumberNormal } from '@/utils/format-number';
import style from './index.module.scss';

type Transaction = BACK_TEST['transaction'];

interface ItemProps {
  title: string;
  access: keyof Transaction;
  color: boolean;
  colorClass?: string;
  formater: (value: number) => number | string;
  transaction: Transaction;
}

const Item = ({
  title,
  color,
  colorClass,
  formater,
  access,
  transaction,
}: ItemProps) => {
  return (
    <div className={style.itemContainer}>
      <div className={style.leftContent}>{title}</div>
      <div
        className={[
          style.rightContent,
          color &&
            (transaction[access] > 0
              ? colorClass ?? style.up
              : transaction[access] < 0
              ? colorClass ?? style.down
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

const DEFAULT_DATA: Omit<ItemProps, 'transaction'>[][] = [
  [
    {
      title: 'Gross Profit',
      access: 'gross_profit',
      color: true,
      formater: formatCurrency,
    },
    {
      title: 'Largest Win',
      access: 'largest_win',
      color: true,
      formater: formatCurrency,
    },
    {
      title: 'Avg Consec Wins',
      access: 'of_wins',
      color: true,
      formater: formatNumberNormal,
    },
    {
      title: 'Gross Loss',
      access: 'gross_loss',
      color: true,
      colorClass: style.down,
      formater: formatCurrency,
    },
  ],

  [
    {
      title: 'Largest Loss',
      access: 'largest_loss',
      color: true,
      colorClass: style.down,
      formater: formatCurrency,
    },
    {
      title: 'Number of Losses',
      access: 'of_losses',
      color: true,
      colorClass: style.down,
      formater: formatNumberNormal,
    },
    {
      title: 'Average Win',
      access: 'average_win',
      color: true,
      formater: formatCurrency,
    },
    {
      title: 'Max Consec Wins',
      access: 'max_consec_win',
      color: true,
      formater: formatNumberNormal,
    },
  ],

  [
    {
      title: 'Nums of Cancelled/Expired',
      access: 'of_cancelled_expired',
      color: false,
      formater: formatNumberNormal,
    },
    {
      title: 'Average Loss',
      access: 'average_loss',
      color: true,
      colorClass: style.down,
      formater: formatCurrency,
    },
    {
      title: 'Max Consec Losses',
      access: 'max_consec_loss',
      color: true,
      colorClass: style.down,
      formater: formatNumberNormal,
    },
  ],
];

interface Props {
  transaction: Transaction;
}

export default function Transaction({ transaction }: Props) {
  return (
    <div className={style.transactionContainer}>
      <div className={style.title}>Transaction</div>
      <div className={style.transactionContent}>
        {DEFAULT_DATA.map((box, index) => (
          <Box box={box} key={index} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
