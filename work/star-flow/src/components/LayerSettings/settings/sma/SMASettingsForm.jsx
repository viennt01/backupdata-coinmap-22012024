import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { SMA_SETTINGS } from '@/config/consts/settings/sma';

const settings = [...SMA_SETTINGS.input, ...SMA_SETTINGS.style];

export const SMASettingsForm = ({ values, onChange }) => {
  return (
    <FormSettingGenerator
      settings={settings}
      onChange={onChange}
      values={values}
    />
  );
};
