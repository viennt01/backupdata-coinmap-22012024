import style from './index.module.scss';

import Banner from './components/banner';
import LineChart from './components/line-chart';
import Information from './components/information';
import Transaction from './components/transaction';
import PerformanceMonth from './components/performance-month';
import PieChart from './components/pie-chart';
import ColumnChart from './components/column-chart';
import { formatCurrency } from '@/utils/format-number';
import { BACK_TEST, BOT } from '@/components/home-page/interface';
import { Empty } from 'antd';
import useI18n from '@/i18n/useI18N';
import { useContext } from 'react';
import { AppContext } from '@/app-context';

interface Props {
  botSelected: BOT | null;
}

export default function BacktestTab({ botSelected }: Props) {
  const { translate: translateBacktest } = useI18n('backtest');
  const { appTheme } = useContext(AppContext);

  const backTest =
    typeof botSelected?.back_test === 'object'
      ? (botSelected?.back_test as BACK_TEST)
      : (JSON.parse(botSelected?.back_test || '{}') as BACK_TEST);

  if (!backTest?.bot_name)
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

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
            title={translateBacktest('percent_long_short')}
            data={backTest.pie_chart.long_short_ratio}
          />
        </div>
        <div className={style.itemPieChartContainer}>
          <PieChart
            title={translateBacktest('pnl_buy')}
            data={backTest.pie_chart.pln_buy}
          />
        </div>
        <div className={style.itemPieChartContainer}>
          <PieChart
            title={translateBacktest('pnl_sell')}
            data={backTest.pie_chart.pln_sell}
          />
        </div>
      </div>
      <div className={style.columnChartContainer}>
        <div className={style.itemColumnChartContainer}>
          <ColumnChart
            title={translateBacktest('trades_of_weekly')}
            label={{
              position: 'top',
              style: {
                fill: appTheme.colors.on_secondary_darken_1,
              },
            }}
            data={backTest.column_chart.trades_of_weekly}
          />
        </div>
        <div className={style.itemColumnChartContainer}>
          <ColumnChart
            title={translateBacktest('pnl_by_month')}
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
