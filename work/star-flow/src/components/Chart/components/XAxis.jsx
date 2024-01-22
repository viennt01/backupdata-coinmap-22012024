import { XAxis } from '@coinmap/react-stockcharts/lib/axes';
import { shallowEqual, useSelector } from 'react-redux';
import { DEFAULT_ZOOM_MULTIPLIER_X } from '@/config/consts/chart';

const fontWeight = 300;

export const X_AXIS_HEIGHT = 30;

export default function XAxisComponent(props) {
  const chartSettings = useSelector(
    (state) => state.chartSettings.charts[props.chartId],
    shallowEqual
  );
  const { timeScaleSettings, viewSettings } = chartSettings;
  return (
    <XAxis
      zoomEnabled
      enableWheelX
      zoomMultiplier={DEFAULT_ZOOM_MULTIPLIER_X}
      axisAt="bottom"
      orient="bottom"
      fontWeight={timeScaleSettings.font.bold ? 700 : fontWeight}
      fontSize={timeScaleSettings.font.fontSize}
      fontFamily={timeScaleSettings.font.fontFamily}
      tickLabelFill={timeScaleSettings.fontColor}
      stroke={timeScaleSettings.axis}
      showBackground
      fillBackground={timeScaleSettings.axisBackground}
      daySeparators={timeScaleSettings.daySeparators}
      weekSeparators={timeScaleSettings.weekSeparators}
      monthSeparators={timeScaleSettings.monthSeparators}
      yearSeparators={timeScaleSettings.yearSeparators}
      tickStrokeWidth={viewSettings.grid.timeVertical.width} // width
      tickStrokeDasharray={viewSettings.grid.timeVertical.type} // linetype
      tickStroke={viewSettings.grid.timeVertical.color}
      tickStrokeOpacity={viewSettings.grid.timeVertical.display ? 0.1 : 0}
      height={X_AXIS_HEIGHT}
      {...props}
    />
  );
}
