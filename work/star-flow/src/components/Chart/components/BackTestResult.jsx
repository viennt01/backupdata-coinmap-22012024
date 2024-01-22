import { SvgCloseDialog } from '@/assets/images/svg';
import Loading from '@/components/Loading';
import { shallowEqual, useSelector } from 'react-redux';

import style from './BackTestResult.module.scss';

const BackTestResult = ({ chartId, onHide }) => {
  const { info, result, infoTrade } = useSelector((state) => {
    const chartData = state.chartData.charts[chartId];

    return {
      info: chartData?.botSignals?.info,
      infoTrade: chartData?.botSignals?.infoTrade,
      result: chartData?.botSignals?.result,
    };
  }, shallowEqual);

  const loading = !info;

  return (
    <>
      {loading && (
        <div className={style.loadingContainer}>
          <Loading />
        </div>
      )}
      <div className={style.container}>
        <button className={style.btnClose} onClick={onHide}>
          <SvgCloseDialog />
        </button>

        <h1>Backtest result: {info?.NamBot}</h1>
        <h2>Thông tin chung</h2>
        <div className={style.tableContainer}>
          <table className="table table-striped table-light table-borderless">
            <tbody>
              <tr>
                <td>Version:</td>
                <td>{info?.Vesion}</td>
              </tr>
              <tr>
                <td>Symbol:</td>
                <td>{info?.Symbol}</td>
              </tr>
              <tr>
                <td>Period:</td>
                <td>{info?.Period}</td>
              </tr>
              <tr>
                <td>Bar in test:</td>
                <td>{info?.BarInTest}</td>
              </tr>
              <tr>
                <td>Initial Deposit:</td>
                <td>{info?.Initialbalance}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Kết quả</h2>
        <div className={style.tableContainer}>
          <table className="table table-striped table-light table-striped table-borderless">
            <tbody>
              <tr>
                <td>Total net profit</td>
                <td>{result?.TotalNetProfit}</td>
              </tr>
              <tr>
                <td>Gross profit</td>
                <td>{result?.GrossProfit}</td>
              </tr>
              <tr>
                <td>Gross loss</td>
                <td>{result?.GrossLoss}</td>
              </tr>
              <tr>
                <td>Profit factor</td>
                <td>{result?.ProfitFactor}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {!loading && (
          <>
            <h2>Thông tin giao dịch</h2>
            <div className={style.tableContainer}>
              <table className="table table-striped table-light table-striped table-borderless">
                <tbody>
                  <tr>
                    <td>Total trades:</td>
                    <td>{infoTrade?.TotalTrades}</td>
                  </tr>
                  <tr>
                    <td>Total fee:</td>
                    <td>{infoTrade?.TotalFee}</td>
                  </tr>
                  <tr>
                    <td>Avg fee:</td>
                    <td>{infoTrade?.AvgFee}</td>
                  </tr>
                  <tr>
                    <td>Apsolute Draw down:</td>
                    <td>{infoTrade?.ApsoluteDrawDown}</td>
                  </tr>
                  <tr>
                    <td>Maximum Drawdown:</td>
                    <td>{infoTrade?.MaximumDrawdown}</td>
                  </tr>
                  <tr>
                    <td>Relative Drawdow:</td>
                    <td>{infoTrade?.RelativeDrawdow}</td>
                  </tr>
                  <tr>
                    <td>Short position (won%):</td>
                    <td>{infoTrade?.ShortPosition}</td>
                  </tr>
                  <tr>
                    <td>Long Position (won%):</td>
                    <td>{infoTrade?.LongPosition}</td>
                  </tr>
                  <tr>
                    <td>Largest profit trade:</td>
                    <td>{infoTrade?.LargestProfitTrade}</td>
                  </tr>
                  <tr>
                    <td>Average profit trade:</td>
                    <td>{infoTrade?.AverageProfitTrade}</td>
                  </tr>
                  <tr>
                    <td>Largest loss trade:</td>
                    <td>{infoTrade?.LargestLostTrade}</td>
                  </tr>
                  <tr>
                    <td>Average loss trade:</td>
                    <td>{infoTrade?.AverageLostTrade}</td>
                  </tr>
                  <tr>
                    <td>Maximal consecutive profit (count of wins):</td>
                    <td>{infoTrade?.MaximumConsecutiveWins}</td>
                  </tr>
                  <tr>
                    <td>Maximal consecutive loss (count of losses):</td>
                    <td>{infoTrade?.MaximalConsecutiveLost}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BackTestResult;
