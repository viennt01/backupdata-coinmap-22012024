import { timeFormat } from 'd3-time-format';
import { format } from 'd3-format';
import { Chart } from '@coinmap/react-stockcharts';
import {
  StraightLine,
  BarSeries,
  LineSeries,
} from '@coinmap/react-stockcharts/lib/series';
import {
  MouseCoordinateX,
  MouseCoordinateY,
} from '@coinmap/react-stockcharts/lib/coordinates';
import { SingleValueTooltip } from '@coinmap/react-stockcharts/lib/tooltip';
import XAxisComponent from './XAxis';
import YAxisComponent from './YAxis';

const numberFormat = format(',.3s');

const renderAccumulatedDeltaChart = ({
  height,
  hPosition,
  theme,
  fontWeight,
  fontSize,
  xGrid,
  gridWidth,
  tickFormat,
  id,
  key,
  showXAxis,
  displayType = 'line',
  chartId,
}) => {
  return (
    <Chart
      key={key}
      id={id}
      height={height}
      yExtents={(d) => {
        const diff = d.cvd * 0.002;

        return [d.cvd - diff, d.cvd + diff];
      }}
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
      {displayType !== 'line' && (
        <BarSeries
          baseAt={(_, yScale) => yScale(0)}
          yAccessor={(d) => d.cvd}
          fill={(d) =>
            d.cvd > 0 ? theme.vpBidDeltaColor : theme.vpAskDeltaColor
          }
          opacity={0.5}
          stroke={false}
          widthRatio={0.85}
        />
      )}
      {displayType === 'line' && (
        <LineSeries
          yAccessor={(d) => d.cvd}
          stroke="#FF0606"
          shouldBreak={(candle) => {
            const startOfDate = new Date(candle.opentime).setHours(7, 0, 0, 0);
            return candle.opentime !== startOfDate;
          }}
          strokeWidth={2}
          interpolation={0.5}
        />
      )}

      <StraightLine yValue={0} stroke="#FFFFFF" />

      <SingleValueTooltip
        labelFill="#FFFFFF"
        valueFill="#FFFFFF"
        fontSize={fontSize}
        fontWeight={fontWeight}
        yAccessor={(d) => d.cvd}
        yLabel="&nbsp;&nbsp;Cumulative delta"
        yDisplayFormat={numberFormat}
        origin={[0, 15]}
      />
    </Chart>
  );
};

export default renderAccumulatedDeltaChart;
