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
  color,
  label,
  fieldName,
  onChange,
  className = '',
  opacity,
  disableAlpha,
  isDisabled,
  rectWidth = 36,
  rectHeight = 36,
  padding = 9,
}) => {
  const contextValue = useContext(ChartSectionContext);
  const { sectionRef, isFullScreen } = contextValue ?? {};
  const container = isFullScreen ? sectionRef?.current : document.body;

  const handleChangeColor = useCallback(
    (newColor) => {
      if (onChange) {
        requestAnimationFrame(() => {
          onChange(fieldName, newColor.hex, newColor?.rgb?.a);
        });
      }
    },
    [onChange, fieldName]
  );

  const rgbaColor = hexToRGBA(
    color || '',
    typeof opacity === 'number' ? opacity : 1
  );

  const colorDisplayStyle = {
    top: padding,
    left: padding,
    width: rectWidth - padding * 2,
    height: rectHeight - padding * 2,
  };

  return (
    <OverlayTrigger
      trigger="click"
      placement="auto"
      container={container}
      overlay={(props) =>
        isDisabled ? (
          <></>
        ) : (
          renderTooltip({
            ...props,
            color: rgbaColor,
            fieldName,
            onChange: handleChangeColor,
            disableAlpha: disableAlpha || typeof opacity !== 'number',
          })
        )
      }
      rootClose
    >
      <div
        className={`${styles.colorWrapper} ${label && 'w-100'} ${className} ${
          isDisabled ? styles.disabledPicker : ''
        }`}
        style={{ padding }}
      >
        <div
          className={styles.colorPickerCircleBackground}
          style={colorDisplayStyle}
        />
        <div
          className={styles.colorPickerCircle}
          style={{
            background: rgbaColor,
            ...colorDisplayStyle,
          }}
        />
        {label ?? ''}
      </div>
    </OverlayTrigger>
  );
};
export const CustomColorPicker = memo(ColorPicker);
