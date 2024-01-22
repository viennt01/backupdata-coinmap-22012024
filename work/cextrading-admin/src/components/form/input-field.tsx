import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react';
import React, { Ref } from 'react';

interface Props {
  error?: string;
  placeholder?: string;
  id?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  type?: 'text' | 'password' | 'number';
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

function InputField(
  {
    error,
    placeholder,
    id,
    label,
    disabled,
    required,
    onChange,
    value,
    step = 'any',
    ...inputProps
  }: Props,
  ref: Ref<HTMLInputElement>,
) {
  return (
    <FormControl mb="12px" isInvalid={Boolean(error)}>
      {label && (
        <FormLabel display={'flex'} fontWeight={600} htmlFor={id}>
          {label}
          {required && <Text color="red.500">*</Text>}
        </FormLabel>
      )}
      <Input
        id={id}
        placeholder={placeholder}
        ref={ref}
        disabled={disabled}
        {...inputProps}
        onChange={onChange}
        value={value}
        step={step}
      />
      <FormErrorMessage>{error && error}</FormErrorMessage>
    </FormControl>
  );
}

export default React.forwardRef<HTMLInputElement, Props>(InputField);
