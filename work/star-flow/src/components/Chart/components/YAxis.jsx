import { YAxis } from '@coinmap/react-stockcharts/lib/axes';
import { shallowEqual, useSelector } from 'react-redux';
import { DEFAULT_ZOOM_MULTIPLIER_Y } from '@/config/consts/chart';

const fontWeight = 300;

export const Y_AXIS_WIDTH = 55;

export default function YAxisComponent(props) {
  const chartSettings = useSelector(
    (state) => state.chartSettings.charts[props.chartId],
    shallowEqual
  );
  const { viewSettings, priceScaleSettings } = chartSettings;
  return (
    <YAxis
      yPanEnabled={false}
      zoomEnabled
      enableWheelY
      zoomMultiplier={DEFAULT_ZOOM_MULTIPLIER_Y}
      axisAt="right"
      orient="right"
      ticks={10}
      fontWeight={priceScaleSettings.font.bold ? 700 : fontWeight}
      fontFamily={priceScaleSettings.font.fontFamily}
      tickLabelFill={priceScaleSettings.fontColor}
      fontSize={priceScaleSettings.font.fontSize}
      showBackground
      stroke={priceScaleSettings.axis}
      fillBackground={priceScaleSettings.axisBackground}
      fill="#000000"
      tickStrokeWidth={viewSettings.grid.priceHorizontal.width} // width
      tickStrokeDasharray={viewSettings.grid.priceHorizontal.type} // linetype
      tickStroke={viewSettings.grid.priceHorizontal.color}
      tickStrokeOpacity={viewSettings.grid.priceHorizontal.display ? 0.1 : 0}
      width={Y_AXIS_WIDTH}
      {...props}
    />
  );
}
