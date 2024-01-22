import { memo } from 'react';
import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { RSI_SETTINGS } from '@/config/consts/settings/rsi';

const settings = [...RSI_SETTINGS.input, ...RSI_SETTINGS.style];

export const RSISettings = memo(({ values, onChange }) => (
  <FormSettingGenerator
    settings={settings}
    onChange={onChange}
    values={values}
  />
));

RSISettings.displayName = 'RSISettings';
