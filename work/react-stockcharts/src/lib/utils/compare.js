const TOLERANCE = 0.0000001;

export const isFloatEqual = (a, b) => Math.abs(a - b) < TOLERANCE;

export const fixLikeTickValue = (num, tickValue) => {
  const result = num;
  const tickValueStr = `${tickValue}`;
  const pointIndex = tickValueStr.indexOf('.');
  let decimalLength = 0;
  if (pointIndex >= 0) {
    const arr = tickValueStr.split('.');
    decimalLength = arr[1].length;
  }

  if (isNaN(+result.toFixed(decimalLength))) {
    console.log('isNAN', num, tickValue);
  }
  return +result.toFixed(decimalLength);
};
