import { memo } from 'react';
import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { DMI_SETTINGS } from '@/config/consts/settings/dmi';

const settings = [...DMI_SETTINGS.input, ...DMI_SETTINGS.style];

export const DMISettings = memo(({ values, onChange }) => (
  <FormSettingGenerator
    settings={settings}
    onChange={onChange}
    values={values}
  />
));

DMISettings.displayName = 'DMISettings';
