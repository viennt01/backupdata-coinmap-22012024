import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { HiArrowLeft } from 'react-icons/hi';
import { useRouter } from 'next/router';
import React from 'react';

interface Props {
  label?: string;
  onClick?: () => void;
}
export default function BackButton({ label, onClick }: Props) {
  const router = useRouter();
  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };
  const color = useColorModeValue('gray.700', 'white');

  return (
    <Flex alignItems="center" mb="20px">
      <Button
        onClick={handleBack}
        bg="transparent"
        color={color}
        _hover={{ bg: 'teal.300', color: 'white' }}
      >
        <HiArrowLeft />
      </Button>
      {label && (
        <Text fontWeight={'600'} ml="12px">
          {label}
        </Text>
      )}
    </Flex>
  );
}
