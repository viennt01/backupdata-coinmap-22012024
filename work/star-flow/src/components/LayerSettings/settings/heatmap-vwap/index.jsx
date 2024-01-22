import { memo } from 'react';
import HeatmapVWAPSettingsForm from './HeatmapVWAPSettingsForm';

export const HeatmapVWAPSettings = memo(({ values, onChange }) => {
  return <HeatmapVWAPSettingsForm values={values} onChange={onChange} />;
});

HeatmapVWAPSettings.displayName = 'HeatmapVWAPSettings';
