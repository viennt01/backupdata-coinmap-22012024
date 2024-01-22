import styles from './style.module.scss';
import { hexToRGBA } from '@coinmap/react-stockcharts/lib/utils';
import { memo, useCallback, useContext } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { ChromePicker, CirclePicker } from 'react-color';
import { ChartSectionContext } from '@/components/ChartSection';

const renderTooltip = ({ color, disableAlpha, ...props }) => (
  <Popover className={styles.customTooltip} {...props}>
    <ChromePicker
      disableAlpha={disableAlpha}
      color={color}
      onChange={props.onChange}
    />
    <div className={styles.presetWrapper}>
      <CirclePicker
        width="225px"
        circleSize={16}
        onChange={props.onChange}
        color={color}
      />
    </div>
  </Popover>
);

export const ColorPicker = ({
  renderIcon = () => null,
  color,
  fieldName,
  onChange,
  opacity,
  disableAlpha,
  disabled,
}) => {
  const contextValue = useContext(ChartSectionContext);
  const { sectionRef, isFullScreen } = contextValue ?? {};
  const container = isFullScreen ? sectionRef?.current : document.body;

  const handleChangeColor = useCallback(
    (newColor) => {
      if (onChange) {
        requestAnimationFrame(() => {
          onChange(fieldName, newColor.hex, newColor.rgb?.a);
        });
      }
    },
    [onChange, fieldName]
  );

  const rgbaColor = hexToRGBA(
    color || '',
    typeof opacity === 'number' ? opacity : 1
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement="auto"
      container={container}
      overlay={(props) =>
        disabled ? (
          <></>
        ) : (
          renderTooltip({
            ...props,
            color: rgbaColor,
            onChange: handleChangeColor,
            disableAlpha: disableAlpha || typeof opacity !== 'number',
          })
        )
      }
      rootClose
    >
      <div
        className={`${styles.colorWrapper} ${
          disabled ? styles.disabledPicker : ''
        }`}
      >
        {renderIcon()}
        <div className={styles.colorMask} style={{ background: rgbaColor }} />
      </div>
    </OverlayTrigger>
  );
};
export const IconColorPicker = memo(ColorPicker);
