import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { VWMA_SETTINGS } from '@/config/consts/settings/vwma';

const settings = [...VWMA_SETTINGS.input, ...VWMA_SETTINGS.style];

export const VWMASettingsForm = ({ values, onChange }) => {
  return (
    <FormSettingGenerator
      settings={settings}
      onChange={onChange}
      values={values}
    />
  );
};
