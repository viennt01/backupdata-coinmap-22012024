import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
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
}

function TextareaField(
  { error, placeholder, id, label, disabled, required, ...inputProps }: Props,
  ref: Ref<HTMLTextAreaElement>,
) {
  return (
    <FormControl mb="12px" isInvalid={Boolean(error)}>
      {label && (
        <FormLabel display={'flex'} fontWeight={600} htmlFor={id}>
          {label}
          {required && <Text color="red.500">*</Text>}
        </FormLabel>
      )}
      <Textarea
        id={id}
        placeholder={placeholder}
        ref={ref}
        disabled={disabled}
        {...inputProps}
      />
      <FormErrorMessage>{error && error}</FormErrorMessage>
    </FormControl>
  );
}

export default React.forwardRef<HTMLTextAreaElement, Props>(TextareaField);
