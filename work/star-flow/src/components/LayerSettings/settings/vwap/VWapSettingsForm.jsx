import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { VWAP_SETTINGS } from '@/config/consts/settings/vwap';

const settings = [...VWAP_SETTINGS.input, ...VWAP_SETTINGS.style];

export const VWAPSettingsForm = ({ values, onChange }) => {
  return (
    <FormSettingGenerator
      settings={settings}
      onChange={onChange}
      values={values}
    />
  );
};
