import { useToast } from '@chakra-ui/react';

export enum STATUS {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

interface Props {
  title?: string;
  description: string;
  status: STATUS;
}

export default function useToastHook() {
  const toast = useToast();
  return ({ status, description, title }: Props) =>
    toast({
      title: title,
      description: description,
      status: status,
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
}
