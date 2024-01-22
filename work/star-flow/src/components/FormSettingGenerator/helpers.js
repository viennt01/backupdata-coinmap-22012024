import { Input } from '@/components/ChartSettings/settings/components';
import { CustomColorPicker } from '@/components/CustomColorPicker';
import CheckboxField from '@/components/FormSettingGenerator/components/CheckboxField';
import CustomSelect from '@/components/FormSettingGenerator/components/CustomSelect';
import { LineSelectBox } from '@/components/FormSettingGenerator/components/LineSelectBox';
import { getValueFromObject, setChangeValue } from '@/utils/mapping';
import RangeSlider from '@/components/FormSettingGenerator/components/RangeSlider';
import ToggleSwitch from '@/components/FormSettingGenerator/components/ToggleSwitch';
import LineSize from '@/components/FormSettingGenerator/components/LineSize';

/* -------------------------------------------------------------------------- */
/*                    Form control adapters should be here                    */
/* -------------------------------------------------------------------------- */
const newline = (props) => <div {...props} />;

const number = ({ width, ...props }) => (
  <div
    style={{ width: width ?? '70px', borderRadius: '4px', overflow: 'hidden' }}
  >
    <Input
      type="number"
      style={{
        height: '36px',
        boxShadow: 'none',
        color: '#AEAEAE',
        padding: '0 10px',
        fontSize: '16px',
      }}
      {...props}
      value={props.value}
    />
  </div>
);

const section = ({ label, fontSizeClass }) => (
  <div className={`text-uppercase ${ROW_MARGIN_Y} ${fontSizeClass ?? ''}`}>
    {label}
  </div>
);

const checkbox = ({ value, ...props }) => (
  <CheckboxField
    className="form-check-input cm-check-box"
    checked={value}
    {...props}
  />
);

const color = ({ value, width, ...props }) => (
  <div style={{ width: width ?? '' }}>
    <CustomColorPicker {...props} color={value.color} opacity={value.opacity} />
  </div>
);

const blank = (props) => <div {...props} />;

const label = ({ label, className }) => (
  <div className={`row gx-2 opacity-50 ${className}`}>
    <label>{label}</label>
  </div>
);

const divider = () => (
  <hr
    className="my-4"
    style={{
      height: 0,
      opacity: '1',
      background: 'transparent',
      borderTop: '1px solid #0F1A30',
    }}
  />
);

const select = ({ width, ...props }) => (
  <div style={{ width: width ?? '244px' }}>
    <CustomSelect {...props} />
  </div>
);

const line = ({ width, ...props }) => (
  <div style={{ width: width ?? '104px' }}>
    <LineSelectBox {...props} />
  </div>
);

const range = ({ width, ...props }) => (
  <div style={{ width: width ?? '244px' }}>
    <RangeSlider {...props} />
  </div>
);

const toggle = ({ width, ...props }) => (
  <div style={{ width: width ?? 'unset' }}>
    <ToggleSwitch defaultChecked={props.value} {...props} />
  </div>
);

const lineSize = ({ width, ...props }) => (
  <div style={{ width: width ?? '104px' }}>
    <LineSize {...props} />
  </div>
);

export const ROW_MARGIN_Y = 'my-3';
export const FORM_CONTROLS = {
  newline,
  number,
  section,
  checkbox,
  color,
  select,
  line,
  blank,
  label,
  divider,
  range,
  toggle,
  lineSize,
};
/* ---------------------------- END FORM CONTROLS --------------------------- */

/* -------------------------------------------------------------------------- */
/*                   Helpers for get/set form control value                   */
/* -------------------------------------------------------------------------- */

const notFieldTypes = ['newline', 'devider', 'blank', 'label', 'divider'];
const noLabelFields = [
  'newline',
  'devider',
  'section',
  'blank',
  'label',
  'divider',
];

export const isNolabelField = (fieldType) => noLabelFields.includes(fieldType);

/**
 * key for element of array element
 * @param {FieldConfig} field field
 * @param {Number} index index of field in list
 * @returns {String} key for field
 */
export const getFieldKey = ({ type, name }, index) => {
  return `${type}-${name}-${index}`;
};

/**
 * Get field value base on field config and form field values
 * @param {FieldConfig} field field
 * @param {Object} values Form field values
 * @returns value of field
 */
export const getFieldValue = ({ type, valueField, opacityField }, values) => {
  if (notFieldTypes.includes(type)) {
    return null;
  }

  const value = getValueFromObject(valueField, values);

  // Color field
  if (type === 'color') {
    const result = { color: value };
    if (opacityField) {
      result.opacity = getValueFromObject(opacityField, values);
    }
    return result;
  }

  return value;
};

// Getters value from change event
const FIELD_CHANGE_GETTERS = {
  number: (field, [value]) => ({ [field.valueField]: value }),
  select: (field, [selectedOption]) => ({
    [field.valueField]: selectedOption?.value,
  }),
  checkbox: (field, [e]) => ({ [field.valueField]: e?.target?.checked }),
  line: (field, [selectedOption]) => ({
    [field.valueField]: selectedOption?.value,
  }),
  color: (field, eventData) => {
    const [, color, opacity] = eventData;

    const result = {
      [field.valueField]: color,
    };

    if (field.opacityField) {
      result[field.opacityField] = opacity;
    }
    return result;
  },
  range: (field, [value]) => ({ [field.valueField]: value }),
  toggle: (field, [e]) => ({ [field.valueField]: e?.target?.checked }),
  lineSize: (field, [selectedOption]) => ({
    [field.valueField]: selectedOption?.value,
  }),
};

/**
 * Get value when field change base on field type
 * @param {FieldConfig} field field
 * @param {*} changeEventData change event
 * @returns new field value
 */
export const getChangedValues = (field, changeEventData) => {
  if (!FIELD_CHANGE_GETTERS[field.type]) {
    return null;
  }

  const getter = FIELD_CHANGE_GETTERS[field.type];

  return getter(field, changeEventData);
};

/**
 * Set value to form field values, support path to field
 * @param {{[pathToValue:String]: *}} fieldValues new field values
 * @param {Object} values current form field values
 * @returns {Object} new values
 */
export const setChangedValues = (fieldValues, values) => {
  if (!fieldValues) {
    return values;
  }

  let result = values;
  Object.keys(fieldValues).forEach((fieldName) => {
    const value = fieldValues[fieldName];
    result = setChangeValue(fieldName, value, result);
  });

  return result;
};
