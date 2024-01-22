import { Chart } from '@coinmap/react-stockcharts';
import { BarSeries } from '@coinmap/react-stockcharts/lib/series';
import { SingleValueTooltip } from '@coinmap/react-stockcharts/lib/tooltip';

const renderVolumePane = ({
  key,
  height = 100,
  fontSize,
  fontWeight,
  numberFormat,
  theme,
  hPosition,
}) => {
  return (
    <Chart
      id={key}
      key={key}
      origin={() => [0, hPosition]}
      height={height}
      yExtents={[(d) => [0, d.volume]]}
    >
      <SingleValueTooltip
        labelFill="#FFFFFF"
        valueFill="#FFFFFF"
        fontSize={fontSize}
        fontWeight={fontWeight}
        yAccessor={(d) => d.volume}
        yLabel="&nbsp;&nbsp;Volume"
        yDisplayFormat={numberFormat}
        origin={[0, 15]}
      />
      <BarSeries
        yAccessor={(d) => d.volume}
        fill={(d) =>
          d.close > d.open ? theme.vpBidDeltaColor : theme.vpAskDeltaColor
        }
        opacity={1}
        stroke={false}
      />
    </Chart>
  );
};

export default renderVolumePane;
