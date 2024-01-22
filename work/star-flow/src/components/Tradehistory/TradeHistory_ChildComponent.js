import cx from 'classnames';

const Tradehistory_ChildComponent = ({ aggTrade, minValue }) => {
  const aggTradeFilter =
    minValue === '0'
      ? aggTrade
      : aggTrade.filter((item) => item.amount * item.price >= minValue);
  const NewaggTrade = aggTrade.map((trade) => trade.amount);
  const calcMaxAggTrade = Math.max(...NewaggTrade);

  return (
    <table className="table my-custom-scrollbar table-wrapper-scroll-y">
      <thead>
        <tr>
          <th>Time</th>
          <th>Price(USDT)</th>
          <th>&nbsp;&nbsp;&nbsp;&nbsp;Amount</th>
        </tr>
      </thead>

      <tbody>
        {aggTradeFilter.map((trade) => {
          return (
            <tr
              key={trade.key}
              className={cx({
                [`green-bg-${
                  Math.round((trade.amount * 20) / calcMaxAggTrade) * 5
                }`]: trade.Isthebuyer === true,
                [`red-bg-${
                  Math.round((trade.amount * 20) / calcMaxAggTrade) * 5
                }`]: trade.Isthebuyer === false,
              })}
            >
              {/* `red-bg-${Math.round(trade.amount * 20 / calcMaxAggTrade) * 5}` */}
              <td
                className={cx({
                  green: trade.Isthebuyer === true,
                  red: trade.Isthebuyer === false,
                })}
              >
                {trade.time}
              </td>
              <td>{trade.price}</td>
              <td>{trade.amount}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Tradehistory_ChildComponent;
