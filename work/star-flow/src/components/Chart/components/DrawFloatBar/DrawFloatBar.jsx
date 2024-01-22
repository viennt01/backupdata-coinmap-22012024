import style from './DrawFloatBar.module.scss';
import Draggable from 'react-draggable';
import { OverlayTrigger } from 'react-bootstrap';
import {
  SvgDrag,
  SvgLock,
  SvgUnlock,
  SvgDelete,
  SvgSetting,
} from '@/assets/images/svg/iconV2';
import QuickSettings from './QuickSettings';
import { QUICK_SETTINGS, SETTINGS } from '@/config/consts/drawSettings/common';
import { useDispatch } from 'react-redux';
import { useRef, useContext } from 'react';
import {
  actSetDrawSetting,
  actUpdateChartToSever,
} from '@/redux/actions/setting';
import { ChartSectionContext } from '@/components/ChartSection';
import CustomTooltip from '@/components/CustomTooltip';

const DrawFloatBar = ({
  chartId,
  item,
  positionXY,
  floatBarRef,
  onDrop,
  onDelete,
  onToggleLock,
  onShowSettingModal,
}) => {
  const dispatch = useDispatch();
  const debounceRef = useRef(null);
  const contextValue = useContext(ChartSectionContext);
  const { sectionRef, isFullScreen } = contextValue ?? {};
  const container = isFullScreen ? sectionRef?.current : document.body;

  const debounce = (callback, time = 500) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(callback, time);
  };

  const handleChangeSettings = (values) => {
    dispatch(actSetDrawSetting(chartId, item.drawType, item.item.id, values));
    debounce(() => dispatch(actUpdateChartToSever(chartId)));
  };

  return (
    <Draggable
      bounds="parent"
      handle=".handleDrag"
      position={positionXY}
      onStop={(_, { x, y }) => {
        onDrop(x, y);
      }}
    >
      <div ref={floatBarRef} className={style.floatBar}>
        <span className={`handleDrag ${style.dragIcon}`}>
          <SvgDrag />
        </span>

        <QuickSettings
          container={container}
          values={item.item.appearance}
          settings={QUICK_SETTINGS[item.drawType]}
          onChange={handleChangeSettings}
        />

        {SETTINGS[item.drawType] && (
          <OverlayTrigger
            container={container}
            overlay={<CustomTooltip>Settings</CustomTooltip>}
          >
            <button
              className={style.actionBtn}
              onClick={() => onShowSettingModal(item)}
            >
              <SvgSetting />
            </button>
          </OverlayTrigger>
        )}

        <OverlayTrigger
          container={container}
          overlay={
            <CustomTooltip>
              {item?.item?.locked ? 'Unlock' : 'Lock'}
            </CustomTooltip>
          }
        >
          <button
            className={`${style.actionBtn} ${
              item?.item?.locked ? style.selected : ''
            }`}
            onClick={() => onToggleLock(item)}
          >
            {item?.item?.locked ? <SvgLock /> : <SvgUnlock />}
          </button>
        </OverlayTrigger>

        <OverlayTrigger
          container={container}
          overlay={<CustomTooltip>Remove</CustomTooltip>}
        >
          <button className={style.actionBtn} onClick={() => onDelete(item)}>
            <SvgDelete />
          </button>
        </OverlayTrigger>
      </div>
    </Draggable>
  );
};

export default DrawFloatBar;
