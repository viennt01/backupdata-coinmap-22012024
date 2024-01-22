import SvgEyeOpen from 'SVG/eye-open.svg';

import style from './style.module.scss';
import {
  SVGArchive,
  SvgJumpTo,
  SvgPanelSign,
  SvgExport,
} from '@/assets/images/svg';
import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  actToggleBotSignalsPane,
  actToggleJumpToModal,
  actToggleExportModal,
} from '@/redux/actions/setting';
import DrawToolList from './DrawToolList';
import ability, { symbolToFeatureId } from '@/utils/authorize/ability';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { FEATURE_IDS } from '@/config/consts/features';

const LeftToolBar = ({ chartId, isHeatmapChart, symbol, chartDemension }) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  const showJumpToModal = useCallback(() => {
    dispatch(actToggleJumpToModal(chartId));
  }, [dispatch, chartId]);

  const toggleBotSignalsPane = useCallback(() => {
    dispatch(actToggleBotSignalsPane(chartId));
  }, [dispatch, chartId]);

  const showExportModal = useCallback(() => {
    dispatch(actToggleExportModal(chartId));
  }, [dispatch, chartId]);

  return (
    <div className={style.leftToolBar} ref={containerRef}>
      <div className={style.scrollY}>
        <div className={style.mainTools}>
          <DrawToolList
            chartId={chartId}
            symbol={symbol}
            chartDemension={chartDemension}
          />
          {ability.can(
            PERMISSION_ACTIONS.VIEW,
            symbolToFeatureId(symbol),
            FEATURE_IDS.TOOL_JUMPTO
          ) &&
            !isHeatmapChart && (
              <button
                role="button"
                className={`${style.tool} btn btn-link`}
                onClick={showJumpToModal}
              >
                <SvgJumpTo />
              </button>
            )}
          {ability.can(
            PERMISSION_ACTIONS.VIEW,
            symbolToFeatureId(symbol),
            FEATURE_IDS.TOOL_BOTSIGNAL
          ) &&
            !isHeatmapChart && (
              <button
                role="button"
                className={`${style.tool} btn btn-link`}
                onClick={toggleBotSignalsPane}
              >
                <SvgPanelSign width={18} height={18} />
              </button>
            )}
          {ability.can(
            PERMISSION_ACTIONS.VIEW,
            symbolToFeatureId(symbol),
            FEATURE_IDS.TOOL_EXPORT
          ) &&
            !isHeatmapChart && (
              <button
                role="button"
                className={`${style.tool} btn btn-link`}
                onClick={showExportModal}
              >
                <SvgExport width={18} height={18} />
              </button>
            )}
        </div>
        <div className={style.bottomTools}>
          <button
            role="button"
            className={`${style.tool} btn btn-link  disabled`}
          >
            <SvgEyeOpen />
          </button>
          <button
            role="button"
            className={`${style.tool} btn btn-link disabled`}
          >
            <SVGArchive />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftToolBar;
