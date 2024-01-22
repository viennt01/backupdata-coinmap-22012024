import VIEW_SETTINGS, {
  BACKGROUND_TYPE,
  BACKGROUND_COLOR,
} from '@/config/consts/settings/view';
import { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

export default function useViewSettings({ chartId }) {
  const viewSettings = useSelector(
    (state) =>
      state.chartSettings.charts[chartId]?.viewSettings || VIEW_SETTINGS,
    shallowEqual
  );
  useEffect(() => {
    const chartWrapperElement = document.getElementById(chartId);
    const chartContainerElement = chartWrapperElement.getElementsByClassName(
      'react-stockchart-canvas'
    );

    // change variable css by js
    if (chartContainerElement.length) {
      let color1 = viewSettings.background['color[0]'];
      let color2 = viewSettings.background['color[1]'];
      if (viewSettings.background.display) {
        if (viewSettings.background.type === BACKGROUND_TYPE.SOLID) {
          color2 = color1;
        }
      } else {
        color1 = BACKGROUND_COLOR;
        color2 = BACKGROUND_COLOR;
      }
      chartContainerElement[0].style.setProperty('--bg-chart-1', color1);
      chartContainerElement[0].style.setProperty('--bg-chart-2', color2);
    }
  });
}
