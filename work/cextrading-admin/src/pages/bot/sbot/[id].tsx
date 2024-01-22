import type { NextPage } from 'next';
// Chakra imports
import { Flex } from '@chakra-ui/react';
// Custom components

import React from 'react';
import Head from 'next/head';
import { NOT_PERMISSION } from 'constants/message';
import useMyAbility from 'hook/ability';
import CreateBotPage from 'components/bot/sbot/create';

const UserPackage: NextPage = () => {
  const ability = useMyAbility();

  if (!ability.can('ROLE', ability.permissions.UPDATE_BOT)) {
    return <>{NOT_PERMISSION}</>;
  }

  return (
    <>
      <Head>
        <title>COINMAP ADMIN | EDIT</title>
      </Head>

      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <CreateBotPage editing />
      </Flex>
    </>
  );
};

export default UserPackage;
