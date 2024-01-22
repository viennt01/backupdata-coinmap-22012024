import type { NextPage } from 'next';
// Chakra imports
import { Flex } from '@chakra-ui/react';
// Custom components

import React from 'react';
import Head from 'next/head';
import CreateUser from 'components/user/users/create';
import HistoryTransaction from 'components/user/users/detail-user';
import { NOT_PERMISSION } from 'constants/message';
import useMyAbility from 'hook/ability';

const User: NextPage = () => {
  const ability = useMyAbility();

  if (!ability.can('ROLE', ability.permissions.UPDATE_USER)) {
    return <>{NOT_PERMISSION}</>;
  }
  return (
    <>
      <Head>
        <title>COINMAP ADMIN | EDIT</title>
      </Head>

      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <CreateUser editing={true} />
        <HistoryTransaction />
      </Flex>
    </>
  );
};

export default User;
