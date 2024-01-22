import React from 'react';
import style from './SelectField.module.scss';
const SelectField = (
  {
    required,
    label,
    note,
    // placeholder,
    options,
    labelSmall,
    disabled,
    ...selectProps
  },
  ref
) => {
  const disabledClass = disabled ? 'bg-shady-lady' : '';
  return (
    <div className={style.container}>
      <label>
        <div>
          {label && <span className={style.span__1}>{label}</span>}{' '}
          {labelSmall && <span className={style.span__2}>{labelSmall}</span>}
          {required && <span className="text-red-500">*</span>}
        </div>
        {note && <span className={style.span__3}>{note}</span>}
      </label>
      <select
        className={`${disabledClass}`}
        ref={ref}
        disabled={disabled}
        {...selectProps}
      >
        <option disabled>Choose...</option>
        {(options || []).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
};
export default React.forwardRef(SelectField);
