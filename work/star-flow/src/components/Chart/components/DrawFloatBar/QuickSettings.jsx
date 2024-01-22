import style from './DrawFloatBar.module.scss';
import { OverlayTrigger } from 'react-bootstrap';
import { IconColorPicker } from '@/components/IconColorPicker';
import {
  SvgColorPaintOpacity,
  SvgColorTextOpacity,
} from '@/assets/images/svg/iconV2';
import CustomTooltip from '@/components/CustomTooltip';

const TextColor = (props) => (
  <IconColorPicker {...props} renderIcon={() => <SvgColorTextOpacity />} />
);

const PaintColor = (props) => (
  <IconColorPicker {...props} renderIcon={() => <SvgColorPaintOpacity />} />
);

const COMPONENTS = {
  'text-color': TextColor,
  'paint-color': PaintColor,
};

const QuickSettings = ({ container, values, settings, onChange }) => {
  if (!settings) return null;

  const handleChangeValue = (item) => (_, color, opacity) => {
    if (!item.opacityField) return onChange({ [item.valueField]: color });
    onChange({
      appearance: {
        ...values,
        [item.valueField]: color,
        [item.opacityField]: opacity,
      },
    });
  };

  return settings.map((item) => {
    const SettingItem = COMPONENTS[item.type];
    return (
      <OverlayTrigger
        key={item.valueField}
        container={container}
        overlay={<CustomTooltip>{item.name}</CustomTooltip>}
      >
        <button className={style.actionBtn}>
          <SettingItem
            color={values?.[item.valueField]}
            opacity={values?.[item.opacityField]}
            onChange={handleChangeValue(item)}
          />
        </button>
      </OverlayTrigger>
    );
  });
};

export default QuickSettings;
