import { useColorModeValue } from '@chakra-ui/react';

export function useBgWhite() {
  const bg = useColorModeValue('white', 'gray.700');
  return bg;
}

export function useTextColor() {
  const color = useColorModeValue('gray.900', 'white');
  return color;
}
