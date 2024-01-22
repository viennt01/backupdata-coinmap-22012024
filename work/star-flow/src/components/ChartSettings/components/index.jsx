import { OverlayTrigger, Popover } from 'react-bootstrap';
import { ChromePicker, CirclePicker } from 'react-color';

import styles from '../styles.module.scss';
import { useCallback } from 'react';
import { RGBAToHex } from '@/utils/rgbaToHex';

export const ColorSection = ({
  keyColor,
  label,
  handleChangeColor,
  color,
  disabled,
}) => {
  const handleChangeTheme = (keyColor, color) => {
    handleChangeColor(keyColor, color);
  };

  const renderColorPicker = useCallback(
    ({ keyColor, ...props }) => {
      return (
        <Popover className={styles.customTooltip} {...props}>
          <ChromePicker
            disableAlpha
            color={color}
            onChange={(color) => {
              handleChangeTheme(keyColor, color.hex);
            }}
          />
          <div className={styles.presetWrapper}>
            <CirclePicker
              width="225px"
              circleSize={16}
              onChange={(color) => {
                handleChangeTheme(keyColor, color.hex);
              }}
              color={color}
            />
          </div>
        </Popover>
      );
    },
    [handleChangeTheme, color]
  );

  if (disabled) {
    return (
      <div className={styles.colorWrapper}>
        <span
          className={styles.colorPickerCircle}
          style={{ background: color }}
        ></span>{' '}
        {label}
      </div>
    );
  }

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      overlay={(props) => renderColorPicker({ keyColor, ...props })}
      rootClose
    >
      <div className={styles.colorWrapper}>
        <span
          className={styles.colorPickerCircle}
          style={{ background: color }}
        ></span>{' '}
        {label}
      </div>
    </OverlayTrigger>
  );
};

export const ColorSectionV2 = ({
  keyColor,
  label,
  handleChangeColor,
  color,
  disabled,
}) => {
  const handleChangeTheme = (keyColor, color) => {
    handleChangeColor(keyColor, color);
  };

  const renderColorPicker = useCallback(
    ({ keyColor, ...props }) => {
      return (
        <Popover className={styles.customTooltip} {...props}>
          <ChromePicker
            color={color}
            onChange={(color) => {
              handleChangeTheme(keyColor, RGBAToHex(color.rgb));
            }}
          />
          <div className={styles.presetWrapper}>
            <CirclePicker
              width="225px"
              circleSize={16}
              onChange={(color) => {
                handleChangeTheme(keyColor, color.hex);
              }}
              color={color}
            />
          </div>
        </Popover>
      );
    },
    [handleChangeTheme, color]
  );

  if (disabled) {
    return (
      <div className={styles.colorWrapper}>
        <span
          className={styles.colorPickerCircle}
          style={{ background: color }}
        ></span>{' '}
        {label}
      </div>
    );
  }

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      overlay={(props) => renderColorPicker({ keyColor, ...props })}
      rootClose
    >
      <div className={styles.colorWrapper}>
        <span
          className={styles.colorPickerCircle}
          style={{ background: color }}
        ></span>{' '}
        {label}
      </div>
    </OverlayTrigger>
  );
};
