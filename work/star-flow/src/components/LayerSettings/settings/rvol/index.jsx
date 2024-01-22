import { memo } from 'react';
import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { RVOL_SETTINGS } from '@/config/consts/settings/rvol';

const settings = [...RVOL_SETTINGS.input, ...RVOL_SETTINGS.style];

export const RVOLSettings = memo(({ values, onChange }) => (
  <FormSettingGenerator
    settings={settings}
    onChange={onChange}
    values={values}
  />
));

RVOLSettings.displayName = 'RVOLSettings';
