import { FormSettingGenerator } from '@/components/FormSettingGenerator';
import { HEATMAP_VWAP_SETTINGS } from '@/config/consts/settings/heatmap-vwap';

const settings = [...HEATMAP_VWAP_SETTINGS.style];

const HeatmapVWAPSettingsForm = ({ values, onChange }) => {
  return (
    <FormSettingGenerator
      settings={settings}
      onChange={onChange}
      values={values}
    />
  );
};

export default HeatmapVWAPSettingsForm;
