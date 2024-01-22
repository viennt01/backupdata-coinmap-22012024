import type { NextPage } from 'next';
// Chakra imports
import { Flex } from '@chakra-ui/react';
// Custom components

import React from 'react';
import Head from 'next/head';
import CreateCurrency from 'components/settings/currency/create';
import useMyAbility from 'hook/ability';
import { NOT_PERMISSION } from 'constants/message';

const BotCreate: NextPage = () => {
  const ability = useMyAbility();

  if (!ability.can('ROLE', ability.permissions.CREATE_CURRENCY)) {
    return <>{NOT_PERMISSION}</>;
  }

  return (
    <>
      <Head>
        <title>COINMAP ADMIN | CREATE</title>
      </Head>

      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <CreateCurrency />
      </Flex>
    </>
  );
};

export default BotCreate;
