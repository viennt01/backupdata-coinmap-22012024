import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import Select, { MultiValue } from 'react-select';

export interface Value {
  value: string;
  label: string;
}

interface Props {
  error?: string;
  placeholder?: string;
  id?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  options: Value[];
  setValue: (value: MultiValue<Value>) => void;
  value: MultiValue<Value>;
}

function SelectMultipleField({
  error,
  placeholder,
  id,
  label,
  disabled,
  required,
  options,
  setValue,
  value,
  ...inputProps
}: Props) {
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
        isMulti
        value={value}
        onChange={setValue}
        isDisabled={disabled}
        options={options}
        {...inputProps}
      />
      <FormErrorMessage>{error && error}</FormErrorMessage>
    </FormControl>
  );
}

export default SelectMultipleField;
