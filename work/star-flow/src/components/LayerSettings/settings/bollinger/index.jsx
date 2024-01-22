import { memo } from 'react';
import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { BOLLINGER_SETTINGS } from '@/config/consts/settings/bollinger';

const settings = [...BOLLINGER_SETTINGS.input, ...BOLLINGER_SETTINGS.style];

export const BollingerSettings = memo(({ values, onChange }) => (
  <FormSettingGenerator
    settings={settings}
    onChange={onChange}
    values={values}
  />
));

BollingerSettings.displayName = 'BollingerSettings';
