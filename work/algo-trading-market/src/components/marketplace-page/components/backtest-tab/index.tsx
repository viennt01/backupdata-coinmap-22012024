import style from './index.module.scss';

import Banner from './components/banner';
import LineChart from './components/line-chart';
import Information from './components/information';
import Transaction from './components/transaction';
import PerformanceMonth from './components/performance-month';
import PieChart from './components/pie-chart';
import ColumnChart from './components/column-chart';
import { formatCurrency } from '@/utils/format-number';
import COLORS from '@/constants/color';
import { BACK_TEST, BOT } from '@/components/marketplace-page/interface';

interface Props {
  botSelected: BOT | null;
}

export default function BacktestTab({ botSelected }: Props) {
  const backTest =
    typeof botSelected?.back_test === 'object'
      ? (botSelected?.back_test as BACK_TEST)
      : (JSON.parse(botSelected?.back_test || '{}') as BACK_TEST);

  if (!backTest?.bot_name)
    return <div style={{ textAlign: 'center' }}>No data</div>;

  return (
    <div className={style.backtestContainer}>
      <div className={style.titleContainer}>
        <span className={style.title}>{backTest.bot_name}</span>
        <span className={style.datetime}>
          {backTest.from} - {backTest.to}
        </span>
      </div>
      <div className={style.bannerContainer}>
        <Banner bannerData={backTest.banner.boxs} />
        <div className={style.bannerContent}>
          <div className={style.lineChart}>
            <LineChart data={backTest.banner.chart} />
          </div>
          <div className={style.informationContainer}>
            <Information information={backTest.banner.information} />
          </div>
        </div>
      </div>
      <Transaction transaction={backTest.transaction} />
      <PerformanceMonth performance={backTest.performance} />
      <div className={style.pieChartContainer}>
        <div className={style.itemPieChartContainer}>
          <PieChart
            title="Long/Short Trades"
            data={backTest.pie_chart.long_short_ratio}
          />
        </div>
        <div className={style.itemPieChartContainer}>
          <PieChart
            title="Long Profit/Loss"
            data={backTest.pie_chart.pln_buy}
          />
        </div>
        <div className={style.itemPieChartContainer}>
          <PieChart
            title="Short Profit/Loss"
            data={backTest.pie_chart.pln_sell}
          />
        </div>
      </div>
      <div className={style.columnChartContainer}>
        <div className={style.itemColumnChartContainer}>
          <ColumnChart
            title="Trade by Weekday"
            label={{
              position: 'top',
              style: {
                fill: COLORS.WHITE,
              },
            }}
            data={backTest.column_chart.trades_of_weekly}
          />
        </div>
        <div className={style.itemColumnChartContainer}>
          <ColumnChart
            title="Win/Losses Profit by Month"
            tooltip={{
              formatter: (datum) => {
                return {
                  name: datum.name,
                  value: formatCurrency(datum.value),
                };
              },
            }}
            data={backTest.column_chart.monthly_pln}
          />
        </div>
      </div>
    </div>
  );
}
