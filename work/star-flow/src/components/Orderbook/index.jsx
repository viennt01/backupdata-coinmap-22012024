import Image from 'next/image';
import Draggable from 'react-draggable';
import dynamic from 'next/dynamic';

import style from './style.module.scss';
import orderbook from '@/assets/images/icons/orderbook.png';
import orderbookdown from '@/assets/images/icons/Sort_down_light.png';
import orderbookup from '@/assets/images/icons/Sort_up_light.png';

import Loading from '../Loading';

const Orderbook = dynamic(() => import('./Orderbook'), {
  loading: Loading,
  ssr: false,
});

const OrderBookWrapper = () => {
  return (
    <Draggable handle="#handle-orderbook">
      <div className="order-book mb15">
        <div className="heading">
          <div className="row">
            <div className="col-5">
              <h2
                id="handle-orderbook"
                style={{
                  fontSize: '14px',
                  paddingTop: '10px',
                  paddingLeft: '10px',
                  paddingRight: '10px',
                }}
              >
                ORDER BOOK
              </h2>
            </div>

            <div className="col-7" style={{ paddingRight: '0px' }}>
              <div className="d-flex align-items-center">
                <a type="button" className="btn-typesTitleCreator">
                  <Image
                    src={orderbook}
                    className={style.icon}
                    width={25}
                    height={25}
                    alt=""
                  />
                </a>
                <a type="button" className="btn-typesTitleCreator">
                  <Image
                    src={orderbookup}
                    className={style.icon}
                    width={25}
                    alt=""
                    height={25}
                  />
                </a>
                <a type="button" className="btn-typesTitleCreator">
                  <Image
                    src={orderbookdown}
                    className={style.icon}
                    alt=""
                    width={25}
                    height={25}
                  />
                </a>

                <select className="fselect">
                  <option value="0.01">0.01</option>
                  <option value="0.1">0.1</option>
                  <option value="1">1</option>
                  <option value="10">10</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <Orderbook />
      </div>
    </Draggable>
  );
};

export default OrderBookWrapper;
