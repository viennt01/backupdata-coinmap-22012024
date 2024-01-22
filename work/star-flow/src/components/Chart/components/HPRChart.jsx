import { format } from 'd3-format';
import { Chart } from '@coinmap/react-stockcharts';
import { LineSeries } from '@coinmap/react-stockcharts/lib/series';
import {
  MouseCoordinateX,
  MouseCoordinateY,
} from '@coinmap/react-stockcharts/lib/coordinates';
import { SingleValueTooltip } from '@coinmap/react-stockcharts/lib/tooltip';
import XAxisComponent from './XAxis';
import YAxisComponent from './YAxis';
import { GET_HPR_YACCESSORS } from '@/config/consts/settings/hpr';

const numberFormat = format(',.6f');

const renderHPRChart = ({
  chartId,
  height,
  hPosition,
  timeDisplayFormat,
  fontWeight,
  fontSize,
  xGrid,
  gridWidth,
  showXAxis,
  layer,
  showLayerSettingModal,
}) => {
  const { style } = layer.settings;
  const yAccessors = GET_HPR_YACCESSORS(layer.i);

  return (
    <Chart
      key={layer.i}
      id={layer.i}
      height={height}
      yExtents={(d) => d[layer.i]?.hpr}
      origin={(w, h) => [0, h - hPosition]}
      padding={{ top: 10, bottom: 10 }}
      zoomEnabled={false}
    >
      {showXAxis && <XAxisComponent chartId={chartId} {...xGrid} />}
      <YAxisComponent
        chartId={chartId}
        ticks={6}
        innerTickSize={-1 * gridWidth}
        tickFormat={numberFormat}
      />
      {showXAxis && (
        <MouseCoordinateX
          at="bottom"
          orient="bottom"
          displayFormat={timeDisplayFormat}
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
        displayFormat={numberFormat}
        fontWeight={fontWeight}
      />

      {style.hpr.show && (
        <LineSeries
          selected
          disableDrag
          showCursorWhenHovering
          highlightOnHover
          yAccessor={yAccessors.hpr}
          stroke={style.hpr.lineColor}
          strokeDasharray={style.hpr.lineType}
          strokeWidth={style.hpr.lineSize}
          strokeOpacity={style.hpr.lineOpacity}
          hoverStrokeWidth={style.hpr.lineSize}
          onDoubleClick={showLayerSettingModal}
        />
      )}

      <SingleValueTooltip
        labelFill="#FFFFFF"
        valueFill="#FFFFFF"
        fontSize={fontSize}
        fontWeight={fontWeight}
        yAccessor={yAccessors.hpr}
        yLabel="&nbsp;&nbsp;HPR"
        yDisplayFormat={numberFormat}
        origin={[0, 15]}
      />
    </Chart>
  );
};

export default renderHPRChart;
