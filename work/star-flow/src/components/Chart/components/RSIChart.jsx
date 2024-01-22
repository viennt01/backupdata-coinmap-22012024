import { timeFormat } from 'd3-time-format';
import { format } from 'd3-format';
import { Chart } from '@coinmap/react-stockcharts';
import { RSISeries } from '@coinmap/react-stockcharts/lib/series';
import {
  MouseCoordinateX,
  MouseCoordinateY,
} from '@coinmap/react-stockcharts/lib/coordinates';
import { SingleValueTooltip } from '@coinmap/react-stockcharts/lib/tooltip';
import XAxisComponent from './XAxis';
import YAxisComponent from './YAxis';
import { GET_RSI_YACCESSORS, RSI_MA_TYPES } from '@/config/consts/settings/rsi';

const numberFormat = format(',.2f');

const renderRSIChart = ({
  chartId,
  height,
  hPosition,
  fontWeight,
  fontSize,
  xGrid,
  gridWidth,
  showXAxis,
  layer,
  showLayerSettingModal,
}) => {
  const { input, style } = layer.settings;
  const yAccessors = GET_RSI_YACCESSORS(layer.i);

  return (
    <Chart
      key={layer.i}
      id={layer.i}
      height={height}
      yExtents={(d) => d[layer.i]?.rsi}
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
        displayFormat={numberFormat}
        fontWeight={fontWeight}
      />

      <RSISeries
        yAccessors={yAccessors}
        rsi={style.rsi}
        rsiMA={style.rsiMA}
        bollingerTop={{
          ...style.bollingerTop,
          show:
            style.bollingerTop.show && input.maType === RSI_MA_TYPES.BOLLINGER,
        }}
        bollingerBottom={{
          ...style.bollingerBottom,
          show:
            style.bollingerBottom.show &&
            input.maType === RSI_MA_TYPES.BOLLINGER,
        }}
        rsiTop={style.rsiTop}
        rsiMiddle={style.rsiMiddle}
        rsiBottom={style.rsiBottom}
        rsiBackground={style.rsiBackground}
        bollingerBackground={{
          ...style.bollingerBackground,
          fill:
            style.bollingerBackground.fill &&
            input.maType === RSI_MA_TYPES.BOLLINGER,
        }}
        highlightOnHover
        onDoubleClick={showLayerSettingModal}
      />

      <SingleValueTooltip
        labelFill="#FFFFFF"
        valueFill="#FFFFFF"
        fontSize={fontSize}
        fontWeight={fontWeight}
        yAccessor={(d) => d[layer.i]?.rsi}
        yLabel="&nbsp;&nbsp;RSI"
        yDisplayFormat={numberFormat}
        origin={[0, 15]}
      />
    </Chart>
  );
};

export default renderRSIChart;
