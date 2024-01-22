import { Flex } from '@chakra-ui/react';
import React from 'react';

export const MESSAGE = {
  SUCCESS: 'Success',
  FAIL: 'Fail',
};

export const NOT_PERMISSION = (
  <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
    You do not have the permission to access this page, contact admin to
    support.
  </Flex>
);
