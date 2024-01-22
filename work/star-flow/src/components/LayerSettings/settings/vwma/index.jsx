import { memo } from 'react';
import { VWMASettingsForm } from './VWMASettingsForm';

export const VWMASettings = memo(({ values, onChange }) => {
  return <VWMASettingsForm values={values} onChange={onChange} />;
});

VWMASettings.displayName = 'VWMASettings';
