import { memo } from 'react';
import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { CE_SETTINGS } from '@/config/consts/settings/chandelierExit';

const settings = [...CE_SETTINGS.input, ...CE_SETTINGS.style];

export const ChandelierExitSettings = memo(({ values, onChange }) => (
  <FormSettingGenerator
    settings={settings}
    onChange={onChange}
    values={values}
  />
));

ChandelierExitSettings.displayName = 'ChandelierExitSettings';
