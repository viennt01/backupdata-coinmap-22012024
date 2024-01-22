import { useCallback } from 'react';
import {
  FORM_CONTROLS,
  getFieldKey,
  getFieldValue,
  isNolabelField,
  ROW_MARGIN_Y,
} from '../helpers';

const DEFAULT_LABEL_WIDTH = '156px';
const DISABLED_OPACITY = 0.55;

/**
 * Render field base on field config
 * To see supported type: FORM_CONTROLS
 * @param {Object} param0 form control props
 * @returns Field Item or null when unsupported field type
 */
const FormControlItem = ({ field, index, values, onChange, marginX }) => {
  const ItemComponent = FORM_CONTROLS[field.type];

  const handleChange = useCallback(
    (...props) => {
      if (!onChange) {
        return;
      }

      onChange(field, props);
    },
    [onChange, field]
  );

  if (!ItemComponent) {
    return null;
  }

  const key = getFieldKey(field, index);
  const value = getFieldValue(field, values);
  const props = field?.props || {};
  if (typeof props?.label === 'undefined') {
    props.label = field.name;
  }

  if (isNolabelField(field.type)) {
    return (
      <ItemComponent
        value={value}
        onChange={handleChange}
        key={key}
        isDisabled={field.isDisabled}
        {...props}
      />
    );
  }

  const renderLabelAndContent = () => (
    <>
      {field.showLabel !== false && !!field.name && (
        <label
          style={{
            width: field.labelWidth ?? DEFAULT_LABEL_WIDTH,
            opacity: field.isDisabled ? DISABLED_OPACITY : 1,
          }}
        >
          {field.name}
        </label>
      )}
      <div style={{ width: 'fit-content' }}>
        <ItemComponent
          value={value}
          onChange={handleChange}
          key={key}
          isDisabled={field.isDisabled}
          {...props}
        />
      </div>
    </>
  );

  if (field.inline) {
    return renderLabelAndContent();
  }

  return (
    <div
      className={`${ROW_MARGIN_Y} row align-items-center gx-2 flex-nowrap ${marginX}`}
    >
      {renderLabelAndContent()}
    </div>
  );
};

export default FormControlItem;
