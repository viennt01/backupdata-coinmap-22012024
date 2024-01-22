import { SVGBars, SVGClose } from '@/assets/images/svg';
import { LOCAL_CACHE_KEYS, URLS } from '@/config';
import { actCloseChartById } from '@/redux/actions';
import { localStore } from '@/utils/localStorage';
import { useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { deleteChart } from '@/utils/chart';

import style from './style.module.scss';

const SectionIframe = ({ chartId }) => {
  const dispatch = useDispatch();
  const { id } = useSelector(
    (state) => ({
      id: state.chartSettings.charts[chartId]?.id || '',
    }),
    shallowEqual
  );
  const token = useMemo(() => {
    return localStore.get(LOCAL_CACHE_KEYS.CM_TOKEN);
  }, []);

  const src = URLS.TRADINGVIEW_URL;

  return (
    <>
      <div className={style.headerContainer}>
        <SVGBars className={`${style.moveIcon}`} />
        <div
          className={[style.dragContainer, 'customDragHandler'].join(' ')}
        ></div>
        <SVGClose
          className={`${style.closeIcon}`}
          role="presentation"
          onClick={() => {
            if (id) {
              deleteChart(id);
            }
            dispatch(actCloseChartById(chartId));
          }}
        />
      </div>
      <iframe
        allowFullScreen
        className={style.iframe}
        src={`${src}?token=${token}`}
      />
    </>
  );
};

export default SectionIframe;
