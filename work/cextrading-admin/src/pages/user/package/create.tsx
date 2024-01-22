import type { NextPage } from 'next';
// Chakra imports
import { Flex } from '@chakra-ui/react';
// Custom components

import React from 'react';
import Head from 'next/head';
import { NOT_PERMISSION } from 'constants/message';
import useMyAbility from 'hook/ability';
import CreatePackageTimePage from 'components/user/package/create';

const UserPackage: NextPage = () => {
  const ability = useMyAbility();

  if (!ability.can('ROLE', ability.permissions.CREATE_PACKAGE)) {
    return <>{NOT_PERMISSION}</>;
  }
  return (
    <>
      <Head>
        <title>COINMAP ADMIN | CREATE</title>
      </Head>

      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <CreatePackageTimePage />
      </Flex>
    </>
  );
};

export default UserPackage;
