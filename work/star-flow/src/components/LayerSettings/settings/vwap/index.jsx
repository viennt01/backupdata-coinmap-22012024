import { memo } from 'react';
import { VWAPSettingsForm } from './VWapSettingsForm';

export const VWAPSettings = memo(({ values, onChange }) => {
  return <VWAPSettingsForm values={values} onChange={onChange} />;
});

VWAPSettings.displayName = 'VWAPSettings';
