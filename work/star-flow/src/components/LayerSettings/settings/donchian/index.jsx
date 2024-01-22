import { memo } from 'react';
import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { DONCHIAN_SETTINGS } from '@/config/consts/settings/donchian';

const settings = [...DONCHIAN_SETTINGS.input, ...DONCHIAN_SETTINGS.style];

export const DonchianSettings = memo(({ values, onChange }) => (
  <FormSettingGenerator
    settings={settings}
    onChange={onChange}
    values={values}
  />
));

DonchianSettings.displayName = 'DonchianSettings';
