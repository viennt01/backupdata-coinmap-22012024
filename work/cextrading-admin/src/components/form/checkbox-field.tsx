import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Checkbox,
} from '@chakra-ui/react';
import React, { Ref } from 'react';

interface Props {
  error?: string;
  placeholder?: string;
  id?: string;
  label?: string;
  value?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isChecked?: boolean;
}

function CheckboxField(
  {
    error,
    placeholder,
    id,
    label,
    disabled,
    children,
    isChecked,
    onChange,
    ...inputProps
  }: Props,
  ref: Ref<HTMLInputElement>,
) {
  return (
    <FormControl mb="12px" isInvalid={Boolean(error)}>
      {label && (
        <FormLabel fontWeight={600} htmlFor={id}>
          {label}
        </FormLabel>
      )}
      <Checkbox
        id={id}
        placeholder={placeholder}
        ref={ref}
        {...inputProps}
        disabled={disabled}
        isChecked={isChecked}
        onChange={onChange}
      >
        {children}
      </Checkbox>
      <FormErrorMessage>{error && error}</FormErrorMessage>
    </FormControl>
  );
}

export default React.forwardRef<HTMLInputElement, Props>(CheckboxField);
