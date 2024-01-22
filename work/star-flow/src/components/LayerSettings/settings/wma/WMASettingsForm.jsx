import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { WMA_SETTINGS } from '@/config/consts/settings/wma';

const settings = [...WMA_SETTINGS.input, ...WMA_SETTINGS.style];

export const WMASettingsForm = ({ values, onChange }) => {
  return (
    <FormSettingGenerator
      settings={settings}
      onChange={onChange}
      values={values}
    />
  );
};
