import { useEffect, useRef } from 'react';
import { formatDateUtc, TIME_ZONE_LIST } from '@/utils/timezone';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import style from './timer.module.scss';
import { useState } from 'react';
import { updateChart } from '@/utils/chart';
import { updateReduxChart } from '@/redux/actions/setting';

const UTCList = ({ utcSelected, handleSelectUtc }) => {
  return (
    <ul>
      {TIME_ZONE_LIST.map((timezone) => {
        const selected =
          JSON.stringify(utcSelected) === JSON.stringify(timezone);
        return (
          <li
            key={timezone.labelTable}
            className={[selected ? style.rowSelected : '', style.row].join(' ')}
            onClick={() => handleSelectUtc(timezone)}
          >
            {timezone.labelTable}
          </li>
        );
      })}
    </ul>
  );
};

export const DEFAULT_TIMEZONE = {
  label: '(UTC+7)',
  labelTable: '(UTC+7) Ho Chi Minh',
  value: '+7',
  timezone: 'Asia/Ho_Chi_Minh',
};

const Timer = ({ chartId }) => {
  const [openUtcList, setOpenUtcList] = useState(false);
  const { id, chart } = useSelector(
    (state) => ({
      id: state.chartSettings.charts[chartId]?.id || '',
      chart: state.chartSettings.charts[chartId],
    }),
    shallowEqual
  );
  const { timezone } = chart;
  const [utcSelected, setUtcSelected] = useState(() => {
    if (timezone) {
      return TIME_ZONE_LIST.find((item) => item.timezone === timezone);
    }
    return DEFAULT_TIMEZONE;
  });
  const ref = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let timer;
    if (ref.current) {
      timer = setInterval(() => {
        ref.current.innerHTML = formatDateUtc(
          new Date().toISOString(),
          utcSelected.timezone
        );
      }, 500);
    }
    return () => {
      clearInterval(timer);
    };
  }, [ref, utcSelected.timezone]);

  const toggleOpenUtcList = () => {
    setOpenUtcList((prev) => !prev);
  };

  const handleSelectUtc = (timezone) => {
    setUtcSelected(timezone);
    toggleOpenUtcList();
    const chartUpdate = {
      ...chart,
      timezone: timezone.timezone,
    };
    dispatch(updateReduxChart(chartId, chartUpdate));
    if (id) {
      updateChart({ chart: chartUpdate, dispatch });
    }
  };

  return (
    <div className={style.footerChart}>
      <div className={style.timer}>
        {openUtcList && (
          <div onClick={toggleOpenUtcList} className={style.blur_utc_list} />
        )}
        <div
          className={style.utc_list_container}
          style={
            openUtcList
              ? {
                  visibility: 'visible',
                }
              : { visibility: 'hidden' }
          }
        >
          <div className={style.utc_list}>
            <UTCList
              utcSelected={utcSelected}
              handleSelectUtc={handleSelectUtc}
            ></UTCList>
          </div>
        </div>
        <button onClick={toggleOpenUtcList}>
          <span ref={ref}></span> <span> {utcSelected.label}</span>
        </button>
      </div>
    </div>
  );
};

export default Timer;
