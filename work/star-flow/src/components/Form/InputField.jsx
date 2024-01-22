import Icons from '@/components/HomePage/components/Icons';
import React from 'react';
import style from './InputField.module.scss';
const InputField = (
  {
    required,
    label,
    placeholder,
    disabled,
    iconName,
    onClickIcon,
    error,
    ...inputProps
  },
  ref
) => {
  const disabledClass = disabled ? 'bg-secondary-6' : '';

  return (
    <div className={style.container}>
      {label && (
        <label>
          <div className={style.group}>
            <div>
              {label && <span className={style.span__1}>{label}</span>}{' '}
              {required && <span className="text-red-500">*</span>}
            </div>
          </div>
        </label>
      )}
      <div className={style.box}>
        <div className={style.group__2}>
          <input
            className={[error ? style.borderRed : '', disabledClass].join(' ')}
            placeholder={placeholder}
            ref={ref}
            disabled={disabled}
            {...inputProps}
          />
          {iconName && (
            <Icons
              onClick={() => onClickIcon && onClickIcon(iconName)}
              className={style.icon}
              name={iconName}
            />
          )}
        </div>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};
export default React.forwardRef(InputField);
