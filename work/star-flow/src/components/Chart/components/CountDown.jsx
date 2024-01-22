import { EdgeIndicator } from '@coinmap/react-stockcharts/lib/coordinates';
import { formatCountDown } from '@/utils/format';

const CountDown = ({
  lastCandle,
  fontWeight,
  fontSize,
  upColor,
  downColor,
}) => {
  const timeLeft = lastCandle.closetime - Date.now();

  if (timeLeft < 0) return null;

  return (
    <EdgeIndicator
      hideLine
      itemType="last"
      orient="right"
      edgeAt="right"
      yAccessor={() => lastCandle.close}
      fill={() => (lastCandle.close > lastCandle.open ? upColor : downColor)}
      textFill="white"
      marginY={fontSize}
      rectHeight={fontSize + 3}
      rectWidth={20}
      fontSize={fontSize}
      strokeWidth={1}
      arrowWidth={0}
      xCountDown={9}
      yCountDown={fontSize - 3}
      wickStroke="white"
      stroke="white"
      lineStroke="white"
      yAxisPad={3}
      displayFormat={() => formatCountDown(timeLeft)}
      fontWeight={fontWeight}
    />
  );
};

export default CountDown;
