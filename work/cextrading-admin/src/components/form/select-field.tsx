import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Text,
} from '@chakra-ui/react';
import React, { Ref } from 'react';

interface Props {
  error?: string;
  placeholder?: string;
  id?: string;
  label?: string;
  disabled?: boolean;
  children: React.ReactNode;
  required?: boolean;
}

function SelectField(
  {
    error,
    placeholder,
    id,
    label,
    disabled,
    children,
    required,
    ...inputProps
  }: Props,
  ref: Ref<HTMLSelectElement>,
) {
  return (
    <FormControl mb="12px" isInvalid={Boolean(error)}>
      {label && (
        <FormLabel display={'flex'} fontWeight={600} htmlFor={id}>
          {label}
          {required && <Text color="red.500">*</Text>}
        </FormLabel>
      )}
      <Select
        id={id}
        placeholder={placeholder}
        ref={ref}
        disabled={disabled}
        {...inputProps}
      >
        {children}
      </Select>
      <FormErrorMessage>{error && error}</FormErrorMessage>
    </FormControl>
  );
}

export default React.forwardRef<HTMLSelectElement, Props>(SelectField);
