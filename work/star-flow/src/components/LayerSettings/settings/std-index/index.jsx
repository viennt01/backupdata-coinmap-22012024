import { memo } from 'react';
import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { STD_INDEX_SETTINGS } from '@/config/consts/settings/stdIndex';

const settings = [...STD_INDEX_SETTINGS.input, ...STD_INDEX_SETTINGS.style];

export const STDIndexSettings = memo(({ values, onChange }) => (
  <FormSettingGenerator
    settings={settings}
    onChange={onChange}
    values={values}
  />
));

STDIndexSettings.displayName = 'STDIndexSettings';
