import { memo } from 'react';
import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { VOLUME_SESSION_SETTINGS } from '@/config/consts/settings/volume-session';

const settings = [
  ...VOLUME_SESSION_SETTINGS.input,
  ...VOLUME_SESSION_SETTINGS.style,
];

export const VolumeSessionSettings = memo(({ values, onChange }) => {
  return (
    <div style={{ margin: '0 16px' }}>
      <FormSettingGenerator
        settings={settings}
        onChange={onChange}
        values={values}
      />
    </div>
  );
});

VolumeSessionSettings.displayName = 'VolumeSessionSettings';
