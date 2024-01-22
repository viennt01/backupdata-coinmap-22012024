import { BUY_SELL } from '@/config/consts/data';
import { fixLikeTickValue } from '@/utils/calculator';
import { format } from 'd3-format';
import { memo } from 'react';

import styles from './OrderBook.module.scss';

const numberD3Format = format(',.2s');
const numberFormat = (n) => {
  if (!n || n < 0 || isNaN(n)) {
    return '';
  }

  return numberD3Format(n);
};

const Header = memo(() => (
  <div className={`${styles.item} ${styles.header}`}>
    <div className={styles.vol}>Price - Vol</div>
    <div className={styles.cob}>COB AG</div>
    <div className={styles.imbalance}>Imbalance</div>
  </div>
));

Header.displayName = 'Header';

const Item = memo(
  ({
    isCurrent,
    tickFormat,
    item,
    top,
    tickHeight,
    maxVol,
    askColor,
    bidColor,
    maxTotalVol,
    ...props
  }) => {
    const volColor = item[0] === BUY_SELL.SELL ? askColor : bidColor;
    const volPercent = Math.floor((item[2] / maxVol) * 100);
    const agVolPercent = Math.floor((item.cobAg / maxTotalVol) * 100);

    return (
      <div
        {...props}
        className={`${styles.item} ${isCurrent ? styles.current : ''}`}
        style={{ top, height: tickHeight }}
      >
        <div
          className={styles.vol}
          style={{
            backgroundImage: `linear-gradient(to right, ${volColor}, ${volColor} ${volPercent}%, transparent ${volPercent}%)`,
          }}
        >
          {tickFormat(item[1])} - {numberFormat(item[2])}
        </div>
        <div
          className={styles.cob}
          style={{
            backgroundImage: `linear-gradient(to right, ${volColor}, ${volColor} ${agVolPercent}%, transparent ${agVolPercent}%)`,
          }}
        >
          {numberFormat(item.cobAg)}
        </div>
        <div
          className={styles.imbalance}
          style={{
            backgroundImage: `linear-gradient(to right, ${volColor}, ${volColor} ${item.imbalance}%, transparent ${item.imbalance}%)`,
          }}
        >
          {numberFormat(item.imbalance)}
        </div>
      </div>
    );
  }
);

/**
 * Calc and add cob ag into order item
 * @param {{[price: String]: [orderType, price, vol]}} orderBookDataMap order map
 * @returns Max total vol
 */
const addCobAg = (
  orderBookDataMap,
  {
    currentPrice,
    minPriceToCalc,
    tickValue,
    maxPriceToCalc,
    minPriceSell: initMinPriceSell,
  }
) => {
  // Calculate COB-AG
  let sumVol = 0;
  let minPriceSell = initMinPriceSell;
  for (
    let i = currentPrice;
    i < maxPriceToCalc;
    i = fixLikeTickValue(i + tickValue, tickValue)
  ) {
    if (!orderBookDataMap[i]) {
      orderBookDataMap[i] = [BUY_SELL.SELL, i, 0];
    }
    const item = orderBookDataMap[i];
    if (item[0] !== BUY_SELL.SELL) {
      continue;
    }
    if (minPriceSell > item[1]) {
      minPriceSell = item[1];
    }
    sumVol += item[2];
    item.cobAg = item[2] > 0 ? sumVol : 0;
  }
  let maxTotalVol = sumVol;

  sumVol = 0;
  for (
    let i = currentPrice;
    i > minPriceToCalc;
    i = fixLikeTickValue(i - tickValue, tickValue)
  ) {
    if (!orderBookDataMap[i]) {
      orderBookDataMap[i] = [BUY_SELL.BUY, i, 0];
    }
    const item = orderBookDataMap[i];
    if (item[0] !== BUY_SELL.BUY) {
      continue;
    }
    sumVol += item[2];
    item.cobAg = item[2] > 0 ? sumVol : 0;
  }
  if (sumVol > maxTotalVol) {
    maxTotalVol = sumVol;
  }

  return { maxTotalVol, minPriceSell };
};

/**
 * Calc imbalance and add into order item
 * @param {{[price: String]: Object}} orderBookDataMap order map
 */
