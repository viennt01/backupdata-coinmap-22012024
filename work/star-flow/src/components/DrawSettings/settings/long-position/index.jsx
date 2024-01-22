import { memo } from 'react';
import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { LONG_SETTINGS } from '@/config/consts/drawSettings/longPosition';

const settings = [...LONG_SETTINGS.style];

export const LongPositionSettings = memo(({ values, onChange }) => (
  <FormSettingGenerator
    settings={settings}
    onChange={onChange}
    values={values}
  />
));

LongPositionSettings.displayName = 'LongPositionSettings';
