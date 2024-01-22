import { useCallback, useMemo } from 'react';
import FormControlItem from './components/FormControlItem';
import { getChangedValues, ROW_MARGIN_Y, setChangedValues } from './helpers';

/**
 * Render list fields config to list field
 *
 * @param {[FieldConfig,[FieldConfig]]} [fields=[]]
 * @param {Object} values Form field values
 * @param {Function} onChange handle on value of a field change
 * @return {[JSX.Element]} list of field
 */
const fieldListRender = (fields = [], values, onChange) => {
  const marginX = fields[0].type === 'section' ? 'ms-4' : '';

  return fields.map((field, index) => {
    if (Array.isArray(field)) {
      const firstField = field[0];
      const marginTop = firstField?.marginTop || ROW_MARGIN_Y;

      return (
        <div
          key={`${field.name}-${index}-wrapper`}
          className={`row d-flex align-items-center gx-2 flex-nowrap ${marginTop} ${marginX}`}
        >
          {fieldListRender(field, values, onChange)}
        </div>
      );
    }

    return (
      <FormControlItem
        key={`${field.name}-${index}`}
        field={field}
        index={index}
        values={values}
        onChange={onChange}
        marginX={marginX}
      />
    );
  });
};

/**
 * Render fields base on config, to see more please go to definition of FieldConfig (global.d.ts)
 * @param {{ settings: Array<FieldConfig>, values: Object, onChange: Function }} param0
 * @returns Array of fields
 */
export const FormSettingGenerator = ({ settings, values, onChange }) => {
  const handleFieldChange = useCallback(
    (field, changeEventData) => {
      const changes = getChangedValues(field, changeEventData);
      const newValues = setChangedValues(changes, values);
      onChange(newValues);
    },
    [values, onChange]
  );

  const renderedFields = useMemo(
    () => fieldListRender(settings, values, handleFieldChange),
    [settings, values, handleFieldChange]
  );

  return renderedFields;
};
