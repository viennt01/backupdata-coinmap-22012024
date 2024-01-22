import { memo } from 'react';
import { SWMASettingsForm } from './SWMASettingsForm';

export const SWMASettings = memo(({ values, onChange }) => {
  return <SWMASettingsForm values={values} onChange={onChange} />;
});

SWMASettings.displayName = 'SWMASettings';
