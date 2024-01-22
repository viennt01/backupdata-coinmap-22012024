import CustomSelect from '@/components/FormControls/CustomSelect';
import { useState, useRef, useEffect, useCallback } from 'react';
import styled from './styles.module.scss';

export const Title = ({ text, margin, disabled }) => {
  return (
    <p
      className={[
        margin ? styled.titleMargin : '',
        disabled ? styled.disabled : '',
      ].join(' ')}
    >
      {text}
    </p>
  );
};

export const Input = ({
  value,
  onChange = () => {},
  step = 1,
  max,
  min,
  type = 'number',
  disabled,
  suffix,
  ...props
}) => {
  const suffixRef = useRef(null);
  const textRulerRef = useRef(null);

  const handleIncre = () => {
    if (disabled) return;
    if (`${max}` == max) {
      if (value + step > max) {
        onChange(max);
      } else {
        onChange(Number(value) + step);
      }
    } else {
      onChange(Number(value) + step);
    }
  };
  const handleDecre = () => {
    if (disabled) return;
    if (`${min}` == min) {
      if (value - step < min) {
        onChange(min);
      } else {
        onChange(value - step);
      }
    } else {
      onChange(value - step);
    }
  };
  const handleChange = (e) => {
    const value = e.target.value;
    if (!value || type !== 'number') return onChange(value);
    if (Number(value) > max) return onChange(max);
    if (Number(value) < min) return onChange(min);
    onChange(Number(value));
  };
  const updateSuffix = useCallback(
    (inputValue) => {
      if (!suffix) return;
      textRulerRef.current.innerText = inputValue;
      suffixRef.current.style.left = textRulerRef.current.clientWidth + 'px';
    },
    [suffix]
  );

  useEffect(() => {
    updateSuffix(value);
  }, [value, updateSuffix]);

  return (
    <div className={styled.inputContainer}>
      <input
        type={type}
        className={[
          'form-control form-control-sm pt-0 pb-0 rounded-0 border-0',
          styled.input,
        ].join(' ')}
        onChange={handleChange}
        value={value}
        step={step}
        max={max}
        min={min}
        disabled={disabled}
        {...props}
      />
      {type === 'number' && (
        <div className={styled.arrrowContainer}>
          <svg
            onClick={handleIncre}
            width="15"
            height="9"
            viewBox="0 0 15 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.916992 8L7.41699 1.5L13.917 8"
              stroke="#D9D9D9"
              strokeWidth="1.25"
            />
            <path
              d="M0.916992 8L7.41699 1.5L13.917 8"
              stroke="black"
              strokeOpacity="0.2"
              strokeWidth="1.25"
            />
          </svg>
          <svg
            onClick={handleDecre}
            width="15"
            height="9"
            viewBox="0 0 15 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.917 1L7.41699 7.5L0.916993 0.999999"
              stroke="#D9D9D9"
              strokeWidth="1.25"
            />
            <path
              d="M13.917 1L7.41699 7.5L0.916993 0.999999"
              stroke="black"
              strokeOpacity="0.2"
              strokeWidth="1.25"
            />
          </svg>
        </div>
      )}
      {suffix && (
        <>
          <span ref={suffixRef} className={styled.inputSuffix}>
            {suffix}
          </span>
          <div ref={textRulerRef} className={styled.inputTextContainer}></div>
        </>
      )}
    </div>
  );
};

export const Selector = ({
  value,
  options,
  onChange,
  isSearchable,
  disabled,
}) => {
  const [openMenu, setOpenMenu] = useState(false);
  const handleOpenMenu = () => {
    setOpenMenu(true);
  };
  return (
    <>
      <CustomSelect
        className="custom-react-select"
        isSearchable={isSearchable}
        value={value}
        options={options}
        onChange={(e) => onChange(e.value)}
        isDisabled={disabled}
        menuIsOpen={openMenu}
        onMenuOpen={handleOpenMenu}
        onMenuClose={() => setOpenMenu(false)}
      />
      {openMenu && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        ></div>
      )}
    </>
  );
};
