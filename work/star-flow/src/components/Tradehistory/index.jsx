import dynamic from 'next/dynamic';
import { useState } from 'react';
import Draggable from 'react-draggable';
import Loading from '../Loading';

const TradeHistory = dynamic(() => import('./TradeHistory'), {
  loading: Loading,
  ssr: false,
});

const TradeHistoryWrapper = () => {
  const [minValue, setMinValue] = useState('0');
  const handleChange = (e) => {
    setMinValue(e.target.value);
  };

  return (
    <Draggable handle="#handle-make-history">
      <div className="market-history">
        <div className="heading">
          <div className="row">
            <div className="col-6">
              <h2
                id="handle-make-history"
                style={{
                  fontSize: '14px',
                  paddingTop: '10px',
                  paddingLeft: '10px',
                }}
              >
                TRADER
              </h2>
            </div>
            <div className="col-6 ">
              <select
                className="fselect"
                name=""
                value={minValue}
                onChange={handleChange}
                style={{ float: 'right', marginTop: '6px' }}
              >
                <option value="0">&gt;0 USDT</option>
                <option value="10">&gt;10 USDT</option>
                <option value="100">&gt;100 USDT</option>
                <option value="1000">&gt;1K USDT</option>
                <option value="10000">&gt;10K USDT</option>
              </select>
            </div>
          </div>
        </div>
        <TradeHistory minValue={minValue} />
      </div>
    </Draggable>
  );
};

export default TradeHistoryWrapper;
