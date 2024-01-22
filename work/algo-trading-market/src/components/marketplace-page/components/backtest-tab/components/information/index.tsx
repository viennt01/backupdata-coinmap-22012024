import { BACK_TEST } from '@/components/marketplace-page/interface';
import {
  formatCurrency,
  formatNumberNormal,
  formatNumberPercent,
} from '@/utils/format-number';
import style from './index.module.scss';

type Information = BACK_TEST['banner']['information'];

interface ItemProps {
  title: string;
  access: keyof Information;
  color: boolean;
  colorClass?: string;
  formater: (value: number) => number | string;
  information: Information;
}

const Item = ({
  title,
  color,
  colorClass,
  formater,
  information,
  access,
}: ItemProps) => {
  return (
    <div className={style.itemContainer}>
      <div className={style.leftContent}>{title}</div>
      <div
        className={[
          style.rightContent,
          color &&
            (information[access] > 0
              ? colorClass ?? style.up
              : information[access] < 0
              ? colorClass ?? style.down
              : ''),
        ].join(' ')}
      >
        {formater(information[access])}
      </div>
    </div>
  );
};

const DEFAULT_DATA: Omit<ItemProps, 'information'>[] = [
  {
    title: 'Number of Trades',
    access: 'of_trades',
    color: false,
    formater: formatNumberNormal,
  },
  {
    title: 'Drawdown',
    access: 'drawdown',
    color: true,
    colorClass: style.down,
    formater: formatCurrency,
  },
  {
    title: 'Sharpe Ratio',
    access: 'sharpe_ratio',
    color: false,
    formater: formatNumberNormal,
  },
  {
    title: '% Drawdown',
    access: 'percent_drawdown',
    color: true,
    colorClass: style.down,
    formater: formatNumberPercent,
  },
  {
    title: 'Profit factor',
    access: 'profit_fator',
    color: false,
    formater: formatNumberNormal,
  },
  {
    title: 'Daily AVG profit',
    access: 'daily_avg_profit',
    color: true,
    formater: formatCurrency,
  },
  {
    title: 'Return/Drawdown Ratio',
    access: 'return_do_ratio',
    color: false,
    formater: formatNumberNormal,
  },
  {
    title: 'Monthly AVG Profit',
    access: 'monthly_avg_profit',
    color: true,
    formater: formatCurrency,
  },
  {
    title: 'Winning Percentage',
    access: 'winning_percent',
    color: false,
    formater: formatNumberPercent,
  },
  {
    title: 'Average Trade',
    access: 'average_trade',
    color: true,
    formater: formatCurrency,
  },
];
interface Props {
  information: Information;
}
export default function Information({ information }: Props) {
  return (
    <>
      {DEFAULT_DATA.map((item) => (
        <Item
          information={information}
          key={item.title}
          title={item.title}
          color={item.color}
          colorClass={item.colorClass}
          access={item.access}
          formater={item.formater}
        />
      ))}
    </>
  );
}
