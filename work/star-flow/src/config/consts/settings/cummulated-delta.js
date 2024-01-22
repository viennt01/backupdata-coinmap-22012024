import { isStartOfPeriod } from '@/utils/calculator';

export const calcCVDForNewCandle = ({ candle, previousCandle }) => {
  // TODO: change to dynamic period
  const period = 'day';
  const isStart = isStartOfPeriod(candle.opentime, period);

  if (isStart) {
    candle.cvd = candle.delta;
  } else {
    candle.cvd = previousCandle.cvd + candle.delta;
  }
};
