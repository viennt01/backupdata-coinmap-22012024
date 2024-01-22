import type { NextPage } from 'next';
// Chakra imports
import { Flex } from '@chakra-ui/react';
// Custom components

import React from 'react';
import Head from 'next/head';
import CreateExchange from 'components/settings/exchange/create';
import useMyAbility from 'hook/ability';
import { NOT_PERMISSION } from 'constants/message';

const ExchangeCreate: NextPage = () => {
  const ability = useMyAbility();

  if (!ability.can('ROLE', ability.permissions.CREATE_EXCHANGE)) {
    return <>{NOT_PERMISSION}</>;
  }

  return (
    <>
      <Head>
        <title>COINMAP ADMIN | CREATE</title>
      </Head>

      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <CreateExchange />
      </Flex>
    </>
  );
};

export default ExchangeCreate;
