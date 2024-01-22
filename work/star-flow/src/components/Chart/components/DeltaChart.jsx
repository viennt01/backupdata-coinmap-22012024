import { timeFormat } from 'd3-time-format';
import { Chart } from '@coinmap/react-stockcharts';
import { StraightLine, BarSeries } from '@coinmap/react-stockcharts/lib/series';
import {
  MouseCoordinateX,
  MouseCoordinateY,
} from '@coinmap/react-stockcharts/lib/coordinates';
import { SingleValueTooltip } from '@coinmap/react-stockcharts/lib/tooltip';
import XAxisComponent from './XAxis';
import YAxisComponent from './YAxis';

const renderDeltaChart = ({
  height,
  hPosition,
  theme,
  fontWeight,
  fontSize,
  xGrid,
  gridWidth,
  tickFormat,
  numberFormat,
  id,
  key,
  showXAxis,
  chartId,
}) => {
  return (
    <Chart
      key={key}
      id={id}
      height={height}
      yExtents={(d) => d.delta}
      origin={(w, h) => [0, h - hPosition]}
      padding={{ top: 10, bottom: 10 }}
      zoomEnabled={false}
    >
      {showXAxis && <XAxisComponent chartId={chartId} {...xGrid} />}
      <YAxisComponent
        chartId={chartId}
        ticks={4}
        innerTickSize={-1 * gridWidth}
        tickFormat={numberFormat}
      />
      {showXAxis && (
        <MouseCoordinateX
          at="bottom"
          orient="bottom"
          displayFormat={timeFormat('%Y/%m/%d %H:%M:%S')}
          fontWeight={fontWeight}
          fontSize={fontSize}
        />
      )}

      <MouseCoordinateY
        yAxisPad={5}
        rectHeight={14}
        fontSize={fontSize}
        strokeWidth={1}
        arrowWidth={5}
        at="right"
        orient="right"
        displayFormat={tickFormat}
        fontWeight={fontWeight}
      />

      {/* <DeltaSeriesComponent
            // yAccessor={(d) => elder.accessor()(d) && elder.accessor()(d).bearPower}
            baseAt={(xScale, yScale, d) => yScale(0)}
            fill={(value) => (value > 0 ? theme.vpBidDeltaColor : theme.vpAskDeltaColor)}
            // stroke={(value) => (value > 0 ? theme.vpBidDeltaColor : theme.vpAskDeltaColor)}
          /> */}
      <BarSeries
        baseAt={(_, yScale) => yScale(0)}
        yAccessor={(d) => d.delta}
        fill={(d) =>
          d.delta > 0 ? theme.vpBidDeltaColor : theme.vpAskDeltaColor
        }
        opacity={0.5}
        stroke={false}
        widthRatio={0.85}
      />

      <StraightLine yValue={0} stroke="#FFFFFF" />

      <SingleValueTooltip
        labelFill="#FFFFFF"
        valueFill="#FFFFFF"
        fontSize={fontSize}
        fontWeight={fontWeight}
        yAccessor={(d) => d.delta}
        yLabel="&nbsp;&nbsp;Delta"
        yDisplayFormat={numberFormat}
        origin={[0, 15]}
      />
    </Chart>
  );
};

export default renderDeltaChart;
