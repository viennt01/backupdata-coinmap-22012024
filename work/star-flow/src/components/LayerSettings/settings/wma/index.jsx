import { memo } from 'react';
import { WMASettingsForm } from './WMASettingsForm';

export const WMASettings = memo(({ values, onChange }) => {
  return <WMASettingsForm values={values} onChange={onChange} />;
});

WMASettings.displayName = 'WMASettings';
