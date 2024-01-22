import { memo } from 'react';
import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { HPR_SETTINGS } from '@/config/consts/settings/hpr';

const settings = [...HPR_SETTINGS.input, ...HPR_SETTINGS.style];

export const HPRSettings = memo(({ values, onChange }) => (
  <FormSettingGenerator
    settings={settings}
    onChange={onChange}
    values={values}
  />
));

HPRSettings.displayName = 'HPRSettings';
