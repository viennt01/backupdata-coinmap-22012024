import { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Loading from '@/components/Loading';
import { SVGClose } from '@/assets/images/svg';
import PaneBotSignals from './PaneBotSignals';
import { actToggleBotSignalsPane } from '@/redux/actions/setting';
import { dateRangeField } from '@/config/consts/bots';

import style from './PaneBotSignals.module.scss';
import { GATEWAY, get } from '@/fetcher';

const PaneBotSignalsWrapper = memo(({ chartId, onJump, symbol, interval }) => {
  const [botMap, setBotMap] = useState(null);
  const dispatch = useDispatch();

  const closePane = useCallback(() => {
    dispatch(actToggleBotSignalsPane(chartId));
  }, [dispatch, chartId]);

  useEffect(() => {
    const getBots = async () => {
      const res = await get({
        gw: GATEWAY.API_USER_ROLES_GW,
      })(`/user/bot-setting/list`);

      if (!Array.isArray(res?.payload)) {
        setBotMap('Lỗi khi tải dữ liệu bot');
        return;
      }

      const bots = {};
      res.payload.forEach((bot) => {
        const key = bot?.params?.type?.default;
        if (!key) {
          return;
        }

        delete bot.params.type;
        bot.params = {
          ...dateRangeField,
          ...bot.params,
        };
        bots[key] = bot;
      });
      setBotMap(bots);
    };
    getBots();
  }, []);

  let loadingOrError = null;
  if (!botMap) {
    loadingOrError = <Loading />;
  } else if (typeof botMap !== 'object') {
    loadingOrError = (
      <div className="text-center text-primary py-3">
        <h3>{botMap}</h3>
      </div>
    );
  }

  return (
    <div className={style.wrapper}>
      <div className={style.header}>
        <span>Bot signal</span>
        <button onClick={closePane} className={style.btnClose}>
          <SVGClose width={16} height={16} />
        </button>
      </div>
      {loadingOrError}
      {loadingOrError === null && (
        <PaneBotSignals
          botMap={botMap}
          chartId={chartId}
          onJump={onJump}
          symbol={symbol}
          interval={interval}
        />
      )}
    </div>
  );
});

PaneBotSignalsWrapper.displayName = 'PaneBotSignalsWrapper';

export default PaneBotSignalsWrapper;
