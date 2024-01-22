import { memo } from 'react';
import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { ATR_SETTINGS } from '@/config/consts/settings/atr';

const settings = [...ATR_SETTINGS.input, ...ATR_SETTINGS.style];

export const ATRSettings = memo(({ values, onChange }) => (
  <FormSettingGenerator
    settings={settings}
    onChange={onChange}
    values={values}
  />
));

ATRSettings.displayName = 'ATRSettings';
