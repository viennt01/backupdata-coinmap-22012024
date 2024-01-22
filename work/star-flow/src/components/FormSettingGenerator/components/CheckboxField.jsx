import React from 'react';
import style from './CheckboxField.module.scss';
const CheckboxField = ({ txt, disabled, checked, ...inputProps }, ref) => {
  return (
    <label className={style.container}>
      <input
        type="checkbox"
        checked={checked}
        ref={ref}
        disabled={disabled}
        {...inputProps}
        value=""
      />
      {txt && <span>{txt}</span>}
    </label>
  );
};

export default React.forwardRef(CheckboxField);
