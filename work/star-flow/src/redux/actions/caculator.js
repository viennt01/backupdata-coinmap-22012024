import FOOTPRINT_SETTINGS from '@/config/consts/settings/footprint';

const DEFALT_IMBALANCE_SETTINGS = {
  ratio: FOOTPRINT_SETTINGS.imbalance.ratio,
  filterVolume: FOOTPRINT_SETTINGS.imbalance.filterVolume,
  zoneCount: FOOTPRINT_SETTINGS.imbalance.zoneCount,
};

export const checkStackImbalance = (priceArray, settings) => {
  const imbalance = {
    sell: [],
    buy: [],
    hasImbalanceBuy: false,
    hasImbalanceSell: false,
    noBuy: 0,
    noSell: 0,
  };
  if (!Array.isArray(priceArray) || priceArray.length === 0) {
    return imbalance;
  }
  const imbalanceSettings = settings?.imbalance || DEFALT_IMBALANCE_SETTINGS;

  let stackImbalanceBuyArr = [];
  let stackImbalanceBuyIds = [];
  let stackImbalanceSellArr = [];
  let stackImbalanceSellIds = [];
  let imbalanceBuyCounter = 0;
  let imbalanceSellCounter = 0;

  const reverseRatio = 1 / Number(imbalanceSettings.ratio);

  for (let i = 1; i < priceArray.length; i++) {
    const current = priceArray[i];
    const previous = priceArray[i - 1];

    const ratio = current.sell / previous.buy;
    // sell
    // check sell imbalance
    if (
      ratio >= Number(imbalanceSettings.ratio) &&
      current.sell >= Number(imbalanceSettings.filterVolume)
    ) {
      stackImbalanceSellArr.push(current.p);
      stackImbalanceSellIds.push(i);

      imbalanceSellCounter++;
      current.imbalanceSell = true;
      imbalance.hasImbalanceSell = true;
    } else {
      if (stackImbalanceSellArr.length >= Number(imbalanceSettings.zoneCount)) {
        imbalance.sell.push(stackImbalanceSellArr);
      }
      current.imbalanceSell = false;
      stackImbalanceSellArr = [];
      stackImbalanceSellIds = [];
    }

    // buy
    if (
      ratio <= reverseRatio &&
      previous.buy >= Number(imbalanceSettings.filterVolume)
    ) {
      stackImbalanceBuyArr.push(previous.p);
      stackImbalanceBuyIds.push(i - 1);
      imbalanceBuyCounter++;
      previous.imbalanceBuy = true;
      imbalance.hasImbalanceBuy = true;
    } else {
      if (stackImbalanceBuyArr.length >= Number(imbalanceSettings.zoneCount)) {
        imbalance.buy.push(stackImbalanceBuyArr);
      }
      previous.imbalanceBuy = false;
      stackImbalanceBuyArr = [];
      stackImbalanceBuyIds = [];
    }
  }
  if (stackImbalanceSellArr.length >= Number(imbalanceSettings.zoneCount)) {
    imbalance.sell.push(stackImbalanceSellArr);
    stackImbalanceSellIds.forEach((id) => {
      priceArray[id].imbalanceSell = true;
    });
  }
  if (stackImbalanceBuyArr.length >= Number(imbalanceSettings.zoneCount)) {
    imbalance.buy.push(stackImbalanceBuyArr);
    stackImbalanceBuyIds.forEach((id) => {
      priceArray[id].imbalanceBuy = true;
    });
  }

  imbalance.noBuy = imbalanceBuyCounter;
  imbalance.noSell = imbalanceSellCounter;

  return imbalance;
};

const DEFAULT_NUMBER_CHECK_EXHAUSTION =
  FOOTPRINT_SETTINGS.exhaustionAirow.value;

export const checkFlowDirect = ({ orderFlow = [] }, settings) => {
  const result = {
    up: false,
    down: false,
  };
  const numToCheck =
    settings?.exhaustionAirow.value ?? DEFAULT_NUMBER_CHECK_EXHAUSTION;

  if (orderFlow && orderFlow?.length < numToCheck) return result;

  const isSellVolDecrease = true;
  let previousSell = null;
  for (let i = orderFlow.length - numToCheck; i < orderFlow.length; i++) {
    const trade = orderFlow[i];
    if (previousSell !== null && previousSell < trade.sell) {
      isSellVolDecrease = false;
      break;
    }
    previousSell = trade.sell;
  }
  result.up = isSellVolDecrease;

  const isBuyVolDecrease = true;
  let previousBuy = null;
  for (let i = 0; i < numToCheck; i++) {
    const trade = orderFlow[i];
    if (previousBuy !== null && previousBuy > trade.buy) {
      isBuyVolDecrease = false;
      break;
    }
    previousBuy = trade.buy;
  }
  result.down = isBuyVolDecrease;

  return result;
};
