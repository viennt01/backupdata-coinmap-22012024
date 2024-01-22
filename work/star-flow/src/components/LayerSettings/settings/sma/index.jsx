import { memo } from 'react';
import { SMASettingsForm } from './SMASettingsForm';

export const SMASettings = memo(({ values, onChange }) => {
  return <SMASettingsForm values={values} onChange={onChange} />;
});

SMASettings.displayName = 'SMASettings';
