import { ButtonHTMLAttributes, ReactElement } from 'react';
import styled from './index.module.scss';
import { SvgArrowRightLong } from '@/assets/images/svg';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  prepend?: string | ReactElement;
  append?: string | ReactElement;
  defaultShadow?: boolean;
}

const CustomButton = ({
  className,
  loading,
  prepend,
  append,
  defaultShadow,
  children,
  ...props
}: CustomButtonProps) => {
  if (loading)
    return (
      <button
        disabled
        className={`${styled.customButton} ${styled.loading} ${
          defaultShadow ? styled.defaultShadow : ''
        } ${className}`}
        {...props}
      >
        <SpinIndicator />
      </button>
    );

  return (
    <button
      className={`${styled.customButton} ${
        defaultShadow ? styled.defaultShadow : ''
      } ${className}`}
      {...props}
    >
      {prepend}
      {children}
      {append ? append : <SvgArrowRightLong />}
    </button>
  );
};

export default CustomButton;

const SpinIndicator = () => (
  <svg
    className={styled.spin}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle opacity="0.4" cx="12" cy="4" r="2" fill="white" />
    <circle opacity="0.4" cx="12" cy="20" r="2" fill="white" />
    <circle
      cx="18.9281"
      cy="8.00012"
      r="2"
      transform="rotate(60 18.9281 8.00012)"
      fill="white"
    />
    <circle
      opacity="0.4"
      cx="5.07166"
      cy="16.0001"
      r="2"
      transform="rotate(60 5.07166 16.0001)"
      fill="white"
    />
    <circle
      opacity="0.4"
      cx="18.9281"
      cy="16.0001"
      r="2"
      transform="rotate(120 18.9281 16.0001)"
      fill="white"
    />
    <circle
      opacity="0.4"
      cx="5.07166"
      cy="8.00012"
      r="2"
      transform="rotate(120 5.07166 8.00012)"
      fill="white"
    />
  </svg>
);
