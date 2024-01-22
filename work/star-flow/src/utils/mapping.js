import { calcCandleWithOrderFlow } from './calculator';

export const toMapWithKey = (dataArr = [], keyStr = '', valueKey = '') => {
  const mapRes = {};
  const getValue = !!valueKey;
  dataArr.forEach((item) => {
    const key = item[keyStr];
    const value = getValue ? item[valueKey] : item;
    mapRes[key] = value;
  });

  return mapRes;
};

export const mapOrderFlowWithCandle = (orderFlow = [], candles = []) => {
  const orderFlowMap = toMapWithKey(orderFlow, 'openTime', 'orderFlow');
  return candles.map((candle) => {
    if (!orderFlowMap[candle.opentime]) {
      return candle;
    }
    candle.orderFlow = orderFlowMap[candle.opentime];

    return calcCandleWithOrderFlow(candle);
  });
};

export const mapAccumulatedDeltaWithCandle = (
  accumulatedDelta = [],
  candles = []
) => {
  const dataMap = toMapWithKey(accumulatedDelta, 't', 'cvd');
  return candles.map((candle) => {
    if (!dataMap[candle.opentime]) {
      return candle;
    }
    candle.cvd = dataMap[candle.opentime];

    return candle;
  });
};

export const removeDiscontinuousCandles = (candles = []) => {
  if (!Array.isArray(candles) || candles.length < 2) {
    return candles;
  }

  const result = [];
  let minTime = candles[candles.length - 1].opentime + 1;
  for (let i = candles.length - 1; i > -1; i--) {
    const candle = candles[i];
    if (minTime > candle.opentime) {
      result.push(candle);
      minTime = candle.opentime;
    }
  }

  return result.reverse();
};

export const sortLayers = (layers) => {
  if (!Array.isArray(layers) || layers.length === 0) {
    return [];
  }

  // Correct position
  const noPositionItems = [];
  let maxPosition = 0;
  for (let i = 0; i < layers.length; i++) {
    const item = layers[i];
    if (typeof item.position !== 'number') {
      noPositionItems.push(item);
    } else if (maxPosition < item.position) {
      maxPosition = item.position;
    }
  }
  for (let i = 0; i < noPositionItems.length; i++) {
    const item = noPositionItems[i];
    item.position = ++maxPosition;
  }

  // Sort
  const sortedLayers = layers.sort(
    (first, second) => first.position - second.position
  );

  // Reposition
  for (let i = 0; i < sortedLayers.length; i++) {
    const item = sortedLayers[i];
    item.position = i;
  }

  return sortedLayers;
};

export const toIndexMap = (data) => {
  const result = {};
  data.forEach((item, index) => {
    result[item.opentime] = index;
  });

  return result;
};

/**
 * Go deeper to get value from object with "."
 * @param {String} fieldName Path to field value. Ex: line1.color
 * @param {Object} objectValue Values
 * @returns value of field path
 */
export const getValueFromObject = (fieldName, objectValue) => {
  if (!fieldName || !objectValue) {
    return null;
  }

  let value = objectValue[fieldName];
  if (fieldName.includes('.')) {
    const listFieldName = fieldName.split('.');
    let tmpValue = objectValue;
    for (let i = 0; i < listFieldName.length; i++) {
      const fieldName = listFieldName[i];
      tmpValue = tmpValue?.[fieldName];
    }
    value = tmpValue;
  }

  return value;
};

/**
 * Set value to object with path to field value
 * @param {String} fieldName Path to field value. Ex: line1.color
 * @param {*} value new value to set
 * @param {Object} values Object to set field value
 * @returns {Object} New object
 */
export const setChangeValue = (fieldName, value, values) => {
  if (!fieldName.includes('.')) {
    return {
      ...values,
      [fieldName]: value,
    };
  }

  const fields = fieldName.split('.');
  const result = { ...values };
  const tmpValues = result;
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const isLast = i === fields.length - 1;
    const newTmp = isLast ? value : { ...tmpValues[field] };
    tmpValues[field] = newTmp;
    tmpValues = newTmp;
  }

  return result;
};
