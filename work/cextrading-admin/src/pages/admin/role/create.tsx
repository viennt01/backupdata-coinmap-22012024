import type { NextPage } from 'next';
// Chakra imports
import { Flex } from '@chakra-ui/react';
// Custom components

import React from 'react';
import Head from 'next/head';
import CreateAdminRole from 'components/admin/role/create';
import { NOT_PERMISSION } from 'constants/message';
import useMyAbility from 'hook/ability';

const Home: NextPage = () => {
  const ability = useMyAbility();

  if (!ability.can('ROLE', ability.permissions.CREATE_AUTH_ROLE)) {
    return <>{NOT_PERMISSION}</>;
  }
  return (
    <>
      <Head>
        <title>COINMAP ADMIN | CREATE ADMIN ROLE</title>
      </Head>

      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <CreateAdminRole />
      </Flex>
    </>
  );
};

export default Home;
