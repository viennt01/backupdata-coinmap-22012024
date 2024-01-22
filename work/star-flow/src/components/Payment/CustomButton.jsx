import styled from './CustomButton.module.scss';

const CustomButton = ({ className, prepend, append, children, ...props }) => {
  return (
    <button className={`${styled.primaryButton} ${className}`} {...props}>
      {prepend}
      {children}
      {append}
    </button>
  );
};

export default CustomButton;
