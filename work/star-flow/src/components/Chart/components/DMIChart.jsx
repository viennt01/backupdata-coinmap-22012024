import { timeFormat } from 'd3-time-format';
import { format } from 'd3-format';
import { Chart } from '@coinmap/react-stockcharts';
import { DMISeries } from '@coinmap/react-stockcharts/lib/series';
import {
  MouseCoordinateX,
  MouseCoordinateY,
} from '@coinmap/react-stockcharts/lib/coordinates';
import { SingleValueTooltip } from '@coinmap/react-stockcharts/lib/tooltip';
import XAxisComponent from './XAxis';
import YAxisComponent from './YAxis';
import { GET_DMI_YACCESSORS } from '@/config/consts/settings/dmi';

const numberFormat = format(',.4f');

const renderDMIChart = ({
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
  const yAccessors = GET_DMI_YACCESSORS(layer.i);

  return (
    <Chart
      key={layer.i}
      id={layer.i}
      height={height}
      yExtents={(d) => d[layer.i]?.adx}
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

      <DMISeries
        yAccessors={yAccessors}
        adx={style.adx}
        diP={style.diP}
        diM={style.diM}
        highlightOnHover
        onDoubleClick={showLayerSettingModal}
      />

      <SingleValueTooltip
        labelFill="#FFFFFF"
        valueFill="#FFFFFF"
        fontSize={fontSize}
        fontWeight={fontWeight}
        yAccessor={(d) => d[layer.i]?.adx}
        yLabel="&nbsp;&nbsp;DMI"
        yDisplayFormat={numberFormat}
        origin={[0, 15]}
      />
    </Chart>
  );
};

export default renderDMIChart;
