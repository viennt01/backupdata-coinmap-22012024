import { memo } from 'react';
import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { SHORT_SETTINGS } from '@/config/consts/drawSettings/shortPosition';

const settings = [...SHORT_SETTINGS.style];

export const ShortPositionSettings = memo(({ values, onChange }) => (
  <FormSettingGenerator
    settings={settings}
    onChange={onChange}
    values={values}
  />
));

ShortPositionSettings.displayName = 'ShortPositionSettings';
