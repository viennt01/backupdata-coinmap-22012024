import {
  ButtonHTMLAttributes,
  ReactElement,
  useContext,
  useEffect,
  useRef,
} from 'react';
import styled from './index.module.scss';
import { AppContext } from '@/app-context';

const hex2Rgb = (hex: string) => {
  return hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (_m: string, r: string, g: string, b: string) =>
        '#' + r + r + g + g + b + b
    )
    .substring(1)
    .match(/.{2}/g)
    ?.map((x) => parseInt(x, 16));
};

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  prepend?: string | ReactElement;
  append?: string | ReactElement;
  textColor?: string;
  backgroundColor?: string; // only accept hex color
}

const CustomButton = ({
  className,
  loading,
  prepend,
  append = <LongRightArrow />,
  children,
  textColor,
  backgroundColor,
  ...props
}: CustomButtonProps) => {
  const ref = useRef(null);
  const { appTheme } = useContext(AppContext);

  useEffect(() => {
    if (!ref.current) return;
    const buttonEle = ref.current as HTMLElement;
    buttonEle?.style.setProperty(
      '--button-background-color',
      `${hex2Rgb(backgroundColor ?? appTheme.colors.primary)}`
    );
    buttonEle?.style.setProperty(
      '--button-text-color',
      textColor ?? appTheme.colors.on_primary
    );
  }, [appTheme, backgroundColor, textColor]);

  return (
    <button
      ref={ref}
      className={`${styled.customButton} ${
        loading ? styled.loading : ''
      } ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && <SpinIndicator />}
      {prepend}
      {children}
      {append}
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

const LongRightArrow = () => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.5 12H3.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.2152 11.7966L16.765 7.90356C16.2355 7.52535 15.5 7.90385 15.5 8.55455V15.4454C15.5 16.0961 16.2355 16.4746 16.765 16.0964L22.2152 12.2034C22.3548 12.1037 22.3548 11.8963 22.2152 11.7966Z"
      fill="currentColor"
    />
  </svg>
);
