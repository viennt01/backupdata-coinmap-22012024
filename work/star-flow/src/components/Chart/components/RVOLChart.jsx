import { timeFormat } from 'd3-time-format';
import { Chart } from '@coinmap/react-stockcharts';
import { RVOLSeries } from '@coinmap/react-stockcharts/lib/series';
import {
  MouseCoordinateX,
  MouseCoordinateY,
} from '@coinmap/react-stockcharts/lib/coordinates';
import { SingleValueTooltip } from '@coinmap/react-stockcharts/lib/tooltip';
import XAxisComponent from './XAxis';
import YAxisComponent from './YAxis';
import { GET_RVOL_YACCESSORS } from '@/config/consts/settings/rvol';

const renderRVOLChart = ({
  chartId,
  height,
  hPosition,
  fontWeight,
  fontSize,
  xGrid,
  gridWidth,
  tickFormat,
  showXAxis,
  layer,
  showLayerSettingModal,
}) => {
  const { input, style } = layer.settings;
  const yAccessors = GET_RVOL_YACCESSORS(layer.i, input.maType);

  return (
    <Chart
      key={layer.i}
      id={layer.i}
      height={height}
      yExtents={(d) => d[layer.i]?.rvol}
      origin={(w, h) => [0, h - hPosition]}
      padding={{ top: 10, bottom: 10 }}
      zoomEnabled={false}
    >
      {showXAxis && <XAxisComponent chartId={chartId} {...xGrid} />}
      <YAxisComponent
        chartId={chartId}
        ticks={6}
        innerTickSize={-1 * gridWidth}
        tickFormat={tickFormat}
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

      <RVOLSeries
        yAccessors={yAccessors}
        rvol={style.rvol}
        highlightOnHover
        onDoubleClick={showLayerSettingModal}
      />

      <SingleValueTooltip
        labelFill="#FFFFFF"
        valueFill="#FFFFFF"
        fontSize={fontSize}
        fontWeight={fontWeight}
        yAccessor={yAccessors.rvol}
        yLabel="&nbsp;&nbsp;RVol"
        yDisplayFormat={tickFormat}
        origin={[0, 15]}
      />
    </Chart>
  );
};

export default renderRVOLChart;
