import React from 'react';
import style from './CheckboxField.module.scss';
const CheckboxField = (
  { txt, disabled, error, checked, ...inputProps },
  ref
) => {
  return (
    <label className={style.container}>
      <input
        type="checkbox"
        checked={checked}
        style={{ color: '#01C3FE' }}
        className={[
          disabled ? style.inputDisable : style.cursorAdd,
          error ? style.borderRed : ' ',
        ].join(' ')}
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
