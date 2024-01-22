import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { SWMA_SETTINGS } from '@/config/consts/settings/swma';

const settings = [...SWMA_SETTINGS.input, ...SWMA_SETTINGS.style];

export const SWMASettingsForm = ({ values, onChange }) => {
  return (
    <FormSettingGenerator
      settings={settings}
      onChange={onChange}
      values={values}
    />
  );
};