const calcImbalace = (
  orderBookDataMap,
  { maxSideCount, minPriceSell, tickValue }
) => {
  // Calcuculate imbalance
  for (let i = 0; i < maxSideCount; i++) {
    const buyPrice = fixLikeTickValue(
      minPriceSell - tickValue - i * tickValue,
      tickValue
    );
    const sellPrice = fixLikeTickValue(minPriceSell + i * tickValue, tickValue);
    const sellItem = orderBookDataMap[sellPrice];
    const buyItem = orderBookDataMap[buyPrice];

    if (!buyItem || buyItem.cobAg === 0 || !sellItem || sellItem.cobAg === 0) {
      continue;
    }

    sellItem.imbalance =
      (sellItem.cobAg / (sellItem.cobAg + buyItem.cobAg)) * 100 || 0;
    buyItem.imbalance =
      (buyItem.cobAg / (sellItem.cobAg + buyItem.cobAg)) * 100 || 0;
  }
};

const Orderbook = memo(
  ({
    left,
    height,
    orderbook,
    yScale,
    currentPrice: propCurrentPrice,
    tickFormat,
    bidColor,
    askColor,
  }) => {
    if (!yScale) {
      return null;
    }
    const domain = yScale.domain();
    const tickValue = orderbook?.tv || 5;
    const tickHeight = Math.abs(yScale(0) - yScale(tickValue));
    let currentPrice = fixLikeTickValue(
      propCurrentPrice - (propCurrentPrice % tickValue),
      tickValue
    );
    const minPriceToShow = fixLikeTickValue(
      Math.min(...domain) - 2 * tickValue,
      tickValue
    );
    let maxPriceToShow = fixLikeTickValue(Math.max(...domain), tickValue);
    const maxSideCount =
      Math.floor(
        Math.max(maxPriceToShow - currentPrice, currentPrice - minPriceToShow) /
          tickValue
      ) + 1;
    const minPriceToCalc = currentPrice - tickValue * maxSideCount;
    const maxPriceToCalc = currentPrice + tickValue * maxSideCount;
    let minPriceSell = maxPriceToCalc + tickValue;

    let maxVol = 0;
    const orderBookDataMap = {};

    // to order map
    orderbook.priceArr.forEach((price, index) => {
      if (price < minPriceToCalc || price > maxPriceToCalc) {
        return;
      }

      const vol = orderbook.volArr[index];
      const orderType =
        price >= orderbook.minSellPrice ? BUY_SELL.SELL : BUY_SELL.BUY;

      if (maxVol < vol && price >= minPriceToShow && price <= maxPriceToShow) {
        maxVol = vol;
      }
      const key = fixLikeTickValue(price, tickValue);
      const item = new Float32Array([orderType, price, vol]);
      orderBookDataMap[key] = item;
    });

    const { maxTotalVol, minPriceSell: newMinPriceSell } = addCobAg(
      orderBookDataMap,
      { currentPrice, minPriceToCalc, tickValue, minPriceSell, maxPriceToCalc }
    );
    minPriceSell = newMinPriceSell;

    // Calcuculate imbalance
    calcImbalace(orderBookDataMap, { minPriceSell, maxSideCount, tickValue });

    return (
      <div
        className={styles.wrapper}
        style={{
          left,
          height,
          fontSize: `${Math.min(tickHeight, 18) - 4}px`,
          lineHeight: `${tickHeight}px`,
          width: 200,
        }}
      >
        <Header />
        {Object.values(orderBookDataMap).map((item) => {
          const isCurrent =
            item[1] <= currentPrice && item[1] + tickValue > currentPrice;
          return (
            <Item
              key={`${item[1]}_${item[0]}`}
              isCurrent={isCurrent}
              maxVol={maxVol}
              item={item}
              top={yScale(item[1]) + 1 - tickHeight}
              tickHeight={tickHeight}
              tickFormat={tickFormat}
              bidColor={bidColor}
              askColor={askColor}
              maxTotalVol={maxTotalVol}
            />
          );
        })}
      </div>
    );
  }
);

Item.displayName = 'Item';
Orderbook.displayName = 'Orderbook';

export default Orderbook;
